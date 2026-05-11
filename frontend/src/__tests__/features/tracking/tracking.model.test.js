/**
 * Tracking model tests
 * File: tracking.model.test.js
 */
import {
  filterTrackingRows,
  matchesTrackingSearch,
  normalizeTrackingItem,
  normalizeTrackingList,
} from '@features/tracking';

const activeAdmission = {
  admissionId: 'adm-1',
  patientId: 'patient-1',
  facilityId: 'facility-1',
  appAdmissionCode: 'ADM001',
  bedNumber: 'ICU-2',
  status: 'ACTIVE',
  admittedAt: '2026-05-01T08:00:00.000Z',
  facility: { id: 'facility-1', name: 'City ICU' },
  patient: {
    id: 'patient-1',
    appPatientCode: 'YMXB24',
    firstName: 'Jane',
    lastName: 'Doe',
    optionalName: 'Jane Doe',
    hospitalNumber: 'HN-7788',
    dateOfBirth: '2018-03-01T00:00:00.000Z',
    ageYears: 8,
    ageMonths: 2,
    ageDays: 10,
    actualWeightKg: 26,
    heightOrLengthCm: 124,
    referenceWeightKg: 25.5,
    patientPathway: 'ADULT',
  },
  currentStatus: {
    patient: {
      id: 'patient-1',
      appPatientCode: 'YMXB24',
      optionalName: 'Jane Doe',
      patientPathway: 'ADULT',
      referenceWeightKg: 25.5,
    },
    advisory: {
      missingData: ['PaO2', 'PEEP'],
    },
    clinicalSummary: {
      missingData: ['PaO2', 'PEEP'],
    },
  },
  reviewState: {
    needsReview: true,
    correctionRequestedCount: 0,
    admissionReviewStatus: 'PENDING',
  },
  syncState: {
    overallStatus: 'conflict',
    hasConflicts: true,
  },
};

describe('tracking.model', () => {
  it('normalizes backend tracking rows with facility, bed, review, sync, conflict, and missing-data labels', () => {
    const row = normalizeTrackingItem(activeAdmission);

    expect(row.admissionId).toBe('adm-1');
    expect(row.optionalName).toBe('Jane Doe');
    expect(row.patientId).toBe('patient-1');
    expect(row.patientCode).toBe('YMXB24');
    expect(row.patientCode).toHaveLength(6);
    expect(row.appPatientCode).toBe('YMXB24');
    expect(row.hospitalNumber).toBe('HN-7788');
    expect(row.ageLabel).toBe('8y 2m 10d');
    expect(row.actualWeightKg).toBe(26);
    expect(row.heightOrLengthCm).toBe(124);
    expect(row.referenceWeightKg).toBe(25.5);
    expect(row.facilityName).toBe('City ICU');
    expect(row.admittedDateLabel).toBeTruthy();
    expect(row.admittedTimeLabel).toBeTruthy();
    expect(row.bedNumber).toBe('ICU-2');
    expect(row.reviewLabel).toBe('Review');
    expect(row.syncLabel).toBe('Conflict');
    expect(row.risk.label).toBe('Conflict');
    expect(row.missingDataLabel).toBe('PaO2, PEEP');
  });

  it('filters invalid list records without admission ids', () => {
    const rows = normalizeTrackingList([
      activeAdmission,
      { patientId: 'missing-admission' },
    ]);

    expect(rows).toHaveLength(1);
    expect(rows[0].admissionId).toBe('adm-1');
  });

  it('normalizes malformed optional tracking data without throwing', () => {
    const row = normalizeTrackingItem({
      admissionId: 'adm-2',
      currentStatus: {
        advisory: {
          missingData: [{ field: 'PaO2' }, 'PEEP'],
        },
      },
    });

    expect(row.admissionId).toBe('adm-2');
    expect(row.missingDataLabel).toBe('PaO2, PEEP');
    expect(row.admissionStatusLabel).toBe('Active');
    expect(row.patientPathwayLabel).toBe('Unknown');
  });

  it('builds searchable tracking rows from patient demographics and identifiers', () => {
    const row = normalizeTrackingItem(activeAdmission);
    const otherRow = normalizeTrackingItem({
      ...activeAdmission,
      admissionId: 'adm-2',
      patientId: 'patient-2',
      appAdmissionCode: 'ADM002',
      patient: {
        id: 'patient-2',
        appPatientCode: 'QZ7N4B',
        optionalName: 'Sam Patient',
        hospitalNumber: 'HN-9900',
      },
    });

    expect(matchesTrackingSearch(row, 'jane')).toBe(true);
    expect(matchesTrackingSearch(row, 'HN-7788')).toBe(true);
    expect(matchesTrackingSearch(row, 'patient-1')).toBe(true);
    expect(filterTrackingRows([row, otherRow], 'QZ7N4B')).toEqual([otherRow]);
  });
});
