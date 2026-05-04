/**
 * Onboarding feature rules (P013).
 * Pure helpers: step order, completion.
 */
const ONBOARDING_STEP_IDS = Object.freeze(['inputs', 'recommendations', 'monitoring', 'offline']);

const getOnboardingStepOrder = () => [...ONBOARDING_STEP_IDS];

const getStepIndex = (stepId) => {
  const idx = ONBOARDING_STEP_IDS.indexOf(stepId);
  return idx >= 0 ? idx : 0;
};

const getNextStepId = (currentStepId) => {
  const idx = getStepIndex(currentStepId);
  return idx < ONBOARDING_STEP_IDS.length - 1 ? ONBOARDING_STEP_IDS[idx + 1] : null;
};

const getPreviousStepId = (currentStepId) => {
  const idx = getStepIndex(currentStepId);
  return idx > 0 ? ONBOARDING_STEP_IDS[idx - 1] : null;
};

const isFirstStep = (stepId) => getStepIndex(stepId) === 0;
const isLastStep = (stepId) => getStepIndex(stepId) === ONBOARDING_STEP_IDS.length - 1;

export {
  getOnboardingStepOrder,
  getStepIndex,
  getNextStepId,
  getPreviousStepId,
  isFirstStep,
  isLastStep,
  ONBOARDING_STEP_IDS,
};
