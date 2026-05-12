import test from 'node:test';
import assert from 'node:assert/strict';

process.env.DATABASE_URL ||= 'mysql://root:password@localhost:3306/collins_test';

const { DEVELOPMENT_REFERENCE_RANGES } = await import('../src/clinical/referenceRanges.js');
const {
  DEVELOPMENT_REFERENCE_GOVERNANCE_STATUS,
  buildSeedReferenceRuleRows,
} = await import('../src/modules/references/referenceSeed.js');
const { findForbiddenTrainingWording } = await import('../src/modules/training-help/trainingHelp.service.js');

const collectStrings = (value) => {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(collectStrings);
  return [];
};

test('reference seed rows are verified reference data, not clinical or training data', () => {
  const rows = buildSeedReferenceRuleRows(DEVELOPMENT_REFERENCE_RANGES, { seedUserId: 'seed-user-1' });

  assert.ok(rows.length > DEVELOPMENT_REFERENCE_RANGES.length);
  assert.ok(rows.every((row) => row.verificationStatus === 'VERIFIED'));
  assert.ok(rows.every((row) => row.governanceStatus === DEVELOPMENT_REFERENCE_GOVERNANCE_STATUS));
  assert.ok(rows.every((row) => row.approvedByUserId === 'seed-user-1'));
  assert.ok(rows.every((row) => row.verifiedByUserId === 'seed-user-1'));
  assert.ok(rows.every((row) => row.verifiedAt instanceof Date));
  assert.ok(rows.every((row) => row.patientPathway));
  assert.ok(rows.every((row) => row.ruleJson.dataLayer === 'reference_evidence'));
  assert.ok(rows.every((row) => row.ruleJson.approvedForTraining === false));
  assert.ok(rows.every((row) => row.ruleJson.rawPatientDataIncluded === false));
  assert.ok(rows.every((row) => !('deidentifiedPayloadJson' in row)));
});

test('reference seed wording stays advisory and avoids treatment orders', () => {
  const rows = buildSeedReferenceRuleRows(DEVELOPMENT_REFERENCE_RANGES, { seedUserId: 'seed-user-1' });
  const text = collectStrings(rows).join(' ');

  assert.equal(findForbiddenTrainingWording({ rows }).length, 0);
  assert.doesNotMatch(
    text,
    /diagnosed|set\s+(peep|fio2|tidal volume)\s+to|intubate now|extubate now|give\s+\d|transfer denial|rationing/i,
  );
});
