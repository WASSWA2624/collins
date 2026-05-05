export const REFERENCE_RANGE_DATASET_VERSION = 'collins-reference-ranges@2026-05-04';

export const PATIENT_PATHWAYS = Object.freeze([
  'NEONATE',
  'INFANT',
  'CHILD',
  'ADOLESCENT',
  'ADULT',
  'OBSTETRIC',
  'BURNS',
  'TRAUMA',
  'PERI_OPERATIVE',
  'MEDICAL',
  'SURGICAL',
  'UNKNOWN',
  'OTHER',
]);

export const REFERENCE_VERIFICATION_STATUS = Object.freeze({
  DRAFT: 'DRAFT',
  PENDING_REVIEW: 'PENDING_REVIEW',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
  RETIRED: 'RETIRED',
});

export const REFERENCE_SCOPES = Object.freeze({
  GLOBAL: 'GLOBAL',
  FACILITY: 'FACILITY',
});

const VERIFIED_AT = '2026-05-04T00:00:00.000Z';
const VERIFIED_BY = 'development-seed';
const DEVELOPMENT_SOURCE = 'Collins development seed safety guardrail; replace with locally approved reference before production clinical use.';

const verifiedSeedRange = ({
  id,
  clinicalCondition = 'general_screening',
  scenario,
  patientPathways = PATIENT_PATHWAYS,
  population = 'all',
  parameterName,
  lowerBound,
  upperBound,
  unit,
  metadata = {},
}) => ({
  id,
  clinicalCondition,
  scenario,
  patientPathways,
  population,
  parameterName,
  lowerBound,
  upperBound,
  unit,
  sourceCitation: DEVELOPMENT_SOURCE,
  version: REFERENCE_RANGE_DATASET_VERSION,
  scope: REFERENCE_SCOPES.GLOBAL,
  verificationStatus: REFERENCE_VERIFICATION_STATUS.VERIFIED,
  verifiedBy: VERIFIED_BY,
  verifiedAt: VERIFIED_AT,
  reviewNotes: 'Verified for MVP development seed use only; production changes require clinician review.',
  auditTrail: [
    {
      action: 'seed_verified_for_mvp',
      actor: VERIFIED_BY,
      at: VERIFIED_AT,
      note: 'Initial rule-based MVP range record.',
    },
  ],
  metadata,
});

const validityRanges = [
  ['ph', 6.8, 7.8, 'pH'],
  ['pao2', 20, 600, 'mmHg'],
  ['paco2', 10, 150, 'mmHg'],
  ['spo2', 40, 100, '%'],
  ['fio2', 0.01, 1, 'fraction'],
  ['peep', 0, 30, 'cmH2O'],
  ['plateauPressure', 0, 60, 'cmH2O'],
  ['tidalVolumeMl', 1, 3000, 'mL'],
  ['respiratoryRate', 0, 180, 'breaths/min'],
].map(([parameterName, lowerBound, upperBound, unit]) => verifiedSeedRange({
  id: `dev-validity-${parameterName}`,
  scenario: 'physiologic_validity',
  parameterName,
  lowerBound,
  upperBound,
  unit,
}));

const commonScreeningRanges = [
  ['ph', 7.25, 7.55, 'pH'],
  ['pao2', 60, 200, 'mmHg'],
  ['paco2', 25, 70, 'mmHg'],
  ['spo2', 90, 100, '%'],
  ['fio2', 0.21, 1, 'fraction'],
  ['peep', 5, 15, 'cmH2O'],
  ['plateauPressure', 0, 30, 'cmH2O'],
].map(([parameterName, lowerBound, upperBound, unit]) => verifiedSeedRange({
  id: `dev-common-${parameterName}`,
  scenario: 'common_screening',
  parameterName,
  lowerBound,
  upperBound,
  unit,
}));

const adultLikePathways = Object.freeze([
  'ADULT',
  'OBSTETRIC',
  'BURNS',
  'TRAUMA',
  'PERI_OPERATIVE',
  'MEDICAL',
  'SURGICAL',
]);

const adultAcidBaseRanges = [
  ['ph', 7.35, 7.45, 'pH'],
  ['paco2', 35, 45, 'mmHg'],
  ['hco3', 22, 26, 'mmol/L'],
  ['baseExcess', -2, 2, 'mmol/L'],
].map(([parameterName, lowerBound, upperBound, unit]) => verifiedSeedRange({
  id: `dev-adult-acid-base-${parameterName}`,
  clinicalCondition: 'acid_base_screening',
  scenario: 'normal_reference',
  patientPathways: adultLikePathways,
  population: 'adult',
  parameterName,
  lowerBound,
  upperBound,
  unit,
}));

