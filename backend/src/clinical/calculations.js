export const CLINICAL_RULE_VERSION = 'collins-rule-calculators@2026-05-04';

const round = (value, digits = 1) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return null;
  const factor = 10 ** digits;
  return Math.round(Number(value) * factor) / factor;
};

export const normalizeFio2 = (fio2) => {
  if (fio2 === null || fio2 === undefined || Number.isNaN(Number(fio2))) return null;
  const numeric = Number(fio2);
  if (numeric > 1 && numeric <= 100) return round(numeric / 100, 3);
  return round(numeric, 3);
};

export const isAdultLikePathway = (patient = {}) => {
  const pathway = patient.patientPathway;
  if (['ADULT', 'OBSTETRIC'].includes(pathway)) return true;
  if (['BURNS', 'TRAUMA', 'PERI_OPERATIVE', 'MEDICAL', 'SURGICAL'].includes(pathway)) {
    return Number(patient.ageYears) >= 18;
  }
  return false;
};

export const calculateAdultPredictedBodyWeight = ({ sexForSizeCalculations, heightOrLengthCm }) => {
  const height = Number(heightOrLengthCm);
  if (!Number.isFinite(height) || height <= 0) return null;
  if (sexForSizeCalculations === 'MALE') return round(50 + (0.91 * (height - 152.4)), 1);
  if (sexForSizeCalculations === 'FEMALE') return round(45.5 + (0.91 * (height - 152.4)), 1);
  return null;
};

export const calculateReferenceWeight = (patient = {}) => {
  if (Number.isFinite(Number(patient.referenceWeightKg)) && Number(patient.referenceWeightKg) > 0) {
    return {
      value: round(patient.referenceWeightKg, 1),
      unit: 'kg',
      method: patient.referenceWeightMethod || 'entered_reference_weight',
      status: 'entered',
      message: 'Reference weight supplied by clinician/facility protocol.',
      ruleVersion: CLINICAL_RULE_VERSION,
    };
  }

  if (isAdultLikePathway(patient)) {
    const pbw = calculateAdultPredictedBodyWeight(patient);
    if (pbw) {
      return {
        value: pbw,
        unit: 'kg',
        method: 'adult_predicted_body_weight',
        status: 'calculated',
        message: 'Adult predicted body weight calculated from sex and height. Clinician confirms pathway applicability.',
        ruleVersion: CLINICAL_RULE_VERSION,
      };
    }
    return {
      value: null,
      unit: 'kg',
      method: 'adult_predicted_body_weight',
      status: 'missing_data',
      message: 'Height and sex are required to calculate adult predicted body weight.',
      ruleVersion: CLINICAL_RULE_VERSION,
    };
  }

  if (['NEONATE', 'INFANT', 'CHILD', 'ADOLESCENT'].includes(patient.patientPathway)) {
    if (Number.isFinite(Number(patient.actualWeightKg)) && Number(patient.actualWeightKg) > 0) {
      return {
        value: round(patient.actualWeightKg, 1),
        unit: 'kg',
        method: `${patient.patientPathway.toLowerCase()}_actual_weight_pending_local_reference`,
        status: 'calculated',
        message: 'Actual/reference weight used for non-adult pathway pending approved local pediatric/neonatal reference rules.',
        ruleVersion: CLINICAL_RULE_VERSION,
      };
    }

    return {
      value: null,
      unit: 'kg',
      method: `${patient.patientPathway?.toLowerCase() || 'unknown'}_reference_weight`,
      status: 'missing_data',
      message: 'Actual weight or approved pathway reference is required; adult PBW was not applied.',
      ruleVersion: CLINICAL_RULE_VERSION,
    };
  }

  return {
    value: null,
    unit: 'kg',
    method: 'unknown_pathway',
    status: 'not_available',
    message: 'Patient pathway is unknown or not configured; avoid pathway-specific calculations until confirmed.',
    ruleVersion: CLINICAL_RULE_VERSION,
  };
};

