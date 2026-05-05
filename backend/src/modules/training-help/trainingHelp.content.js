export const TRAINING_HELP_CONTENT_VERSION = '2026.05.phase14';
export const TRAINING_HELP_SCHEMA_VERSION = '1.0';
export const TRAINING_HELP_LAST_UPDATED = '2026-05-05';

export const TRAINING_HELP_WORKFLOWS = Object.freeze([
  'home',
  'admit',
  'tracking',
  'abg-vent-update',
  'dataset-capture',
  'review-queue',
  'dashboard',
  'settings',
]);

export const TRAINING_HELP_SAFETY_STATEMENT = 'Training and help content is advisory. It supports app use, documentation, review, and escalation without creating clinical orders.';

export const TRAINING_HELP_REFERENCE_POLICY = Object.freeze({
  activeReferenceEndpoint: '/references/active',
  verifiedOnly: true,
  requiredMetadata: Object.freeze(['verificationStatus', 'sourceCitation', 'version', 'scope']),
  decisionSupportUse: 'Only active approved or verified reference rules are eligible for decision-support display.',
  excludedUse: 'Draft, retired, pending, rejected, or unverified reference records are not active decision-support rules.',
});

export const TRAINING_HELP_TOPICS = Object.freeze([
  Object.freeze({
    id: 'workflow.home',
    workflow: 'home',
    title: 'Home',
    audiences: Object.freeze(['all']),
    order: 10,
    summary: 'Use Home for facility context, sync state, and workload status before opening a patient workflow.',
    body: Object.freeze([
      'Review the active facility, offline or sync state, active admissions count, red-flag count, and records needing review.',
      'Home summaries are operational signals only. They do not create clinical conclusions, treatment instructions, or ventilator-setting instructions.',
    ]),
  }),
  Object.freeze({
    id: 'workflow.admit',
    workflow: 'admit',
    title: 'Admit',
    audiences: Object.freeze(['clinical', 'facility_admin']),
    order: 20,
    summary: 'Use Admit to capture patient, pathway, oxygenation, ABG, ventilator, airway, and humidification data.',
    body: Object.freeze([
      'Enter available data and mark unavailable values explicitly when the bedside record is incomplete.',
      'Server-side calculations and flags are advisory prompts for clinical review after save.',
    ]),
  }),
  Object.freeze({
    id: 'workflow.tracking',
    workflow: 'tracking',
    title: 'Tracking',
    audiences: Object.freeze(['clinical', 'reviewer', 'facility_admin']),
    order: 30,
    summary: 'Use Tracking as a bed-board view for recent ventilation status and review needs.',
    body: Object.freeze([
      'Use trend and review-status indicators to decide which record needs attention or specialist review.',
      'Tracking flags should be read with source data, pathway, reference weight, and local protocol context.',
    ]),
  }),
  Object.freeze({
    id: 'workflow.abg-vent-update',
    workflow: 'abg-vent-update',
    title: 'ABG / Vent Update',
    audiences: Object.freeze(['clinical', 'facility_admin']),
    order: 40,
    summary: 'Use ABG / Vent Update to append time-stamped ABG and ventilator records.',
    body: Object.freeze([
      'New ABGs and ventilator records are appended as versions so earlier clinical records remain available for review.',
      'Calculated ratios, VT/kg, and pressure flags are recalculated by the backend after save.',
    ]),
  }),
  Object.freeze({
    id: 'workflow.dataset-capture',
    workflow: 'dataset-capture',
    title: 'Dataset Capture',
    audiences: Object.freeze(['reviewer', 'research_governance', 'facility_admin']),
    order: 50,
    summary: 'Use Dataset Capture for candidate de-identified records that require review before dataset or training use.',
    body: Object.freeze([
      'Raw notes are parsed into structured previews for human review, then stored separately from live facility records.',
      'Only reviewed, de-identified, governance-approved records can become approved training data.',
    ]),
  }),
  Object.freeze({
    id: 'workflow.review-queue',
    workflow: 'review-queue',
    title: 'Review Queue',
    audiences: Object.freeze(['reviewer', 'research_governance', 'facility_admin']),
    order: 60,
    summary: 'Use Review Queue to approve, request correction, or exclude records with an audit trail.',
    body: Object.freeze([
      'Review actions preserve the submitted record, reviewer decision, status transition, and reason where provided.',
      'Reference ranges require approved or verified governance status before decision-support display.',
    ]),
  }),
  Object.freeze({
    id: 'workflow.dashboard',
    workflow: 'dashboard',
    title: 'Dashboard',
    audiences: Object.freeze(['facility_admin', 'platform_admin', 'reviewer', 'research_governance']),
    order: 70,
    summary: 'Use Dashboard for aggregate facility, quality, review, reference, and governance status.',
    body: Object.freeze([
      'Dashboards should remain aggregate and role-scoped, without patient identifiers in governance summaries.',
      'Normal clinician workflows should not expose predictive model controls or model internals.',
    ]),
  }),
  Object.freeze({
    id: 'workflow.settings',
    workflow: 'settings',
    title: 'Settings',
    audiences: Object.freeze(['all']),
    order: 80,
    summary: 'Use Settings for account, active facility, accessibility, privacy, sync, and reference visibility preferences.',
    body: Object.freeze([
      'Settings can change user or facility preferences where authorized, but cannot activate unverified reference ranges.',
      'Settings should not enable predictive model outputs for normal clinicians.',
    ]),
  }),
  Object.freeze({
    id: 'governance.model-readiness',
    workflow: 'dashboard',
    title: 'Model Readiness',
    audiences: Object.freeze(['platform_admin', 'model_governance']),
    order: 90,
    summary: 'Use model-readiness help for governed shadow-mode review and future model cards.',
    body: Object.freeze([
      'Model metadata is available only to approved governance roles.',
      'Shadow-mode outputs remain hidden from normal clinical workflows until future governance approval explicitly changes that policy.',
    ]),
  }),
]);
