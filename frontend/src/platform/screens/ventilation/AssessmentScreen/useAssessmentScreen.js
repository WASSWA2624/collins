/**
 * useAssessmentScreen
 * Shared logic for the three-step admission wizard.
 * File: useAssessmentScreen.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { STEPS, ASSESSMENT_TEST_IDS, STEP_KEYS } from './types';

const TOTAL_STEPS = 3;
const MISSING_UNKNOWN = 'not_available';

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
});

const normalizeInputs = (inputs, clientRecordId) => {
  const base = inputs && typeof inputs === 'object' ? inputs : {};
  return {
    ...defaultAdmissionInputs(clientRecordId),
    ...base,
    clientRecordId: base.clientRecordId || clientRecordId,
    clientCreatedAt: base.clientCreatedAt || nowIso(),
    patientPathway: base.patientPathway || 'ADULT',
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
  if (serverReadiness && typeof serverReadiness === 'object') return serverReadiness;

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
      ? `${field} is documented as unavailable; review when it becomes available.`
      : `${field} is missing; saving is allowed, but clinician review should confirm the gap.`,
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

  return {
    isReadyToSave: blockers.length === 0,
    needsReview: warnings.some((warning) => ['red', 'yellow'].includes(warning.severity)),
    missingData,
    permittedMissingFields: permitted,
    warnings,
    blockers,
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

const buildOxygenAbgVentilatorPayload = (inputs) => {
  const timestamp = nowIso();
  return {
    facilityId: textOrUndefined(inputs.facilityId),
    oxygen: {
      measuredAt: textOrUndefined(inputs.measuredAt),
      oxygenSupportType: textOrUndefined(inputs.oxygenSupportType),
      spo2: numberOrUndefined(inputs.spo2),
      fio2: numberOrUndefined(inputs.fio2),
      respiratoryRate: numberOrUndefined(inputs.respiratoryRate),
      heartRate: numberOrUndefined(inputs.heartRate),
    },
    abg: {
      collectedAt: textOrUndefined(inputs.abgCollectedAt),
      ph: numberOrUndefined(inputs.ph),
      pao2: numberOrUndefined(inputs.pao2),
      paco2: numberOrUndefined(inputs.paco2),
      hco3: numberOrUndefined(inputs.hco3),
      baseExcess: numberOrUndefined(inputs.baseExcess),
      lactate: numberOrUndefined(inputs.lactate),
      fio2AtSample: numberOrUndefined(inputs.fio2AtSample),
      spo2AtSample: numberOrUndefined(inputs.spo2AtSample),
    },
    ventilator: {
      measuredAt: textOrUndefined(inputs.ventilatorMeasuredAt),
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
    },
    uncertainty: {
      isUncertain: Boolean(cleanText(inputs.uncertaintyFieldsText) || cleanText(inputs.uncertaintyReason)),
      fields: splitList(inputs.uncertaintyFieldsText),
      reason: textOrUndefined(inputs.uncertaintyReason),
      notes: textOrUndefined(inputs.uncertaintyNotes),
    },
    deviceContext: {
      deviceId: textOrUndefined(inputs.deviceId),
      source: 'manual',
      oxygenSource: textOrUndefined(inputs.oxygenSource),
      ventilatorType: textOrUndefined(inputs.ventilatorType),
      facilityDeviceLabel: textOrUndefined(inputs.facilityDeviceLabel),
    },
    clientRecordId: inputs.clientRecordId,
    deviceId: textOrUndefined(inputs.deviceId),
    clientCreatedAt: inputs.clientCreatedAt || timestamp,
    clientUpdatedAt: timestamp,
    idempotencyKey: `${inputs.clientRecordId}:oxygen-abg-ventilator`,
  };
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
  } = useVentilationSession();

  const [clientRecordId] = useState(() => inputs?.clientRecordId || createAdmissionClientRecordId());
  const [summaryExpanded, setSummaryExpanded] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [serverResponse, setServerResponse] = useState(null);
  const [saveErrorCode, setSaveErrorCode] = useState(null);
  const [recommendationErrorCode, setRecommendationErrorCode] = useState(null);
  const [admissionId, setAdmissionId] = useState(() => inputs?.admissionId || inputs?.clientRecordId || clientRecordId);
  const [syncStatus, setSyncStatus] = useState(inputs?.syncStatus || 'draft');

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

  const currentStep = typeof assessmentCurrentStep === 'number'
    ? Math.min(Math.max(0, assessmentCurrentStep), TOTAL_STEPS - 1)
    : 0;

  const updateInput = useCallback(
    (partial) => {
      if (!partial || typeof partial !== 'object') return;
      setInputs({ ...mergedInputs, ...partial });
      setSaveErrorCode(null);
    },
    [mergedInputs, setInputs]
  );

  const updateBodyMetric = useCallback(
    (field, value) => {
      updateInput(updateBodyMetricInputs(mergedInputs, field, value));
    },
    [mergedInputs, updateInput]
  );

  const readiness = useMemo(
    () => buildReadinessFromInputs(mergedInputs, serverResponse?.readiness),
    [mergedInputs, serverResponse]
  );

  const canProceedFromStep = useCallback(
    (step) => {
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
      setInputs({ ...mergedInputs, ...partial });
      await persistDraft();
    },
    [mergedInputs, persistDraft, setInputs]
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
        await persistDraft();
        return summaryWithSource;
      } catch (error) {
        setRecommendationSummary(null);
        setRecommendationErrorCode(error?.code || error?.message || 'ADMISSION_RECOMMENDATION_FAILED');
        await persistDraft();
        return null;
      }
    },
    [admissionId, mergedInputs, persistDraft, setRecommendationSummary, syncStatus]
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
    const payload = buildOxygenAbgVentilatorPayload(mergedInputs);
    const response = await saveOxygenAbgVentilatorStepApi(admissionId || mergedInputs.clientRecordId, payload);
    applyStepResponse(response);
    await persistCurrentDraft({
      admissionId: response?.admission?.id || admissionId || mergedInputs.clientRecordId,
      syncStatus: response?.syncStatus || ADMISSION_SYNC_STATUS.SYNCED,
    });
    return response;
  }, [admissionId, applyStepResponse, mergedInputs, persistCurrentDraft]);

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
    if (!canProceedFromStep(currentStep)) return;
    const nextStep = Math.min(currentStep + 1, TOTAL_STEPS - 1);
    setIsSaving(true);
    setSaveErrorCode(null);
    try {
      let response = null;
      if (currentStep === STEPS.PATIENT_REASON) {
        response = await savePatientReasonStep();
      }
      if (currentStep === STEPS.OXYGEN_ABG_VENTILATOR) {
        response = await saveOxygenAbgVentilatorStep();
        await generateDatasetRecommendation(response?.clinicalSummary || null);
      }
      if (currentStep < TOTAL_STEPS - 1) {
        await advanceToStep(nextStep);
      }
    } catch (error) {
      setSaveErrorCode(error?.code || 'ADMISSION_SAVE_FAILED');
      setSyncStatus(ADMISSION_SYNC_STATUS.NEEDS_SYNC);
      await persistCurrentDraft({ syncStatus: ADMISSION_SYNC_STATUS.NEEDS_SYNC });
      if (currentStep === STEPS.OXYGEN_ABG_VENTILATOR) {
        await generateDatasetRecommendation(serverResponse?.clinicalSummary || null);
      }
      if (currentStep < TOTAL_STEPS - 1) {
        await advanceToStep(nextStep);
      }
    } finally {
      setIsSaving(false);
    }
  }, [
    advanceToStep,
    canProceedFromStep,
    currentStep,
    generateDatasetRecommendation,
    persistCurrentDraft,
    saveOxygenAbgVentilatorStep,
    savePatientReasonStep,
    serverResponse,
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
    if (!canProceedFromStep(STEPS.SAVE_REVIEW)) return;
    setIsSaving(true);
    setSaveErrorCode(null);
    try {
      await saveReviewStep();
      router.replace('/tracking');
    } catch (error) {
      setSaveErrorCode(error?.code || 'ADMISSION_SAVE_FAILED');
    } finally {
      setIsSaving(false);
    }
  }, [canProceedFromStep, router, saveReviewStep]);

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

  return {
    currentStep,
    setCurrentStep: setAssessmentStep,
    stepKey: STEP_KEYS[currentStep] ?? STEP_KEYS[0],
    progressPercent,
    mergedInputs,
    updateInput,
    updateBodyMetric,
    summaryData,
    summaryExpanded,
    setSummaryExpanded,
    readiness,
    recommendationSummary,
    recommendationSettings,
    recommendationUnits,
    recommendationMissingInputs,
    recommendationConfidence,
    recommendationErrorCode,
    canProceedFromStep,
    goNext,
    goBack,
    goBackOrExit,
    saveAdmission,
    isSaving,
    isGenerating: isSaving,
    isHydrating,
    errorCode: saveErrorCode || recommendationErrorCode || errorCode,
    clearError,
    sessionId,
    admissionId,
    syncStatus,
    togglePermittedMissingField,
    missingValueSentinel: MISSING_UNKNOWN,
    testIds: ASSESSMENT_TEST_IDS,
    totalSteps: TOTAL_STEPS,
  };
}
