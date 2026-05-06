import { DEVELOPMENT_REFERENCE_RANGES } from '../../clinical/referenceRanges.js';

export const DEVELOPMENT_REFERENCE_SEED_USER_ID = 'development-reference-seed-user';
export const DEVELOPMENT_REFERENCE_SEED_EMAIL = 'reference-seed@collins.local';
export const DEVELOPMENT_REFERENCE_GOVERNANCE_STATUS = 'verified_for_decision_support';
export const DEVELOPMENT_REFERENCE_ACTIVE_FROM = new Date('2026-05-04T00:00:00.000Z');

const toDate = (value, fallback = DEVELOPMENT_REFERENCE_ACTIVE_FROM) => {
  const parsed = value ? new Date(value) : fallback;
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
};

const buildReferenceName = (range, pathway) => `${range.id}:${pathway.toLowerCase()}`;

export const buildSeedReferenceRuleRows = (
  ranges = DEVELOPMENT_REFERENCE_RANGES,
  {
    seedUserId = DEVELOPMENT_REFERENCE_SEED_USER_ID,
    activeFrom = DEVELOPMENT_REFERENCE_ACTIVE_FROM,
  } = {},
) => ranges.flatMap((range) => range.patientPathways.map((patientPathway) => ({
  name: buildReferenceName(range, patientPathway),
  version: range.version,
  clinicalCondition: range.clinicalCondition,
  scenario: range.scenario,
  patientPathway,
  population: range.population,
  scope: range.scope,
  parameterName: range.parameterName,
  lowerBound: range.lowerBound,
  upperBound: range.upperBound,
  unit: range.unit,
  sourceCitation: range.sourceCitation,
  ruleJson: {
    dataLayer: 'reference_evidence',
    approvedForTraining: false,
    rawPatientDataIncluded: false,
    patientPathways: [patientPathway],
    sourceRangeId: range.id,
    metadata: range.metadata || {},
  },
  activeFrom,
  activeTo: null,
  approvedByUserId: seedUserId,
  verifiedByUserId: seedUserId,
  verifiedAt: toDate(range.verifiedAt),
  verificationStatus: 'VERIFIED',
  reviewNotes: `${range.reviewNotes} Not patient data and not an approved training dataset.`,
  auditTrailJson: [
    ...(Array.isArray(range.auditTrail) ? range.auditTrail : []),
    {
      action: 'seeded_to_database',
      actorUserId: seedUserId,
      at: new Date('2026-05-05T00:00:00.000Z').toISOString(),
      note: 'Development reference/evidence seed only; production edits require authorized review.',
    },
  ],
  governanceStatus: DEVELOPMENT_REFERENCE_GOVERNANCE_STATUS,
})));
