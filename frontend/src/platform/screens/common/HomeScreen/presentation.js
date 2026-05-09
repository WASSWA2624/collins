/**
 * HomeScreen presentation helpers
 * Shared visual metadata for web and native renderers.
 * File: presentation.js
 */

const ACTION_GLYPHS = Object.freeze({
  admit: '+',
  tracking: 'T',
  abgVentUpdate: 'ABG',
  datasetCapture: 'D',
  reviewQueue: 'R',
  dashboard: '#',
  settings: '*',
});

const STATUS_GLYPHS = Object.freeze({
  facility: 'F',
  network: 'N',
  activeAdmissions: 'A',
  drafts: 'D',
  syncAttention: '!',
  reviewNeeds: 'R',
});

const getFacilityMeta = (facility) =>
  [facility?.district, facility?.region, facility?.type].filter(Boolean).join(' / ');

export { ACTION_GLYPHS, STATUS_GLYPHS, getFacilityMeta };
