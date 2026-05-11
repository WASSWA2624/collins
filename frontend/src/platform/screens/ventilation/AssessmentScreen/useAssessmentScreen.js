/**
 * useAssessmentScreen
 * Shared logic for the three-step New Patient wizard.
 * File: useAssessmentScreen.js
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import {
  NEW_PATIENT_SYNC_STATUS,
  createNewPatientClientRecordId,
  getNewPatientVentilatorRecommendationApi,
  getVentilationRecommendationUseCase,
  saveNewPatientReviewStepApi,
  saveOxygenAbgVentilatorStepApi,
  savePatientReasonStepApi,
} from '@features/ventilation';
import { searchFacilitiesUseCase } from '@features/facilities';
import { selectActiveFacility } from '@store/selectors';
import { useDebounce } from '@hooks';
import useVentilationSession from '@hooks/useVentilationSession';
import {
  STEPS,
  ASSESSMENT_TEST_IDS,
  STEP_KEYS,
  resolvePatientAgeGroupFromAgeYears,
} from './types';

const TOTAL_STEPS = 3;
const MISSING_UNKNOWN = 'not_available';
const AGE_COMPONENT_FIELDS = Object.freeze(['ageYearsPart', 'ageMonthsPart', 'ageDaysPart']);
const BODY_METRIC_FIELDS = Object.freeze(['actualWeightKg', 'heightOrLengthCm', 'bmi']);
const OXYGEN_ABG_DECIMAL_FIELDS = Object.freeze([
  'spo2',
  'respiratoryRate',
  'heartRate',
  'ph',
  'pao2',
  'paco2',
  'hco3',
  'baseExcess',
  'lactate',
  'spo2AtSample',
]);
const DECIMAL_INPUT_FIELDS = Object.freeze([...BODY_METRIC_FIELDS, ...OXYGEN_ABG_DECIMAL_FIELDS]);
const DATE_FIELDS = [
  { field: 'abgCollectedAt', label: 'ABG collected at', steps: [STEPS.OXYGEN_ABG_VENTILATOR] },
  { field: 'ventilatorMeasuredAt', label: 'Ventilator measured at', steps: [STEPS.SAVE_REVIEW] },
];
const REQUIRED_FIELDS = [
  { field: 'facilityId', label: 'Facility', steps: [STEPS.PATIENT_REASON] },
  { field: 'firstName', label: 'First name', steps: [STEPS.PATIENT_REASON] },
  { field: 'reasonForSupport', label: 'Reason for support', steps: [STEPS.PATIENT_REASON] },
  { field: 'actualWeightKg', label: 'Weight', steps: [STEPS.PATIENT_REASON], type: 'number' },
  { field: 'heightOrLengthCm', label: 'Height', steps: [STEPS.PATIENT_REASON], type: 'number' },
  { field: 'spo2', label: 'SpO2', steps: [STEPS.OXYGEN_ABG_VENTILATOR], type: 'number' },
  { field: 'respiratoryRate', label: 'Respiratory rate', steps: [STEPS.OXYGEN_ABG_VENTILATOR], type: 'number' },
  { field: 'heartRate', label: 'Heart rate', steps: [STEPS.OXYGEN_ABG_VENTILATOR], type: 'number' },
];
const RANGE_SUGGESTIONS = [
  { field: 'ageYears', hint: 'Suggested range: 0-130 years.' },
  { field: 'actualWeightKg', hint: 'Suggested range: 0.2-400 kg.' },
  { field: 'heightOrLengthCm', hint: 'Suggested range: 20-260 cm.' },
  { field: 'bmi', hint: 'Suggested range: 5-80.' },
  { field: 'spo2', hint: 'Suggested range: 92-100%, or local target.' },
  { field: 'respiratoryRate', hint: 'Suggested adult reference: 12-20 breaths/min; use pathway context.' },
  { field: 'heartRate', hint: 'Suggested adult reference: 60-100 bpm; use pathway context.' },
  { field: 'ph', hint: 'Suggested range: 7.35-7.45.' },
  { field: 'pao2', hint: 'Optional. Suggested room-air reference: 80-100 mmHg.' },
  { field: 'paco2', hint: 'Optional. Suggested range: 35-45 mmHg.' },
  { field: 'hco3', hint: 'Suggested range: 22-26 mmol/L.' },
  { field: 'baseExcess', hint: 'Suggested range: -2 to +2.' },
  { field: 'lactate', hint: 'Suggested range: 0.5-2.0 mmol/L.' },
  { field: 'spo2AtSample', hint: 'Optional. Suggested range: 92-100%, or local target.' },
  { field: 'tidalVolumeMl', hint: 'Suggested range depends on reference weight and pathway.' },
  { field: 'respiratoryRateSet', hint: 'Suggested adult reference: 12-20 breaths/min; use pathway context.' },
  { field: 'respiratoryRateMeasured', hint: 'Suggested adult reference: 12-20 breaths/min; use pathway context.' },
  { field: 'peep', hint: 'Suggested initial reference often 5-10 cmH2O; use pathway context.' },
  { field: 'pressureSupport', hint: 'Suggested range depends on patient effort and mode.' },
  { field: 'inspiratoryPressure', hint: 'Suggested range depends on mode and lung mechanics.' },
  { field: 'peakPressure', hint: 'Suggested safety review threshold: around 35 cmH2O.' },
  { field: 'plateauPressure', hint: 'Suggested safety review threshold: below 30 cmH2O when available.' },
];

const FIELD_RANGE_HINTS = RANGE_SUGGESTIONS.reduce((acc, rule) => {
  acc[rule.field] = rule.hint;
  return acc;
}, {});

const FIELD_VALIDATION_STEPS = [...REQUIRED_FIELDS, ...DATE_FIELDS].reduce(
  (acc, rule) => {
    acc[rule.field] = [...new Set([...(acc[rule.field] || []), ...rule.steps])];
    return acc;
  },
  {
    ageYears: [STEPS.PATIENT_REASON],
    dateOfBirth: [STEPS.PATIENT_REASON],
    clinicianConfirmed: [STEPS.SAVE_REVIEW],
    overrideReason: [STEPS.SAVE_REVIEW],
  }
);

const nowIso = () => new Date().toISOString();
const isFiniteNumber = (value) => typeof value === 'number' && Number.isFinite(value);
const cleanText = (value) => (typeof value === 'string' && value.trim() ? value.trim() : '');
const isNewPatientConflictError = (error) => {
  const status = error?.status || error?.statusCode;
  const code = cleanText(error?.code);
  return status === 409 || code === 'CONFLICT';
};
const splitList = (value) =>
  cleanText(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const splitPatientName = (value) => {
  const parts = cleanText(value).split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' '),
  };
};

const composePatientName = ({ firstName, lastName, optionalName } = {}) =>
  [cleanText(firstName), cleanText(lastName)].filter(Boolean).join(' ') || cleanText(optionalName);

const resolvePatientNameInputs = (inputs = {}) => {
  const split = splitPatientName(inputs.optionalName);
  const firstName = cleanText(inputs.firstName) || split.firstName;
  const lastName = cleanText(inputs.lastName) || split.lastName;
  return {
    firstName,
    lastName,
    optionalName: composePatientName({ firstName, lastName, optionalName: inputs.optionalName }),
  };
};

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
const parseDateOfBirthDate = (value) => {
  const text = cleanText(value);
  if (!text) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return null;
  const [year, month, day] = text.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  const today = new Date();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return date > todayDate ? null : date;
};
const isValidDateOfBirthValue = (value) => {
  const text = cleanText(value);
  if (!text) return true;
  return Boolean(parseDateOfBirthDate(text));
};
const calculateAgeComponentsFromDateOfBirth = (value, now = new Date()) => {
  const dateOfBirth = parseDateOfBirthDate(value);
  if (!dateOfBirth) return null;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let years = today.getFullYear() - dateOfBirth.getFullYear();
  let months = today.getMonth() - dateOfBirth.getMonth();
  let days = today.getDate() - dateOfBirth.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {
    ageYearsPart: years,
    ageMonthsPart: months,
    ageDaysPart: days,
  };
};
const formatDateInput = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const calculateDateOfBirthFromAgeComponents = (components, now = new Date()) => {
  const years = ageComponentOrNull(components?.ageYearsPart);
  const months = ageComponentOrNull(components?.ageMonthsPart);
  const days = ageComponentOrNull(components?.ageDaysPart);
  if (years == null && months == null && days == null) return '';

  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  date.setFullYear(date.getFullYear() - (years || 0));
  date.setMonth(date.getMonth() - (months || 0));
  date.setDate(date.getDate() - (days || 0));
  return formatDateInput(date);
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
const normalizeFacilityOption = (facility) => {
  if (!facility || typeof facility !== 'object') return null;
  const nested = facility.facility && typeof facility.facility === 'object' ? facility.facility : {};
  const id = facility.id || facility.facilityId || nested.id || nested.facilityId;
  const name = facility.name || facility.facilityName || facility.displayName || nested.name || id;
  if (!id) return null;
  return {
    id,
    name,
    registryCode: facility.registryCode || nested.registryCode,
    district: facility.district || nested.district,
    region: facility.region || nested.region,
    ownership: facility.ownership || nested.ownership,
    type: facility.type || nested.type,
  };
};
const uniqueFacilities = (...groups) => {
  const byId = new Map();
  groups.flat().forEach((facility) => {
    const normalized = normalizeFacilityOption(facility);
    if (normalized?.id && !byId.has(normalized.id)) byId.set(normalized.id, normalized);
  });
  return Array.from(byId.values());
};

export const parseAdmissionNumberInput = (value) => {
  const text = String(value ?? '').trim();
  if (!text) return null;
  if (!/^-?(?:\d+(?:\.\d+)?|\.\d+)$/.test(text)) return null;
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : null;
};

export const parseAdmissionIntegerInput = (value) => {
  const text = String(value ?? '').trim();
  if (!text) return null;
  if (!/^\d+$/.test(text)) return null;
  const parsed = Number(text);
  return Number.isSafeInteger(parsed) ? parsed : null;
};

const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value || {}, key);

const ageComponentOrNull = (value) =>
  Number.isSafeInteger(value) && value >= 0 ? value : null;

const calculateAgeYearsFromComponents = ({ ageYearsPart, ageMonthsPart, ageDaysPart }) => {
  const years = ageComponentOrNull(ageYearsPart);
  const months = ageComponentOrNull(ageMonthsPart);
  const days = ageComponentOrNull(ageDaysPart);
  if (years == null && months == null && days == null) return null;
  return roundTo((years || 0) + (months || 0) / 12 + (days || 0) / 365, 4);
};

const splitAgeYearsToComponents = (ageYears) => {
  if (!isFiniteNumber(ageYears) || ageYears < 0) {
    return { ageYearsPart: null, ageMonthsPart: null, ageDaysPart: null };
  }
  const years = Math.floor(ageYears);
  const remainingMonths = (ageYears - years) * 12;
  const months = Math.floor(remainingMonths);
  const days = Math.round((remainingMonths - months) * (365 / 12));
  return {
    ageYearsPart: years,
    ageMonthsPart: months,
    ageDaysPart: days,
  };
};

const resolveAgeComponents = (base) => {
  const componentInputs = {
    ageYearsPart: ageComponentOrNull(base.ageYearsPart),
    ageMonthsPart: ageComponentOrNull(base.ageMonthsPart),
    ageDaysPart: ageComponentOrNull(base.ageDaysPart),
  };
  if (Object.values(componentInputs).some((value) => value != null)) {
    return componentInputs;
  }

  const persistedAgeComponents = {
    ageYearsPart: ageComponentOrNull(base.ageYears),
    ageMonthsPart: ageComponentOrNull(base.ageMonths),
    ageDaysPart: ageComponentOrNull(base.ageDays),
  };
  if (Object.values(persistedAgeComponents).some((value) => value != null)) {
    return persistedAgeComponents;
  }

  const dateOfBirthComponents = calculateAgeComponentsFromDateOfBirth(base.dateOfBirth);
  if (dateOfBirthComponents) return dateOfBirthComponents;

  return splitAgeYearsToComponents(numberOrNull(base.ageYears));
};

export const updateAgeComponentInputs = (inputs, field, value) => {
  if (!AGE_COMPONENT_FIELDS.includes(field)) return {};
  const components = {
    ageYearsPart: ageComponentOrNull(inputs?.ageYearsPart),
    ageMonthsPart: ageComponentOrNull(inputs?.ageMonthsPart),
    ageDaysPart: ageComponentOrNull(inputs?.ageDaysPart),
    [field]: ageComponentOrNull(value),
  };
  const ageYears = calculateAgeYearsFromComponents(components);
  const patientPathway = resolvePatientAgeGroupFromAgeYears(ageYears) || 'UNKNOWN';
  const dateOfBirth = calculateDateOfBirthFromAgeComponents(components);
  return {
    ...components,
    dateOfBirth,
    ageMonths: components.ageMonthsPart,
    ageDays: components.ageDaysPart,
    ageYears,
    patientPathway,
  };
};

const defaultAdmissionInputs = (clientRecordId) => ({
  clientRecordId,
  clientCreatedAt: nowIso(),
  facilityId: '',
  admissionSource: '',
  reasonForSupport: '',
  optionalName: '',
  firstName: '',
  lastName: '',
  patientPathway: 'UNKNOWN',
  dateOfBirth: '',
  ageYears: null,
  ageMonths: null,
  ageDays: null,
  ageYearsPart: null,
  ageMonthsPart: null,
  ageDaysPart: null,
  sexForSizeCalculations: 'MALE',
  actualWeightKg: null,
  heightOrLengthCm: null,
  bmi: null,
  permittedMissingFields: [],
  spo2: null,
  respiratoryRate: null,
  heartRate: null,
  abgCollectedAt: '',
  ph: null,
  pao2: null,
  paco2: null,
  hco3: null,
  baseExcess: null,
  lactate: null,
  spo2AtSample: null,
  ventilatorMeasuredAt: '',
  ventilatorMode: '',
  tidalVolumeMl: null,
  respiratoryRateSet: null,
  respiratoryRateMeasured: null,
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
  const ageComponents = resolveAgeComponents(base);
  const ageYears = calculateAgeYearsFromComponents(ageComponents);
  const resolvedAgeGroup = resolvePatientAgeGroupFromAgeYears(ageYears ?? numberOrNull(base.ageYears));
  const nameInputs = resolvePatientNameInputs(base);
  return {
    ...defaultAdmissionInputs(clientRecordId),
    ...base,
    ...nameInputs,
    ...ageComponents,
    dateOfBirth: cleanText(base.dateOfBirth),
    ageYears: ageYears ?? numberOrNull(base.ageYears),
    ageMonths: ageComponents.ageMonthsPart,
    ageDays: ageComponents.ageDaysPart,
    clientRecordId: base.clientRecordId || clientRecordId,
    clientCreatedAt: base.clientCreatedAt || nowIso(),
    patientPathway: resolvedAgeGroup || base.patientPathway || 'UNKNOWN',
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

  const permitted = Array.isArray(inputs.permittedMissingFields) ? inputs.permittedMissingFields : [];
  const warnings = missingData.map((field) => ({
    code: permitted.includes(field) ? 'PERMITTED_MISSING_DATA' : 'MISSING_DATA',
    severity: permitted.includes(field) ? 'info' : 'yellow',
    field,
    message: permitted.includes(field)
      ? `${field} is documented as unavailable. Complete this required value before saving.`
      : `${field} is missing. Complete this value before saving.`,
  }));

  const localReadiness = {
    isReadyToSave: true,
    needsReview: warnings.some((warning) => ['red', 'yellow'].includes(warning.severity)),
    missingData,
    permittedMissingFields: permitted,
    warnings,
    blockers: [],
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

  toArray(serverReadiness.blockers).forEach((blocker) => {
    const advisory = {
      ...blocker,
      code: blocker?.code || 'SERVER_REVIEW_WARNING',
      severity: blocker?.severity || 'yellow',
      message: cleanText(blocker?.message) || 'Review this advisory item before saving.',
    };
    if (!combinedWarnings.some((item) => item?.code === advisory.code && item?.field === advisory.field)) {
      combinedWarnings.push(advisory);
    }
  });

  return {
    ...serverReadiness,
    isReadyToSave: true,
    needsReview:
      localReadiness.needsReview ||
      combinedWarnings.some((warning) => ['red', 'yellow'].includes(warning?.severity)),
    missingData: localReadiness.missingData,
    permittedMissingFields: localReadiness.permittedMissingFields,
    warnings: combinedWarnings,
    blockers: [],
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

const hasPatientAgeValue = (inputs) =>
  AGE_COMPONENT_FIELDS.some((field) => ageComponentOrNull(inputs?.[field]) != null) ||
  isFiniteNumber(inputs?.ageYears) ||
  Boolean(cleanText(inputs?.dateOfBirth));

const shouldValidateRuleForStep = (rule, step) =>
  rule.steps.some((ruleStep) => ruleStep <= step);

const shouldValidateRuleOnStep = (rule, step) =>
  rule.steps.some((ruleStep) => ruleStep === step);

const buildValidationFromInputs = (inputs, step, readiness, options = {}) => {
  const fieldErrors = {};
  const messages = [];
  const shouldValidateRule = options.includePreviousSteps === false
    ? shouldValidateRuleOnStep
    : shouldValidateRuleForStep;

  REQUIRED_FIELDS
    .filter((rule) => shouldValidateRule(rule, step))
    .forEach((rule) => {
      if (!hasRequiredFieldValue(inputs, rule)) {
        addValidationError(fieldErrors, messages, rule.field, `${rule.label} is required before continuing.`);
      }
    });

  if (shouldValidateRule({ steps: [STEPS.PATIENT_REASON] }, step) && !hasPatientAgeValue(inputs)) {
    addValidationError(fieldErrors, messages, 'ageYears', 'Age or date of birth is required before continuing.');
  }

  if (
    shouldValidateRule({ steps: [STEPS.PATIENT_REASON] }, step) &&
    cleanText(inputs.dateOfBirth) &&
    !isValidDateOfBirthValue(inputs.dateOfBirth)
  ) {
    addValidationError(fieldErrors, messages, 'dateOfBirth', 'Date of birth must use YYYY-MM-DD and cannot be in the future.');
  }

  DATE_FIELDS
    .filter((rule) => shouldValidateRule(rule, step))
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
        'Confirm the New Patient record is ready for review before saving.'
      );
    }
  }

  return {
    fieldErrors,
    messages,
    hasBlockingErrors: messages.length > 0,
    firstInvalidField: Object.keys(fieldErrors)[0] || null,
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
    firstInvalidField: Object.keys(visibleFieldErrors)[0] || null,
  };
};

const buildPatientReasonPayload = (inputs) => {
  const timestamp = nowIso();
  const optionalName = composePatientName(inputs);
  return {
    facilityId: textOrUndefined(inputs.facilityId),
    admissionSource: textOrUndefined(inputs.admissionSource),
    reasonForSupport: textOrUndefined(inputs.reasonForSupport),
    patient: {
      firstName: textOrUndefined(inputs.firstName),
      lastName: textOrUndefined(inputs.lastName),
      optionalName: textOrUndefined(optionalName),
      patientPathway: cleanText(inputs.patientPathway) || 'UNKNOWN',
      dateOfBirth: textOrUndefined(inputs.dateOfBirth),
      ageYears: numberOrNull(inputs.ageYears),
      ageMonths: numberOrNull(inputs.ageMonths),
      ageDays: numberOrNull(inputs.ageDays),
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
      measuredAt: timestamp,
      spo2: numberOrUndefined(inputs.spo2),
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

const getResponseAdmissionId = (response, fallback) =>
  response?.admission?.id ||
  response?.admissionId ||
  response?.admission?.clientRecordId ||
  fallback ||
  null;

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
    'general',
  patientPathway: cleanText(inputs.patientPathway) || 'UNKNOWN',
  sexForSizeCalculations: cleanText(inputs.sexForSizeCalculations) || 'UNKNOWN',
  ageYears: numberOrNull(inputs.ageYears),
  ageMonths: numberOrNull(inputs.ageMonths),
  ageDays: numberOrNull(inputs.ageDays),
  actualWeightKg: numberOrNull(inputs.actualWeightKg),
  heightOrLengthCm: numberOrNull(inputs.heightOrLengthCm),
  spo2: firstFiniteNumber(inputs.spo2, inputs.spo2AtSample),
  pao2: numberOrNull(inputs.pao2),
  paco2: numberOrNull(inputs.paco2),
  ph: numberOrNull(inputs.ph),
  respiratoryRate: firstFiniteNumber(
    inputs.respiratoryRate,
    inputs.respiratoryRateMeasured,
    inputs.respiratoryRateSet
  ),
  heartRate: numberOrNull(inputs.heartRate),
  mode: textOrUndefined(inputs.ventilatorMode),
  tidalVolumeMl: numberOrNull(inputs.tidalVolumeMl),
  respiratoryRateSet: numberOrNull(inputs.respiratoryRateSet),
  respiratoryRateMeasured: numberOrNull(inputs.respiratoryRateMeasured),
  peep: numberOrNull(inputs.peep),
  pressureSupport: numberOrNull(inputs.pressureSupport),
  inspiratoryPressure: numberOrNull(inputs.inspiratoryPressure),
  peakPressure: numberOrNull(inputs.peakPressure),
  plateauPressure: numberOrNull(inputs.plateauPressure),
  ieRatio: textOrUndefined(inputs.ieRatio),
});

const hasSuggestedVentilatorSettings = (inputs) =>
  Boolean(
    cleanText(inputs.ventilatorMode) ||
    cleanText(inputs.ieRatio) ||
    isFiniteNumber(inputs.tidalVolumeMl) ||
    isFiniteNumber(inputs.respiratoryRateSet) ||
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
  if (isFiniteNumber(settings.peep)) patch.peep = settings.peep;
  if (isFiniteNumber(settings.pressureSupport)) patch.pressureSupport = settings.pressureSupport;
  if (textOrUndefined(settings.ieRatio)) patch.ieRatio = settings.ieRatio;

  return patch;
};

const hasRecommendationVentilatorSettings = (recommendation) => {
  const settings = recommendation?.initialVentilatorSettings?.settings;
  return Boolean(settings && typeof settings === 'object' && Object.keys(settings).length > 0);
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

  const [clientRecordId, setClientRecordId] = useState(() => inputs?.clientRecordId || createNewPatientClientRecordId());
  const [summaryExpanded, setSummaryExpanded] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingRecommendation, setIsGeneratingRecommendation] = useState(false);
  const [serverResponse, setServerResponse] = useState(null);
  const [saveErrorCode, setSaveErrorCode] = useState(null);
  const [recommendationErrorCode, setRecommendationErrorCode] = useState(null);
  const [conflictWarning, setConflictWarning] = useState(null);
  const [admissionId, setAdmissionId] = useState(() => inputs?.admissionId || inputs?.clientRecordId || clientRecordId);
  const [syncStatus, setSyncStatus] = useState(inputs?.syncStatus || 'draft');
  const [touchedFields, setTouchedFields] = useState({});
  const [attemptedSteps, setAttemptedSteps] = useState({});
  const [rawNumericInputValues, setRawNumericInputValues] = useState({});
  const [facilityQuery, setFacilityQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [facilityOptions, setFacilityOptions] = useState([]);
  const [facilityError, setFacilityError] = useState(null);
  const [isLoadingFacilities, setIsLoadingFacilities] = useState(false);
  const debouncedFacilityQuery = useDebounce(facilityQuery, 250);
  const facilitiesRequestRef = useRef(0);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!sessionId) {
      startSession(clientRecordId);
    }
  }, [clientRecordId, sessionId, startSession]);

  useEffect(() => {
    const requestId = facilitiesRequestRef.current + 1;
    facilitiesRequestRef.current = requestId;
    setIsLoadingFacilities(true);
    setFacilityError(null);

    searchFacilitiesUseCase({
      q: debouncedFacilityQuery || undefined,
      page: 1,
      limit: 25,
    })
      .then((response) => {
        if (facilitiesRequestRef.current === requestId) {
          setFacilityOptions(Array.isArray(response?.facilities) ? response.facilities : []);
        }
      })
      .catch((error) => {
        if (facilitiesRequestRef.current === requestId) {
          setFacilityOptions([]);
          setFacilityError(error?.safeMessage || error?.message || 'Unable to load facilities.');
        }
      })
      .finally(() => {
        if (facilitiesRequestRef.current === requestId) setIsLoadingFacilities(false);
      });
  }, [debouncedFacilityQuery]);

  const mergedInputs = useMemo(() => {
    const normalized = normalizeInputs(inputs, clientRecordId);
    const facilitySearchIsEditing = touchedFields.facilityId === true || Boolean(cleanText(facilityQuery));
    if (!cleanText(normalized.facilityId) && activeFacilityId && !facilitySearchIsEditing) {
      return { ...normalized, facilityId: activeFacilityId };
    }
    return normalized;
  }, [activeFacilityId, clientRecordId, facilityQuery, inputs, touchedFields.facilityId]);
  const activeFacilityOption = useMemo(() => normalizeFacilityOption(activeFacility), [activeFacility]);
  const selectedFacilityValue = useMemo(() => {
    if (selectedFacility?.id && selectedFacility.id === mergedInputs.facilityId) return selectedFacility;
    if (activeFacilityOption?.id && activeFacilityOption.id === mergedInputs.facilityId) return activeFacilityOption;
    if (mergedInputs.facilityId) {
      return normalizeFacilityOption({ id: mergedInputs.facilityId, name: mergedInputs.facilityId });
    }
    return null;
  }, [activeFacilityOption, mergedInputs.facilityId, selectedFacility]);
  const displayedFacilityOptions = useMemo(
    () => uniqueFacilities(selectedFacilityValue, activeFacilityOption, facilityOptions),
    [activeFacilityOption, facilityOptions, selectedFacilityValue]
  );
  const displayedFacilityQuery = facilityQuery || selectedFacilityValue?.name || '';
  const latestInputsRef = useRef(mergedInputs);

  useEffect(() => {
    latestInputsRef.current = mergedInputs;
  }, [mergedInputs]);

  useEffect(() => {
    setRawNumericInputValues({});
  }, [mergedInputs.clientRecordId]);

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
      setConflictWarning(null);
    },
    [markFieldsTouched, setInputs]
  );

  const updateFacilityQuery = useCallback(
    (value) => {
      const nextQuery = String(value ?? '');
      setFacilityQuery(nextQuery);
      if (selectedFacilityValue && nextQuery.trim() !== selectedFacilityValue.name) {
        setSelectedFacility(null);
        updateInput({ facilityId: '' }, { touchedFields: ['facilityId'] });
      }
    },
    [selectedFacilityValue, updateInput]
  );

  const selectFacility = useCallback(
    (facility) => {
      const normalized = normalizeFacilityOption(facility);
      setSelectedFacility(normalized);
      setFacilityQuery(normalized?.name || '');
      updateInput({ facilityId: normalized?.id || '' }, { touchedFields: ['facilityId'] });
    },
    [updateInput]
  );

  const clearFacility = useCallback(() => {
    setSelectedFacility(null);
    setFacilityQuery('');
    updateInput({ facilityId: '' }, { touchedFields: ['facilityId'] });
  }, [updateInput]);

  const updateBodyMetric = useCallback(
    (field, value) => {
      updateInput(updateBodyMetricInputs(latestInputsRef.current, field, value), {
        touchedFields: [field],
      });
    },
    [updateInput]
  );

  const updatePatientName = useCallback(
    (field, value) => {
      if (field !== 'firstName' && field !== 'lastName') return;
      const nextNameInputs = {
        firstName: latestInputsRef.current.firstName,
        lastName: latestInputsRef.current.lastName,
        optionalName: latestInputsRef.current.optionalName,
        [field]: value,
      };
      updateInput({
        [field]: value,
        optionalName: composePatientName(nextNameInputs),
      }, {
        touchedFields: [field],
      });
    },
    [updateInput]
  );

  const updateDecimalInput = useCallback(
    (field, value) => {
      if (!DECIMAL_INPUT_FIELDS.includes(field)) return;
      const text = String(value ?? '');
      setRawNumericInputValues((current) => ({ ...current, [field]: text }));

      if (!text.trim()) {
        if (BODY_METRIC_FIELDS.includes(field)) {
          updateBodyMetric(field, null);
          return;
        }
        updateInput({ [field]: null }, { touchedFields: [field] });
        return;
      }

      const numericValue = parseAdmissionNumberInput(text);
      if (numericValue == null) {
        markFieldsTouched([field]);
        return;
      }

      if (!BODY_METRIC_FIELDS.includes(field)) {
        updateInput({ [field]: numericValue }, { touchedFields: [field] });
        return;
      }

      const previous = latestInputsRef.current;
      const patch = updateBodyMetricInputs(previous, field, numericValue);
      setRawNumericInputValues((current) => {
        const next = { ...current, [field]: text };
        BODY_METRIC_FIELDS.forEach((metricField) => {
          if (metricField !== field && patch[metricField] !== previous?.[metricField]) {
            delete next[metricField];
          }
        });
        return next;
      });
      updateInput(patch, { touchedFields: [field] });
    },
    [markFieldsTouched, updateBodyMetric, updateInput]
  );

  const updateAgeComponent = useCallback(
    (field, value) => {
      if (!AGE_COMPONENT_FIELDS.includes(field)) return;
      const text = String(value ?? '');
      setRawNumericInputValues((current) => ({ ...current, [field]: text }));

      if (!text.trim()) {
        updateInput(updateAgeComponentInputs(latestInputsRef.current, field, null), {
          touchedFields: ['ageYears'],
        });
        return;
      }

      const numericValue = parseAdmissionIntegerInput(text);
      if (numericValue == null) {
        markFieldsTouched(['ageYears']);
        return;
      }

      updateInput(updateAgeComponentInputs(latestInputsRef.current, field, numericValue), {
        touchedFields: ['ageYears'],
      });
    },
    [markFieldsTouched, updateInput]
  );

  const updateDateOfBirth = useCallback(
    (value) => {
      const dateOfBirth = String(value ?? '').trim();
      const components = calculateAgeComponentsFromDateOfBirth(dateOfBirth);
      if (!components) {
        updateInput({ dateOfBirth }, { touchedFields: ['dateOfBirth'] });
        return;
      }

      const ageYears = calculateAgeYearsFromComponents(components);
      setRawNumericInputValues((current) => ({
        ...current,
        ageYearsPart: String(components.ageYearsPart),
        ageMonthsPart: String(components.ageMonthsPart),
        ageDaysPart: String(components.ageDaysPart),
      }));
      updateInput({
        dateOfBirth,
        ...components,
        ageMonths: components.ageMonthsPart,
        ageDays: components.ageDaysPart,
        ageYears,
        patientPathway: resolvePatientAgeGroupFromAgeYears(ageYears) || 'UNKNOWN',
      }, {
        touchedFields: ['dateOfBirth', 'ageYears'],
      });
    },
    [updateInput]
  );

  const getNumericInputValue = useCallback(
    (field) => {
      if (hasOwn(rawNumericInputValues, field)) return rawNumericInputValues[field];
      const value = mergedInputs?.[field];
      return value != null ? String(value) : '';
    },
    [mergedInputs, rawNumericInputValues]
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
  const admissionRecordId = useMemo(() => {
    const hydratedAdmissionId = cleanText(mergedInputs.admissionId);
    const hydratedClientRecordId = cleanText(mergedInputs.clientRecordId);
    const stateAdmissionId = cleanText(admissionId);
    const initialClientRecordId = cleanText(clientRecordId);

    if (hydratedAdmissionId) return hydratedAdmissionId;
    if (stateAdmissionId && (stateAdmissionId !== initialClientRecordId || !hydratedClientRecordId)) {
      return stateAdmissionId;
    }
    return hydratedClientRecordId || stateAdmissionId;
  }, [admissionId, clientRecordId, mergedInputs.admissionId, mergedInputs.clientRecordId]);

  const stepValidationStates = useMemo(
    () => STEP_KEYS.map((key, step) => {
      const exactValidation = buildValidationFromInputs(mergedInputs, step, readiness, {
        includePreviousSteps: false,
      });
      const attempted = attemptedSteps[step] === true;
      return {
        key,
        step,
        attempted,
        hasErrors: attempted && exactValidation.hasBlockingErrors,
        errorCount: attempted ? Object.keys(exactValidation.fieldErrors || {}).length : 0,
        firstInvalidField: attempted ? exactValidation.firstInvalidField : null,
      };
    }),
    [attemptedSteps, mergedInputs, readiness]
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
          return mergedInputs.clinicianConfirmed === true;
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
      await persistDraft({ inputs: nextInputs });
    },
    [persistDraft, setInputs]
  );

  const advanceToStep = useCallback(
    async (nextStep) => {
      const boundedStep = Math.min(Math.max(nextStep, 0), TOTAL_STEPS - 1);
      setAssessmentStep(boundedStep);
      await persistDraft({
        inputs: latestInputsRef.current,
        assessmentCurrentStep: boundedStep,
      });
    },
    [persistDraft, setAssessmentStep]
  );

  const applyStepResponse = useCallback((response) => {
    if (!response || typeof response !== 'object') return;
    setServerResponse(response);
    setSyncStatus(response.syncStatus || NEW_PATIENT_SYNC_STATUS.SYNCED);

    const nextAdmissionId = getResponseAdmissionId(
      response,
      mergedInputs.admissionId ||
      admissionId ||
      mergedInputs.clientRecordId
    );
    if (nextAdmissionId) setAdmissionId(nextAdmissionId);
  }, [admissionId, mergedInputs.admissionId, mergedInputs.clientRecordId]);

  const getBackendDatasetRecommendation = useCallback(
    async (backendSummary = null, options = {}) => {
      const activeInputs = options.inputs || latestInputsRef.current || mergedInputs;
      const activeAdmissionId = options.admissionId || admissionRecordId;
      try {
        const response = await getNewPatientVentilatorRecommendationApi({
          facilityId: textOrUndefined(activeInputs.facilityId),
          admissionId: activeAdmissionId,
          input: buildRecommendationInput(activeInputs),
          backendSummary,
        });
        return response?.recommendation || response || null;
      } catch {
        return null;
      }
    },
    [admissionRecordId, mergedInputs]
  );

  const generateDatasetRecommendation = useCallback(
    async (backendSummary = null, options = {}) => {
      const activeInputs = options.inputs || latestInputsRef.current || mergedInputs;
      const activeAdmissionId = options.admissionId || admissionRecordId;
      setIsGeneratingRecommendation(true);
      try {
        const backendRecommendation = await getBackendDatasetRecommendation(backendSummary, {
          inputs: activeInputs,
          admissionId: activeAdmissionId,
        });
        const useBackendRecommendation = hasRecommendationVentilatorSettings(backendRecommendation);
        const recommendation = useBackendRecommendation ? backendRecommendation : await getVentilationRecommendationUseCase({
          input: buildRecommendationInput(activeInputs),
          ai: {
            useOnlineAi: false,
            backendSummary,
          },
        });
        const summaryWithSource = recommendation
          ? {
            ...recommendation,
            responseSource: useBackendRecommendation ? 'backend_dataset' : 'offline',
              admissionId: activeAdmissionId,
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
        await persistDraft({ inputs: latestInputsRef.current });
        return null;
      } finally {
        setIsGeneratingRecommendation(false);
      }
    },
    [admissionRecordId, getBackendDatasetRecommendation, mergedInputs, persistCurrentDraft, persistDraft, setRecommendationSummary, syncStatus]
  );

  const savePatientReasonStep = useCallback(async (inputOverride = null) => {
    const activeInputs = inputOverride || latestInputsRef.current || mergedInputs;
    const payload = buildPatientReasonPayload(activeInputs);
    const response = await savePatientReasonStepApi(payload);
    applyStepResponse(response);
    await persistCurrentDraft({
      admissionId: getResponseAdmissionId(response, activeInputs.clientRecordId),
      syncStatus: response?.syncStatus || NEW_PATIENT_SYNC_STATUS.SYNCED,
    });
    return response;
  }, [applyStepResponse, mergedInputs, persistCurrentDraft]);

  const saveOxygenAbgVentilatorStep = useCallback(async (inputOverride = null, admissionIdOverride = null) => {
    const activeInputs = inputOverride || latestInputsRef.current || mergedInputs;
    const activeAdmissionId =
      admissionIdOverride ||
      admissionRecordId ||
      activeInputs.admissionId ||
      activeInputs.clientRecordId;
    const payload = buildOxygenAbgVentilatorPayload(activeInputs, {
      includeVentilator: false,
    });
    const response = await saveOxygenAbgVentilatorStepApi(activeAdmissionId, payload);
    applyStepResponse(response);
    await persistCurrentDraft({
      admissionId: getResponseAdmissionId(response, activeAdmissionId || activeInputs.clientRecordId),
      syncStatus: response?.syncStatus || NEW_PATIENT_SYNC_STATUS.SYNCED,
    });
    return response;
  }, [admissionRecordId, applyStepResponse, mergedInputs, persistCurrentDraft]);

  const saveSuggestedVentilatorSettingsStep = useCallback(async (inputOverride = null, admissionIdOverride = null) => {
    const activeInputs = inputOverride || latestInputsRef.current || mergedInputs;
    const activeAdmissionId =
      admissionIdOverride ||
      admissionRecordId ||
      activeInputs.admissionId ||
      activeInputs.clientRecordId;
    const fallbackPatch = buildSuggestedVentilatorInputPatch(
      recommendationSummary?.initialVentilatorSettings?.settings
    );
    const inputsForVentilator = hasSuggestedVentilatorSettings(activeInputs)
      ? activeInputs
      : { ...activeInputs, ...fallbackPatch };

    if (!hasSuggestedVentilatorSettings(inputsForVentilator)) return null;
    const payload = buildOxygenAbgVentilatorPayload(inputsForVentilator, {
      includeOxygen: true,
      includeAbg: true,
      includeVentilator: true,
      includeFlowContext: false,
      idempotencyKeySuffix: 'suggested-ventilator-settings',
    });
    const response = await saveOxygenAbgVentilatorStepApi(activeAdmissionId, payload);
    applyStepResponse(response);
    await persistCurrentDraft({
      admissionId: getResponseAdmissionId(response, activeAdmissionId || activeInputs.clientRecordId),
      syncStatus: response?.syncStatus || NEW_PATIENT_SYNC_STATUS.SYNCED,
    });
    return response;
  }, [admissionRecordId, applyStepResponse, mergedInputs, persistCurrentDraft, recommendationSummary]);

  const saveReviewStep = useCallback(async (inputOverride = null, admissionIdOverride = null) => {
    const activeInputs = inputOverride || latestInputsRef.current || mergedInputs;
    const activeAdmissionId =
      admissionIdOverride ||
      admissionRecordId ||
      activeInputs.admissionId ||
      activeInputs.clientRecordId;
    const payload = buildSaveReviewPayload(activeInputs);
    const response = await saveNewPatientReviewStepApi(activeAdmissionId, payload);
    applyStepResponse(response);
    await persistCurrentDraft({
      admissionId: getResponseAdmissionId(response, activeAdmissionId || activeInputs.clientRecordId),
      syncStatus: response?.syncStatus || NEW_PATIENT_SYNC_STATUS.SYNCED,
    });
    return response;
  }, [admissionRecordId, applyStepResponse, mergedInputs, persistCurrentDraft]);

  const createSeparateNewPatientDraft = useCallback(async () => {
    const nextClientRecordId = createNewPatientClientRecordId();
    const timestamp = nowIso();
    const nextInputs = {
      ...latestInputsRef.current,
      clientRecordId: nextClientRecordId,
      admissionId: null,
      clientCreatedAt: timestamp,
      clientUpdatedAt: timestamp,
      syncStatus: NEW_PATIENT_SYNC_STATUS.NEEDS_SYNC,
    };
    latestInputsRef.current = nextInputs;
    setClientRecordId(nextClientRecordId);
    setAdmissionId(nextClientRecordId);
    setInputs(nextInputs);
    setSyncStatus(NEW_PATIENT_SYNC_STATUS.NEEDS_SYNC);
    startSession(nextClientRecordId);
    await persistDraft({
      sessionId: nextClientRecordId,
      inputs: nextInputs,
      assessmentCurrentStep: currentStep,
    });
    return nextInputs;
  }, [currentStep, persistDraft, setInputs, startSession]);

  const showConflictWarning = useCallback(
    async (error, step = currentStep) => {
      setConflictWarning({
        step,
        meta: error?.meta || null,
        errors: Array.isArray(error?.errors) ? error.errors : [],
      });
      setSaveErrorCode(null);
      setSyncStatus(NEW_PATIENT_SYNC_STATUS.NEEDS_SYNC);
      await persistCurrentDraft({ syncStatus: NEW_PATIENT_SYNC_STATUS.NEEDS_SYNC });
    },
    [currentStep, persistCurrentDraft]
  );

  const dismissConflictWarning = useCallback(() => {
    setConflictWarning(null);
  }, []);

  const completeSaveReview = useCallback(
    async (reviewResponse, fallbackAdmissionId = null) => {
      const trackingAdmissionId = getResponseAdmissionId(
        reviewResponse,
        fallbackAdmissionId || admissionRecordId || mergedInputs.admissionId || mergedInputs.clientRecordId
      );
      const trackingPath = trackingAdmissionId
        ? `/tracking/${encodeURIComponent(trackingAdmissionId)}?admitted=1&detail=1`
        : '/tracking';
      await clearDraft();
      resetSession();
      router.replace(trackingPath);
    },
    [admissionRecordId, clearDraft, mergedInputs.admissionId, mergedInputs.clientRecordId, resetSession, router]
  );

  const continueAfterConflict = useCallback(async () => {
    const conflictStep =
      typeof conflictWarning?.step === 'number'
        ? Math.min(Math.max(conflictWarning.step, 0), TOTAL_STEPS - 1)
        : currentStep;
    markStepAttempted(conflictStep);
    const stepValidation = buildValidationFromInputs(latestInputsRef.current, conflictStep, readiness);
    if (stepValidation.hasBlockingErrors || !canProceedFromStep(conflictStep)) {
      setConflictWarning(null);
      setSaveErrorCode('ADMISSION_VALIDATION_FAILED');
      return;
    }

    setIsSaving(true);
    setSaveErrorCode(null);
    setConflictWarning(null);
    try {
      const nextInputs = await createSeparateNewPatientDraft();
      const patientResponse = await savePatientReasonStep(nextInputs);
      let activeAdmissionId = getResponseAdmissionId(patientResponse, nextInputs.clientRecordId);
      let activeInputs = {
        ...latestInputsRef.current,
        admissionId: activeAdmissionId,
      };
      latestInputsRef.current = activeInputs;
      setInputs(activeInputs);

      let response = patientResponse;
      if (conflictStep >= STEPS.OXYGEN_ABG_VENTILATOR) {
        response = await saveOxygenAbgVentilatorStep(activeInputs, activeAdmissionId);
        activeAdmissionId = getResponseAdmissionId(response, activeAdmissionId);
        activeInputs = {
          ...latestInputsRef.current,
          admissionId: activeAdmissionId,
        };
        latestInputsRef.current = activeInputs;
        setInputs(activeInputs);
      }

      if (conflictStep === STEPS.SAVE_REVIEW) {
        await saveSuggestedVentilatorSettingsStep(activeInputs, activeAdmissionId);
        const reviewResponse = await saveReviewStep(activeInputs, activeAdmissionId);
        await completeSaveReview(reviewResponse, activeAdmissionId || nextInputs.clientRecordId);
        return;
      }

      const nextStep = Math.min(conflictStep + 1, TOTAL_STEPS - 1);
      if (conflictStep === STEPS.OXYGEN_ABG_VENTILATOR) {
        await advanceToStep(nextStep);
        await generateDatasetRecommendation(response?.clinicalSummary || null, {
          inputs: activeInputs,
          admissionId: activeAdmissionId,
        });
        return;
      }

      await advanceToStep(nextStep);
    } catch (error) {
      if (isNewPatientConflictError(error)) {
        await showConflictWarning(error, conflictStep);
      } else {
        setSaveErrorCode(error?.code || 'ADMISSION_SAVE_FAILED');
        setSyncStatus(NEW_PATIENT_SYNC_STATUS.NEEDS_SYNC);
        await persistCurrentDraft({ syncStatus: NEW_PATIENT_SYNC_STATUS.NEEDS_SYNC });
      }
    } finally {
      setIsSaving(false);
    }
  }, [
    advanceToStep,
    canProceedFromStep,
    completeSaveReview,
    conflictWarning,
    createSeparateNewPatientDraft,
    currentStep,
    generateDatasetRecommendation,
    markStepAttempted,
    persistCurrentDraft,
    readiness,
    saveOxygenAbgVentilatorStep,
    savePatientReasonStep,
    saveReviewStep,
    saveSuggestedVentilatorSettingsStep,
    setInputs,
    showConflictWarning,
  ]);

  const goNext = useCallback(async () => {
    markStepAttempted(currentStep);
    const stepValidation = buildValidationFromInputs(mergedInputs, currentStep, readiness);
    if (stepValidation.hasBlockingErrors || !canProceedFromStep(currentStep)) {
      setSaveErrorCode('ADMISSION_VALIDATION_FAILED');
      return;
    }
    const nextStep = Math.min(currentStep + 1, TOTAL_STEPS - 1);
    setIsSaving(true);
    setSaveErrorCode(null);
    setConflictWarning(null);
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
      if (isNewPatientConflictError(error)) {
        await showConflictWarning(error, currentStep);
      } else {
        setSaveErrorCode(error?.code || 'ADMISSION_SAVE_FAILED');
        setSyncStatus(NEW_PATIENT_SYNC_STATUS.NEEDS_SYNC);
        await persistCurrentDraft({ syncStatus: NEW_PATIENT_SYNC_STATUS.NEEDS_SYNC });
      }
    } finally {
      setIsSaving(false);
    }
  }, [
    advanceToStep,
    canProceedFromStep,
    currentStep,
    generateDatasetRecommendation,
    markStepAttempted,
    mergedInputs,
    persistCurrentDraft,
    readiness,
    saveOxygenAbgVentilatorStep,
    savePatientReasonStep,
    showConflictWarning,
  ]);

  const canGoBack = currentStep > 0;
  const canGoNext = currentStep < TOTAL_STEPS - 1;

  const goToStep = useCallback(async (step) => {
    const boundedStep = Math.min(Math.max(Number(step) || 0, 0), TOTAL_STEPS - 1);
    setConflictWarning(null);
    if (boundedStep === currentStep) return;
    await advanceToStep(boundedStep);
  }, [advanceToStep, currentStep]);

  const goBack = useCallback(async () => {
    if (!canGoBack) return;
    await goToStep(currentStep - 1);
  }, [canGoBack, currentStep, goToStep]);

  const saveAdmission = useCallback(async () => {
    markStepAttempted(STEPS.SAVE_REVIEW);
    if (!canProceedFromStep(STEPS.SAVE_REVIEW)) {
      setSaveErrorCode('ADMISSION_VALIDATION_FAILED');
      return;
    }
    setIsSaving(true);
    setSaveErrorCode(null);
    setConflictWarning(null);
    try {
      await saveSuggestedVentilatorSettingsStep();
      const reviewResponse = await saveReviewStep();
      await completeSaveReview(reviewResponse);
    } catch (error) {
      if (isNewPatientConflictError(error)) {
        await showConflictWarning(error, STEPS.SAVE_REVIEW);
      } else {
        setSaveErrorCode(error?.code || 'ADMISSION_SAVE_FAILED');
      }
    } finally {
      setIsSaving(false);
    }
  }, [
    canProceedFromStep,
    completeSaveReview,
    markStepAttempted,
    saveReviewStep,
    saveSuggestedVentilatorSettingsStep,
    showConflictWarning,
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
      facilityLabel: selectedFacilityValue?.name || activeFacilityLabel || mergedInputs.facilityId,
      optionalName: composePatientName(mergedInputs),
      pathway: mergedInputs.patientPathway,
      reasonForSupport: mergedInputs.reasonForSupport,
      spo2: mergedInputs.spo2,
      ph: mergedInputs.ph,
      pao2: mergedInputs.pao2,
      paco2: mergedInputs.paco2,
      ventilatorMode: mergedInputs.ventilatorMode,
      peep: mergedInputs.peep,
      pressureSupport: mergedInputs.pressureSupport,
      tidalVolumeMl: mergedInputs.tidalVolumeMl,
      syncStatus,
    }),
    [activeFacilityLabel, mergedInputs, selectedFacilityValue?.name, syncStatus]
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
    peep: mergedInputs.peep ?? recommendationSettings?.peep ?? null,
    pressureSupport: mergedInputs.pressureSupport ?? recommendationSettings?.pressureSupport ?? null,
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
  const recommendationSourceCategory = useMemo(
    () =>
      recommendationSummary?.source?.sourceCategory ||
      recommendationSummary?.decisionProvenance?.sourceCategory ||
      'unknown',
    [recommendationSummary]
  );
  const recommendationSourceCategoryLabel = useMemo(
    () =>
      recommendationSummary?.source?.sourceCategoryLabel ||
      recommendationSummary?.decisionProvenance?.sourceCategoryLabel ||
      null,
    [recommendationSummary]
  );
  const recommendationCalculation = useMemo(
    () => recommendationSummary?.initialVentilatorSettings?.calculation ?? null,
    [recommendationSummary]
  );
  const recommendationSources = useMemo(
    () =>
      recommendationSummary?.source?.sources ||
      recommendationSummary?.decisionProvenance?.sources ||
      [],
    [recommendationSummary]
  );
  const recommendationDecisionProvenance = useMemo(
    () => recommendationSummary?.decisionProvenance ?? {},
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
    facilitySearch: {
      query: displayedFacilityQuery,
      value: selectedFacilityValue,
      options: displayedFacilityOptions,
      error: facilityError,
      loading: isLoadingFacilities,
      onQueryChange: updateFacilityQuery,
      onValueChange: selectFacility,
      onClear: clearFacility,
    },
    updateInput,
    updatePatientName,
    updateBodyMetric,
    updateDecimalInput,
    updateAgeComponent,
    updateDateOfBirth,
    getNumericInputValue,
    toggleClinicianConfirmed,
    summaryData,
    summaryExpanded,
    setSummaryExpanded,
    readiness,
    recommendationSummary,
    recommendationSettings,
    suggestedVentilatorInputs,
    rangeSuggestions: FIELD_RANGE_HINTS,
    recommendationUnits,
    recommendationMissingInputs,
    recommendationConfidence,
    recommendationSourceCategory,
    recommendationSourceCategoryLabel,
    recommendationCalculation,
    recommendationSources,
    recommendationDecisionProvenance,
    recommendationErrorCode,
    validation,
    rawValidation,
    stepValidationStates,
    canProceedFromStep,
    canGoBack,
    canGoNext,
    goToStep,
    goNext,
    goBack,
    saveAdmission,
    conflictWarning,
    continueAfterConflict,
    dismissConflictWarning,
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
    admissionId: admissionRecordId || admissionId,
    syncStatus,
    togglePermittedMissingField,
    missingValueSentinel: MISSING_UNKNOWN,
    testIds: ASSESSMENT_TEST_IDS,
    totalSteps: TOTAL_STEPS,
  };
}
