/**
 * Help feature rules (P013).
 * Pure helpers: search filter, glossary/troubleshooting/guide keys.
 */
const GLOSSARY_KEYS = Object.freeze([
  'PEEP',
  'FiO2',
  'IERatio',
  'tidalVolume',
  'respiratoryRate',
  'SpO2',
  'PaO2',
  'PaCO2',
  'pH',
]);

const TROUBLESHOOTING_KEYS = Object.freeze(['missingABG', 'offline']);
const GUIDE_KEYS = Object.freeze(['hypoxemia', 'hypercapnia', 'acidosis', 'general']);

const normalizeSearch = (q) => (typeof q === 'string' ? q.trim().toLowerCase() : '');

const matchesGlossaryKey = (key, query) => {
  const nq = normalizeSearch(query);
  if (!nq) return true;
  return key.toLowerCase().includes(nq);
};

const filterGlossaryKeys = (query) => {
  const nq = normalizeSearch(query);
  if (!nq) return [...GLOSSARY_KEYS];
  return GLOSSARY_KEYS.filter((k) => matchesGlossaryKey(k, nq));
};

const filterTroubleshootingKeys = (query) => {
  const nq = normalizeSearch(query);
  if (!nq) return [...TROUBLESHOOTING_KEYS];
  return TROUBLESHOOTING_KEYS.filter((k) => k.toLowerCase().includes(nq));
};

const filterGuideKeys = (query) => {
  const nq = normalizeSearch(query);
  if (!nq) return [...GUIDE_KEYS];
  return GUIDE_KEYS.filter((k) => k.toLowerCase().includes(nq));
};

export {
  GLOSSARY_KEYS,
  TROUBLESHOOTING_KEYS,
  GUIDE_KEYS,
  normalizeSearch,
  filterGlossaryKeys,
  filterTroubleshootingKeys,
  filterGuideKeys,
};