const adultVentilationRanges = [
  verifiedSeedRange({
    id: 'dev-adult-vt-ml-per-kg',
    clinicalCondition: 'invasive_ventilation',
    scenario: 'lung_protective_guardrail',
    patientPathways: adultLikePathways,
    population: 'adult',
    parameterName: 'vtMlPerKgReferenceWeight',
    lowerBound: 4,
    upperBound: 8,
    unit: 'mL/kg',
  }),
  verifiedSeedRange({
    id: 'dev-adult-driving-pressure',
    clinicalCondition: 'invasive_ventilation',
    scenario: 'lung_mechanics_guardrail',
    patientPathways: adultLikePathways,
    population: 'adult',
    parameterName: 'drivingPressure',
    lowerBound: 0,
    upperBound: 15,
    unit: 'cmH2O',
  }),
  verifiedSeedRange({
    id: 'dev-adult-plateau-pressure',
    clinicalCondition: 'invasive_ventilation',
    scenario: 'lung_mechanics_guardrail',
    patientPathways: adultLikePathways,
    population: 'adult',
    parameterName: 'plateauPressure',
    lowerBound: 0,
    upperBound: 30,
    unit: 'cmH2O',
  }),
];

const adultOxygenationSeverityRanges = [
  ['severe', 0, 100, 'red'],
  ['moderate', 100, 200, 'yellow'],
  ['mild', 200, 300, 'yellow'],
].map(([category, lowerBound, upperBound, severity]) => verifiedSeedRange({
  id: `dev-adult-pf-${category}`,
  clinicalCondition: 'oxygenation_impairment',
  scenario: 'severity',
  patientPathways: adultLikePathways,
  population: 'adult',
  parameterName: 'pfRatio',
  lowerBound,
  upperBound,
  unit: 'ratio',
  metadata: { category, severity },
}));

const adultOxygenTargetRanges = [
  verifiedSeedRange({
    id: 'dev-adult-spo2-target-general',
    clinicalCondition: 'general_oxygenation',
    scenario: 'target_prompt',
    patientPathways: adultLikePathways,
    population: 'adult',
    parameterName: 'oxygenTargetSpo2',
    lowerBound: 94,
    upperBound: 98,
    unit: '%',
    metadata: { status: 'default' },
  }),
  verifiedSeedRange({
    id: 'dev-adult-spo2-target-hypercapnia',
    clinicalCondition: 'hypercapnia_risk',
    scenario: 'target_prompt',
    patientPathways: adultLikePathways,
    population: 'adult',
    parameterName: 'oxygenTargetSpo2',
    lowerBound: 88,
    upperBound: 92,
    unit: '%',
    metadata: { status: 'caution' },
  }),
];

export const DEVELOPMENT_REFERENCE_RANGES = Object.freeze([
  ...validityRanges,
  ...commonScreeningRanges,
  ...adultAcidBaseRanges,
  ...adultVentilationRanges,
  ...adultOxygenationSeverityRanges,
  ...adultOxygenTargetRanges,
]);

const isFiniteNumber = (value) => Number.isFinite(Number(value));

