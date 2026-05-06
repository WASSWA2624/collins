import { prisma } from '../../config/prisma.js';
import {
  DEVELOPMENT_REFERENCE_RANGES,
  validateReferenceRangeRecord,
} from '../../clinical/referenceRanges.js';
import {
  decorateReferenceRulesForTraining,
  VERIFIED_REFERENCE_GOVERNANCE_STATUSES,
} from '../training-help/trainingHelp.service.js';

const activeWindowWhere = (now) => ({
  verificationStatus: 'VERIFIED',
  governanceStatus: { in: [...VERIFIED_REFERENCE_GOVERNANCE_STATUSES] },
  OR: [
    { activeFrom: null },
    { activeFrom: { lte: now } },
  ],
  AND: [{ OR: [{ activeTo: null }, { activeTo: { gte: now } }] }],
});

export const activeReferenceWhere = (now, { facilityId } = {}) => ({
  ...activeWindowWhere(now),
  ...(facilityId
    ? {
      AND: [
        ...(activeWindowWhere(now).AND || []),
        {
          OR: [
            { scope: 'GLOBAL' },
            { facilityId },
          ],
        },
      ],
    }
    : {}),
});

export const listActiveReferenceRules = async (now = new Date(), { facilityId, client = prisma } = {}) => {
  const candidates = await client.referenceRule.findMany({
    where: activeReferenceWhere(now, { facilityId }),
    orderBy: [{ name: 'asc' }, { version: 'desc' }],
  });

  return decorateReferenceRulesForTraining(candidates, now);
};

const toIsoString = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

export const referenceRuleToRangeRecord = (rule) => {
  if (!rule) return null;

  const record = {
    id: rule.id,
    clinicalCondition: rule.clinicalCondition,
    scenario: rule.scenario,
    patientPathways: rule.patientPathway ? [rule.patientPathway] : [],
    population: rule.population,
    parameterName: rule.parameterName,
    lowerBound: rule.lowerBound,
    upperBound: rule.upperBound,
    unit: rule.unit,
    sourceCitation: rule.sourceCitation,
    version: rule.version,
    scope: rule.scope,
    facilityId: rule.facilityId || undefined,
    verificationStatus: rule.verificationStatus,
    verifiedBy: rule.verifiedByUserId || rule.verifiedBy?.email || rule.verifiedBy?.name || null,
    verifiedAt: toIsoString(rule.verifiedAt),
    reviewNotes: rule.reviewNotes,
    auditTrail: Array.isArray(rule.auditTrailJson) ? rule.auditTrailJson : [],
    metadata: rule.ruleJson?.metadata || {},
  };

  const validation = validateReferenceRangeRecord(record);
  return {
    ...record,
    validation,
  };
};

export const listActiveReferenceRangeRecords = async ({
  now = new Date(),
  facilityId,
  client = prisma,
  allowDevelopmentFallback = false,
} = {}) => {
  if (!client.referenceRule?.findMany) {
    return allowDevelopmentFallback
      ? DEVELOPMENT_REFERENCE_RANGES.map((range) => ({ ...range, source: 'development_fallback_no_reference_repository' }))
      : [];
  }

  const rules = await listActiveReferenceRules(now, { facilityId, client });
  const records = rules
    .map(referenceRuleToRangeRecord)
    .filter((record) => record?.validation?.valid);

  return records.map(({ validation, ...record }) => record);
};

export const getReferencePolicy = () => ({
  verifiedOnly: true,
  eligibleGovernanceStatuses: [...VERIFIED_REFERENCE_GOVERNANCE_STATUSES],
  requiredMetadata: [
    'clinicalCondition',
    'scenario',
    'patientPathway',
    'population',
    'parameterName',
    'lowerBound',
    'upperBound',
    'unit',
    'sourceCitation',
    'version',
    'scope',
    'verificationStatus',
    'verifiedBy',
    'verifiedAt',
    'reviewNotes',
    'auditTrail',
  ],
  safetyStatement: 'Reference rules support clinical judgement only and do not create treatment orders.',
});
