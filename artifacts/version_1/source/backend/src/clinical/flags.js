import {
  CLINICAL_RULE_VERSION,
  calculateDrivingPressure,
  calculateMinuteVentilation,
  calculatePfRatio,
  calculateReferenceWeight,
  calculateSfRatio,
  calculateVtPerKg,
  isAdultLikePathway,
  normalizeFio2,
} from './calculations.js';
import {
  DEVELOPMENT_REFERENCE_RANGES,
  evaluateValueAgainstReferenceRange,
  findApplicableReferenceRange,
  findMatchingValueRange,
  isValueAboveRange,
  isValueBelowRange,
  toReferenceRangeSummary,
} from './referenceRanges.js';

const makeFlag = (code, severity, message, details = {}) => {
  const requiresClinicianConfirmation = details.requiresClinicianConfirmation ?? severity !== 'info';
  const overrideReasonRequired = details.overrideReasonRequired ?? (severity === 'red' || code === 'IMPOSSIBLE_VALUE');

  return {
    code,
    severity,
    message,
    ruleVersion: CLINICAL_RULE_VERSION,
    advisory: true,
    requiresClinicianConfirmation,
    overrideReasonRequired,
    ...details,
  };
};

const includesCondition = (snapshot, names) => {
  const text = [
    snapshot?.mainCondition,
    JSON.stringify(snapshot?.comorbiditiesJson || {}),
  ].join(' ').toLowerCase();
  return names.some((name) => text.includes(name));
};

const getReferenceRanges = (options = {}) => options.referenceRanges || DEVELOPMENT_REFERENCE_RANGES;

const getPatientPathway = (patient = {}) => patient.patientPathway || 'UNKNOWN';

const getPatientPopulation = (patient = {}) => {
  if (isAdultLikePathway(patient)) return 'adult';
  if (patient.patientPathway === 'NEONATE') return 'neonatal';
  if (['INFANT', 'CHILD'].includes(patient.patientPathway)) return 'pediatric';
  if (patient.patientPathway === 'ADOLESCENT') return 'adolescent';
  return 'unknown';
};

const findPatientRange = ({
  patient = {},
  referenceRanges,
  clinicalCondition,
  scenario,
  parameterName,
}) => findApplicableReferenceRange({
  ranges: referenceRanges,
  clinicalCondition,
  scenario,
  parameterName,
  patientPathway: getPatientPathway(patient),
  population: getPatientPopulation(patient),
});

const makeReferenceDetails = (range) => ({
  referenceRange: toReferenceRangeSummary(range),
});

const makeMissingReferenceFlag = ({ parameterName, patient = {}, clinicalCondition, scenario, message }) => makeFlag(
  'MISSING_VERIFIED_REFERENCE_RANGE',
  'yellow',
  message || `No verified ${parameterName} reference range is active for this pathway; use local protocol and document clinician confirmation.`,
  {
    parameterName,
    patientPathway: getPatientPathway(patient),
    population: getPatientPopulation(patient),
    clinicalCondition,
    scenario,
  },
);

const pushUniqueFlag = (flags, flag) => {
  const alreadyPresent = flags.some((item) => (
    item.code === flag.code
    && item.parameterName === flag.parameterName
    && item.clinicalCondition === flag.clinicalCondition
    && item.scenario === flag.scenario
  ));
  if (!alreadyPresent) flags.push(flag);
};

const fieldChecks = [
  { field: 'ph', parameterName: 'ph' },
  { field: 'pao2', parameterName: 'pao2' },
  { field: 'paco2', parameterName: 'paco2' },
  { field: 'spo2', parameterName: 'spo2', source: (data) => data.spo2 ?? data.spo2AtSample },
  { field: 'fio2', parameterName: 'fio2', source: (data) => normalizeFio2(data.fio2 ?? data.fio2AtSample) },
  { field: 'peep', parameterName: 'peep' },
  { field: 'plateauPressure', parameterName: 'plateauPressure' },
  { field: 'tidalVolumeMl', parameterName: 'tidalVolumeMl' },
  {
    field: 'respiratoryRate',
    parameterName: 'respiratoryRate',
    source: (data) => data.respiratoryRate ?? data.respiratoryRateSet ?? data.respiratoryRateMeasured,
  },
];

