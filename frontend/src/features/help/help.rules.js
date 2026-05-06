/**
 * Help feature rules (P013/P014).
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
  'ABG',
  'referenceStatus',
  'datasetCapture',
  'reviewQueue',
  'syncState',
  'shadowMode',
]);

const TROUBLESHOOTING_KEYS = Object.freeze([
  'missingABG',
  'offline',
  'unverifiedReference',
  'roleRestrictedModelHelp',
  'needsReview',
]);

const GUIDE_KEYS = Object.freeze([
  'home',
  'admit',
  'tracking',
  'abgVentUpdate',
  'datasetCapture',
  'reviewQueue',
  'dashboard',
  'settings',
  'hypoxemia',
  'hypercapnia',
  'acidosis',
  'general',
]);

const HELP_SEARCH_TERMS = Object.freeze({
  glossary: Object.freeze({
    PEEP: Object.freeze(['positive end expiratory pressure', 'ventilator pressure']),
    FiO2: Object.freeze(['fraction inspired oxygen', 'oxygen concentration']),
    IERatio: Object.freeze(['inspiratory expiratory ratio', 'i e ratio']),
    tidalVolume: Object.freeze(['tidal volume', 'vt']),
    respiratoryRate: Object.freeze(['respiratory rate', 'breaths per minute', 'rr']),
    SpO2: Object.freeze(['oxygen saturation', 'pulse oximetry']),
    PaO2: Object.freeze(['arterial oxygen', 'abg oxygen']),
    PaCO2: Object.freeze(['arterial carbon dioxide', 'abg carbon dioxide']),
    pH: Object.freeze(['arterial ph', 'acidosis']),
    ABG: Object.freeze(['arterial blood gas', 'blood gas', 'abg update']),
    referenceStatus: Object.freeze(['verified reference', 'reference range', 'governance status', 'source version']),
    datasetCapture: Object.freeze(['dataset capture', 'de identified records', 'training data']),
    reviewQueue: Object.freeze(['review queue', 'review status', 'audit trail']),
    syncState: Object.freeze(['offline', 'sync', 'network status']),
    shadowMode: Object.freeze(['model readiness', 'predictive model', 'shadow mode', 'model governance']),
  }),
  troubleshooting: Object.freeze({
    missingABG: Object.freeze(['missing abg', 'no blood gas', 'abg unavailable']),
    offline: Object.freeze(['offline', 'no network', 'sync']),
    unverifiedReference: Object.freeze(['unverified reference', 'reference range', 'not active']),
    roleRestrictedModelHelp: Object.freeze(['model readiness', 'shadow mode', 'restricted role']),
    needsReview: Object.freeze(['needs review', 'review queue', 'pending review']),
  }),
  guides: Object.freeze({
    home: Object.freeze(['home', 'facility context', 'workload', 'sync state']),
    admit: Object.freeze(['admit', 'patient capture', 'pathway', 'assessment']),
    tracking: Object.freeze(['tracking', 'bed board', 'review status', 'trend']),
    abgVentUpdate: Object.freeze(['abg vent update', 'abg update', 'ventilator settings', 'time stamped']),
    datasetCapture: Object.freeze(['dataset capture', 'de identified', 'research dataset']),
    reviewQueue: Object.freeze(['review queue', 'approve', 'request correction', 'exclude']),
    dashboard: Object.freeze(['dashboard', 'aggregate', 'quality', 'governance']),
    settings: Object.freeze(['settings', 'privacy', 'accessibility', 'reference visibility']),
    hypoxemia: Object.freeze(['hypoxemia', 'oxygenation', 'fio2', 'peep']),
    hypercapnia: Object.freeze(['hypercapnia', 'carbon dioxide', 'minute ventilation']),
    acidosis: Object.freeze(['acidosis', 'ph', 'perfusion']),
    general: Object.freeze(['general', 'decision support', 'clinical judgment']),
  }),
});

const normalizeSearch = (q) => (typeof q === 'string' ? q.trim().toLowerCase().replace(/\s+/g, ' ') : '');

const splitTokens = (query) => {
  const normalized = normalizeSearch(query);
  if (!normalized) return [];
  return normalized.split(' ').map((token) => token.trim()).filter(Boolean);
};

const spacedKey = (key) => String(key || '').replace(/([a-z])([A-Z])/g, '$1 $2');

const entryMatches = ({ key, query, terms = [] }) => {
  const normalized = normalizeSearch(query);
  if (!normalized) return true;

  const tokens = splitTokens(normalized);
  const compactQuery = normalized.replace(/\s+/g, '');
  const haystacks = [key, spacedKey(key), ...terms].map((value) => normalizeSearch(value));

  return haystacks.some((value) => {
    const compactValue = value.replace(/\s+/g, '');
    return value.includes(normalized)
      || compactValue.includes(compactQuery)
      || tokens.every((token) => value.includes(token) || compactValue.includes(token));
  });
};

const filterKeys = (keys, termMap, query) => {
  const nq = normalizeSearch(query);
  if (!nq) return [...keys];
  return keys.filter((key) => entryMatches({ key, query: nq, terms: termMap?.[key] || [] }));
};

const filterGlossaryKeys = (query) => filterKeys(GLOSSARY_KEYS, HELP_SEARCH_TERMS.glossary, query);

const filterTroubleshootingKeys = (query) =>
  filterKeys(TROUBLESHOOTING_KEYS, HELP_SEARCH_TERMS.troubleshooting, query);

const filterGuideKeys = (query) => filterKeys(GUIDE_KEYS, HELP_SEARCH_TERMS.guides, query);

export {
  GLOSSARY_KEYS,
  TROUBLESHOOTING_KEYS,
  GUIDE_KEYS,
  HELP_SEARCH_TERMS,
  normalizeSearch,
  filterGlossaryKeys,
  filterTroubleshootingKeys,
  filterGuideKeys,
};
