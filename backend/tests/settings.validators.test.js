import test from 'node:test';
import assert from 'node:assert/strict';

process.env.DATABASE_URL ||= 'mysql://root:password@localhost:3306/collins_test';

const { facilitySettingsSchema, userSettingsSchema } = await import('../src/modules/settings/settings.validators.js');
const { getReferenceRuleSettingsStatus } = await import('../src/modules/settings/settings.service.js');

test('validates canonical user settings payloads', () => {
  const result = userSettingsSchema.safeParse({
    body: {
      account: { name: 'Ada Clinician', phone: null },
      activeFacilityId: 'facility_1',
      roleVisibility: {
        activeRole: 'CLINICIAN',
        visibleRoles: ['CLINICIAN', 'ICU_NURSE'],
      },
      displayPreferences: {
        themePreference: 'dark',
      },
      offlineSyncPreferences: {
        offlineModeEnabled: true,
        autoSyncEnabled: true,
        conflictResolutionMode: 'manual_review',
      },
      privacyControls: {
        hidePatientIdentifiersInLists: true,
        shareUsageDiagnostics: false,
      },
    },
    params: {},
    query: {},
  });

  assert.equal(result.success, true);
});

test('rejects invalid display theme preferences', () => {
  const result = userSettingsSchema.safeParse({
    body: {
      displayPreferences: {
        themePreference: 'sepia',
      },
    },
    params: {},
    query: {},
  });

  assert.equal(result.success, false);
  assert.ok(result.error.issues.some((issue) => issue.path.join('.') === 'body.displayPreferences.themePreference'));
});

test('rejects clinical decision outputs in settings payloads', () => {
  const result = userSettingsSchema.safeParse({
    body: {
      offlineSyncPreferences: {
        autoSyncEnabled: true,
        suggestedVentilatorSettings: { peep: 8 },
      },
    },
    params: {},
    query: {},
  });

  assert.equal(result.success, false);
  assert.ok(result.error.issues.some((issue) => issue.path.join('.') === 'body.offlineSyncPreferences'));
});

test('facility settings cannot enable predictive model visibility', () => {
  const result = facilitySettingsSchema.safeParse({
    body: {
      modelVisibility: {
        liveClinicalPredictionEnabled: true,
      },
    },
    params: { facilityId: 'facility_1' },
    query: {},
  });

  assert.equal(result.success, false);
  assert.ok(result.error.issues.some((issue) => issue.path.join('.') === 'body.modelVisibility.liveClinicalPredictionEnabled'));
});

test('facility settings keep export and review safeguards enabled', () => {
  const result = facilitySettingsSchema.safeParse({
    body: {
      workflowSettings: {
        lockReviewedClinicalRecords: false,
      },
      privacyControls: {
        exportPatientIdentifiers: true,
      },
    },
    params: { facilityId: 'facility_1' },
    query: {},
  });

  assert.equal(result.success, false);
  assert.ok(result.error.issues.some((issue) => issue.path.join('.') === 'body.workflowSettings.lockReviewedClinicalRecords'));
  assert.ok(result.error.issues.some((issue) => issue.path.join('.') === 'body.privacyControls.exportPatientIdentifiers'));
});

test('reference rules must be approved and currently active for settings activation', () => {
  const now = new Date('2026-05-05T00:00:00.000Z');
  const approved = getReferenceRuleSettingsStatus({
    id: 'rule_approved',
    verificationStatus: 'VERIFIED',
    governanceStatus: 'approved',
    approvedByUserId: 'user_1',
    verifiedByUserId: 'user_1',
    verifiedAt: new Date('2026-01-01T00:00:00.000Z'),
    activeFrom: new Date('2026-01-01T00:00:00.000Z'),
    activeTo: null,
  }, now);
  const unverified = getReferenceRuleSettingsStatus({
    id: 'rule_pending',
    verificationStatus: 'PENDING_REVIEW',
    governanceStatus: 'approved',
    approvedByUserId: 'user_1',
    verifiedByUserId: null,
    verifiedAt: null,
    activeFrom: null,
    activeTo: null,
  }, now);
  const expired = getReferenceRuleSettingsStatus({
    id: 'rule_expired',
    verificationStatus: 'VERIFIED',
    governanceStatus: 'approved',
    approvedByUserId: 'user_1',
    verifiedByUserId: 'user_1',
    verifiedAt: new Date('2026-01-01T00:00:00.000Z'),
    activeFrom: null,
    activeTo: new Date('2026-01-01T00:00:00.000Z'),
  }, now);

  assert.deepEqual(approved, { id: 'rule_approved', approvedForSettings: true });
  assert.deepEqual(unverified, { id: 'rule_pending', approvedForSettings: false });
  assert.deepEqual(expired, { id: 'rule_expired', approvedForSettings: false });
});