export const validatePhysiology = (data = {}, options = {}) => {
  const flags = [];
  const referenceRanges = getReferenceRanges(options);

  for (const check of fieldChecks) {
    const value = check.source ? check.source(data) : data[check.field];
    if (value === null || value === undefined || value === '') continue;

    const numeric = Number(value);
    const validityRange = findApplicableReferenceRange({
      ranges: referenceRanges,
      clinicalCondition: 'general_screening',
      scenario: 'physiologic_validity',
      parameterName: check.parameterName,
      patientPathway: 'UNKNOWN',
      population: 'unknown',
    });

    if (!validityRange) {
      flags.push(makeMissingReferenceFlag({
        parameterName: check.parameterName,
        clinicalCondition: 'general_screening',
        scenario: 'physiologic_validity',
        message: `${check.field} cannot be screened because no verified physiologic validity range is active.`,
      }));
      continue;
    }

    const validity = evaluateValueAgainstReferenceRange(numeric, validityRange);
    if (validity.status !== 'within_range') {
      flags.push(makeFlag(
        'IMPOSSIBLE_VALUE',
        'red',
        `${check.field} is outside the verified physiologic validity range and needs correction or reviewer override.`,
        { field: check.field, direction: validity.direction, ...makeReferenceDetails(validityRange) },
      ));
      continue;
    }

    const commonRange = findApplicableReferenceRange({
      ranges: referenceRanges,
      clinicalCondition: 'general_screening',
      scenario: 'common_screening',
      parameterName: check.parameterName,
      patientPathway: 'UNKNOWN',
      population: 'unknown',
    });

    if (commonRange && evaluateValueAgainstReferenceRange(numeric, commonRange).status !== 'within_range') {
      flags.push(makeFlag(
        'SUSPICIOUS_VALUE',
        'yellow',
        `${check.field} is outside the verified common screening range; confirm clinically.`,
        { field: check.field, ...makeReferenceDetails(commonRange) },
      ));
    }
  }

  return flags;
};

const getAcidBaseRange = ({ patient, referenceRanges, parameterName }) => findPatientRange({
  patient,
  referenceRanges,
  clinicalCondition: 'acid_base_screening',
  scenario: 'normal_reference',
  parameterName,
});

const buildAcidBaseMissingFlag = (patient) => makeMissingReferenceFlag({
  parameterName: 'acidBase',
  patient,
  clinicalCondition: 'acid_base_screening',
  scenario: 'normal_reference',
  message: 'No verified acid-base reference ranges are active for this pathway; use pathway-specific local reference and document interpretation.',
});

