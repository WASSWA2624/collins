/**
 * useRecommendationScreen
 * Shared logic for Recommendation screen.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import useVentilationSession from '@hooks/useVentilationSession';
import { selectIsOnline, selectAiDecisionSupportEnabled, selectAiProviderId, selectAiModelId } from '@store/selectors';
import { getVentilationRecommendationUseCase } from '@features/ventilation';
import { async as asyncStorage, aiKeyStorage } from '@services/storage';
import { trackScreen, trackEvent } from '@services/analytics';
import { getAiProviderConfig } from '@config/constants';

const TOTAL_STEPS = 5;
const isFiniteNumber = (v) => typeof v === 'number' && Number.isFinite(v);

export default function useRecommendationScreen() {
  const router = useRouter();
  const {
    recommendationSummary,
    inputs,
    isHydrating,
    errorCode,
    sessionId,
    setRecommendationSummary,
    setAssessmentStep,
    resetSession,
  } = useVentilationSession();
  const isOnline = useSelector(selectIsOnline);
  const aiEnabled = useSelector(selectAiDecisionSupportEnabled);
  const aiProviderId = useSelector(selectAiProviderId);
  const aiModelId = useSelector(selectAiModelId);
  const [aiKeyConfigured, setAiKeyConfigured] = useState(false);
  const [isRequestingAi, setIsRequestingAi] = useState(false);

  const providerConfig = useMemo(() => getAiProviderConfig(aiProviderId), [aiProviderId]);

  useEffect(() => {
    trackScreen('RecommendationScreen');
  }, []);

  useEffect(() => {
    let cancelled = false;
    const storageKey = providerConfig?.storageKey;
    if (!storageKey) {
      if (!cancelled) setAiKeyConfigured(false);
      return () => {};
    }
    aiKeyStorage.getItem(storageKey).then((key) => {
      if (!cancelled) setAiKeyConfigured(typeof key === 'string' && key.trim().length > 0);
    });
    return () => { cancelled = true; };
  }, [providerConfig?.storageKey]);

  const similarityInput = useMemo(() => {
    const i = inputs && typeof inputs === 'object' ? inputs : {};
    return {
      condition: i.condition || null,
      spo2: isFiniteNumber(i.spo2) ? i.spo2 : null,
      pao2: isFiniteNumber(i.pao2) ? i.pao2 : null,
      paco2: isFiniteNumber(i.paco2) ? i.paco2 : null,
      ph: isFiniteNumber(i.ph) ? i.ph : null,
      respiratoryRate: isFiniteNumber(i.respiratoryRate) ? i.respiratoryRate : null,
      heartRate: isFiniteNumber(i.heartRate) ? i.heartRate : null,
    };
  }, [inputs]);

  const requestAiRecommendation = useCallback(async () => {
    if (!aiEnabled || !aiKeyConfigured || !isOnline) return;
    setIsRequestingAi(true);
    try {
      const rec = await getVentilationRecommendationUseCase({
        input: similarityInput,
        ai: {
          useOnlineAi: true,
          isOnline: true,
          flags: { AI_AUGMENTATION_ENABLED: true, aiProviderId, model: aiModelId },
        },
      });
      const applied = rec?.aiAugmentation?.status === 'applied';
      const summaryWithSource = rec ? { ...rec, responseSource: applied ? 'online' : 'offline' } : null;
      setRecommendationSummary(summaryWithSource);
      trackEvent('request_ai_recommendation', { success: Boolean(rec), applied });
    } catch {
      trackEvent('request_ai_recommendation', { success: false });
      try {
        const localRec = await getVentilationRecommendationUseCase({
          input: similarityInput,
          ai: { useOnlineAi: false },
        });
        if (localRec) {
          setRecommendationSummary({
            ...localRec,
            responseSource: 'offline',
            aiAugmentation: Object.freeze({ provider: 'aiSdk', status: 'skipped', reasonCodes: Object.freeze(['VENTILATION_ONLINE_AUGMENTATION_AI_SDK_FAILED']) }),
          });
        }
      } catch {
        // Keep existing recommendation if local fetch fails
      }
    } finally {
      setIsRequestingAi(false);
    }
  }, [aiEnabled, aiKeyConfigured, isOnline, aiProviderId, aiModelId, similarityInput, setRecommendationSummary]);

  const settings = useMemo(
    () => recommendationSummary?.initialVentilatorSettings?.settings ?? null,
    [recommendationSummary]
  );

  const units = useMemo(
    () => recommendationSummary?.units ?? {},
    [recommendationSummary]
  );

  const confidenceTier = useMemo(
    () => recommendationSummary?.source?.confidenceTier ?? 'low',
    [recommendationSummary]
  );

  const monitoringPoints = useMemo(
    () => recommendationSummary?.monitoringPoints ?? [],
    [recommendationSummary]
  );

  const riskFactors = useMemo(
    () => recommendationSummary?.riskFactors ?? [],
    [recommendationSummary]
  );

  const complicationHistory = useMemo(
    () => recommendationSummary?.complicationHistory ?? [],
    [recommendationSummary]
  );

  const matched = useMemo(
    () => recommendationSummary?.matched ?? [],
    [recommendationSummary]
  );

  const caseEvidence = useMemo(
    () => recommendationSummary?.caseEvidence ?? [],
    [recommendationSummary]
  );

  const safety = useMemo(
    () => recommendationSummary?.safety ?? { intendedUseWarning: '', validationRequirement: '' },
    [recommendationSummary]
  );

  const missingInputs = useMemo(
    () => recommendationSummary?.source?.missingInputs ?? [],
    [recommendationSummary]
  );

  const contributingFactors = useMemo(
    () => recommendationSummary?.source?.contributingFactors ?? [],
    [recommendationSummary]
  );

  const additionalTestPrompts = useMemo(
    () => recommendationSummary?.additionalTestPrompts ?? [],
    [recommendationSummary]
  );

  const nextActions = useMemo(
    () => recommendationSummary?.nextActions ?? [],
    [recommendationSummary]
  );

  const aiAugmentation = useMemo(
    () => recommendationSummary?.aiAugmentation ?? null,
    [recommendationSummary]
  );
  const aiReasons = useMemo(
    () => (Array.isArray(aiAugmentation?.reasons) ? aiAugmentation.reasons : []),
    [aiAugmentation]
  );
  const aiHints = useMemo(
    () => (Array.isArray(aiAugmentation?.hints) ? aiAugmentation.hints : []),
    [aiAugmentation]
  );

  /** Reason codes that mean "online AI was attempted but failed" (show fallback message). */
  const AI_FAILURE_REASON_CODES = useMemo(
    () =>
      Object.freeze([
        'VENTILATION_ONLINE_AUGMENTATION_OFFLINE',
        'VENTILATION_ONLINE_AUGMENTATION_OFFLINE_MODE',
        'VENTILATION_ONLINE_AUGMENTATION_NO_API_KEY',
        'VENTILATION_ONLINE_AUGMENTATION_AI_SDK_FAILED',
        'VENTILATION_ONLINE_AUGMENTATION_INVALID_INPUT',
        'VENTILATION_ONLINE_AUGMENTATION_FEATURE_DISABLED',
        'VENTILATION_AI_SKIPPED',
      ]),
    []
  );

  const usedLocalFallback = useMemo(() => {
    const status = aiAugmentation?.status;
    const codes = aiAugmentation?.reasonCodes;
    return status === 'skipped' && Array.isArray(codes) && codes.length > 0;
  }, [aiAugmentation]);

  /** True when online AI was requested but failed; show "AI failed, showing local" message. */
  const showAiFallbackMessage = useMemo(() => {
    if (aiAugmentation?.status !== 'skipped') return false;
    const code = aiAugmentation?.reasonCodes?.[0];
    return code && AI_FAILURE_REASON_CODES.includes(code);
  }, [aiAugmentation, AI_FAILURE_REASON_CODES]);

  const FALLBACK_REASON_KEYS = useMemo(
    () =>
      Object.freeze({
        VENTILATION_AI_SKIPPED_USER_CHOSE_LOCAL: 'ventilation.recommendation.fallbackReasons.userChoseLocal',
        VENTILATION_AI_SKIPPED_NOT_COMPLEX: 'ventilation.recommendation.fallbackReasons.notComplex',
        VENTILATION_ONLINE_AUGMENTATION_OFFLINE: 'ventilation.recommendation.fallbackReasons.offline',
        VENTILATION_ONLINE_AUGMENTATION_OFFLINE_MODE: 'ventilation.recommendation.fallbackReasons.offline',
        VENTILATION_ONLINE_AUGMENTATION_NO_API_KEY: 'ventilation.recommendation.fallbackReasons.noApiKey',
        VENTILATION_ONLINE_AUGMENTATION_AI_SDK_FAILED: 'ventilation.recommendation.fallbackReasons.error',
        VENTILATION_AI_SKIPPED: 'ventilation.recommendation.fallbackReasons.error',
      }),
    []
  );
  const fallbackReasonKey = useMemo(() => {
    const code = aiAugmentation?.reasonCodes?.[0];
    return code && FALLBACK_REASON_KEYS[code] ? FALLBACK_REASON_KEYS[code] : 'ventilation.recommendation.fallbackReasons.error';
  }, [aiAugmentation, FALLBACK_REASON_KEYS]);

  const isEmpty = !recommendationSummary || !settings;
  const showRequestAi = aiEnabled && aiKeyConfigured;
  const responseSource = recommendationSummary?.responseSource === 'online' ? 'online' : 'offline';

  const goToAssessmentStep = useCallback(
    (step) => {
      const s = typeof step === 'number' && step >= 0 && step < TOTAL_STEPS ? step : 0;
      setAssessmentStep(s);
      router.push('/assessment');
    },
    [setAssessmentStep, router]
  );

  const startNewAssessment = useCallback(() => {
    resetSession();
    router.replace('/assessment');
  }, [resetSession, router]);

  /** Opens the Edit Assessment form at step 0 with current session data pre-filled (Patient Profile, Clinical Parameters, Optional Observations, Optional Time Series, Review). */
  const editAssessment = useCallback(() => {
    setAssessmentStep(0);
    router.push('/assessment');
  }, [setAssessmentStep, router]);

  return {
    recommendationSummary,
    settings,
    units,
    confidenceTier,
    monitoringPoints,
    riskFactors,
    complicationHistory,
    matched,
    caseEvidence,
    safety,
    missingInputs,
    contributingFactors,
    additionalTestPrompts,
    nextActions,
    aiAugmentation,
    aiReasons,
    aiHints,
    usedLocalFallback,
    showAiFallbackMessage,
    fallbackReasonKey,
    inputs,
    isEmpty,
    isHydrating,
    errorCode,
    sessionId,
    showRequestAi,
    isOnline,
    isRequestingAi,
    requestAiRecommendation,
    responseSource,
    goToAssessmentStep,
    editAssessment,
    startNewAssessment,
    totalSteps: TOTAL_STEPS,
  };
}
