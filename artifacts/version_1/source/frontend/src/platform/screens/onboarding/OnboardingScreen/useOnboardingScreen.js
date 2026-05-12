/**
 * useOnboardingScreen (P013).
 * Composes useOnboarding; exposes testIds and i18n step labels.
 */
import useOnboarding from '@hooks/useOnboarding';
import { useMemo } from 'react';
import { useI18n } from '@hooks';
import { ONBOARDING_TEST_IDS } from './types';

export default function useOnboardingScreen() {
  const onboarding = useOnboarding();
  const { t } = useI18n();

  const stepTitle = useMemo(
    () => (stepId) => t(`settings.onboarding.steps.${stepId}.title`),
    [t]
  );
  const stepBody = useMemo(
    () => (stepId) => t(`settings.onboarding.steps.${stepId}.body`),
    [t]
  );

  return useMemo(
    () => ({
      ...onboarding,
      testIds: ONBOARDING_TEST_IDS,
      stepTitle,
      stepBody,
    }),
    [onboarding, stepTitle, stepBody]
  );
}
