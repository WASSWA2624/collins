/**
 * useRecommendationScreen
 * Shared logic for Recommendation screen.
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import useVentilationSession from '@hooks/useVentilationSession';
import { getVentilationRecommendationUseCase } from '@features/ventilation';
import { trackScreen } from '@services/analytics';
import { STEP_KEYS } from '../AssessmentScreen/types';

const TOTAL_STEPS = STEP_KEYS.length;
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
  useEffect(() => {
    trackScreen('RecommendationScreen');
  }, []);

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
    const rec = await getVentilationRecommendationUseCase({
      input: similarityInput,
      ai: { useOnlineAi: false },
    });
    const summaryWithSource = rec ? { ...rec, responseSource: 'offline' } : null;
    setRecommendationSummary(summaryWithSource);
  }, [similarityInput, setRecommendationSummary]);

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
    () => [],
    [recommendationSummary]
  );

  const caseEvidence = useMemo(
    () => recommendationSummary?.caseEvidence ?? [],
    [recommendationSummary]
  );

  const decisionProvenance = useMemo(
    () => recommendationSummary?.decisionProvenance ?? { reviewStatus: 'unvalidated', sourceNote: '', sources: [] },
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
    () => [],
    []
  );
  const aiHints = useMemo(
    () => [],
    []
  );

  const decisionSupport = useMemo(
    () => recommendationSummary?.decisionSupport ?? null,
    [recommendationSummary]
  );
  const advisoryFlags = useMemo(
    () => (Array.isArray(decisionSupport?.flags) ? decisionSupport.flags : []),
    [decisionSupport]
  );
  const missingData = useMemo(
    () => (Array.isArray(decisionSupport?.missingData) ? decisionSupport.missingData : []),
    [decisionSupport]
  );
  const supportStatus = useMemo(
    () => decisionSupport?.status ?? {
      reviewStatus: 'pending_clinician_review',
      syncStatus: 'local_preview_pending_backend_confirmation',
      referenceStatus: 'frontend_preview_unconfirmed',
      pendingBackendConfirmation: true,
    },
    [decisionSupport]
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

  const isEmpty = !recommendationSummary;
  const showRequestAi = false;
  const responseSource = 'offline';

  const goToAssessmentStep = useCallback(
    (step) => {
      const s = typeof step === 'number' && step >= 0 && step < TOTAL_STEPS ? step : 0;
      setAssessmentStep(s);
      router.push('/new-patient');
    },
    [setAssessmentStep, router]
  );

  const startNewAssessment = useCallback(() => {
    resetSession();
    router.replace('/new-patient');
  }, [resetSession, router]);

  /** Opens the New Patient form at step 0 with current session data pre-filled. */
  const editAssessment = useCallback(() => {
    setAssessmentStep(0);
    router.push('/new-patient');
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
    decisionProvenance,
    safety,
    missingInputs,
    contributingFactors,
    additionalTestPrompts,
    nextActions,
    decisionSupport,
    advisoryFlags,
    missingData,
    supportStatus,
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
    isOnline: false,
    isRequestingAi: false,
    requestAiRecommendation,
    responseSource,
    goToAssessmentStep,
    editAssessment,
    startNewAssessment,
    totalSteps: TOTAL_STEPS,
  };
}