export const interpretAbg = (abg = {}, patient = {}, options = {}) => {
  const referenceRanges = getReferenceRanges(options);
  const flags = [...validatePhysiology({ ...abg, fio2: abg.fio2AtSample, spo2: abg.spo2AtSample }, { referenceRanges })];
  const ph = Number(abg.ph);
  const paco2 = Number(abg.paco2);
  const hco3 = Number(abg.hco3);
  const baseExcess = Number(abg.baseExcess);
  const hasPh = Number.isFinite(ph);
  const hasPaco2 = Number.isFinite(paco2);
  const hasHco3 = Number.isFinite(hco3);
  const hasBaseExcess = Number.isFinite(baseExcess);
  const adultLike = isAdultLikePathway(patient);

  if (!hasPh || !hasPaco2) {
    flags.push(makeFlag('ABG_INCOMPLETE', 'yellow', 'ABG pH and PaCO2 are needed for acid-base pattern screening.'));
  }

  const phRange = getAcidBaseRange({ patient, referenceRanges, parameterName: 'ph' });
  const paco2Range = getAcidBaseRange({ patient, referenceRanges, parameterName: 'paco2' });
  const hco3Range = getAcidBaseRange({ patient, referenceRanges, parameterName: 'hco3' });
  const baseExcessRange = getAcidBaseRange({ patient, referenceRanges, parameterName: 'baseExcess' });

  if ((hasPh || hasPaco2 || hasHco3 || hasBaseExcess) && (!phRange || !paco2Range)) {
    pushUniqueFlag(flags, buildAcidBaseMissingFlag(patient));
  }

  if (phRange && paco2Range) {
    if (hasPh && hasPaco2 && isValueBelowRange(ph, phRange) && isValueAboveRange(paco2, paco2Range)) {
      flags.push(makeFlag('RESPIRATORY_ACIDOSIS_PATTERN', 'red', 'ABG pattern suggests respiratory acidosis; confirm clinically.', {
        ...makeReferenceDetails(phRange),
      }));
    }
    if (hasPh && hasPaco2 && isValueAboveRange(ph, phRange) && isValueBelowRange(paco2, paco2Range)) {
      flags.push(makeFlag('RESPIRATORY_ALKALOSIS_PATTERN', 'yellow', 'ABG pattern suggests respiratory alkalosis; confirm clinically.'));
    }
    if (hasPh && isValueBelowRange(ph, phRange) && (
      (hasHco3 && hco3Range && isValueBelowRange(hco3, hco3Range))
      || (hasBaseExcess && baseExcessRange && isValueBelowRange(baseExcess, baseExcessRange))
    )) {
      flags.push(makeFlag('METABOLIC_ACIDOSIS_PATTERN', 'red', 'ABG pattern suggests metabolic acidosis; confirm clinically.'));
    }
    if (hasPh && isValueAboveRange(ph, phRange) && (
      (hasHco3 && hco3Range && isValueAboveRange(hco3, hco3Range))
      || (hasBaseExcess && baseExcessRange && isValueAboveRange(baseExcess, baseExcessRange))
    )) {
      flags.push(makeFlag('METABOLIC_ALKALOSIS_PATTERN', 'yellow', 'ABG pattern suggests metabolic alkalosis; confirm clinically.'));
    }
    if (hasPh && hasPaco2 && (
      (isValueBelowRange(ph, phRange) && isValueBelowRange(paco2, paco2Range))
      || (isValueAboveRange(ph, phRange) && isValueAboveRange(paco2, paco2Range))
    )) {
      flags.push(makeFlag('MIXED_OR_UNCERTAIN_ABG', 'yellow', 'Mixed disorder possible; senior review is recommended.'));
    }
  }

  if (!adultLike) {
    flags.push(makeFlag('PATHWAY_REFERENCE_CAUTION', 'yellow', 'Use verified pathway-specific ABG reference ranges; confirm clinically.'));
  }

  const pfRatio = calculatePfRatio({ pao2: abg.pao2, fio2: abg.fio2AtSample });
  const sfRatio = calculateSfRatio({ spo2: abg.spo2AtSample, fio2: abg.fio2AtSample });

  if (abg.pao2 !== undefined && !normalizeFio2(abg.fio2AtSample)) {
    flags.push(makeFlag('MISSING_FIO2_FOR_PF', 'yellow', 'Cannot calculate P/F ratio because FiO2 at ABG sample time is missing.'));
  }

  if (pfRatio.value !== null) {
    const oxygenSeverity = findMatchingValueRange({
      ranges: referenceRanges,
      clinicalCondition: 'oxygenation_impairment',
      scenario: 'severity',
      parameterName: 'pfRatio',
      patientPathway: getPatientPathway(patient),
      population: getPatientPopulation(patient),
      value: pfRatio.value,
      includeUpperBound: false,
    });

    if (!oxygenSeverity) {
      pushUniqueFlag(flags, makeMissingReferenceFlag({
        parameterName: 'pfRatio',
        patient,
        clinicalCondition: 'oxygenation_impairment',
        scenario: 'severity',
      }));
    } else if (oxygenSeverity.metadata?.category === 'severe') {
      flags.push(makeFlag('SEVERE_HYPOXAEMIA', 'red', 'Severe oxygenation impairment pattern; urgent clinician review.', makeReferenceDetails(oxygenSeverity)));
    }
  }

  return { pfRatio, sfRatio, flags };
};

const classifyOxygenation = ({ patient, referenceRanges, pfRatio }) => findMatchingValueRange({
  ranges: referenceRanges,
  clinicalCondition: 'oxygenation_impairment',
  scenario: 'severity',
  parameterName: 'pfRatio',
  patientPathway: getPatientPathway(patient),
  population: getPatientPopulation(patient),
  value: pfRatio.value,
  includeUpperBound: false,
});

const buildUncertainty = ({ flags, referenceWeight, pfRatio, sfRatio }) => {
  const uncertainty = [];
  if (referenceWeight.status !== 'entered' && referenceWeight.status !== 'calculated') {
    uncertainty.push({ code: 'REFERENCE_WEIGHT_UNCERTAIN', message: referenceWeight.message });
  }
  if (pfRatio.status === 'missing_data') {
    uncertainty.push({ code: 'PF_RATIO_UNAVAILABLE', message: pfRatio.message });
  }
  if (sfRatio.status === 'missing_data') {
    uncertainty.push({ code: 'SF_RATIO_UNAVAILABLE', message: sfRatio.message });
  }
  for (const flag of flags.filter((item) => item.code === 'MISSING_VERIFIED_REFERENCE_RANGE')) {
    uncertainty.push({
      code: 'MISSING_VERIFIED_REFERENCE_RANGE',
      parameterName: flag.parameterName,
      message: flag.message,
    });
  }
  return uncertainty;
};

