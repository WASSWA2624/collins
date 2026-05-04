import {
  CLINICAL_RULE_VERSION,
  calculateDrivingPressure,
  calculateMinuteVentilation,
  calculatePfRatio,
  calculateReferenceWeight,
  calculateSfRatio,
  calculateVtPerKg,
  normalizeFio2,
} from './calculations.js';

const makeFlag = (code, severity, message, details = {}) => ({
  code,
  severity,
  message,
  ruleVersion: CLINICAL_RULE_VERSION,
  ...details,
});

const includesCondition = (snapshot, names) => {
  const text = [
    snapshot?.mainCondition,
    JSON.stringify(snapshot?.comorbiditiesJson || {}),
  ].join(' ').toLowerCase();
  return names.some((name) => text.includes(name));
};

export const validatePhysiology = (data = {}) => {
  const flags = [];
  const checks = [
    ['ph', data.ph, 6.8, 7.8, 7.25, 7.55],
    ['pao2', data.pao2, 20, 600, 60, 200],
    ['paco2', data.paco2, 10, 150, 25, 70],
    ['spo2', data.spo2 ?? data.spo2AtSample, 40, 100, 90, 100],
    ['fio2', normalizeFio2(data.fio2 ?? data.fio2AtSample), 0.01, 1, 0.21, 1],
    ['peep', data.peep, 0, 30, 5, 15],
    ['plateauPressure', data.plateauPressure, 0, 60, 0, 30],
  ];

  for (const [field, value, impossibleLow, impossibleHigh, warningLow, warningHigh] of checks) {
    if (value === null || value === undefined || value === '') continue;
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric < impossibleLow || numeric > impossibleHigh) {
      flags.push(makeFlag('IMPOSSIBLE_VALUE', 'red', `${field} has an impossible value and needs correction or reviewer override.`, { field }));
    } else if (numeric < warningLow || numeric > warningHigh) {
      flags.push(makeFlag('SUSPICIOUS_VALUE', 'yellow', `${field} is outside common screening range; confirm clinically.`, { field }));
    }
  }

  return flags;
};

export const interpretAbg = (abg = {}, patient = {}) => {
  const flags = [...validatePhysiology({ ...abg, fio2: abg.fio2AtSample, spo2: abg.spo2AtSample })];
  const ph = Number(abg.ph);
  const paco2 = Number(abg.paco2);
  const hco3 = Number(abg.hco3);
  const baseExcess = Number(abg.baseExcess);
  const hasPh = Number.isFinite(ph);
  const hasPaco2 = Number.isFinite(paco2);
  const hasHco3 = Number.isFinite(hco3);
  const hasBaseExcess = Number.isFinite(baseExcess);
  const nonAdult = !['ADULT', 'OBSTETRIC', 'MEDICAL', 'SURGICAL', 'TRAUMA', 'BURNS', 'PERI_OPERATIVE'].includes(patient.patientPathway);

  if (!hasPh || !hasPaco2) {
    flags.push(makeFlag('ABG_INCOMPLETE', 'yellow', 'ABG pH and PaCO2 are needed for acid-base pattern screening.'));
  }

  if (hasPh && hasPaco2 && ph < 7.35 && paco2 > 45) {
    flags.push(makeFlag('RESPIRATORY_ACIDOSIS_PATTERN', 'red', 'ABG pattern suggests respiratory acidosis — confirm clinically.'));
  }
  if (hasPh && hasPaco2 && ph > 7.45 && paco2 < 35) {
    flags.push(makeFlag('RESPIRATORY_ALKALOSIS_PATTERN', 'yellow', 'ABG pattern suggests respiratory alkalosis — confirm clinically.'));
  }
  if (hasPh && ph < 7.35 && ((hasHco3 && hco3 < 22) || (hasBaseExcess && baseExcess < -2))) {
    flags.push(makeFlag('METABOLIC_ACIDOSIS_PATTERN', 'red', 'ABG pattern suggests metabolic acidosis — confirm clinically.'));
  }
  if (hasPh && ph > 7.45 && ((hasHco3 && hco3 > 26) || (hasBaseExcess && baseExcess > 2))) {
    flags.push(makeFlag('METABOLIC_ALKALOSIS_PATTERN', 'yellow', 'ABG pattern suggests metabolic alkalosis — confirm clinically.'));
  }
  if (hasPh && hasPaco2 && ((ph < 7.35 && paco2 < 35) || (ph > 7.45 && paco2 > 45))) {
    flags.push(makeFlag('MIXED_OR_UNCERTAIN_ABG', 'yellow', 'Mixed disorder possible — senior review recommended.'));
  }
  if (nonAdult) {
    flags.push(makeFlag('PATHWAY_REFERENCE_CAUTION', 'yellow', 'Use approved pathway-specific ABG reference ranges; confirm clinically.'));
  }

  const pfRatio = calculatePfRatio({ pao2: abg.pao2, fio2: abg.fio2AtSample });
  const sfRatio = calculateSfRatio({ spo2: abg.spo2AtSample, fio2: abg.fio2AtSample });

  if (abg.pao2 !== undefined && !normalizeFio2(abg.fio2AtSample)) {
    flags.push(makeFlag('MISSING_FIO2_FOR_PF', 'yellow', 'Cannot calculate P/F ratio because FiO2 at ABG sample time is missing.'));
  }

  if (pfRatio.value !== null && pfRatio.value < 100) {
    flags.push(makeFlag('SEVERE_HYPOXAEMIA', 'red', 'Severe oxygenation impairment pattern — urgent clinician review.'));
  }

  return { pfRatio, sfRatio, flags };
};

