/**
 * Session summary export (text).
 * Builds shareable text with disclaimers; optional anonymization.
 * File: sessionExport.js
 */

const PROTOTYPE_DISCLAIMER = 'This summary is from a prototype for reference and training. It is not intended for direct clinical use.';

/**
 * @param {{ summary: object, inputs: object, intendedUse: { warning: string, validationRequirement: string }, sessionId?: string, anonymize?: boolean }}
 * @returns {string}
 */
const buildSessionSummaryText = ({ summary, inputs, intendedUse, sessionId, anonymize = false }) => {
  const lines = [];
  lines.push('--- Session summary ---');
  if (!anonymize && (sessionId ?? inputs?.sessionId)) lines.push(`Session: ${sessionId ?? inputs?.sessionId}`);
  lines.push('');
  if (intendedUse?.warning) {
    lines.push('Disclaimer: ' + intendedUse.warning);
    if (intendedUse.validationRequirement) lines.push('Validation: ' + intendedUse.validationRequirement);
    lines.push('');
  }
  lines.push(PROTOTYPE_DISCLAIMER);
  lines.push('');
  if (inputs && typeof inputs === 'object') {
    lines.push('--- Inputs ---');
    if (inputs.condition != null) lines.push('Condition: ' + String(inputs.condition));
    if (!anonymize) {
      if (inputs.age != null) lines.push('Age: ' + inputs.age);
      if (inputs.gender) lines.push('Gender: ' + String(inputs.gender));
    }
    if (inputs.spo2 != null) lines.push('SpO2: ' + inputs.spo2);
    if (inputs.respiratoryRate != null) lines.push('Respiratory rate: ' + inputs.respiratoryRate);
    if (inputs.heartRate != null) lines.push('Heart rate: ' + inputs.heartRate);
    if (inputs.pao2 != null) lines.push('PaO2: ' + inputs.pao2);
    if (inputs.paco2 != null) lines.push('PaCO2: ' + inputs.paco2);
    if (inputs.ph != null) lines.push('pH: ' + inputs.ph);
    lines.push('');
  }
  if (summary?.initialVentilatorSettings?.settings) {
    lines.push('--- Recommended settings ---');
    const s = summary.initialVentilatorSettings.settings;
    Object.entries(s).forEach(([k, v]) => { if (v != null) lines.push(`${k}: ${v}`); });
    lines.push('');
  }
  if (summary?.source?.confidenceTier) {
    lines.push('Confidence: ' + summary.source.confidenceTier);
  }
  return lines.join('\n');
};

export { buildSessionSummaryText };
