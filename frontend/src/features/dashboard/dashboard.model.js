/**
 * Dashboard Model
 * Normalizes backend-authorized aggregate dashboard responses.
 * File: dashboard.model.js
 */
import { z } from 'zod';
import { DASHBOARD_TYPES } from './dashboard.api';

const MEMBERSHIP_ROLES = Object.freeze({
  PLATFORM_ADMIN: 'PLATFORM_ADMIN',
  FACILITY_ADMIN: 'FACILITY_ADMIN',
  CLINICIAN: 'CLINICIAN',
  ICU_NURSE: 'ICU_NURSE',
  SPECIALIST_REVIEWER: 'SPECIALIST_REVIEWER',
  RESEARCH_GOVERNANCE_OFFICER: 'RESEARCH_GOVERNANCE_OFFICER',
  MODEL_GOVERNANCE_OFFICER: 'MODEL_GOVERNANCE_OFFICER',
  READ_ONLY_REVIEWER: 'READ_ONLY_REVIEWER',
});

const READ_ROLES = Object.freeze(Object.values(MEMBERSHIP_ROLES));
const OPERATIONAL_ROLES = Object.freeze([
  MEMBERSHIP_ROLES.PLATFORM_ADMIN,
  MEMBERSHIP_ROLES.FACILITY_ADMIN,
]);
const GOVERNANCE_ROLES = Object.freeze([
  MEMBERSHIP_ROLES.PLATFORM_ADMIN,
  MEMBERSHIP_ROLES.FACILITY_ADMIN,
  MEMBERSHIP_ROLES.RESEARCH_GOVERNANCE_OFFICER,
  MEMBERSHIP_ROLES.MODEL_GOVERNANCE_OFFICER,
]);

const numberWithDefault = z.number().catch(0);
const statusCountsSchema = z.record(z.string(), z.number()).catch({});
const trendSchema = z.array(z.object({
  date: z.string().min(1),
  count: numberWithDefault,
}).passthrough()).catch([]);

const facilitySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  district: z.string().nullable().optional(),
  region: z.string().nullable().optional(),
  verificationStatus: z.string().nullable().optional(),
}).passthrough();

const scopeSchema = z.object({
  scope: z.enum(['facility', 'platform']).catch('facility'),
  facility: facilitySchema.nullable().optional(),
}).passthrough();

const windowSchema = z.object({
  from: z.string().or(z.date()).optional(),
  to: z.string().or(z.date()).optional(),
}).passthrough().catch({});

const reviewBacklogSchema = z.object({
  admissions: statusCountsSchema,
  abgTests: statusCountsSchema,
  ventilatorSettings: statusCountsSchema,
  datasetCases: statusCountsSchema,
}).passthrough().catch({
  admissions: {},
  abgTests: {},
  ventilatorSettings: {},
  datasetCases: {},
});

const syncConflictsSchema = z.object({
  total: numberWithDefault,
  byStatus: statusCountsSchema,
  byOperation: statusCountsSchema,
  trend: trendSchema,
}).passthrough().catch({
  total: 0,
  byStatus: {},
  byOperation: {},
  trend: [],
});

const datasetReadinessSchema = z.object({
  total: numberWithDefault,
  statusCounts: statusCountsSchema,
  approvedForTraining: numberWithDefault,
  exportEligible: numberWithDefault,
  missingGovernance: numberWithDefault,
  byDatasetVersion: statusCountsSchema,
  exportRule: z.string().optional(),
}).passthrough();

const overrideSummarySchema = z.object({
  auditedOverrides: numberWithDefault,
  correctionRequests: numberWithDefault,
  exclusions: numberWithDefault,
  reviewApprovals: numberWithDefault,
  auditedOverrideTrend: trendSchema,
  source: z.string().optional(),
}).passthrough();

const referenceGovernanceSchema = z.object({
  verificationBacklog: numberWithDefault,
  activeVersions: numberWithDefault,
  retiredVersions: numberWithDefault,
  byGovernanceStatus: statusCountsSchema,
  auditSummary: statusCountsSchema,
  auditTrend: trendSchema,
  safetyStatement: z.string().optional(),
}).passthrough();

const modelGovernanceSchema = z.object({
  byApprovalStatus: statusCountsSchema,
  shadowOutputs: numberWithDefault,
  outputsInWindow: numberWithDefault,
  modelsMissingReadinessMetadata: numberWithDefault,
  outputTrend: trendSchema,
  liveClinicalPredictionEnabled: z.boolean().catch(false),
  driftMetricSource: z.string().optional(),
  safetyStatement: z.string().optional(),
}).passthrough();

const auditSummarySchema = z.object({
  total: numberWithDefault,
  byAction: statusCountsSchema,
  byEntityType: statusCountsSchema,
  trend: trendSchema,
}).passthrough();

