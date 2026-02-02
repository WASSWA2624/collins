/**
 * useAssessmentScreen
 * Shared logic for Assessment wizard (ventilation).
 * File: useAssessmentScreen.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  buildVentilationAdditionalTestPrompts,
  getMissingSimilarityFields,
  getVentilationRecommendationUseCase,
  getVentilationUnits,
  VENTILATION_SIMILARITY_OPTIONAL_ABG_FIELDS,
} from '@features/ventilation';
import useVentilationSession from '@hooks/useVentilationSession';
import { useI18n } from '@hooks';
import { useSelector } from 'react-redux';
import { selectIsOnline, selectAiProviderId, selectAiModelId } from '@store/selectors';
import { getModelsForProvider } from '@config/constants';
import { STEPS, ASSESSMENT_TEST_IDS, STEP_KEYS } from './types';

const TOTAL_STEPS = 5;

const isFiniteNumber = (v) => typeof v === 'number' && Number.isFinite(v);

const parseComorbidities = (val) => {
  if (typeof val !== 'string' || !val.trim()) return [];
  return val
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
};

export default function useAssessmentScreen() {
  const router = useRouter();
  const {
    sessionId,
    inputs,
    setInputs,
    startSession,
    setRecommendationSummary,
    appendToHistory,
    isHydrating,
    errorCode,
    hydrate,
    clearError,
  } = useVentilationSession();
  const { t } = useI18n();
  const isOnline = useSelector(selectIsOnline);
  const aiProviderId = useSelector(selectAiProviderId);
  const aiModelId = useSelector(selectAiModelId);

  const modelOptions = useMemo(
    () => getModelsForProvider(aiProviderId).map((m) => ({ value: m.id, label: t(m.labelKey) })),
    [t, aiProviderId]
  );

  const [currentStep, setCurrentStep] = useState(STEPS.PATIENT_PROFILE);
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendationSource, setRecommendationSource] = useState('local'); // 'local' | 'online_ai'

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const mergedInputs = useMemo(() => {
    const base = inputs && typeof inputs === 'object' ? { ...inputs } : {};
    return {
      condition: base.condition ?? '',
      age: base.age ?? null,
      weight: base.weight ?? null,
      height: base.height ?? null,
      gender: base.gender ?? '',
      comorbidities: Array.isArray(base.comorbidities)
        ? base.comorbidities
        : parseComorbidities(base.comorbiditiesText ?? ''),
      comorbiditiesText: base.comorbiditiesText ?? '',
      spo2: base.spo2 ?? null,
      pao2: base.pao2 ?? null,
      paco2: base.paco2 ?? null,
      ph: base.ph ?? null,
      respiratoryRate: base.respiratoryRate ?? null,
      heartRate: base.heartRate ?? null,
      bloodPressure: base.bloodPressure ?? '',
      observations: Array.isArray(base.observations) ? base.observations : [],
      timeSeries: Array.isArray(base.timeSeries) ? base.timeSeries : [],
    };
  }, [inputs]);

  const updateInput = useCallback(
    (partial) => {
      if (!partial || typeof partial !== 'object') return;
      setInputs({ ...mergedInputs, ...partial });
    },
    [mergedInputs, setInputs]
  );

  const similarityInput = useMemo(() => {
    return {
      condition: mergedInputs.condition || null,
      spo2: isFiniteNumber(mergedInputs.spo2) ? mergedInputs.spo2 : null,
      pao2: isFiniteNumber(mergedInputs.pao2) ? mergedInputs.pao2 : null,
      paco2: isFiniteNumber(mergedInputs.paco2) ? mergedInputs.paco2 : null,
      ph: isFiniteNumber(mergedInputs.ph) ? mergedInputs.ph : null,
      respiratoryRate: isFiniteNumber(mergedInputs.respiratoryRate) ? mergedInputs.respiratoryRate : null,
      heartRate: isFiniteNumber(mergedInputs.heartRate) ? mergedInputs.heartRate : null,
    };
  }, [mergedInputs]);

  const missingFields = useMemo(
    () => getMissingSimilarityFields(similarityInput),
    [similarityInput]
  );

  const missingAbg = useMemo(
    () => missingFields.filter((f) => VENTILATION_SIMILARITY_OPTIONAL_ABG_FIELDS.includes(f)),
    [missingFields]
  );

  const additionalTestPrompts = useMemo(
    () =>
      buildVentilationAdditionalTestPrompts({
        confidenceTier: 'low',
        missingAbgFields: missingAbg,
      }),
    [missingAbg]
  );

  const units = useMemo(() => getVentilationUnits(), []);

  const canProceedFromStep = useCallback(
    (step) => {
      switch (step) {
        case STEPS.PATIENT_PROFILE:
          return !!mergedInputs.condition?.trim();
        case STEPS.CLINICAL_PARAMS:
          return (
            isFiniteNumber(mergedInputs.spo2) &&
            isFiniteNumber(mergedInputs.respiratoryRate) &&
            isFiniteNumber(mergedInputs.heartRate)
          );
        case STEPS.OBSERVATIONS:
        case STEPS.TIME_SERIES:
          return true;
        case STEPS.REVIEW:
          return true;
        default:
          return false;
      }
    },
    [mergedInputs]
  );

  const goNext = useCallback(() => {
    if (currentStep < TOTAL_STEPS - 1 && canProceedFromStep(currentStep)) {
      setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
    }
  }, [currentStep, canProceedFromStep]);

  const goBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => Math.max(s - 1, 0));
    }
  }, [currentStep]);

  const generateRecommendation = useCallback(async () => {
    const sid = sessionId || `session-${Date.now()}`;
    if (!sessionId) {
      startSession(sid);
    }
    setInputs(mergedInputs);
    setIsGenerating(true);
    try {
      const useOnlineAi = recommendationSource === 'online_ai';
      const rec = await getVentilationRecommendationUseCase({
        input: similarityInput,
        ai: {
          useOnlineAi,
          isOnline,
          flags: {
            AI_AUGMENTATION_ENABLED: useOnlineAi ? true : false,
            model: aiModelId,
          },
        },
      });
      setRecommendationSummary(rec ?? null);
      appendToHistory();
      router.replace('/session/recommendation');
    } catch (err) {
      setRecommendationSummary(null);
    } finally {
      setIsGenerating(false);
    }
  }, [sessionId, mergedInputs, similarityInput, startSession, setInputs, setRecommendationSummary, appendToHistory, router, recommendationSource, isOnline, aiModelId]);

  const addObservation = useCallback(() => {
    const obs = {
      name: '',
      value: null,
      unit: null,
      timestamp: new Date().toISOString(),
      codeSystem: null,
      code: null,
      method: null,
      source: null,
      referenceRange: null,
    };
    updateInput({
      observations: [...(mergedInputs.observations || []), obs],
    });
  }, [mergedInputs.observations, updateInput]);

  const updateObservation = useCallback(
    (index, partial) => {
      const list = [...(mergedInputs.observations || [])];
      if (index < 0 || index >= list.length) return;
      list[index] = { ...list[index], ...partial };
      updateInput({ observations: list });
    },
    [mergedInputs.observations, updateInput]
  );

  const removeObservation = useCallback(
    (index) => {
      const list = (mergedInputs.observations || []).filter((_, i) => i !== index);
      updateInput({ observations: list });
    },
    [mergedInputs.observations, updateInput]
  );

  const addTimeSeriesPoint = useCallback(
    (seriesName, value) => {
      const existing = mergedInputs.timeSeries?.find((ts) => ts.name === seriesName) ?? {
        name: seriesName,
        unit: null,
        points: [],
      };
      const points = [...(existing.points || []), { timestamp: new Date().toISOString(), value }];
      const updated = (mergedInputs.timeSeries || []).filter((ts) => ts.name !== seriesName);
      updated.push({ ...existing, points });
      updateInput({ timeSeries: updated });
    },
    [mergedInputs.timeSeries, updateInput]
  );

  const summaryData = useMemo(
    () => ({
      condition: mergedInputs.condition,
      spo2: mergedInputs.spo2,
      respiratoryRate: mergedInputs.respiratoryRate,
      heartRate: mergedInputs.heartRate,
      pao2: mergedInputs.pao2,
      paco2: mergedInputs.paco2,
      ph: mergedInputs.ph,
      age: mergedInputs.age,
      weight: mergedInputs.weight,
      height: mergedInputs.height,
      gender: mergedInputs.gender,
      comorbidities: mergedInputs.comorbidities,
      bloodPressure: mergedInputs.bloodPressure,
    }),
    [mergedInputs]
  );

  const progressPercent = useMemo(() => ((currentStep + 1) / TOTAL_STEPS) * 100, [currentStep]);

  return {
    currentStep,
    setCurrentStep,
    stepKey: STEP_KEYS[currentStep],
    progressPercent,
    mergedInputs,
    updateInput,
    summaryData,
    summaryExpanded,
    setSummaryExpanded,
    missingFields,
    missingAbg,
    additionalTestPrompts,
    units,
    canProceedFromStep,
    goNext,
    goBack,
    generateRecommendation,
    isGenerating,
    isHydrating,
    errorCode,
    clearError,
    sessionId,
    addObservation,
    updateObservation,
    removeObservation,
    addTimeSeriesPoint,
    recommendationSource,
    setRecommendationSource,
    aiModelId,
    modelOptions,
    testIds: ASSESSMENT_TEST_IDS,
    totalSteps: TOTAL_STEPS,
  };
}
