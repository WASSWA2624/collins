/**
 * Rule-based ventilation decision-support preview.
 * Frontend output is advisory and unconfirmed until backend summary confirms it.
 */

const CLINICIAN_RULE_PREVIEW_VERSION = 'collins-frontend-rule-preview@2026-05-05';

const round = (value, digits = 1) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  const factor = 10 ** digits;
  return Math.round(numeric * factor) / factor;
};

const isFiniteNumber = (value) => typeof value === 'number' && Number.isFinite(value);

const normalizeFio2 = (fio2) => {
  const numeric = Number(fio2);
  if (!Number.isFinite(numeric) || numeric <= 0) return null;
  if (numeric > 1 && numeric <= 100) return round(numeric / 100, 3);
  return round(numeric, 3);
};

const normalizeSex = (value) => {
  const token = String(value || '').trim().toUpperCase();
  if (token === 'MALE' || token === 'M') return 'MALE';
  if (token === 'FEMALE' || token === 'F') return 'FEMALE';
  return 'UNKNOWN';
};

const resolvePatientPathway = (input = {}) => {
  const explicit = String(input.patientPathway || '').trim().toUpperCase();
  if (explicit) return explicit;

  const age = Number(input.age ?? input.ageYears);
  if (!Number.isFinite(age)) return 'UNKNOWN';
  if (age < 1 / 12) return 'NEONATE';
  if (age < 1) return 'INFANT';
  if (age < 13) return 'CHILD';
  if (age < 18) return 'ADOLESCENT';
  return 'ADULT';
};

const isAdultLikePathway = (patient = {}) => {
  const pathway = patient.patientPathway;
  if (['ADULT', 'OBSTETRIC'].includes(pathway)) return true;
  if (['BURNS', 'TRAUMA', 'PERI_OPERATIVE', 'MEDICAL', 'SURGICAL'].includes(pathway)) {
    return Number(patient.ageYears) >= 18;
  }
  return false;
};

const calculateAdultPredictedBodyWeight = ({ sexForSizeCalculations, heightOrLengthCm }) => {
  const height = Number(heightOrLengthCm);
  if (!Number.isFinite(height) || height <= 0) return null;
  if (sexForSizeCalculations === 'MALE') return round(50 + 0.91 * (height - 152.4), 1);
  if (sexForSizeCalculations === 'FEMALE') return round(45.5 + 0.91 * (height - 152.4), 1);
  return null;
};

const calculateReferenceWeight = (patient = {}) => {
  const entered = Number(patient.referenceWeightKg);
  if (Number.isFinite(entered) && entered > 0) {
    return {
      value: round(entered, 1),
      unit: 'kg',
      status: 'entered',
      method: 'entered_reference_weight',
      message: 'Reference weight entered locally; backend confirmation is pending.',
    };
  }

  if (isAdultLikePathway(patient)) {
    const pbw = calculateAdultPredictedBodyWeight(patient);
    if (pbw) {
      return {
        value: pbw,
        unit: 'kg',
        status: 'calculated',
        method: 'adult_predicted_body_weight',
        message: 'Adult predicted body weight preview from sex and height.',
      };
    }
    return {
      value: null,
      unit: 'kg',
      status: 'missing_data',
      method: 'adult_predicted_body_weight',
      message: 'Height and sex are needed for adult predicted body weight.',
    };
  }

  if (['NEONATE', 'INFANT', 'CHILD', 'ADOLESCENT'].includes(patient.patientPathway)) {
    const weight = Number(patient.actualWeightKg);
    if (Number.isFinite(weight) && weight > 0) {
      return {
        value: round(weight, 1),
        unit: 'kg',
        status: 'calculated',
        method: `${patient.patientPathway.toLowerCase()}_actual_weight_preview`,
        message: 'Actual weight preview used for non-adult pathway; adult PBW was not applied.',
      };
    }
    return {
      value: null,
      unit: 'kg',
      status: 'missing_data',
      method: `${patient.patientPathway.toLowerCase()}_reference_weight`,
      message: 'Actual weight is needed for non-adult pathway preview; adult PBW was not applied.',
    };
  }

  return {
    value: null,
    unit: 'kg',
    status: 'not_available',
    method: 'unknown_pathway',
    message: 'Patient pathway is unknown; pathway-specific calculations are pending.',
  };
};

