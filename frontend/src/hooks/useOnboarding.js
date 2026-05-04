/**
 * useOnboarding (P013).
 * Exposes onboarding steps and current step navigation; content from i18n.
 */
import { useMemo, useCallback, useState } from 'react';
import { getOnboardingSteps, getNextStepId, getPreviousStepId, isFirstStep, isLastStep } from '@features/onboarding';

const INITIAL_STEP = 'inputs';

export default function useOnboarding() {
  const [currentStepId, setCurrentStepId] = useState(INITIAL_STEP);

  const steps = useMemo(() => getOnboardingSteps(), []);
  const nextStepId = useMemo(() => getNextStepId(currentStepId), [currentStepId]);
  const prevStepId = useMemo(() => getPreviousStepId(currentStepId), [currentStepId]);
  const isFirst = useMemo(() => isFirstStep(currentStepId), [currentStepId]);
  const isLast = useMemo(() => isLastStep(currentStepId), [currentStepId]);

  const goNext = useCallback(() => {
    const next = getNextStepId(currentStepId);
    if (next) setCurrentStepId(next);
  }, [currentStepId]);

  const goBack = useCallback(() => {
    const prev = getPreviousStepId(currentStepId);
    if (prev) setCurrentStepId(prev);
  }, [currentStepId]);

  return useMemo(
    () => ({
      steps,
      currentStepId,
      nextStepId,
      prevStepId,
      isFirst,
      isLast,
      goNext,
      goBack,
    }),
    [steps, currentStepId, nextStepId, prevStepId, isFirst, isLast, goNext, goBack]
  );
}
