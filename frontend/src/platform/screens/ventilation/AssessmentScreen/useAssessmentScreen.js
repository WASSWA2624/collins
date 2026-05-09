/**
 * useAssessmentScreen
 * Shared logic for the three-step admission wizard.
 * File: useAssessmentScreen.js
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import {
  ADMISSION_SYNC_STATUS,
  createAdmissionClientRecordId,
  getVentilationRecommendationUseCase,
  saveAdmissionReviewStepApi,
  saveOxygenAbgVentilatorStepApi,
  savePatientReasonStepApi,
} from '@features/ventilation';
import { selectActiveFacility } from '@store/selectors';
import useVentilationSession from '@hooks/useVentilationSession';
import {
  STEPS,
  ASSESSMENT_TEST_IDS,
  STEP_KEYS,
  resolvePatientAgeGroupFromAgeYears,
} from './types';

const TOTAL_STEPS = 3;
const MISSING_UNKNOWN = 'not_available';
const DATE_FIELDS = [
  { field: 'measuredAt', label: 'Oxygen measured at', steps: [STEPS.OXYGEN_ABG_VENTILATOR] },
  { field: 'abgCollectedAt', label: 'ABG collected at', steps: [STEPS.OXYGEN_ABG_VENTILATOR] },
  { field: 'ventilatorMeasuredAt', label: 'Ventilator measured at', steps: [STEPS.SAVE_REVIEW] },
];
const REQUIRED_FIELDS = [
  { field: 'patientPathway', label: 'Patient age group', steps: [STEPS.PATIENT_REASON] },
  { field: 'reasonForSupport', label: 'Reason for support', steps: [STEPS.PATIENT_REASON] },
  { field: 'ageYears', label: 'Age', steps: [STEPS.PATIENT_REASON], type: 'number' },
  { field: 'actualWeightKg', label: 'Weight', steps: [STEPS.PATIENT_REASON], type: 'number' },
  { field: 'heightOrLengthCm', label: 'Height', steps: [STEPS.PATIENT_REASON], type: 'number' },
  { field: 'oxygenSupportType', label: 'Oxygen support type', steps: [STEPS.OXYGEN_ABG_VENTILATOR] },
  { field: 'measuredAt', label: 'Oxygen measured at', steps: [STEPS.OXYGEN_ABG_VENTILATOR] },
  { field: 'spo2', label: 'SpO2', steps: [STEPS.OXYGEN_ABG_VENTILATOR], type: 'number' },
  { field: 'fio2', label: 'FiO2', steps: [STEPS.OXYGEN_ABG_VENTILATOR], type: 'number' },
  { field: 'respiratoryRate', label: 'Respiratory rate', steps: [STEPS.OXYGEN_ABG_VENTILATOR], type: 'number' },
  { field: 'heartRate', label: 'Heart rate', steps: [STEPS.OXYGEN_ABG_VENTILATOR], type: 'number' },
  { field: 'ph', label: 'pH', steps: [STEPS.OXYGEN_ABG_VENTILATOR], type: 'number' },
  { field: 'pao2', label: 'PaO2', steps: [STEPS.OXYGEN_ABG_VENTILATOR], type: 'number' },
  { field: 'paco2', label: 'PaCO2', steps: [STEPS.OXYGEN_ABG_VENTILATOR], type: 'number' },
  { field: 'ventilatorMode', label: 'Ventilator mode', steps: [STEPS.SAVE_REVIEW] },
  { field: 'tidalVolumeMl', label: 'Tidal volume', steps: [STEPS.SAVE_REVIEW], type: 'number' },
  { field: 'respiratoryRateSet', label: 'Set respiratory rate', steps: [STEPS.SAVE_REVIEW], type: 'number' },
  { field: 'ventilatorFio2', label: 'Ventilator FiO2', steps: [STEPS.SAVE_REVIEW], type: 'number' },
  { field: 'peep', label: 'PEEP', steps: [STEPS.SAVE_REVIEW], type: 'number' },
];
const NUMERIC_RULES = [
  { field: 'ageYears', label: 'Age', min: 0, max: 130, steps: [STEPS.PATIENT_REASON] },
  { field: 'actualWeightKg', label: 'Weight', min: 0.2, max: 400, steps: [STEPS.PATIENT_REASON] },
  { field: 'heightOrLengthCm', label: 'Height', min: 20, max: 260, steps: [STEPS.PATIENT_REASON] },
  { field: 'bmi', label: 'BMI', min: 5, max: 80, steps: [STEPS.PATIENT_REASON] },
  { field: 'spo2', label: 'SpO2', min: 40, max: 100, steps: [STEPS.OXYGEN_ABG_VENTILATOR] },
  { field: 'fio2', label: 'FiO2', minExclusive: 0, max: 1, steps: [STEPS.OXYGEN_ABG_VENTILATOR] },
  { field: 'respiratoryRate', label: 'Respiratory rate', min: 0, max: 180, steps: [STEPS.OXYGEN_ABG_VENTILATOR] },
  { field: 'heartRate', label: 'Heart rate', min: 0, max: 320, steps: [STEPS.OXYGEN_ABG_VENTILATOR] },
  { field: 'ph', label: 'pH', min: 6.8, max: 7.8, steps: [STEPS.OXYGEN_ABG_VENTILATOR] },
  { field: 'pao2', label: 'PaO2', min: 20, max: 600, steps: [STEPS.OXYGEN_ABG_VENTILATOR] },
  { field: 'paco2', label: 'PaCO2', min: 10, max: 150, steps: [STEPS.OXYGEN_ABG_VENTILATOR] },
  { field: 'hco3', label: 'HCO3', min: 0, max: 80, steps: [STEPS.OXYGEN_ABG_VENTILATOR] },
  { field: 'baseExcess', label: 'Base excess', min: -40, max: 40, steps: [STEPS.OXYGEN_ABG_VENTILATOR] },
  { field: 'lactate', label: 'Lactate', min: 0, max: 40, steps: [STEPS.OXYGEN_ABG_VENTILATOR] },
  { field: 'fio2AtSample', label: 'FiO2 at ABG sample', minExclusive: 0, max: 1, steps: [STEPS.OXYGEN_ABG_VENTILATOR] },
  { field: 'spo2AtSample', label: 'SpO2 at ABG sample', min: 40, max: 100, steps: [STEPS.OXYGEN_ABG_VENTILATOR] },
  { field: 'tidalVolumeMl', label: 'Tidal volume', min: 1, max: 3000, steps: [STEPS.SAVE_REVIEW] },
  { field: 'respiratoryRateSet', label: 'Set respiratory rate', min: 0, max: 120, steps: [STEPS.SAVE_REVIEW] },
  { field: 'respiratoryRateMeasured', label: 'Measured respiratory rate', min: 0, max: 180, steps: [STEPS.SAVE_REVIEW] },
  { field: 'ventilatorFio2', label: 'Ventilator FiO2', minExclusive: 0, max: 1, steps: [STEPS.SAVE_REVIEW] },
  { field: 'peep', label: 'PEEP', min: 0, max: 30, steps: [STEPS.SAVE_REVIEW] },
  { field: 'pressureSupport', label: 'Pressure support', min: 0, max: 80, steps: [STEPS.SAVE_REVIEW] },
  { field: 'inspiratoryPressure', label: 'Inspiratory pressure', min: 0, max: 80, steps: [STEPS.SAVE_REVIEW] },
  { field: 'peakPressure', label: 'Peak pressure', min: 0, max: 100, steps: [STEPS.SAVE_REVIEW] },
  { field: 'plateauPressure', label: 'Plateau pressure', min: 0, max: 80, steps: [STEPS.SAVE_REVIEW] },
];

const FIELD_VALIDATION_STEPS = [...REQUIRED_FIELDS, ...NUMERIC_RULES, ...DATE_FIELDS].reduce(
  (acc, rule) => {
    acc[rule.field] = [...new Set([...(acc[rule.field] || []), ...rule.steps])];
    return acc;
  },
  {
    clinicianConfirmed: [STEPS.SAVE_REVIEW],
    overrideReason: [STEPS.SAVE_REVIEW],
  }
);

const nowIso = () => new Date().toISOString();
const isFiniteNumber = (value) => typeof value === 'number' && Number.isFinite(value);
const cleanText = (value) => (typeof value === 'string' && value.trim() ? value.trim() : '');
const splitList = (value) =>
  cleanText(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const numberOrNull = (value) => (isFiniteNumber(value) ? value : null);
const textOrUndefined = (value) => {
  const text = cleanText(value);
  return text || undefined;
};
const numberOrUndefined = (value) => (isFiniteNumber(value) ? value : undefined);
const dateTimeOrUndefined = (value) => {
  const text = cleanText(value);
  if (!text) return undefined;
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? text : parsed.toISOString();
};
const isValidDateTimeValue = (value) => {
  const text = cleanText(value);
  if (!text) return true;
  return !Number.isNaN(new Date(text).getTime());
};
const isWithinRule = (value, rule) => {
  if (!isFiniteNumber(value)) return true;
  if (rule.min != null && value < rule.min) return false;
  if (rule.minExclusive != null && value <= rule.minExclusive) return false;
  if (rule.max != null && value > rule.max) return false;
  return true;
};
const rangeMessage = (rule) => {
  if (rule.minExclusive != null && rule.max != null) {
    return `${rule.label} must be greater than ${rule.minExclusive} and no more than ${rule.max}.`;
  }
  if (rule.min != null && rule.max != null) {
    return `${rule.label} must be between ${rule.min} and ${rule.max}.`;
  }
  if (rule.min != null) return `${rule.label} must be at least ${rule.min}.`;
  if (rule.max != null) return `${rule.label} must be no more than ${rule.max}.`;
  return `${rule.label} has an invalid value.`;
};
const roundTo = (value, precision = 1) => {
  if (!isFiniteNumber(value)) return null;
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};
const calculateBmi = (weightKg, heightCm) => {
  if (!isFiniteNumber(weightKg) || !isFiniteNumber(heightCm) || weightKg <= 0 || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  return roundTo(weightKg / (heightM * heightM), 1);
};
const calculateWeightFromBmi = (bmi, heightCm) => {
  if (!isFiniteNumber(bmi) || !isFiniteNumber(heightCm) || bmi <= 0 || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  return roundTo(bmi * heightM * heightM, 1);
};
const calculateHeightFromBmi = (weightKg, bmi) => {
  if (!isFiniteNumber(weightKg) || !isFiniteNumber(bmi) || weightKg <= 0 || bmi <= 0) return null;
  return roundTo(Math.sqrt(weightKg / bmi) * 100, 1);
};

const toArray = (value) => (Array.isArray(value) ? value : []);

export const parseAdmissionNumberInput = (value) => {
  const text = String(value ?? '').trim();
  if (!text) return null;
  if (!/^-?(?:\d+(?:\.\d+)?|\.\d+)$/.test(text)) return null;
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : null;
};

const defaultAdmissionInputs = (clientRecordId) => ({
  clientRecordId,
  clientCreatedAt: nowIso(),
  facilityId: '',
  admissionSource: '',
  reasonForSupport: '',
  patientPathway: 'ADULT',
  ageYears: null,
  sexForSizeCalculations: 'MALE',
  actualWeightKg: null,
  heightOrLengthCm: null,
  bmi: null,
  permittedMissingFields: [],
  oxygenSupportType: '',
  measuredAt: '',
  spo2: null,
  fio2: null,
  respiratoryRate: null,
  heartRate: null,
  abgCollectedAt: '',
  ph: null,
  pao2: null,
  paco2: null,
  hco3: null,
  baseExcess: null,
  lactate: null,
  fio2AtSample: null,
  spo2AtSample: null,
  ventilatorMeasuredAt: '',
  ventilatorMode: '',
  tidalVolumeMl: null,
  respiratoryRateSet: null,
  respiratoryRateMeasured: null,
  ventilatorFio2: null,
  peep: null,
  pressureSupport: null,
  inspiratoryPressure: null,
  peakPressure: null,
  plateauPressure: null,
  ieRatio: '',
  deviceId: '',
  oxygenSource: '',
  ventilatorType: '',
  facilityDeviceLabel: '',
  uncertaintyFieldsText: '',
  uncertaintyReason: '',
  uncertaintyNotes: '',
  clinicianConfirmed: false,
  overrideReason: '',
  reviewNote: '',
  suggestedVentilatorSettings: null,
});

const normalizeInputs = (inputs, clientRecordId) => {
  const base = inputs && typeof inputs === 'object' ? inputs : {};
  const resolvedAgeGroup = resolvePatientAgeGroupFromAgeYears(base.ageYears);
  return {
    ...defaultAdmissionInputs(clientRecordId),
    ...base,
    clientRecordId: base.clientRecordId || clientRecordId,
    clientCreatedAt: base.clientCreatedAt || nowIso(),
    patientPathway: base.patientPathway || resolvedAgeGroup || 'ADULT',
    sexForSizeCalculations: base.sexForSizeCalculations || 'MALE',
    permittedMissingFields: Array.isArray(base.permittedMissingFields) ? base.permittedMissingFields : [],
    clinicianConfirmed: base.clinicianConfirmed === true,
  };
};

export const updateBodyMetricInputs = (inputs, field, value) => {
  const numericValue = numberOrNull(value);
  const next = {
    actualWeightKg: numberOrNull(inputs?.actualWeightKg),
    heightOrLengthCm: numberOrNull(inputs?.heightOrLengthCm),
    bmi: numberOrNull(inputs?.bmi),
    [field]: numericValue,
  };

  if (numericValue == null) return next;

  if (field === 'actualWeightKg' || field === 'heightOrLengthCm') {
    const bmi = calculateBmi(next.actualWeightKg, next.heightOrLengthCm);
    if (bmi != null) return { ...next, bmi };

    if (field === 'actualWeightKg' && isFiniteNumber(next.bmi)) {
      const heightOrLengthCm = calculateHeightFromBmi(next.actualWeightKg, next.bmi);
      return heightOrLengthCm == null ? next : { ...next, heightOrLengthCm };
    }

    if (field === 'heightOrLengthCm' && isFiniteNumber(next.bmi)) {
      const actualWeightKg = calculateWeightFromBmi(next.bmi, next.heightOrLengthCm);
      return actualWeightKg == null ? next : { ...next, actualWeightKg };
    }
  }

  if (field === 'bmi') {
    const actualWeightKg = calculateWeightFromBmi(next.bmi, next.heightOrLengthCm);
    if (actualWeightKg != null) return { ...next, actualWeightKg };

    const heightOrLengthCm = calculateHeightFromBmi(next.actualWeightKg, next.bmi);
    if (heightOrLengthCm != null) return { ...next, heightOrLengthCm };
  }

  return next;
};

const buildReadinessFromInputs = (inputs, serverReadiness = null) => {
  const missingData = [];
  if (!isFiniteNumber(inputs.actualWeightKg)) missingData.push('actualWeightKg/referenceWeightKg');
  if (!isFiniteNumber(inputs.spo2)) missingData.push('SpO2');
  if (!isFiniteNumber(inputs.fio2) && !isFiniteNumber(inputs.fio2AtSample) && !isFiniteNumber(inputs.ventilatorFio2)) {
    missingData.push('FiO2');
  }
  if (!isFiniteNumber(inputs.pao2)) missingData.push('PaO2');
  if (!isFiniteNumber(inputs.tidalVolumeMl)) missingData.push('tidalVolumeMl');
  if (!isFiniteNumber(inputs.peep)) missingData.push('PEEP');

  const permitted = Array.isArray(inputs.permittedMissingFields) ? inputs.permittedMissingFields : [];
  const warnings = missingData.map((field) => ({
    code: permitted.includes(field) ? 'PERMITTED_MISSING_DATA' : 'MISSING_DATA',
    severity: permitted.includes(field) ? 'info' : 'yellow',
    field,
    message: permitted.includes(field)
      ? `${field} is documented as unavailable. Complete this required value before saving.`
      : `${field} is missing. Complete this value before saving.`,
  }));

  const impossibleFields = [];
  if (isFiniteNumber(inputs.spo2) && (inputs.spo2 < 40 || inputs.spo2 > 100)) impossibleFields.push('SpO2');
  if (isFiniteNumber(inputs.fio2) && (inputs.fio2 <= 0 || inputs.fio2 > 1)) impossibleFields.push('FiO2');
  if (isFiniteNumber(inputs.ventilatorFio2) && (inputs.ventilatorFio2 <= 0 || inputs.ventilatorFio2 > 1)) impossibleFields.push('ventilator FiO2');
  if (isFiniteNumber(inputs.peep) && (inputs.peep < 0 || inputs.peep > 30)) impossibleFields.push('PEEP');

  const blockers = impossibleFields.map((field) => ({
    code: 'IMPOSSIBLE_VALUE',
    severity: 'red',
    field,
    message: 'Impossible values require correction or documented clinician override before save review.',
  }));

  const localReadiness = {
    isReadyToSave: blockers.length === 0 && missingData.length === 0,
    needsReview: warnings.some((warning) => ['red', 'yellow'].includes(warning.severity)),
    missingData,
    permittedMissingFields: permitted,
    warnings,
    blockers,
  };

  if (!serverReadiness || typeof serverReadiness !== 'object') return localReadiness;

  const localMissingFields = new Set(localReadiness.missingData);
  const serverWarnings = toArray(serverReadiness.warnings)
    .filter((warning) => {
      const code = warning?.code;
      if (code !== 'MISSING_DATA' && code !== 'PERMITTED_MISSING_DATA') return true;
      return localMissingFields.has(warning?.field);
    })
    .map((warning) => {
      const message = cleanText(warning?.message);
      if (!/saving is allowed/i.test(message)) return warning;
      const field = cleanText(warning?.field) || 'This value';
      return {
        ...warning,
        message: `${field} is missing. Complete this value before saving.`,
      };
    });
  const combinedWarnings = [...serverWarnings];
  localReadiness.warnings.forEach((warning) => {
    if (!combinedWarnings.some((item) => item?.code === warning.code && item?.field === warning.field)) {
      combinedWarnings.push(warning);
    }
  });

  const serverBlockers = toArray(serverReadiness.blockers);
  const combinedBlockers = [...serverBlockers];
  localReadiness.blockers.forEach((blocker) => {
    if (!combinedBlockers.some((item) => item?.code === blocker.code && item?.field === blocker.field)) {
      combinedBlockers.push(blocker);
    }
  });

  return {
    ...serverReadiness,
    isReadyToSave: localReadiness.isReadyToSave && combinedBlockers.length === 0,
    needsReview:
      localReadiness.needsReview ||
      combinedWarnings.some((warning) => ['red', 'yellow'].includes(warning?.severity)) ||
      combinedBlockers.length > 0,
    missingData: localReadiness.missingData,
    permittedMissingFields: localReadiness.permittedMissingFields,
    warnings: combinedWarnings,
    blockers: combinedBlockers,
  };
};

const addValidationError = (fieldErrors, messages, field, message) => {
  if (!fieldErrors[field]) fieldErrors[field] = message;
  if (!messages.includes(message)) messages.push(message);
};

const hasRequiredFieldValue = (inputs, rule) => {
  if (rule.type === 'number') return isFiniteNumber(inputs[rule.field]);
  return Boolean(cleanText(inputs[rule.field]));
};

const shouldValidateRuleForStep = (rule, step) =>
  rule.steps.some((ruleStep) => ruleStep <= step);

const buildValidationFromInputs = (inputs, step, readiness) => {
  const fieldErrors = {};
  const messages = [];

  REQUIRED_FIELDS
    .filter((rule) => shouldValidateRuleForStep(rule, step))
    .forEach((rule) => {
      if (!hasRequiredFieldValue(inputs, rule)) {
        addValidationError(fieldErrors, messages, rule.field, `${rule.label} is required before continuing.`);
      }
    });

  NUMERIC_RULES
    .filter((rule) => shouldValidateRuleForStep(rule, step))
    .forEach((rule) => {
      if (!isWithinRule(inputs[rule.field], rule)) {
        addValidationError(fieldErrors, messages, rule.field, rangeMessage(rule));
      }
    });

  DATE_FIELDS
    .filter((rule) => shouldValidateRuleForStep(rule, step))
    .forEach((rule) => {
      if (!isValidDateTimeValue(inputs[rule.field])) {
        addValidationError(fieldErrors, messages, rule.field, `${rule.label} must be a valid date and time.`);
      }
    });

  if (step === STEPS.SAVE_REVIEW) {
    if (inputs.clinicianConfirmed !== true) {
      addValidationError(
        fieldErrors,
        messages,
        'clinicianConfirmed',
        'Confirm the admission record is ready for review before saving.'
      );
    }

    if ((readiness?.blockers || []).length > 0 && cleanText(inputs.overrideReason).length < 8) {
      addValidationError(
        fieldErrors,
        messages,
        'overrideReason',
        'Add a brief override reason before saving with correction blockers.'
      );
    }
  }

  return {
    fieldErrors,
    messages,
    hasBlockingErrors: messages.length > 0,
  };
};

const filterVisibleValidation = (validation, touchedFields, attemptedSteps) => {
  const visibleFieldErrors = {};
  const visibleMessages = [];
  const attemptedStepNumbers = Object.keys(attemptedSteps)
    .map((step) => Number(step))
    .filter((step) => Number.isFinite(step) && attemptedSteps[step] === true);

  Object.entries(validation.fieldErrors || {}).forEach(([field, message]) => {
    const fieldSteps = FIELD_VALIDATION_STEPS[field] || [];
    const shouldShow =
      touchedFields[field] === true ||
      fieldSteps.some((fieldStep) => attemptedStepNumbers.some((step) => step >= fieldStep));

    if (!shouldShow) return;
    visibleFieldErrors[field] = message;
    if (!visibleMessages.includes(message)) visibleMessages.push(message);
  });

  return {
    fieldErrors: visibleFieldErrors,
    messages: visibleMessages,
    hasBlockingErrors: validation.hasBlockingErrors,
  };
};

const buildPatientReasonPayload = (inputs) => {
  const timestamp = nowIso();
  return {
    facilityId: textOrUndefined(inputs.facilityId),
    admissionSource: textOrUndefined(inputs.admissionSource),
    reasonForSupport: textOrUndefined(inputs.reasonForSupport),
    patient: {
      patientPathway: cleanText(inputs.patientPathway) || 'UNKNOWN',
      ageYears: numberOrNull(inputs.ageYears),
      sexForSizeCalculations: cleanText(inputs.sexForSizeCalculations) || 'UNKNOWN',
      actualWeightKg: numberOrNull(inputs.actualWeightKg),
      heightOrLengthCm: numberOrNull(inputs.heightOrLengthCm),
    },
    clinicalReason: {
      mainCondition: cleanText(inputs.reasonForSupport),
    },
    permittedMissingFields: inputs.permittedMissingFields,
    clientRecordId: inputs.clientRecordId,
    deviceId: textOrUndefined(inputs.deviceId),
    clientCreatedAt: inputs.clientCreatedAt || timestamp,
    clientUpdatedAt: timestamp,
    idempotencyKey: `${inputs.clientRecordId}:patient-reason`,
  };
};

const buildOxygenAbgVentilatorPayload = (
  inputs,
  {
    includeOxygen = true,
    includeAbg = true,
    includeVentilator = true,
    includeFlowContext = true,
    idempotencyKeySuffix = 'oxygen-abg-ventilator',
  } = {}
) => {
  const timestamp = nowIso();
  const payload = {
    facilityId: textOrUndefined(inputs.facilityId),
    clientRecordId: inputs.clientRecordId,
    deviceId: textOrUndefined(inputs.deviceId),
    clientCreatedAt: inputs.clientCreatedAt || timestamp,
    clientUpdatedAt: timestamp,
    idempotencyKey: `${inputs.clientRecordId}:${idempotencyKeySuffix}`,
  };

  if (includeOxygen) {
    payload.oxygen = {
      measuredAt: dateTimeOrUndefined(inputs.measuredAt),
      oxygenSupportType: textOrUndefined(inputs.oxygenSupportType),
      spo2: numberOrUndefined(inputs.spo2),
      fio2: numberOrUndefined(inputs.fio2),
      respiratoryRate: numberOrUndefined(inputs.respiratoryRate),
      heartRate: numberOrUndefined(inputs.heartRate),
    };
  }

  if (includeAbg) {
    payload.abg = {
      collectedAt: dateTimeOrUndefined(inputs.abgCollectedAt),
      ph: numberOrUndefined(inputs.ph),
      pao2: numberOrUndefined(inputs.pao2),
      paco2: numberOrUndefined(inputs.paco2),
      hco3: numberOrUndefined(inputs.hco3),
      baseExcess: numberOrUndefined(inputs.baseExcess),
      lactate: numberOrUndefined(inputs.lactate),
      fio2AtSample: numberOrUndefined(inputs.fio2AtSample),
      spo2AtSample: numberOrUndefined(inputs.spo2AtSample),
    };
  }

  if (includeVentilator) {
    payload.ventilator = {
      measuredAt: dateTimeOrUndefined(inputs.ventilatorMeasuredAt) || timestamp,
      mode: textOrUndefined(inputs.ventilatorMode),
      tidalVolumeMl: numberOrUndefined(inputs.tidalVolumeMl),
      respiratoryRateSet: numberOrUndefined(inputs.respiratoryRateSet),
      respiratoryRateMeasured: numberOrUndefined(inputs.respiratoryRateMeasured),
      fio2: numberOrUndefined(inputs.ventilatorFio2),
      peep: numberOrUndefined(inputs.peep),
      pressureSupport: numberOrUndefined(inputs.pressureSupport),
      inspiratoryPressure: numberOrUndefined(inputs.inspiratoryPressure),
      peakPressure: numberOrUndefined(inputs.peakPressure),
      plateauPressure: numberOrUndefined(inputs.plateauPressure),
      ieRatio: textOrUndefined(inputs.ieRatio),
    };
  }

  if (includeFlowContext) {
    payload.uncertainty = {
      isUncertain: Boolean(cleanText(inputs.uncertaintyFieldsText) || cleanText(inputs.uncertaintyReason)),
      fields: splitList(inputs.uncertaintyFieldsText),
      reason: textOrUndefined(inputs.uncertaintyReason),
      notes: textOrUndefined(inputs.uncertaintyNotes),
    };
    payload.deviceContext = {
      deviceId: textOrUndefined(inputs.deviceId),
      source: 'manual',
      oxygenSource: textOrUndefined(inputs.oxygenSource),
      ventilatorType: textOrUndefined(inputs.ventilatorType),
      facilityDeviceLabel: textOrUndefined(inputs.facilityDeviceLabel),
    };
  }

  return payload;
};

const buildSaveReviewPayload = (inputs) => {
  const timestamp = nowIso();
  return {
    facilityId: textOrUndefined(inputs.facilityId),
    clinicianConfirmed: inputs.clinicianConfirmed === true,
    overrideReason: textOrUndefined(inputs.overrideReason),
    reviewNote: textOrUndefined(inputs.reviewNote),
    clientRecordId: inputs.clientRecordId,
    deviceId: textOrUndefined(inputs.deviceId),
    clientCreatedAt: inputs.clientCreatedAt || timestamp,
    clientUpdatedAt: timestamp,
    idempotencyKey: `${inputs.clientRecordId}:save-review`,
  };
};

const firstFiniteNumber = (...values) => {
  for (const value of values) {
    if (isFiniteNumber(value)) return value;
  }
  return null;
};

const buildRecommendationInput = (inputs) => ({
  condition:
    cleanText(inputs.condition) ||
    cleanText(inputs.reasonForSupport) ||
    cleanText(inputs.oxygenSupportType) ||
    'general',
  patientPathway: cleanText(inputs.patientPathway) || 'UNKNOWN',
  sexForSizeCalculations: cleanText(inputs.sexForSizeCalculations) || 'UNKNOWN',
  ageYears: numberOrNull(inputs.ageYears),
  actualWeightKg: numberOrNull(inputs.actualWeightKg),
  heightOrLengthCm: numberOrNull(inputs.heightOrLengthCm),
  spo2: firstFiniteNumber(inputs.spo2, inputs.spo2AtSample),
  fio2: firstFiniteNumber(inputs.fio2AtSample, inputs.ventilatorFio2, inputs.fio2),
  pao2: numberOrNull(inputs.pao2),
  paco2: numberOrNull(inputs.paco2),
  ph: numberOrNull(inputs.ph),
  respiratoryRate: firstFiniteNumber(
    inputs.respiratoryRate,
    inputs.respiratoryRateMeasured,
    inputs.respiratoryRateSet
  ),
  heartRate: numberOrNull(inputs.heartRate),
  tidalVolumeMl: numberOrNull(inputs.tidalVolumeMl),
  peep: numberOrNull(inputs.peep),
  plateauPressure: numberOrNull(inputs.plateauPressure),
});

const hasSuggestedVentilatorSettings = (inputs) =>
  Boolean(
    cleanText(inputs.ventilatorMode) ||
    cleanText(inputs.ieRatio) ||
    isFiniteNumber(inputs.tidalVolumeMl) ||
    isFiniteNumber(inputs.respiratoryRateSet) ||
    isFiniteNumber(inputs.ventilatorFio2) ||
    isFiniteNumber(inputs.peep) ||
    isFiniteNumber(inputs.pressureSupport) ||
    isFiniteNumber(inputs.inspiratoryPressure) ||
    isFiniteNumber(inputs.peakPressure) ||
    isFiniteNumber(inputs.plateauPressure)
  );

const buildSuggestedVentilatorInputPatch = (settings) => {
  if (!settings || typeof settings !== 'object') return {};
  const patch = {
    suggestedVentilatorSettings: settings,
  };

  if (textOrUndefined(settings.mode)) patch.ventilatorMode = settings.mode;
  if (isFiniteNumber(settings.tidalVolume)) patch.tidalVolumeMl = settings.tidalVolume;
  if (isFiniteNumber(settings.respiratoryRate)) patch.respiratoryRateSet = settings.respiratoryRate;
  if (isFiniteNumber(settings.fio2)) patch.ventilatorFio2 = settings.fio2;
  if (isFiniteNumber(settings.peep)) patch.peep = settings.peep;
  if (textOrUndefined(settings.ieRatio)) patch.ieRatio = settings.ieRatio;

  return patch;
};

export default function useAssessmentScreen() {
  const router = useRouter();
  const activeFacility = useSelector(selectActiveFacility);
  const activeFacilityId = activeFacility?.facilityId || activeFacility?.id || null;
  const activeFacilityLabel = activeFacility?.name || activeFacilityId || null;
  const {
    sessionId,
    inputs,
    setInputs,
    startSession,
    persistDraft,
    recommendationSummary,
    setRecommendationSummary,
    assessmentCurrentStep,
    setAssessmentStep,
    isHydrating,
    errorCode,
    hydrate,
    clearError,
    clearDraft,
    resetSession,
  } = useVentilationSession();

  const [clientRecordId] = useState(() => inputs?.clientRecordId || createAdmissionClientRecordId());
  const [summaryExpanded, setSummaryExpanded] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingRecommendation, setIsGeneratingRecommendation] = useState(false);
  const [serverResponse, setServerResponse] = useState(null);
  const [saveErrorCode, setSaveErrorCode] = useState(null);
  const [recommendationErrorCode, setRecommendationErrorCode] = useState(null);
  const [admissionId, setAdmissionId] = useState(() => inputs?.admissionId || inputs?.clientRecordId || clientRecordId);
  const [syncStatus, setSyncStatus] = useState(inputs?.syncStatus || 'draft');
  const [touchedFields, setTouchedFields] = useState({});
  const [attemptedSteps, setAttemptedSteps] = useState({});

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!sessionId) {
      startSession(clientRecordId);
    }
  }, [clientRecordId, sessionId, startSession]);

  const mergedInputs = useMemo(() => {
    const normalized = normalizeInputs(inputs, clientRecordId);
    if (!cleanText(normalized.facilityId) && activeFacilityId) {
      return { ...normalized, facilityId: activeFacilityId };
    }
    return normalized;
  }, [activeFacilityId, clientRecordId, inputs]);
  const latestInputsRef = useRef(mergedInputs);

  useEffect(() => {
    latestInputsRef.current = mergedInputs;
  }, [mergedInputs]);

  const currentStep = typeof assessmentCurrentStep === 'number'
    ? Math.min(Math.max(0, assessmentCurrentStep), TOTAL_STEPS - 1)
    : 0;

  const markFieldsTouched = useCallback((fields) => {
    const fieldList = Array.isArray(fields) ? fields.filter(Boolean) : [];
    if (fieldList.length === 0) return;
    setTouchedFields((current) => {
      const next = { ...current };
      fieldList.forEach((field) => {
        next[field] = true;
      });
      return next;
    });
  }, []);

  const markStepAttempted = useCallback((step) => {
    setAttemptedSteps((current) => (current[step] ? current : { ...current, [step]: true }));
  }, []);

  const updateInput = useCallback(
    (partial, options = {}) => {
      if (!partial || typeof partial !== 'object') return;
      const derivedPartial = { ...partial };
      if (Object.prototype.hasOwnProperty.call(partial, 'ageYears')) {
        const nextAgeGroup = resolvePatientAgeGroupFromAgeYears(partial.ageYears);
        if (nextAgeGroup) derivedPartial.patientPathway = nextAgeGroup;
      }
      if (options.touchedFields !== false) {
        markFieldsTouched(options.touchedFields || Object.keys(partial));
      }
      const nextInputs = { ...latestInputsRef.current, ...derivedPartial };
      latestInputsRef.current = nextInputs;
      setInputs(nextInputs);
      setSaveErrorCode(null);
    },
    [markFieldsTouched, setInputs]
  );

  const updateBodyMetric = useCallback(
    (field, value) => {
      updateInput(updateBodyMetricInputs(latestInputsRef.current, field, value), {
        touchedFields: [field],
      });
    },
    [updateInput]
  );

  const readiness = useMemo(
    () => buildReadinessFromInputs(mergedInputs, serverResponse?.readiness),
    [mergedInputs, serverResponse]
  );

  const rawValidation = useMemo(
    () => buildValidationFromInputs(mergedInputs, currentStep, readiness),
    [currentStep, mergedInputs, readiness]
  );
  const validation = useMemo(
    () => filterVisibleValidation(rawValidation, touchedFields, attemptedSteps),
    [attemptedSteps, rawValidation, touchedFields]
  );

  const canProceedFromStep = useCallback(
    (step) => {
      const stepValidation = buildValidationFromInputs(mergedInputs, step, readiness);
      if (stepValidation.hasBlockingErrors) return false;

      switch (step) {
        case STEPS.PATIENT_REASON:
          return Boolean(cleanText(mergedInputs.patientPathway));
        case STEPS.OXYGEN_ABG_VENTILATOR:
          return true;
        case STEPS.SAVE_REVIEW:
          return (
            mergedInputs.clinicianConfirmed === true &&
            (readiness.blockers?.length > 0 ? cleanText(mergedInputs.overrideReason).length >= 8 : true)
          );
        default:
          return false;
      }
    },
    [mergedInputs, readiness]
  );

  const persistCurrentDraft = useCallback(
    async (partial = {}) => {
      const nextInputs = { ...latestInputsRef.current, ...partial };
      latestInputsRef.current = nextInputs;
      setInputs(nextInputs);
      await persistDraft();
    },
    [persistDraft, setInputs]
  );

  const advanceToStep = useCallback(
    async (nextStep) => {
      setAssessmentStep(Math.min(Math.max(nextStep, 0), TOTAL_STEPS - 1));
      await persistDraft();
    },
    [persistDraft, setAssessmentStep]
  );

  const applyStepResponse = useCallback((response) => {
    if (!response || typeof response !== 'object') return;
    setServerResponse(response);
    setSyncStatus(response.syncStatus || ADMISSION_SYNC_STATUS.SYNCED);

    const nextAdmissionId =
      response.admission?.id ||
      response.admissionId ||
      response.admission?.clientRecordId ||
      admissionId ||
      mergedInputs.clientRecordId;
    if (nextAdmissionId) setAdmissionId(nextAdmissionId);
  }, [admissionId, mergedInputs.clientRecordId]);

  const generateDatasetRecommendation = useCallback(
    async (backendSummary = null) => {
      setIsGeneratingRecommendation(true);
      try {
        const recommendation = await getVentilationRecommendationUseCase({
          input: buildRecommendationInput(mergedInputs),
          ai: {
            useOnlineAi: false,
            backendSummary,
          },
        });
        const summaryWithSource = recommendation
          ? {
              ...recommendation,
              responseSource: 'offline',
              admissionId,
              syncStatus,
            }
          : null;
        setRecommendationSummary(summaryWithSource);
        setRecommendationErrorCode(null);
        await persistCurrentDraft(buildSuggestedVentilatorInputPatch(
          summaryWithSource?.initialVentilatorSettings?.settings
        ));
        return summaryWithSource;
      } catch (error) {
        setRecommendationSummary(null);
        setRecommendationErrorCode(error?.code || 'ADMISSION_RECOMMENDATION_FAILED');
        await persistDraft();
        return null;
      } finally {
        setIsGeneratingRecommendation(false);
      }
    },
    [admissionId, mergedInputs, persistCurrentDraft, persistDraft, setRecommendationSummary, syncStatus]
  );

  const savePatientReasonStep = useCallback(async () => {
    const payload = buildPatientReasonPayload(mergedInputs);
    const response = await savePatientReasonStepApi(payload);
    applyStepResponse(response);
    await persistCurrentDraft({
      admissionId: response?.admission?.id || response?.admission?.clientRecordId || mergedInputs.clientRecordId,
      syncStatus: response?.syncStatus || ADMISSION_SYNC_STATUS.SYNCED,
    });
    return response;
  }, [applyStepResponse, mergedInputs, persistCurrentDraft]);

  const saveOxygenAbgVentilatorStep = useCallback(async () => {
    const payload = buildOxygenAbgVentilatorPayload(mergedInputs, {
      includeVentilator: false,
    });
    const response = await saveOxygenAbgVentilatorStepApi(admissionId || mergedInputs.clientRecordId, payload);
    applyStepResponse(response);
    await persistCurrentDraft({
      admissionId: response?.admission?.id || admissionId || mergedInputs.clientRecordId,
      syncStatus: response?.syncStatus || ADMISSION_SYNC_STATUS.SYNCED,
    });
    return response;
  }, [admissionId, applyStepResponse, mergedInputs, persistCurrentDraft]);

  const saveSuggestedVentilatorSettingsStep = useCallback(async () => {
    const fallbackPatch = buildSuggestedVentilatorInputPatch(
      recommendationSummary?.initialVentilatorSettings?.settings
    );
    const inputsForVentilator = hasSuggestedVentilatorSettings(mergedInputs)
      ? mergedInputs
      : { ...mergedInputs, ...fallbackPatch };

    if (!hasSuggestedVentilatorSettings(inputsForVentilator)) return null;
    const payload = buildOxygenAbgVentilatorPayload(inputsForVentilator, {
      includeOxygen: true,
      includeAbg: true,
      includeVentilator: true,
      includeFlowContext: false,
      idempotencyKeySuffix: 'suggested-ventilator-settings',
    });
    const response = await saveOxygenAbgVentilatorStepApi(admissionId || mergedInputs.clientRecordId, payload);
    applyStepResponse(response);
    await persistCurrentDraft({
      admissionId: response?.admission?.id || admissionId || mergedInputs.clientRecordId,
      syncStatus: response?.syncStatus || ADMISSION_SYNC_STATUS.SYNCED,
    });
    return response;
  }, [admissionId, applyStepResponse, mergedInputs, persistCurrentDraft, recommendationSummary]);

  const saveReviewStep = useCallback(async () => {
    const payload = buildSaveReviewPayload(mergedInputs);
    const response = await saveAdmissionReviewStepApi(admissionId || mergedInputs.clientRecordId, payload);
    applyStepResponse(response);
    await persistCurrentDraft({
      admissionId: response?.admission?.id || admissionId || mergedInputs.clientRecordId,
      syncStatus: response?.syncStatus || ADMISSION_SYNC_STATUS.SYNCED,
    });
    return response;
  }, [admissionId, applyStepResponse, mergedInputs, persistCurrentDraft]);

  const goNext = useCallback(async () => {
    markStepAttempted(currentStep);
    if (!canProceedFromStep(currentStep)) return;
    const nextStep = Math.min(currentStep + 1, TOTAL_STEPS - 1);
    setIsSaving(true);
    setSaveErrorCode(null);
    try {
      let response = null;
      let advanced = false;
      if (currentStep === STEPS.PATIENT_REASON) {
        response = await savePatientReasonStep();
      }
      if (currentStep === STEPS.OXYGEN_ABG_VENTILATOR) {
        response = await saveOxygenAbgVentilatorStep();
        if (currentStep < TOTAL_STEPS - 1) {
          await advanceToStep(nextStep);
          advanced = true;
        }
        await generateDatasetRecommendation(response?.clinicalSummary || null);
      }
      if (!advanced && currentStep < TOTAL_STEPS - 1) {
        await advanceToStep(nextStep);
      }
    } catch (error) {
      setSaveErrorCode(error?.code || 'ADMISSION_SAVE_FAILED');
      setSyncStatus(ADMISSION_SYNC_STATUS.NEEDS_SYNC);
      await persistCurrentDraft({ syncStatus: ADMISSION_SYNC_STATUS.NEEDS_SYNC });
    } finally {
      setIsSaving(false);
    }
  }, [
    advanceToStep,
    canProceedFromStep,
    currentStep,
    generateDatasetRecommendation,
    markStepAttempted,
    persistCurrentDraft,
    saveOxygenAbgVentilatorStep,
    savePatientReasonStep,
  ]);

  const goBack = useCallback(() => {
    if (currentStep > 0) setAssessmentStep(Math.max(currentStep - 1, 0));
  }, [currentStep, setAssessmentStep]);

  const goBackOrExit = useCallback(() => {
    if (currentStep > 0) {
      setAssessmentStep(Math.max(currentStep - 1, 0));
      return;
    }
    router.back();
  }, [currentStep, router, setAssessmentStep]);

  const saveAdmission = useCallback(async () => {
    markStepAttempted(STEPS.SAVE_REVIEW);
    if (!canProceedFromStep(STEPS.SAVE_REVIEW)) {
      setSaveErrorCode('ADMISSION_VALIDATION_FAILED');
      return;
    }
    setIsSaving(true);
    setSaveErrorCode(null);
    try {
      await saveSuggestedVentilatorSettingsStep();
      const reviewResponse = await saveReviewStep();
      const trackingAdmissionId =
        reviewResponse?.admission?.id ||
        reviewResponse?.admissionId ||
        admissionId ||
        mergedInputs.admissionId ||
        mergedInputs.clientRecordId;
      const trackingPath = trackingAdmissionId
        ? `/tracking?admissionId=${encodeURIComponent(trackingAdmissionId)}&admitted=1`
        : '/tracking';
      await clearDraft();
      resetSession();
      router.replace(trackingPath);
    } catch (error) {
      setSaveErrorCode(error?.code || 'ADMISSION_SAVE_FAILED');
    } finally {
      setIsSaving(false);
    }
  }, [
    admissionId,
    canProceedFromStep,
    clearDraft,
    markStepAttempted,
    mergedInputs.admissionId,
    mergedInputs.clientRecordId,
    resetSession,
    router,
    saveReviewStep,
    saveSuggestedVentilatorSettingsStep,
  ]);

  const toggleClinicianConfirmed = useCallback(
    (checked) => {
      const nextChecked =
        checked === true ||
        checked?.target?.checked === true ||
        checked?.nativeEvent?.value === true ||
        false;
      updateInput({ clinicianConfirmed: nextChecked });
    },
    [updateInput]
  );

  const togglePermittedMissingField = useCallback(
    (field, checked) => {
      const fieldKey = cleanText(field);
      if (!fieldKey) return;
      const nextChecked = checked === true || checked?.target?.checked === true;
      const current = Array.isArray(mergedInputs.permittedMissingFields)
        ? mergedInputs.permittedMissingFields
        : [];
      const next = nextChecked
        ? [...new Set([...current, fieldKey])]
        : current.filter((item) => item !== fieldKey);
      updateInput({ permittedMissingFields: next });
    },
    [mergedInputs.permittedMissingFields, updateInput]
  );

  const summaryData = useMemo(
    () => ({
      facilityId: mergedInputs.facilityId,
      facilityLabel: activeFacilityLabel || mergedInputs.facilityId,
      pathway: mergedInputs.patientPathway,
      reasonForSupport: mergedInputs.reasonForSupport,
      oxygenSupportType: mergedInputs.oxygenSupportType,
      spo2: mergedInputs.spo2,
      fio2: mergedInputs.fio2,
      ph: mergedInputs.ph,
      pao2: mergedInputs.pao2,
      paco2: mergedInputs.paco2,
      ventilatorMode: mergedInputs.ventilatorMode,
      peep: mergedInputs.peep,
      tidalVolumeMl: mergedInputs.tidalVolumeMl,
      syncStatus,
    }),
    [activeFacilityLabel, mergedInputs, syncStatus]
  );

  const progressPercent = useMemo(() => ((currentStep + 1) / TOTAL_STEPS) * 100, [currentStep]);
  const recommendationSettings = useMemo(
    () => recommendationSummary?.initialVentilatorSettings?.settings ?? null,
    [recommendationSummary]
  );
  const suggestedVentilatorInputs = useMemo(() => ({
    ventilatorMode: mergedInputs.ventilatorMode || recommendationSettings?.mode || '',
    tidalVolumeMl: mergedInputs.tidalVolumeMl ?? recommendationSettings?.tidalVolume ?? null,
    respiratoryRateSet: mergedInputs.respiratoryRateSet ?? recommendationSettings?.respiratoryRate ?? null,
    ventilatorFio2: mergedInputs.ventilatorFio2 ?? recommendationSettings?.fio2 ?? null,
    peep: mergedInputs.peep ?? recommendationSettings?.peep ?? null,
    ieRatio: mergedInputs.ieRatio || recommendationSettings?.ieRatio || '',
  }), [mergedInputs, recommendationSettings]);
  const recommendationUnits = useMemo(
    () => recommendationSummary?.units ?? {},
    [recommendationSummary]
  );
  const recommendationMissingInputs = useMemo(
    () => recommendationSummary?.source?.missingInputs ?? [],
    [recommendationSummary]
  );
  const recommendationConfidence = useMemo(
    () => recommendationSummary?.source?.confidenceTier ?? 'low',
    [recommendationSummary]
  );

  const retryLoadAdmissionForm = useCallback(async () => {
    clearError();
    await hydrate();
  }, [clearError, hydrate]);

  return {
    currentStep,
    setCurrentStep: setAssessmentStep,
    stepKey: STEP_KEYS[currentStep] ?? STEP_KEYS[0],
    progressPercent,
    mergedInputs,
    updateInput,
    updateBodyMetric,
    toggleClinicianConfirmed,
    summaryData,
    summaryExpanded,
    setSummaryExpanded,
    readiness,
    recommendationSummary,
    recommendationSettings,
    suggestedVentilatorInputs,
    recommendationUnits,
    recommendationMissingInputs,
    recommendationConfidence,
    recommendationErrorCode,
    validation,
    rawValidation,
    canProceedFromStep,
    goNext,
    goBack,
    goBackOrExit,
    saveAdmission,
    isSaving,
    isGenerating: isSaving || isGeneratingRecommendation,
    isGeneratingRecommendation,
    isHydrating,
    errorCode: saveErrorCode || errorCode,
    saveErrorCode,
    loadErrorCode: errorCode,
    clearError,
    retryLoadAdmissionForm,
    sessionId,
    admissionId,
    syncStatus,
    togglePermittedMissingField,
    missingValueSentinel: MISSING_UNKNOWN,
    testIds: ASSESSMENT_TEST_IDS,
    totalSteps: TOTAL_STEPS,
  };
}