export const validateReferenceRangeRecord = (record = {}) => {
  const errors = [];
  const requireString = (field) => {
    if (!record[field] || typeof record[field] !== 'string') {
      errors.push({ field, message: `${field} is required` });
    }
  };

  [
    'clinicalCondition',
    'scenario',
    'parameterName',
    'unit',
    'sourceCitation',
    'version',
    'scope',
    'verificationStatus',
    'verifiedBy',
    'verifiedAt',
    'reviewNotes',
  ].forEach(requireString);

  if (!Array.isArray(record.patientPathways) || record.patientPathways.length === 0) {
    errors.push({ field: 'patientPathways', message: 'patientPathways must include at least one pathway' });
  } else {
    for (const pathway of record.patientPathways) {
      if (!PATIENT_PATHWAYS.includes(pathway)) {
        errors.push({ field: 'patientPathways', message: `${pathway} is not a supported patient pathway` });
      }
    }
  }

  if (!record.population || typeof record.population !== 'string') {
    errors.push({ field: 'population', message: 'population is required' });
  }

  if (!isFiniteNumber(record.lowerBound) && !isFiniteNumber(record.upperBound)) {
    errors.push({ field: 'lowerBound', message: 'At least one numeric bound is required' });
  }

  if (isFiniteNumber(record.lowerBound) && isFiniteNumber(record.upperBound) && Number(record.lowerBound) > Number(record.upperBound)) {
    errors.push({ field: 'lowerBound', message: 'lowerBound cannot be greater than upperBound' });
  }

  if (!Object.values(REFERENCE_SCOPES).includes(record.scope)) {
    errors.push({ field: 'scope', message: 'scope must be GLOBAL or FACILITY' });
  }

  if (record.scope === REFERENCE_SCOPES.FACILITY && !record.facilityId) {
    errors.push({ field: 'facilityId', message: 'facilityId is required for facility-scoped ranges' });
  }

  if (!Object.values(REFERENCE_VERIFICATION_STATUS).includes(record.verificationStatus)) {
    errors.push({ field: 'verificationStatus', message: 'verificationStatus is not supported' });
  }

  if (record.verificationStatus === REFERENCE_VERIFICATION_STATUS.VERIFIED && Number.isNaN(Date.parse(record.verifiedAt))) {
    errors.push({ field: 'verifiedAt', message: 'verifiedAt must be a valid date for verified ranges' });
  }

  if (!Array.isArray(record.auditTrail) || record.auditTrail.length === 0) {
    errors.push({ field: 'auditTrail', message: 'auditTrail must include at least one entry' });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateReferenceRangeDataset = (ranges = []) => {
  const results = ranges.map((range) => ({
    id: range.id,
    ...validateReferenceRangeRecord(range),
  }));

  return {
    valid: results.every((result) => result.valid),
    results,
  };
};

export const isReferenceRangeRecordVerified = (record) => (
  record?.verificationStatus === REFERENCE_VERIFICATION_STATUS.VERIFIED
  && validateReferenceRangeRecord(record).valid
);

export const getVerifiedReferenceRanges = (ranges = DEVELOPMENT_REFERENCE_RANGES) => (
  ranges.filter(isReferenceRangeRecordVerified)
);

const matchesRangeCriteria = (range, {
  clinicalCondition,
  scenario,
  parameterName,
  patientPathway,
  population,
  facilityId,
}) => {
  if (parameterName && range.parameterName !== parameterName) return false;
  if (clinicalCondition && range.clinicalCondition !== clinicalCondition) return false;
  if (scenario && range.scenario !== scenario) return false;
  if (patientPathway && !range.patientPathways.includes(patientPathway)) return false;
  if (population && range.population !== 'all' && range.population !== population) return false;
  if (range.scope === REFERENCE_SCOPES.FACILITY && range.facilityId !== facilityId) return false;
  return true;
};

const sortReferenceRanges = (a, b) => {
  if (a.scope !== b.scope) return a.scope === REFERENCE_SCOPES.FACILITY ? -1 : 1;
  return Date.parse(b.verifiedAt) - Date.parse(a.verifiedAt);
};

export const findApplicableReferenceRanges = ({
  ranges = DEVELOPMENT_REFERENCE_RANGES,
  ...criteria
} = {}) => (
  getVerifiedReferenceRanges(ranges)
    .filter((range) => matchesRangeCriteria(range, criteria))
    .sort(sortReferenceRanges)
);

export const findApplicableReferenceRange = (criteria = {}) => (
  findApplicableReferenceRanges(criteria)[0] || null
);

export const evaluateValueAgainstReferenceRange = (value, range) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return { status: 'missing_data', direction: null };
  }
  if (!range) {
    return { status: 'missing_reference', direction: null };
  }
  if (isFiniteNumber(range.lowerBound) && numeric < Number(range.lowerBound)) {
    return { status: 'outside_range', direction: 'below' };
  }
  if (isFiniteNumber(range.upperBound) && numeric > Number(range.upperBound)) {
    return { status: 'outside_range', direction: 'above' };
  }
  return { status: 'within_range', direction: null };
};

export const isValueBelowRange = (value, range) => (
  Number.isFinite(Number(value)) && range && isFiniteNumber(range.lowerBound) && Number(value) < Number(range.lowerBound)
);

export const isValueAboveRange = (value, range, { includeUpperBound = false } = {}) => {
  if (!Number.isFinite(Number(value)) || !range || !isFiniteNumber(range.upperBound)) return false;
  return includeUpperBound ? Number(value) >= Number(range.upperBound) : Number(value) > Number(range.upperBound);
};

export const findMatchingValueRange = ({
  value,
  includeUpperBound = false,
  ...criteria
} = {}) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;

  return findApplicableReferenceRanges(criteria).find((range) => {
    const aboveLower = !isFiniteNumber(range.lowerBound) || numeric >= Number(range.lowerBound);
    const belowUpper = !isFiniteNumber(range.upperBound)
      || (includeUpperBound ? numeric <= Number(range.upperBound) : numeric < Number(range.upperBound));
    return aboveLower && belowUpper;
  }) || null;
};

export const toReferenceRangeSummary = (range) => {
  if (!range) return null;
  return {
    id: range.id,
    clinicalCondition: range.clinicalCondition,
    scenario: range.scenario,
    patientPathways: range.patientPathways,
    population: range.population,
    parameterName: range.parameterName,
    lowerBound: range.lowerBound,
    upperBound: range.upperBound,
    unit: range.unit,
    sourceCitation: range.sourceCitation,
    version: range.version,
    scope: range.scope,
    verificationStatus: range.verificationStatus,
    verifiedAt: range.verifiedAt,
  };
};
