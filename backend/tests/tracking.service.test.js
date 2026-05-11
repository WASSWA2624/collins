import test from 'node:test';
import assert from 'node:assert/strict';
import { buildTrackingAdmissionWhere } from '../src/modules/tracking/tracking.service.js';

test('tracking admission query filters by the selected facility without user membership scope', () => {
  const where = buildTrackingAdmissionWhere({
    facilityId: 'facility-2',
    status: 'ACTIVE',
    patientPathway: 'ADULT',
  });

  assert.deepEqual(where, {
    facilityId: 'facility-2',
    status: 'ACTIVE',
    patient: { patientPathway: 'ADULT' },
  });
  assert.equal(Object.prototype.hasOwnProperty.call(where, 'createdByUserId'), false);
});
