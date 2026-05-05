import { MEMBERSHIP_ROLES } from '../../constants/roles.js';
import {
  TRAINING_HELP_CONTENT_VERSION,
  TRAINING_HELP_LAST_UPDATED,
  TRAINING_HELP_REFERENCE_POLICY,
  TRAINING_HELP_SAFETY_STATEMENT,
  TRAINING_HELP_SCHEMA_VERSION,
  TRAINING_HELP_TOPICS,
  TRAINING_HELP_WORKFLOWS,
} from './trainingHelp.content.js';

const ROLE_AUDIENCES = Object.freeze({
  [MEMBERSHIP_ROLES.PLATFORM_ADMIN]: Object.freeze(['platform_admin', 'facility_admin', 'reviewer', 'research_governance', 'clinical']),
  [MEMBERSHIP_ROLES.FACILITY_ADMIN]: Object.freeze(['facility_admin', 'reviewer', 'clinical']),
  [MEMBERSHIP_ROLES.CLINICIAN]: Object.freeze(['clinical']),
  [MEMBERSHIP_ROLES.ICU_NURSE]: Object.freeze(['clinical']),
  [MEMBERSHIP_ROLES.SPECIALIST_REVIEWER]: Object.freeze(['reviewer', 'clinical']),
  [MEMBERSHIP_ROLES.RESEARCH_GOVERNANCE_OFFICER]: Object.freeze(['research_governance', 'reviewer']),
  [MEMBERSHIP_ROLES.READ_ONLY_REVIEWER]: Object.freeze(['reviewer']),
});

export const VERIFIED_REFERENCE_GOVERNANCE_STATUSES = Object.freeze([
  'approved',
  'verified',
  'active',
  'approved_for_decision_support',
  'verified_for_decision_support',
]);

export const FORBIDDEN_TRAINING_WORDING = Object.freeze([
  Object.freeze({
    code: 'EXACT_VENTILATOR_ORDER',
    pattern: /\b(set|increase|decrease|change)\s+(the\s+)?(ventilator|peep|fio2|tidal volume|respiratory rate|pressure support)\s+(to|at)\s+\d/i,
  }),
  Object.freeze({
    code: 'AUTONOMOUS_DIAGNOSIS',
    pattern: /\b(diagnose|diagnoses|diagnosed)\b/i,
  }),
  Object.freeze({
    code: 'PRESCRIPTION_LANGUAGE',
    pattern: /\b(prescribe|prescribes|prescribed|prescription)\b/i,
  }),
  Object.freeze({
    code: 'MANDATORY_AIRWAY_ACTION',
    pattern: /\b(must|should)\s+(intubate|extubate|paralyze|sedate)\b/i,
  }),
  Object.freeze({
    code: 'DOSE_OR_TREATMENT_ORDER',
    pattern: /\b(give|administer|start)\s+\d+(\.\d+)?\s*(mg|mcg|ml|units?|iu|mmol)\b/i,
  }),
]);

const normalizeText = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');

const unique = (values) => [...new Set(values.filter(Boolean))];

const getRoleAudiences = (roles = []) => new Set([
  'all',
  ...roles.flatMap((role) => ROLE_AUDIENCES[role] || []),
]);

const isVisibleTopic = (topic, audienceSet) => topic.audiences.some((audience) => audienceSet.has(audience));

const sortByOrder = (a, b) => {
  if (a.order !== b.order) return a.order - b.order;
  return a.id.localeCompare(b.id);
};

const sanitizeTopic = (topic) => ({
  id: topic.id,
  workflow: topic.workflow,
  title: topic.title,
  summary: topic.summary,
  body: [...topic.body],
  audiences: [...topic.audiences],
});

const collectStrings = (value) => {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(collectStrings);
  return [];
};