export const calculateVentilationSummary = ({ patient = {}, ventilator = {}, latestAbg = null, latestSnapshot = null }) => {
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
    ...validatePhysiology({ ...ventilator, fio2: ventilator.fio2 }),
  ];

  if (referenceWeight.value === null && ventilator.tidalVolumeMl) {
    flags.push(makeFlag('MISSING_SIZE_WEIGHT', 'yellow', 'Cannot calculate VT/kg reference weight because required size/weight data is missing.'));
  }
  if (vtPerKg.value !== null && vtPerKg.value > 8) {
    flags.push(makeFlag('HIGH_VT_PER_KG', 'red', 'Check VT/kg against pathway-specific lung-protective guardrail; clinician confirms final settings.'));
  }
  if (vtPerKg.value !== null && vtPerKg.value < 4 && latestAbg?.ph < 7.2) {
    flags.push(makeFlag('LOW_VT_WITH_ACIDAEMIA', 'red', 'Review ventilation and acid-base status urgently.'));
  }
  if (Number(ventilator.plateauPressure) >= 30) {
    flags.push(makeFlag('HIGH_PLATEAU_PRESSURE', 'red', 'Review plateau pressure and lung-protective strategy.'));
  }
  if (drivingPressure.value !== null && drivingPressure.value >= 15) {
    flags.push(makeFlag('HIGH_DRIVING_PRESSURE', 'yellow', 'Review lung mechanics and settings.'));
  }
  if (pfRatio.value !== null && pfRatio.value < 300 && Number(ventilator.peep) >= 5) {
    const severity = pfRatio.value < 100 ? 'severe' : pfRatio.value < 200 ? 'moderate' : 'mild';
    flags.push(makeFlag('ARDS_RESPIRATORY_FAILURE_PATTERN', severity === 'severe' ? 'red' : 'yellow', `Possible ${severity} ARDS/acute respiratory-failure pattern — confirm timing, imaging/ultrasound, pathway criteria, and oedema cause.`));
  }

  const hypercapniaContext = includesCondition(latestSnapshot, ['copd', 'asthma', 'chronic co2', 'hypercapnia']) || Number(latestAbg?.paco2) > 45;
  if (hypercapniaContext && (Number(latestAbg?.paco2) > 45 || Number(latestAbg?.ph) < 7.35)) {
    flags.push(makeFlag('COPD_HYPERCAPNIA_CAUTION', 'yellow', 'COPD/hypercapnia caution: document target SpO2 and review ABG trend.'));
  }
  if (includesCondition(latestSnapshot, ['oedema', 'edema', 'heart failure', 'cardiac'])) {
    flags.push(makeFlag('PULMONARY_OEDEMA_CONTEXT', 'yellow', 'Possible pulmonary oedema pattern — confirm with clinical/imaging findings.'));
  }
  if (includesCondition(latestSnapshot, ['sepsis', 'pneumonia'])) {
    flags.push(makeFlag('SEPSIS_PNEUMONIA_CONTEXT', 'info', 'Sepsis/pneumonia context: ensure local sepsis pathway is followed.'));
  }

  const redCount = flags.filter((flag) => flag.severity === 'red').length;
  const yellowCount = flags.filter((flag) => flag.severity === 'yellow').length;
  const reviewPriority = redCount > 0 ? 'urgent' : yellowCount > 0 ? 'routine_review' : 'standard';

  return {
    ruleVersion: CLINICAL_RULE_VERSION,
    referenceWeight,
    vtPerKg,
    minuteVentilation,
    drivingPressure,
    pfRatio,
    sfRatio,
    oxygenCaution: buildOxygenCaution({ patient, latestAbg, latestSnapshot }),
    flags,
    reviewPriority,
    safetyStatement: 'Decision support only. Clinician must confirm final interpretation and settings.',
  };
};

export const buildOxygenCaution = ({ patient = {}, latestAbg = null, latestSnapshot = null }) => {
  const hypercapniaRisk = includesCondition(latestSnapshot, ['copd', 'chronic co2', 'hypercapnia']) || Number(latestAbg?.paco2) > 45;
  if (hypercapniaRisk) {
    return {
      status: 'caution',
      message: 'Controlled oxygen target often 88–92% pending ABG/local policy; clinician confirms patient-specific target.',
      ruleVersion: CLINICAL_RULE_VERSION,
    };
  }

  if (['NEONATE', 'INFANT', 'CHILD', 'ADOLESCENT', 'OBSTETRIC', 'BURNS', 'TRAUMA', 'PERI_OPERATIVE'].includes(patient.patientPathway)) {
    return {
      status: 'pathway_specific',
      message: 'Use pathway-specific target range from local protocol; clinician confirms target.',
      ruleVersion: CLINICAL_RULE_VERSION,
    };
  }

  return {
    status: 'default',
    message: 'Target range often 94–98% depending local policy; clinician confirms patient-specific target.',
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
