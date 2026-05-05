/**
 * useAssessmentScreen
 * Shared logic for the three-step admission wizard.
 * File: useAssessmentScreen.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ADMISSION_SYNC_STATUS,
  createAdmissionClientRecordId,
  saveAdmissionReviewStepApi,
  saveOxygenAbgVentilatorStepApi,
  savePatientReasonStepApi,
} from '@features/ventilation';
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

const defaultAdmissionInputs = (clientRecordId) => ({
  clientRecordId,
  clientCreatedAt: nowIso(),
  facilityId: '',
  bedNumber: '',
  admissionSource: '',
  reasonForSupport: '',
  patientPathway: '',
  ageYears: null,
  sexForSizeCalculations: 'UNKNOWN',
  actualWeightKg: null,
  heightOrLengthCm: null,
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
    patientPathway: base.patientPathway || '',
    sexForSizeCalculations: base.sexForSizeCalculations || 'UNKNOWN',
    permittedMissingFields: Array.isArray(base.permittedMissingFields) ? base.permittedMissingFields : [],
    clinicianConfirmed: base.clinicianConfirmed === true,
  };
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
    facilityId: cleanText(inputs.facilityId),
    bedNumber: textOrUndefined(inputs.bedNumber),
    admissionSource: textOrUndefined(inputs.admissionSource),
    reasonForSupport: cleanText(inputs.reasonForSupport),
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

export default function useAssessmentScreen() {
  const router = useRouter();
  const {
    sessionId,
    inputs,
    setInputs,
    startSession,
    persistDraft,
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

  const mergedInputs = useMemo(
    () => normalizeInputs(inputs, clientRecordId),
    [clientRecordId, inputs]
  );

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

  const readiness = useMemo(
    () => buildReadinessFromInputs(mergedInputs, serverResponse?.readiness),
    [mergedInputs, serverResponse]
  );

  const canProceedFromStep = useCallback(
    (step) => {
      switch (step) {
        case STEPS.PATIENT_REASON:
          return Boolean(
            cleanText(mergedInputs.facilityId) &&
            cleanText(mergedInputs.patientPathway) &&
            cleanText(mergedInputs.reasonForSupport)
          );
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
    setIsSaving(true);
    setSaveErrorCode(null);
    try {
      if (currentStep === STEPS.PATIENT_REASON) {
        await savePatientReasonStep();
      }
      if (currentStep === STEPS.OXYGEN_ABG_VENTILATOR) {
        await saveOxygenAbgVentilatorStep();
      }
      if (currentStep < TOTAL_STEPS - 1) {
        setAssessmentStep(Math.min(currentStep + 1, TOTAL_STEPS - 1));
      }
    } catch (error) {
      setSaveErrorCode(error?.code || 'ADMISSION_SAVE_FAILED');
    } finally {
      setIsSaving(false);
    }
  }, [
    canProceedFromStep,
    currentStep,
    saveOxygenAbgVentilatorStep,
    savePatientReasonStep,
    setAssessmentStep,
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
    } catch (error) {
      setSaveErrorCode(error?.code || 'ADMISSION_SAVE_FAILED');
    } finally {
      setIsSaving(false);
    }
  }, [canProceedFromStep, saveReviewStep]);

  const togglePermittedMissingField = useCallback(
    (field, checked) => {
      const current = Array.isArray(mergedInputs.permittedMissingFields)
        ? mergedInputs.permittedMissingFields
        : [];
      const next = checked
        ? [...new Set([...current, field])]
        : current.filter((item) => item !== field);
      updateInput({ permittedMissingFields: next });
    },
    [mergedInputs.permittedMissingFields, updateInput]
  );

  const summaryData = useMemo(
    () => ({
      facilityId: mergedInputs.facilityId,
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
    [mergedInputs, syncStatus]
  );

  const progressPercent = useMemo(() => ((currentStep + 1) / TOTAL_STEPS) * 100, [currentStep]);

  return {
    currentStep,
    setCurrentStep: setAssessmentStep,
    stepKey: STEP_KEYS[currentStep] ?? STEP_KEYS[0],
    progressPercent,
    mergedInputs,
    updateInput,
    summaryData,
    summaryExpanded,
    setSummaryExpanded,
    readiness,
    canProceedFromStep,
    goNext,
    goBack,
    goBackOrExit,
    saveAdmission,
    isSaving,
    isGenerating: isSaving,
    isHydrating,
    errorCode: saveErrorCode || errorCode,
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
