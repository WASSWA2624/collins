/**
 * useRecommendationScreen
 * Shared logic for Recommendation screen.
 */
import { useMemo } from 'react';
import useVentilationSession from '@hooks/useVentilationSession';

export default function useRecommendationScreen() {
  const {
    recommendationSummary,
    inputs,
    isHydrating,
    errorCode,
    sessionId,
  } = useVentilationSession();

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

  const isEmpty = !recommendationSummary || !settings;

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
    inputs,
    isEmpty,
    isHydrating,
    errorCode,
    sessionId,
  };
}
