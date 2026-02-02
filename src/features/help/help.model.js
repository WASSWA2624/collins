/**
 * Help feature model (P013).
 * Glossary, troubleshooting, and guide entry shapes (keys only; content from i18n).
 */
const getGlossaryKeys = () =>
  ['PEEP', 'FiO2', 'IERatio', 'tidalVolume', 'respiratoryRate', 'SpO2', 'PaO2', 'PaCO2', 'pH'];

const getTroubleshootingKeys = () => ['missingABG', 'offline'];
const getGuideKeys = () => ['hypoxemia', 'hypercapnia', 'acidosis', 'general'];

export { getGlossaryKeys, getTroubleshootingKeys, getGuideKeys };