const clinicalDashboardSchema = z.object({
  dashboard: z.literal(DASHBOARD_TYPES.CLINICAL),
  scope: scopeSchema,
  window: windowSchema,
  workload: z.object({
    counts: z.object({
      activeAdmissions: numberWithDefault,
      newAdmissions: numberWithDefault,
      pendingDailyReviews: numberWithDefault,
      recentAbgTests: numberWithDefault,
      recentVentilatorUpdates: numberWithDefault,
    }).passthrough(),
    reviewBacklog: reviewBacklogSchema,
    trends: z.object({
      admissions: trendSchema,
      abgTests: trendSchema,
      ventilatorSettings: trendSchema,
    }).passthrough(),
  }).passthrough(),
  syncConflicts: syncConflictsSchema,
  visibility: z.object({
    modelGovernanceIncluded: z.boolean().catch(false),
    governanceDashboardIncluded: z.boolean().catch(false),
  }).passthrough(),
  safetyStatement: z.string().optional(),
  privacy: z.string().optional(),
}).passthrough().transform((value) => {
  const safeValue = { ...value };
  delete safeValue.modelGovernance;
  delete safeValue.overrides;
  delete safeValue.referenceGovernance;
  delete safeValue.auditSummary;
  return safeValue;
});

const operationalDashboardSchema = z.object({
  dashboard: z.literal(DASHBOARD_TYPES.OPERATIONAL),
  scope: scopeSchema,
  window: windowSchema,
  counts: z.record(z.string(), z.number()).catch({}),
  trends: z.object({
    admissions: trendSchema,
    datasetCases: trendSchema,
    syncAttention: trendSchema,
  }).passthrough(),
  reviewBacklog: reviewBacklogSchema,
  syncConflicts: syncConflictsSchema,
  datasetReadiness: datasetReadinessSchema,
  overrides: overrideSummarySchema,
  referenceGovernance: referenceGovernanceSchema,
  modelGovernance: modelGovernanceSchema,
  auditSummary: auditSummarySchema,
  privacy: z.string().optional(),
}).passthrough();

const governanceDashboardSchema = z.object({
  dashboard: z.literal(DASHBOARD_TYPES.GOVERNANCE),
  scope: scopeSchema,
  window: windowSchema,
  datasetReadiness: datasetReadinessSchema,
  referenceGovernance: referenceGovernanceSchema,
  modelGovernance: modelGovernanceSchema,
  auditSummary: auditSummarySchema,
  overrides: overrideSummarySchema,
  syncConflicts: syncConflictsSchema,
  privacy: z.string().optional(),
}).passthrough();

const dashboardSchemas = Object.freeze({
  [DASHBOARD_TYPES.CLINICAL]: clinicalDashboardSchema,
  [DASHBOARD_TYPES.OPERATIONAL]: operationalDashboardSchema,
  [DASHBOARD_TYPES.GOVERNANCE]: governanceDashboardSchema,
});

const normalizeRole = (role) => {
  const value = String(role || '').trim().toUpperCase();
  if (value === 'SUPER_ADMIN') return MEMBERSHIP_ROLES.PLATFORM_ADMIN;
  return value;
};

const normalizeRoles = (roles = []) => {
  const list = Array.isArray(roles) ? roles : [roles];
  return [...new Set(list.map(normalizeRole).filter(Boolean))];
};

const hasAnyRole = (roles, allowedRoles) => {
  const normalizedRoles = normalizeRoles(roles);
  return allowedRoles.some((role) => normalizedRoles.includes(role));
};

const getDashboardCapabilities = (roles = []) => ({
  canViewClinical: hasAnyRole(roles, READ_ROLES),
  canViewOperational: hasAnyRole(roles, OPERATIONAL_ROLES),
  canViewGovernance: hasAnyRole(roles, GOVERNANCE_ROLES),
});

const getDashboardTypeForRoles = (roles = []) => {
  const capabilities = getDashboardCapabilities(roles);
  if (capabilities.canViewOperational) return DASHBOARD_TYPES.OPERATIONAL;
  if (capabilities.canViewGovernance) return DASHBOARD_TYPES.GOVERNANCE;
  return DASHBOARD_TYPES.CLINICAL;
};

const normalizeDashboard = (type, value) => {
  const schema = dashboardSchemas[type];
  if (!schema) {
    const error = new Error('Unsupported dashboard response type');
    error.code = 'DASHBOARD_TYPE_UNSUPPORTED';
    throw error;
  }

  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    const error = new Error('Invalid dashboard response');
    error.code = 'DASHBOARD_RESPONSE_INVALID';
    error.cause = parsed.error;
    throw error;
  }
  return parsed.data;
};

export {
  MEMBERSHIP_ROLES,
  READ_ROLES,
  OPERATIONAL_ROLES,
  GOVERNANCE_ROLES,
  getDashboardCapabilities,
  getDashboardTypeForRoles,
  normalizeDashboard,
  normalizeRoles,
};