export const getTrainingHelpCatalog = ({ roles = [], workflow } = {}) => {
  const audienceSet = getRoleAudiences(roles);
  const normalizedWorkflow = normalizeText(workflow);
  const topics = TRAINING_HELP_TOPICS
    .filter((topic) => isVisibleTopic(topic, audienceSet))
    .filter((topic) => !normalizedWorkflow || topic.workflow === normalizedWorkflow)
    .sort(sortByOrder)
    .map(sanitizeTopic);

  return {
    contentVersion: TRAINING_HELP_CONTENT_VERSION,
    contentSchemaVersion: TRAINING_HELP_SCHEMA_VERSION,
    lastUpdated: TRAINING_HELP_LAST_UPDATED,
    safetyStatement: TRAINING_HELP_SAFETY_STATEMENT,
    dataBoundary: 'Training/help content is separate from live facility records and approved training datasets.',
    workflows: [...TRAINING_HELP_WORKFLOWS],
    referencePolicy: {
      ...TRAINING_HELP_REFERENCE_POLICY,
      requiredMetadata: [...TRAINING_HELP_REFERENCE_POLICY.requiredMetadata],
    },
    topics,
  };
};

export const findForbiddenTrainingWording = (content = getTrainingHelpCatalog({ roles: Object.values(MEMBERSHIP_ROLES) })) => {
  const strings = collectStrings(content);
  return strings.flatMap((text) => FORBIDDEN_TRAINING_WORDING
    .filter(({ pattern }) => pattern.test(text))
    .map(({ code }) => ({ code, text })));
};

export const normalizeReferenceGovernanceStatus = (status) => normalizeText(status || 'unverified');

export const normalizeReferenceVerificationStatus = (status) => normalizeText(status || 'unverified');

export const isVerifiedReferenceRule = (rule) => (
  normalizeReferenceVerificationStatus(rule?.verificationStatus) === 'verified'
  && VERIFIED_REFERENCE_GOVERNANCE_STATUSES.includes(normalizeReferenceGovernanceStatus(rule?.governanceStatus))
);

export const isActiveReferenceRule = (rule, now = new Date()) => {
  const activeFrom = rule?.activeFrom ? new Date(rule.activeFrom) : null;
  const activeTo = rule?.activeTo ? new Date(rule.activeTo) : null;

  if (activeFrom && activeFrom > now) return false;
  if (activeTo && activeTo < now) return false;
  return true;
};

const getReferenceScope = (rule) => {
  const ruleScope = rule?.ruleJson?.scope;
  const facilityId = rule?.facilityId || ruleScope?.facilityId || rule?.ruleJson?.facilityId || null;
  return facilityId || rule?.scope === 'FACILITY'
    ? { type: 'facility', facilityId }
    : { type: 'global', facilityId: null };
};

export const explainReferenceRuleForTraining = (rule, now = new Date()) => {
  const active = isActiveReferenceRule(rule, now);
  const verified = isVerifiedReferenceRule(rule);
  const scope = getReferenceScope(rule);

  return {
    id: rule?.id,
    name: rule?.name,
    version: rule?.version,
    sourceCitation: rule?.sourceCitation || null,
    verificationStatus: normalizeReferenceVerificationStatus(rule?.verificationStatus),
    governanceStatus: normalizeReferenceGovernanceStatus(rule?.governanceStatus),
    scope,
    activeFrom: rule?.activeFrom || null,
    activeTo: rule?.activeTo || null,
    active,
    decisionSupportEligible: active && verified,
    explanation: active && verified
      ? `Verified ${scope.type} reference rule ${rule?.name || 'reference'}@${rule?.version || 'unknown-version'} is eligible for advisory decision-support display.`
      : 'This reference rule is not eligible for active decision-support display.',
  };
};

export const filterDecisionSupportReferenceRules = (rules = [], now = new Date()) => rules
  .filter((rule) => isActiveReferenceRule(rule, now) && isVerifiedReferenceRule(rule));

export const decorateReferenceRulesForTraining = (rules = [], now = new Date()) => filterDecisionSupportReferenceRules(rules, now)
  .map((rule) => ({
    ...rule,
    referenceUse: explainReferenceRuleForTraining(rule, now),
  }));

export const getTrainingHelpSummary = ({ roles = [], workflow } = {}) => {
  const catalog = getTrainingHelpCatalog({ roles, workflow });
  return {
    ...catalog,
    availableWorkflows: unique(catalog.topics.map((topic) => topic.workflow)),
  };
};