const calculateVtPerKg = ({ tidalVolumeMl, referenceWeightKg }) => {
  const vt = Number(tidalVolumeMl);
  const weight = Number(referenceWeightKg);
  if (!Number.isFinite(vt) || !Number.isFinite(weight) || vt <= 0 || weight <= 0) {
    return {
      value: null,
      unit: 'mL/kg',
      status: 'missing_data',
      message: 'VT/kg needs tidal volume and reference weight.',
    };
  }
  return {
    value: round(vt / weight, 1),
    unit: 'mL/kg',
    status: 'calculated',
    message: 'VT/kg frontend preview; backend confirmation is pending.',
  };
};

const calculatePfRatio = ({ pao2, fio2 }) => {
  const pao2Value = Number(pao2);
  const fio2Value = normalizeFio2(fio2);
  if (!Number.isFinite(pao2Value) || !fio2Value) {
    return {
      value: null,
      unit: 'ratio',
      status: 'missing_data',
      message: 'P/F ratio needs PaO2 and same-time FiO2.',
    };
  }
  return {
    value: round(pao2Value / fio2Value, 0),
    unit: 'ratio',
    status: 'calculated',
    message: 'P/F ratio preview from entered PaO2 and FiO2.',
  };
};

const calculateSfRatio = ({ spo2, fio2 }) => {
  const spo2Value = Number(spo2);
  const fio2Value = normalizeFio2(fio2);
  if (!Number.isFinite(spo2Value) || !fio2Value) {
    return {
      value: null,
      unit: 'ratio',
      status: 'missing_data',
      message: 'S/F screening ratio needs SpO2 and FiO2.',
    };
  }
  return {
    value: round(spo2Value / fio2Value, 0),
    unit: 'ratio',
    status: 'screening_only',
    message: spo2Value > 97
      ? 'S/F screening only; ABG is preferred when available.'
      : 'S/F screening only; ABG is preferred if available.',
  };
};

const calculateDrivingPressure = ({ plateauPressure, peep }) => {
  const plateau = Number(plateauPressure);
  const peepValue = Number(peep);
  if (!Number.isFinite(plateau) || !Number.isFinite(peepValue)) {
    return {
      value: null,
      unit: 'cmH2O',
      status: 'missing_data',
      message: 'Driving pressure needs plateau pressure and PEEP.',
    };
  }
  return {
    value: round(plateau - peepValue, 1),
    unit: 'cmH2O',
    status: 'calculated',
    message: 'Driving pressure preview from plateau pressure minus PEEP.',
  };
};

const makeFlag = (code, severity, message, details = {}) => Object.freeze({
  code,
  severity,
  message,
  advisory: true,
  ruleVersion: CLINICIAN_RULE_PREVIEW_VERSION,
  requiresClinicianConfirmation: severity !== 'info',
  overrideReasonRequired: severity === 'red',
  ...details,
});

const buildPatientFromInput = (input = {}) => {
  const patientPathway = resolvePatientPathway(input);
  return {
    patientPathway,
    ageYears: Number.isFinite(Number(input.age ?? input.ageYears)) ? Number(input.age ?? input.ageYears) : null,
    actualWeightKg: Number.isFinite(Number(input.weight ?? input.actualWeightKg)) ? Number(input.weight ?? input.actualWeightKg) : null,
    heightOrLengthCm: Number.isFinite(Number(input.height ?? input.heightOrLengthCm)) ? Number(input.height ?? input.heightOrLengthCm) : null,
    referenceWeightKg: Number.isFinite(Number(input.referenceWeightKg)) ? Number(input.referenceWeightKg) : null,
    sexForSizeCalculations: normalizeSex(input.gender ?? input.sexForSizeCalculations),
  };
};

