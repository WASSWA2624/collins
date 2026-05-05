import test from 'node:test';
import assert from 'node:assert/strict';

process.env.DATABASE_URL ||= 'mysql://root:password@localhost:3306/collins_test';

const { activeReferenceWhere } = await import('../src/modules/references/references.service.js');
const { reviewActionSchema, reviewQueueSchema } = await import('../src/modules/review/review.validators.js');
const { recordRequiresReviewerOverride } = await import('../src/modules/review/review.service.js');

test('review queue contract includes reference-rule items', () => {
  const result = reviewQueueSchema.safeParse({
    body: {},
    params: {},
    query: {
      entityType: 'reference-rule',
      page: '1',
      limit: '20',
    },
  });

  assert.equal(result.success, true);
  assert.equal(result.data.query.entityType, 'reference-rule');
});

test('review queue contract includes sync conflict items', () => {
  const result = reviewQueueSchema.safeParse({
    body: {},
    params: {},
    query: {
      entityType: 'sync-conflict',
      page: '1',
      limit: '20',
    },
  });

  assert.equal(result.success, true);
  assert.equal(result.data.query.entityType, 'sync-conflict');
});

test('review action contract preserves triage, override, and return-to-clinician metadata', () => {
  const result = reviewActionSchema.safeParse({
    body: {
      triagePriority: 'urgent',
      validationStatus: 'impossible',
      overrideReason: 'Senior reviewer confirmed a documented clinical exception.',
      returnedToClinician: true,
      correctionJson: { ph: { message: 'repeat ABG requested' } },
      reviewNotes: 'Return for bedside confirmation.',
    },
    params: {
      entityType: 'abg-test',
      entityId: 'abg-1',
    },
    query: {},
  });

  assert.equal(result.success, true);
  assert.equal(result.data.body.triagePriority, 'urgent');
  assert.equal(result.data.body.returnedToClinician, true);
  assert.equal(result.data.body.correctionJson.ph.message, 'repeat ABG requested');
});

test('review action contract supports conflict triage metadata', () => {
  const result = reviewActionSchema.safeParse({
    body: {
      triagePriority: 'deferred',
      comment: 'Keep reviewed server data; ask clinician to submit append-only correction.',
    },
    params: {
      entityType: 'sync-conflict',
      entityId: 'sync-1',
    },
    query: {},
  });

  assert.equal(result.success, true);
  assert.equal(result.data.params.entityType, 'sync-conflict');
  assert.equal(result.data.body.triagePriority, 'deferred');
});

test('red or impossible clinical review items require override metadata before approval', () => {
  assert.equal(recordRequiresReviewerOverride({ validationStatus: 'impossible' }), true);
  assert.equal(recordRequiresReviewerOverride({
    clinicalFlagsJson: [{ code: 'IMPOSSIBLE_VALUE', severity: 'red' }],
  }), true);
  assert.equal(recordRequiresReviewerOverride({
    clinicalFlagsJson: [{ code: 'ABG_INCOMPLETE', severity: 'yellow' }],
  }), false);
});

test('active reference query uses verified-only governance gates', () => {
  const where = activeReferenceWhere(new Date('2026-05-05T12:00:00.000Z'));

  assert.equal(where.verificationStatus, 'VERIFIED');
  assert.deepEqual(where.governanceStatus.in, [
    'approved',
    'verified',
    'active',
    'approved_for_decision_support',
    'verified_for_decision_support',
  ]);
});
