/**
 * AI SDK Client (stub)
 * Infrastructure wrapper for optional online AI augmentation.
 *
 * Rules:
 * - Must be safe to call in offline-first builds (returns null by default).
 * - Must not log directly (errors are routed via @errors elsewhere).
 * - Must not contain business/domain logic.
 *
 * File: client.js
 */

/**
 * Request additional analysis for a ventilation case input.
 * This is a stub hook point for future phases; it intentionally returns null.
 *
 * @param {object} caseInput
 * @returns {Promise<null>}
 */
const requestCaseAnalysis = async (caseInput) => {
  // Preserve forward-compatibility: accept only plain objects; otherwise treat as no-op.
  if (!caseInput || typeof caseInput !== 'object') return null;
  return null;
};

export { requestCaseAnalysis };

