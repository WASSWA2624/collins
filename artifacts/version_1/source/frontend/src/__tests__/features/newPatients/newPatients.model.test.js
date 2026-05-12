/**
 * New Patient Model Tests
 * File: newPatients.model.test.js
 */
import {
  NEW_PATIENT_PATHWAYS,
  buildNewPatientAiSafePayload,
  buildCreateNewPatientPayload,
  buildNewPatientReasonStepPayload,
  normalizeNewPatientDraft,
} from '@features/newPatients';

const now = () => new Date('2026-05-05T08:00:00.000Z');

describe('newPatients.model', () => {
  it('supports all required patient pathways', () => {
    NEW_PATIENT_PATHWAYS.forEach((patientPathway) => {
      const draft = normalizeNewPatientDraft({
        facilityId: 'facility-1',
        patient: { patientPathway, optionalName: 'Patient One' },
      }, { now, nonce: `nonce-${patientPathway}` });

      expect(draft.patient.patientPathway).toBe(patientPathway);
      expect(draft.patient.firstName).toBe('Patient');
      expect(draft.patient.lastName).toBe('One');
      expect(draft.facilityId).toBe('facility-1');
      expect(draft.idempotencyKey).toMatch(/^new-patient:facility-1:/);
      expect(draft.clientCreatedAt).toBe('2026-05-05T08:00:00.000Z');
    });
  });

  it('normalizes missing values and pathway aliases without forcing assumptions', () => {
    const draft = normalizeNewPatientDraft({
      facilityId: 'facility-1',
      reasonForSupport: 'Post-op oxygen support',
      patient: {
        optionalName: 'Patient One',
        patientPathway: 'obstetric/post-partum',
        sexForSizeCalculations: 'not_available',
        ageYears: 'unknown',
        actualWeightKg: null,
        pathwayDetailsJson: {
          pregnancyStatus: 'post_partum',
          gestationalAgeAtDeliveryWeeks: null,
        },
      },
      oxygen: {
        spo2: '94',
      },
      permittedMissingFields: ['actualWeightKg/referenceWeightKg'],
    }, { now, nonce: 'fixed' });

    expect(draft.patient.patientPathway).toBe('OBSTETRIC');
    expect(draft.patient.firstName).toBe('Patient');
    expect(draft.patient.lastName).toBe('One');
    expect(draft.patient.sexForSizeCalculations).toBe('UNKNOWN');
    expect(draft.patient.ageYears).toBeNull();
    expect(draft.patient.actualWeightKg).toBeNull();
    expect(draft.oxygen.spo2).toBe(94);
  });

  it('builds backend create and patient-reason payloads with offline metadata', () => {
    const draft = {
      facilityId: 'facility-1',
      bedNumber: 'ICU-2',
      reasonForSupport: 'Pneumonia with oxygen support',
      patient: {
        patientPathway: 'adult',
        firstName: 'Patient',
        lastName: 'One',
        hospitalNumber: 'H-123',
        actualWeightKg: 'not_available',
      },
      oxygen: { spo2: '92' },
    };

    const createPayload = buildCreateNewPatientPayload(draft, { now, nonce: 'abc' });
    expect(createPayload.facilityId).toBe('facility-1');
    expect(createPayload.reasonForVentilation).toBe('Pneumonia with oxygen support');
    expect(createPayload.patient.patientPathway).toBe('ADULT');
    expect(createPayload.patient).toMatchObject({
      firstName: 'Patient',
      lastName: 'One',
      optionalName: 'Patient One',
    });
    expect(createPayload.patient.actualWeightKg).toBeNull();
    expect(createPayload.clinicalSnapshot.spo2).toBe(92);
    expect(createPayload.clientCreatedAt).toBe('2026-05-05T08:00:00.000Z');
    expect(createPayload.idempotencyKey).toMatch(/^new-patient:facility-1:/);

    const stepPayload = buildNewPatientReasonStepPayload(draft, { now, nonce: 'abc' });
    expect(stepPayload.reasonForSupport).toBe('Pneumonia with oxygen support');
    expect(stepPayload.patient.patientPathway).toBe('ADULT');
    expect(stepPayload.clinicalSnapshot).toBeUndefined();
  });

  it('strips patient identifiers from AI/model-service payloads', () => {
    const safe = buildNewPatientAiSafePayload({
      facilityId: 'facility-1',
      idempotencyKey: 'offline-key-1',
      patient: {
        appPatientCode: 'COL-P-1',
        optionalName: 'Jane Patient',
        hospitalNumber: 'MRN-1',
        patientPathway: 'TRAUMA',
        ageYears: 32,
        pathwayDetailsJson: {
          traumaMechanism: 'blunt',
          referringHospitalNumber: 'MRN-2',
        },
      },
      reasonForVentilation: 'Chest trauma',
      clinicalSnapshot: {
        spo2: 91,
        deviceId: 'device-1',
      },
    });

    expect(safe.patient.patientPathway).toBe('TRAUMA');
    expect(safe.patient.ageYears).toBe(32);
    expect(safe.patient.optionalName).toBeUndefined();
    expect(safe.patient.hospitalNumber).toBeUndefined();
    expect(safe.patient.pathwayDetailsJson.traumaMechanism).toBe('blunt');
    expect(safe.patient.pathwayDetailsJson.referringHospitalNumber).toBeUndefined();
    expect(safe.clinicalSnapshot.deviceId).toBeUndefined();
    expect(JSON.stringify(safe)).not.toMatch(/Jane|MRN|facility-1|offline-key/);
  });
});