export const calculateVentilationSummary = ({
  patient = {},
  ventilator = {},
  latestAbg = null,
  latestSnapshot = null,
  referenceRanges = DEVELOPMENT_REFERENCE_RANGES,
}) => {
  const referenceWeight = calculateReferenceWeight(patient);
  const vtPerKg = calculateVtPerKg({
    tidalVolumeMl: ventilator.tidalVolumeMl,
    referenceWeightKg: referenceWeight.value,
  });
  const minuteVentilation = calculateMinuteVentilation({
    tidalVolumeMl: ventilator.tidalVolumeMl,
    respiratoryRate: ventilator.respiratoryRateSet ?? ventilator.respiratoryRateMeasured,
  });
  const drivingPressure = calculateDrivingPressure(ventilator);
  const pfRatio = latestAbg
    ? calculatePfRatio({ pao2: latestAbg.pao2, fio2: latestAbg.fio2AtSample ?? ventilator.fio2 })
    : calculatePfRatio({ pao2: undefined, fio2: undefined });
  const sfRatio = calculateSfRatio({
    spo2: latestAbg?.spo2AtSample ?? latestSnapshot?.spo2,
    fio2: latestAbg?.fio2AtSample ?? ventilator.fio2 ?? latestSnapshot?.fio2,
  });

  const flags = [
    ...validatePhysiology({ ...ventilator, fio2: ventilator.fio2 }, { referenceRanges }),
  ];

  if (referenceWeight.value === null && ventilator.tidalVolumeMl) {
    flags.push(makeFlag('MISSING_SIZE_WEIGHT', 'yellow', 'Cannot calculate VT/kg reference weight because required size or weight data is missing.'));
  }

  if (vtPerKg.value !== null) {
    const vtRange = findPatientRange({
      patient,
      referenceRanges,
      clinicalCondition: 'invasive_ventilation',
      scenario: 'lung_protective_guardrail',
      parameterName: 'vtMlPerKgReferenceWeight',
    });

    if (!vtRange) {
      pushUniqueFlag(flags, makeMissingReferenceFlag({
        parameterName: 'vtMlPerKgReferenceWeight',
        patient,
        clinicalCondition: 'invasive_ventilation',
        scenario: 'lung_protective_guardrail',
      }));
    } else if (isValueAboveRange(vtPerKg.value, vtRange)) {
      flags.push(makeFlag('HIGH_VT_PER_KG', 'red', 'Check VT/kg against verified pathway-specific lung-protective guardrail; clinician confirms final settings.', makeReferenceDetails(vtRange)));
    } else {
      const phRange = getAcidBaseRange({ patient, referenceRanges, parameterName: 'ph' });
      if (isValueBelowRange(vtPerKg.value, vtRange) && latestAbg?.ph !== undefined && phRange && isValueBelowRange(latestAbg.ph, phRange)) {
        flags.push(makeFlag('LOW_VT_WITH_ACIDAEMIA', 'red', 'Review ventilation and acid-base status urgently with clinician confirmation.', makeReferenceDetails(vtRange)));
      }
    }
  }

  const plateauRange = findPatientRange({
    patient,
    referenceRanges,
    clinicalCondition: 'invasive_ventilation',
    scenario: 'lung_mechanics_guardrail',
    parameterName: 'plateauPressure',
  });
  if (plateauRange && isValueAboveRange(ventilator.plateauPressure, plateauRange, { includeUpperBound: true })) {
    flags.push(makeFlag('HIGH_PLATEAU_PRESSURE', 'red', 'Review plateau pressure and lung-protective strategy.', makeReferenceDetails(plateauRange)));
  }

  const drivingPressureRange = findPatientRange({
    patient,
    referenceRanges,
    clinicalCondition: 'invasive_ventilation',
    scenario: 'lung_mechanics_guardrail',
    parameterName: 'drivingPressure',
  });
  if (drivingPressureRange && isValueAboveRange(drivingPressure.value, drivingPressureRange, { includeUpperBound: true })) {
    flags.push(makeFlag('HIGH_DRIVING_PRESSURE', 'yellow', 'Review lung mechanics and settings.', makeReferenceDetails(drivingPressureRange)));
  }

  const oxygenSeverity = pfRatio.value !== null
    ? classifyOxygenation({ patient, referenceRanges, pfRatio })
    : null;

  if (pfRatio.value !== null && !oxygenSeverity) {
    pushUniqueFlag(flags, makeMissingReferenceFlag({
      parameterName: 'pfRatio',
      patient,
      clinicalCondition: 'oxygenation_impairment',
      scenario: 'severity',
    }));
  }

  if (oxygenSeverity && Number(ventilator.peep) >= 5) {
    const category = oxygenSeverity.metadata?.category || 'possible';
    const severity = oxygenSeverity.metadata?.severity || 'yellow';
    flags.push(makeFlag(
      'ARDS_RESPIRATORY_FAILURE_PATTERN',
      severity,
      `Possible ${category} ARDS or acute respiratory-failure pattern; confirm timing, imaging or ultrasound, pathway criteria, and oedema cause.`,
      makeReferenceDetails(oxygenSeverity),
    ));
  }

  const paco2Range = getAcidBaseRange({ patient, referenceRanges, parameterName: 'paco2' });
  const phRange = getAcidBaseRange({ patient, referenceRanges, parameterName: 'ph' });
  const hypercapniaContext = includesCondition(latestSnapshot, ['copd', 'asthma', 'chronic co2', 'hypercapnia'])
    || (paco2Range ? isValueAboveRange(latestAbg?.paco2, paco2Range) : Number(latestAbg?.paco2) > 45);
  if (hypercapniaContext && (
    (paco2Range ? isValueAboveRange(latestAbg?.paco2, paco2Range) : Number(latestAbg?.paco2) > 45)
    || (phRange ? isValueBelowRange(latestAbg?.ph, phRange) : Number(latestAbg?.ph) < 7.35)
  )) {
    flags.push(makeFlag('COPD_HYPERCAPNIA_CAUTION', 'yellow', 'COPD or hypercapnia caution: document target SpO2 and review ABG trend.'));
  }
  if (includesCondition(latestSnapshot, ['oedema', 'edema', 'heart failure', 'cardiac'])) {
    flags.push(makeFlag('PULMONARY_OEDEMA_CONTEXT', 'yellow', 'Possible pulmonary oedema pattern; confirm with clinical and imaging findings.'));
  }
  if (includesCondition(latestSnapshot, ['sepsis', 'pneumonia'])) {
    flags.push(makeFlag('SEPSIS_PNEUMONIA_CONTEXT', 'info', 'Sepsis or pneumonia context: ensure local sepsis pathway is followed.'));
  }

  const redCount = flags.filter((flag) => flag.severity === 'red').length;
  const yellowCount = flags.filter((flag) => flag.severity === 'yellow').length;
  const reviewPriority = redCount > 0 ? 'urgent' : yellowCount > 0 ? 'routine_review' : 'standard';
  const oxygenCaution = buildOxygenCaution({ patient, latestAbg, latestSnapshot, referenceRanges });

  return {
    ruleVersion: CLINICAL_RULE_VERSION,
    referenceWeight,
    vtPerKg,
    minuteVentilation,
    drivingPressure,
    pfRatio,
    sfRatio,
    oxygenCaution,
    flags,
    uncertainty: buildUncertainty({ flags, referenceWeight, pfRatio, sfRatio }),
    reviewPriority,
    safetyStatement: 'Decision support only. Clinician must confirm final interpretation and settings.',
  };
};