export const calculateVtPerKg = ({ tidalVolumeMl, referenceWeightKg }) => {
  const vt = Number(tidalVolumeMl);
  const weight = Number(referenceWeightKg);
  if (!Number.isFinite(vt) || !Number.isFinite(weight) || vt <= 0 || weight <= 0) {
    return {
      value: null,
      unit: 'mL/kg',
      status: 'missing_data',
      message: 'Cannot calculate VT/kg reference weight without tidal volume and reference weight.',
      ruleVersion: CLINICAL_RULE_VERSION,
    };
  }

  return {
    value: round(vt / weight, 1),
    unit: 'mL/kg',
    status: 'calculated',
    message: 'VT/kg calculated server-side from entered tidal volume and selected reference weight.',
    ruleVersion: CLINICAL_RULE_VERSION,
  };
};

export const calculateMinuteVentilation = ({ tidalVolumeMl, respiratoryRate }) => {
  const vt = Number(tidalVolumeMl);
  const rate = Number(respiratoryRate);
  if (!Number.isFinite(vt) || !Number.isFinite(rate) || vt <= 0 || rate <= 0) {
    return {
      value: null,
      unit: 'L/min',
      status: 'missing_data',
      message: 'Cannot calculate minute ventilation without tidal volume and respiratory rate.',
      ruleVersion: CLINICAL_RULE_VERSION,
    };
  }

  return {
    value: round((vt / 1000) * rate, 1),
    unit: 'L/min',
    status: 'calculated',
    message: 'Minute ventilation calculated server-side.',
    ruleVersion: CLINICAL_RULE_VERSION,
  };
};

export const calculatePfRatio = ({ pao2, fio2 }) => {
  const pao2Value = Number(pao2);
  const fio2Value = normalizeFio2(fio2);
  if (!Number.isFinite(pao2Value) || !Number.isFinite(fio2Value) || fio2Value <= 0) {
    return {
      value: null,
      unit: 'ratio',
      status: 'missing_data',
      message: 'Cannot calculate P/F ratio without PaO2 and FiO2 from the same time point.',
      ruleVersion: CLINICAL_RULE_VERSION,
    };
  }

  return {
    value: round(pao2Value / fio2Value, 0),
    unit: 'ratio',
    status: 'calculated',
    message: 'P/F ratio calculated from same-time PaO2 and FiO2.',
    ruleVersion: CLINICAL_RULE_VERSION,
  };
};

export const calculateSfRatio = ({ spo2, fio2 }) => {
  const spo2Value = Number(spo2);
  const fio2Value = normalizeFio2(fio2);
  if (!Number.isFinite(spo2Value) || !Number.isFinite(fio2Value) || fio2Value <= 0) {
    return {
      value: null,
      unit: 'ratio',
      status: 'missing_data',
      message: 'Cannot calculate S/F screening ratio without SpO2 and FiO2.',
      ruleVersion: CLINICAL_RULE_VERSION,
    };
  }

  return {
    value: round(spo2Value / fio2Value, 0),
    unit: 'ratio',
    status: 'screening_only',
    message: spo2Value > 97
      ? 'S/F screening only — ABG preferred if available; SpO2 above 97% is less discriminating.'
      : 'S/F screening only — ABG preferred if available.',
    ruleVersion: CLINICAL_RULE_VERSION,
  };
};

export const calculateDrivingPressure = ({ plateauPressure, peep }) => {
  const plateau = Number(plateauPressure);
  const peepValue = Number(peep);
  if (!Number.isFinite(plateau) || !Number.isFinite(peepValue)) {
    return {
      value: null,
      unit: 'cmH2O',
      status: 'missing_data',
      message: 'Driving pressure cannot be calculated without plateau pressure and PEEP.',
      ruleVersion: CLINICAL_RULE_VERSION,
    };
  }

  return {
    value: round(plateau - peepValue, 1),
    unit: 'cmH2O',
    status: 'calculated',
    message: 'Driving pressure calculated as plateau pressure minus PEEP.',
    ruleVersion: CLINICAL_RULE_VERSION,
  };
};
