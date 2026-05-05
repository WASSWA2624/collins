import test from 'node:test';
import assert from 'node:assert/strict';
import {
  listActiveReferenceRangeRecords,
  referenceRuleToRangeRecord,
} from '../src/modules/references/references.service.js';

const verifiedRule = {
  id: 'rule-1',
  name: 'adult-vt',
  version: '2026.1',
  clinicalCondition: 'invasive_ventilation',
  scenario: 'lung_protective_guardrail',
  patientPathway: 'ADULT',
  population: 'adult',
  scope: 'GLOBAL',
  parameterName: 'vtMlPerKgReferenceWeight',
  lowerBound: 4,
  upperBound: 8,
  unit: 'mL/kg',
  sourceCitation: 'Local approved ICU ventilation reference.',
  ruleJson: { metadata: { category: 'guardrail' } },
  activeFrom: new Date('2026-05-01T00:00:00.000Z'),
  activeTo: null,
  verifiedByUserId: 'reviewer-1',
  verifiedAt: new Date('2026-05-04T00:00:00.000Z'),
  verificationStatus: 'VERIFIED',
  reviewNotes: 'Reviewed for decision-support use.',
  auditTrailJson: [{ action: 'verified', actorUserId: 'reviewer-1', at: '2026-05-04T00:00:00.000Z' }],
  governanceStatus: 'verified_for_decision_support',
};

test('reference rules map to validated range records', () => {
  const record = referenceRuleToRangeRecord(verifiedRule);

  assert.equal(record.validation.valid, true);
  assert.deepEqual(record.patientPathways, ['ADULT']);
  assert.equal(record.scenario, 'lung_protective_guardrail');
  assert.equal(record.verifiedBy, 'reviewer-1');
  assert.equal(record.verifiedAt, '2026-05-04T00:00:00.000Z');
  assert.deepEqual(record.auditTrail, verifiedRule.auditTrailJson);
});

test('active range record listing returns only valid verified records', async () => {
  const client = {
    referenceRule: {
      findMany: async ({ where }) => {
        assert.equal(where.verificationStatus, 'VERIFIED');
        return [
          verifiedRule,
          {
            ...verifiedRule,
            id: 'invalid-no-scenario',
            name: 'invalid-no-scenario',
            scenario: null,
          },
        ];
      },
    },
  };

  const records = await listActiveReferenceRangeRecords({ client, facilityId: 'facility-1' });

  assert.equal(records.length, 1);
  assert.equal(records[0].id, 'rule-1');
  assert.equal(records[0].validation, undefined);
});

