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
import { async as asyncStorage } from '@services/storage';
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
    const key = providerConfig?.configuredAsyncKey;
    if (!key) {
      if (!cancelled) setAiKeyConfigured(false);
      return () => {};
    }
    asyncStorage.getItem(key).then((v) => {
      if (!cancelled) setAiKeyConfigured(v === 'true');
    });
    return () => { cancelled = true; };
  }, [providerConfig?.configuredAsyncKey]);

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
      const summaryWithSource = rec ? { ...rec, responseSource: 'online' } : null;
      setRecommendationSummary(summaryWithSource);
      trackEvent('request_ai_recommendation', { success: Boolean(rec) });
    } catch {
      trackEvent('request_ai_recommendation', { success: false });
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