const buildVentilatorFromSettings = (settings = {}) => ({
  tidalVolumeMl: settings.tidalVolumeMl ?? settings.tidalVolume,
  respiratoryRateSet: settings.respiratoryRateSet ?? settings.respiratoryRate,
  fio2: settings.fio2,
  peep: settings.peep,
  plateauPressure: settings.plateauPressure,
});

const buildMissingData = ({ patient, input, ventilator }) => {
  const missing = [];
  if (!patient.patientPathway || ['UNKNOWN', 'OTHER'].includes(patient.patientPathway)) missing.push('patientPathway');
  if (!patient.actualWeightKg && !patient.referenceWeightKg && !isAdultLikePathway(patient)) missing.push('actualWeightKg');
  if (isAdultLikePathway(patient) && (!patient.heightOrLengthCm || patient.sexForSizeCalculations === 'UNKNOWN')) missing.push('height/sex');
  if (!isFiniteNumber(input.spo2)) missing.push('SpO2');
  if (!Number.isFinite(Number(ventilator.tidalVolumeMl))) missing.push('tidalVolume');
  if (!Number.isFinite(Number(ventilator.peep))) missing.push('PEEP');
  return missing;
};

const buildAbgFlags = ({ input, patient }) => {
  const flags = [];
  const ph = Number(input.ph);
  const paco2 = Number(input.paco2);
  const hasPh = Number.isFinite(ph);
  const hasPaco2 = Number.isFinite(paco2);

  if (!hasPh || !hasPaco2) {
    flags.push(makeFlag('ABG_INCOMPLETE', 'yellow', 'ABG pH and PaCO2 are needed for acid-base pattern screening.'));
  } else if (hasPh && hasPaco2 && ph < 7.35 && paco2 > 45 && isAdultLikePathway(patient)) {
    flags.push(makeFlag('RESPIRATORY_ACIDOSIS_PATTERN', 'red', 'ABG pattern suggests respiratory acidosis; confirm clinically.'));
  } else if (hasPh && hasPaco2 && ph > 7.45 && paco2 < 35 && isAdultLikePathway(patient)) {
    flags.push(makeFlag('RESPIRATORY_ALKALOSIS_PATTERN', 'yellow', 'ABG pattern suggests respiratory alkalosis; confirm clinically.'));
  }

  if (!isAdultLikePathway(patient)) {
    flags.push(makeFlag('PATHWAY_REFERENCE_CAUTION', 'yellow', 'Use verified pathway-specific references; backend confirmation is required.'));
  }

  return flags;
};

const buildPressureAndOxygenFlags = ({ patient, ventilator, vtPerKg, drivingPressure, pfRatio, sfRatio, input }) => {
  const flags = [];
  const fio2 = normalizeFio2(input.fio2 ?? ventilator.fio2);

  if (vtPerKg.value !== null && isAdultLikePathway(patient) && vtPerKg.value > 8) {
    flags.push(makeFlag('HIGH_VT_PER_KG', 'red', 'Check VT/kg against verified pathway-specific guardrail; clinician confirms settings.'));
  }
  if (Number.isFinite(Number(ventilator.plateauPressure)) && Number(ventilator.plateauPressure) >= 30) {
    flags.push(makeFlag('HIGH_PLATEAU_PRESSURE', 'red', 'Review plateau pressure and lung-protective strategy.'));
  }
  if (drivingPressure.value !== null && drivingPressure.value >= 15) {
    flags.push(makeFlag('HIGH_DRIVING_PRESSURE', 'yellow', 'Review lung mechanics and settings.'));
  }
  if (pfRatio.value !== null && pfRatio.value < 100) {
    flags.push(makeFlag('SEVERE_HYPOXAEMIA', 'red', 'Severe oxygenation impairment pattern; urgent clinician review.'));
  } else if (pfRatio.value !== null && pfRatio.value < 300) {
    flags.push(makeFlag('OXYGENATION_IMPAIRMENT', 'yellow', 'Oxygenation impairment pattern; confirm clinically.'));
  } else if (pfRatio.value === null && sfRatio.value !== null && sfRatio.value < 235) {
    flags.push(makeFlag('SF_SCREENING_CAUTION', 'yellow', 'Low S/F screening ratio; ABG is preferred if available.'));
  }
  if (fio2 !== null && fio2 >= 0.6) {
    flags.push(makeFlag('OXYGEN_CAUTIONS', 'yellow', 'High FiO2 exposure; document target SpO2 and review ABG trend.'));
  }
  return flags;
};

