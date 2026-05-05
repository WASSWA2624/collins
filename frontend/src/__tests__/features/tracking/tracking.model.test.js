/**
 * Tracking model tests
 * File: tracking.model.test.js
 */
import { normalizeTrackingItem, normalizeTrackingList } from '@features/tracking';

const activeAdmission = {
  admissionId: 'adm-1',
  patientId: 'patient-1',
  facilityId: 'facility-1',
  appAdmissionCode: 'COL-A-1',
  bedNumber: 'ICU-2',
  status: 'ACTIVE',
  admittedAt: '2026-05-01T08:00:00.000Z',
  facility: { id: 'facility-1', name: 'City ICU' },
  patient: { id: 'patient-1', appPatientCode: 'COL-P-1', patientPathway: 'ADULT' },
  currentStatus: {
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
    expect(row.facilityName).toBe('City ICU');
    expect(row.bedNumber).toBe('ICU-2');
    expect(row.reviewLabel).toBe('Review');
    expect(row.syncLabel).toBe('Conflict');
    expect(row.risk.label).toBe('Conflict');
    expect(row.missingDataLabel).toBe('PaO2, PEEP');
  });

  it('filters invalid list records without admission ids', () => {
    const rows = normalizeTrackingList([activeAdmission, { patientId: 'missing-admission' }]);

    expect(rows).toHaveLength(1);
    expect(rows[0].admissionId).toBe('adm-1');
  });
});
