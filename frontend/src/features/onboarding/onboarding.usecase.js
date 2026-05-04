/**
 * Onboarding use case (P013).
 * Returns steps for UI; content from i18n.
 */
import { getOnboardingStepOrder } from './onboarding.rules';

const getOnboardingSteps = () => {
  const order = getOnboardingStepOrder();
  return order.map((id, index) => ({ id, order: index }));
};

const getOnboardingStepIds = () => getOnboardingSteps().map((s) => s.id);

export { getOnboardingSteps, getOnboardingStepIds };
