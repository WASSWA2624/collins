/**
 * Dashboard Model Tests
 * File: dashboard.model.test.js
 */
const {
  DASHBOARD_TYPES,
  getDashboardCapabilities,
  getDashboardTypeForRoles,
  normalizeDashboard,
  normalizeRoles,
} = require('@features/dashboard');

const scope = {
  scope: 'facility',
  facility: {
    id: 'facility-1',
    name: 'City ICU',
  },
};

const windowRange = {
  from: '2026-05-01T00:00:00.000Z',
  to: '2026-05-05T00:00:00.000Z',
};

const reviewBacklog = {
  admissions: { PENDING: 2 },
  abgTests: { CORRECTION_REQUESTED: 1 },
  ventilatorSettings: {},
  datasetCases: {},
};

const syncConflicts = {
  total: 1,
  byStatus: { NEEDS_REVIEW: 1 },
  byOperation: { CREATE: 1 },
  trend: [],
};

const datasetReadiness = {
  total: 8,
  statusCounts: { APPROVED: 5 },
  approvedForTraining: 5,
  exportEligible: 4,
  missingGovernance: 1,
  byDatasetVersion: { v1: 8 },
  exportRule: 'Approved reviewed records only.',
};

const overrides = {
  auditedOverrides: 2,
  correctionRequests: 1,
  exclusions: 0,
  reviewApprovals: 3,
  auditedOverrideTrend: [],
};

const referenceGovernance = {
  verificationBacklog: 1,
  activeVersions: 2,
  retiredVersions: 1,
  byGovernanceStatus: { VERIFIED: 2 },
  auditSummary: { VERIFY_REFERENCE: 1 },
  auditTrend: [],
};

const modelGovernance = {
  byApprovalStatus: { SHADOW: 1 },
  shadowOutputs: 3,
  outputsInWindow: 3,
  modelsMissingReadinessMetadata: 1,
  outputTrend: [],
  liveClinicalPredictionEnabled: false,
};

const auditSummary = {
  total: 4,
  byAction: { CREATE: 2 },
  byEntityType: { DatasetCase: 2 },
  trend: [],
};

describe('dashboard model', () => {
  it('normalizes role aliases and preserves unique role keys', () => {
    expect(normalizeRoles(['super_admin', 'clinician', 'CLINICIAN'])).toEqual([
      'PLATFORM_ADMIN',
      'CLINICIAN',
    ]);
  });

  it('computes role-aware dashboard capabilities', () => {
    expect(getDashboardCapabilities(['CLINICIAN'])).toEqual({
      canViewClinical: true,
      canViewOperational: false,
      canViewGovernance: false,
    });
    expect(getDashboardCapabilities(['FACILITY_ADMIN'])).toEqual({
      canViewClinical: true,
      canViewOperational: true,
      canViewGovernance: true,
    });
    expect(getDashboardTypeForRoles(['MODEL_GOVERNANCE_OFFICER'])).toBe(DASHBOARD_TYPES.GOVERNANCE);
  });

  it('strips governance and model-only summaries from clinical dashboards', () => {
    const dashboard = normalizeDashboard(DASHBOARD_TYPES.CLINICAL, {
      dashboard: DASHBOARD_TYPES.CLINICAL,
      scope,
      window: windowRange,
      workload: {
        counts: {
          activeAdmissions: 4,
          newAdmissions: 1,
          pendingDailyReviews: 2,
          recentAbgTests: 3,
          recentVentilatorUpdates: 2,
        },
        reviewBacklog,
        trends: {
          admissions: [],
          abgTests: [],
          ventilatorSettings: [],
        },
      },
      syncConflicts,
      visibility: {
        modelGovernanceIncluded: false,
        governanceDashboardIncluded: false,
      },
      modelGovernance,
      overrides,
      referenceGovernance,
      auditSummary,
      privacy: 'Aggregate counts only.',
    });

    expect(dashboard.workload.counts.activeAdmissions).toBe(4);
    expect(dashboard.modelGovernance).toBeUndefined();
    expect(dashboard.overrides).toBeUndefined();
    expect(dashboard.referenceGovernance).toBeUndefined();
    expect(dashboard.auditSummary).toBeUndefined();
  });

  it('normalizes authorized operational dashboard aggregates', () => {
    const dashboard = normalizeDashboard(DASHBOARD_TYPES.OPERATIONAL, {
      dashboard: DASHBOARD_TYPES.OPERATIONAL,
      scope,
      window: windowRange,
      counts: {
        activeAdmissions: 4,
        ventilatedPatients: 3,
        syncAttention: 1,
      },
      trends: {
        admissions: [],
        datasetCases: [],
        syncAttention: [],
      },
      reviewBacklog,
      syncConflicts,
      datasetReadiness,
      overrides,
      referenceGovernance,
      modelGovernance,
      auditSummary,
      privacy: 'Aggregate counts only.',
    });

    expect(dashboard.datasetReadiness.exportEligible).toBe(4);
    expect(dashboard.modelGovernance.liveClinicalPredictionEnabled).toBe(false);
    expect(dashboard.auditSummary.total).toBe(4);
  });
});