const mergeBackendDecisionSupport = (backendSummary) => {
  if (!backendSummary || typeof backendSummary !== 'object') return null;
  return {
    ...backendSummary,
    status: {
      reviewStatus: backendSummary.reviewStatus || 'backend_confirmed',
      syncStatus: backendSummary.syncStatus || 'synced',
      referenceStatus: backendSummary.referenceRangeStatus?.status || 'backend_verified',
      pendingBackendConfirmation: backendSummary.referenceRangeStatus?.pendingBackendConfirmation === true,
    },
  };
};

const buildRuleBasedDecisionSupportPreview = ({ input = {}, settings = {}, backendSummary = null } = {}) => {
  const confirmed = mergeBackendDecisionSupport(backendSummary);
  if (confirmed) return Object.freeze(confirmed);

  const patient = buildPatientFromInput(input);
  const ventilator = buildVentilatorFromSettings(settings);
  const referenceWeight = calculateReferenceWeight(patient);
  const vtPerKg = calculateVtPerKg({
    tidalVolumeMl: ventilator.tidalVolumeMl,
    referenceWeightKg: referenceWeight.value,
  });
  const pfRatio = calculatePfRatio({
    pao2: input.pao2,
    fio2: input.fio2 ?? ventilator.fio2,
  });
  const sfRatio = calculateSfRatio({
    spo2: input.spo2,
    fio2: input.fio2 ?? ventilator.fio2,
  });
  const drivingPressure = calculateDrivingPressure(ventilator);
  const missingData = buildMissingData({ patient, input, ventilator });
  const flags = [
    ...buildAbgFlags({ input, patient }),
    ...buildPressureAndOxygenFlags({ patient, ventilator, vtPerKg, drivingPressure, pfRatio, sfRatio, input }),
    ...missingData.map((field) => makeFlag('MISSING_DATA', 'yellow', `${field} is missing; clinician review should confirm the gap.`, { field })),
  ];
  const redCount = flags.filter((flag) => flag.severity === 'red').length;
  const yellowCount = flags.filter((flag) => flag.severity === 'yellow').length;

  return Object.freeze({
    ruleVersion: CLINICIAN_RULE_PREVIEW_VERSION,
    referenceWeight,
    vtPerKg,
    pfRatio,
    sfRatio,
    drivingPressure,
    flags: Object.freeze(flags),
    missingData: Object.freeze(missingData),
    oxygenCaution: Object.freeze({
      status: 'pending_backend_reference',
      message: 'Oxygen target range must be confirmed by backend verified reference records.',
    }),
    uncertainty: Object.freeze([
      ...(referenceWeight.value === null ? [{ code: 'REFERENCE_WEIGHT_UNCERTAIN', message: referenceWeight.message }] : []),
      ...(pfRatio.value === null ? [{ code: 'PF_RATIO_UNAVAILABLE', message: pfRatio.message }] : []),
    ]),
    reviewPriority: redCount > 0 ? 'urgent' : yellowCount > 0 ? 'routine_review' : 'standard',
    status: Object.freeze({
      reviewStatus: 'pending_clinician_review',
      syncStatus: 'local_preview_pending_backend_confirmation',
      referenceStatus: 'frontend_preview_unconfirmed',
      pendingBackendConfirmation: true,
    }),
    safetyStatement: 'Decision support only. Clinician must confirm final interpretation and settings.',
  });
};

export {
  CLINICIAN_RULE_PREVIEW_VERSION,
  buildRuleBasedDecisionSupportPreview,
  calculateAdultPredictedBodyWeight,
  calculateReferenceWeight,
  calculateVtPerKg,
  calculatePfRatio,
  calculateSfRatio,
  calculateDrivingPressure,
  resolvePatientPathway,
};