export const buildOxygenCaution = ({
  patient = {},
  latestAbg = null,
  latestSnapshot = null,
  referenceRanges = DEVELOPMENT_REFERENCE_RANGES,
}) => {
  const paco2Range = getAcidBaseRange({ patient, referenceRanges, parameterName: 'paco2' });
  const hypercapniaRisk = includesCondition(latestSnapshot, ['copd', 'chronic co2', 'hypercapnia'])
    || (paco2Range ? isValueAboveRange(latestAbg?.paco2, paco2Range) : Number(latestAbg?.paco2) > 45);
  const clinicalCondition = hypercapniaRisk ? 'hypercapnia_risk' : 'general_oxygenation';
  const range = findPatientRange({
    patient,
    referenceRanges,
    clinicalCondition,
    scenario: 'target_prompt',
    parameterName: 'oxygenTargetSpo2',
  });

  if (!range) {
    return {
      status: 'missing_reference',
      message: 'No verified pathway-specific oxygen target range is active; use local protocol and document clinician-confirmed target.',
      ruleVersion: CLINICAL_RULE_VERSION,
    };
  }

  return {
    status: range.metadata?.status || 'reference_available',
    message: `Verified SpO2 target reference is ${range.lowerBound}-${range.upperBound}${range.unit}; clinician confirms patient-specific target and local policy.`,
    referenceRange: toReferenceRangeSummary(range),
    ruleVersion: CLINICAL_RULE_VERSION,
  };
};

export const calculateHumidificationFlags = (data = {}) => {
  const flags = [];
  if (data.thickSecretions || data.highMinuteVentilation || data.hypothermia || data.airwayBleeding || data.expectedLongVentilation) {
    flags.push(makeFlag('HME_CAUTION', 'yellow', 'Review heated humidification need.'));
  }
  return flags;
};
