import test from 'node:test';
import assert from 'node:assert/strict';
import {
  acknowledgeClinicalSafetySchema,
  updateOnboardingStateSchema,
} from '../src/modules/onboarding/onboarding.validators.js';
import {
  CLINICAL_SAFETY_ACKNOWLEDGEMENT,
  CLINICAL_SAFETY_STATEMENT_HASH,
} from '../src/modules/onboarding/onboarding.constants.js';

test('onboarding state validation accepts only non-clinical setup fields', () => {
  const valid = updateOnboardingStateSchema.safeParse({
    body: {
      currentStep: 'FACILITY_SELECTION',
      completedSteps: ['WELCOME', 'CLINICAL_SAFETY'],
      selectedFacilityId: 'facility_123',
      requestedRole: 'CLINICIAN',
    },
    params: {},
    query: {},
  });

  assert.equal(valid.success, true);

  const clinicalPayload = updateOnboardingStateSchema.safeParse({
    body: {
      currentStep: 'FACILITY_SELECTION',
      patientId: 'patient_123',
      ventilatorSettings: { peep: 8 },
    },
    params: {},
    query: {},
  });

  assert.equal(clinicalPayload.success, false);
});

test('clinical safety acknowledgement requires affirmative current-version metadata', () => {
  const accepted = acknowledgeClinicalSafetySchema.safeParse({
    body: {
      acknowledged: true,
      acknowledgementVersion: CLINICAL_SAFETY_ACKNOWLEDGEMENT.version,
      clientAcknowledgedAt: '2026-05-05T09:00:00.000+03:00',
      deviceId: 'device-1',
    },
    params: {},
    query: {},
  });

  assert.equal(accepted.success, true);
  assert.equal(typeof CLINICAL_SAFETY_STATEMENT_HASH, 'string');
  assert.equal(CLINICAL_SAFETY_STATEMENT_HASH.length, 64);

  const rejected = acknowledgeClinicalSafetySchema.safeParse({
    body: {
      acknowledged: false,
      acknowledgementVersion: CLINICAL_SAFETY_ACKNOWLEDGEMENT.version,
    },
    params: {},
    query: {},
  });

  assert.equal(rejected.success, false);
});
