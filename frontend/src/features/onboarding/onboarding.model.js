/**
 * Onboarding feature model (P013).
 * Step shape for UI; no external data.
 */
const defaultSteps = () =>
  ['inputs', 'recommendations', 'monitoring', 'offline'].map((id, order) => ({
    id,
    order,
  }));

export { defaultSteps };
