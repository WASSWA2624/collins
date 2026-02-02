/**
 * useRecommendationScreen
 * Shared logic for Recommendation screen.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import useVentilationSession from '@hooks/useVentilationSession';
import { selectIsOnline, selectAiDecisionSupportEnabled, selectAiModelId } from '@store/selectors';
import { getVentilationRecommendationUseCase } from '@features/ventilation';
import { async as asyncStorage } from '@services/storage';
import { trackScreen, trackEvent } from '@services/analytics';
import { AI_API_KEY_CONFIGURED_ASYNC_KEY } from '@config/constants';

const isFiniteNumber = (v) => typeof v === 'number' && Number.isFinite(v);

export default function useRecommendationScreen() {
  const {
    recommendationSummary,
    inputs,
    isHydrating,
    errorCode,
    sessionId,
    setRecommendationSummary,
  } = useVentilationSession();
  const isOnline = useSelector(selectIsOnline);
  const aiEnabled = useSelector(selectAiDecisionSupportEnabled);
  const aiModelId = useSelector(selectAiModelId);
  const [aiKeyConfigured, setAiKeyConfigured] = useState(false);
  const [isRequestingAi, setIsRequestingAi] = useState(false);

  useEffect(() => {
    trackScreen('RecommendationScreen');
  }, []);

  useEffect(() => {
    let cancelled = false;
    asyncStorage.getItem(AI_API_KEY_CONFIGURED_ASYNC_KEY).then((v) => {
      if (!cancelled) setAiKeyConfigured(v === 'true');
    });
    return () => { cancelled = true; };
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
    if (!aiEnabled || !aiKeyConfigured || !isOnline) return;
    setIsRequestingAi(true);
    try {
      const rec = await getVentilationRecommendationUseCase({
        input: similarityInput,
        ai: {
          isOnline: true,
          flags: { AI_AUGMENTATION_ENABLED: true, model: aiModelId },
        },
      });
      setRecommendationSummary(rec ?? null);
      trackEvent('request_ai_recommendation', { success: Boolean(rec) });
    } catch {
      trackEvent('request_ai_recommendation', { success: false });
    } finally {
      setIsRequestingAi(false);
    }
  }, [aiEnabled, aiKeyConfigured, isOnline, aiModelId, similarityInput, setRecommendationSummary]);

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
  };
}
