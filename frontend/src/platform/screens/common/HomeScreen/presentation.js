/**
 * HomeScreen presentation helpers
 * Shared visual metadata for web and native renderers.
 * File: presentation.js
 */

const ACTION_GLYPHS = Object.freeze({
  newPatient: '+',
  tracking: 'T',
  currentReadings: 'ABG',
  datasetCapture: 'D',
  reviewQueue: 'R',
  dashboard: '#',
  userManagement: 'UM',
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

const getFacilitySearchText = (facility) => [
  facility?.name,
  facility?.registryCode,
  facility?.district,
  facility?.region,
  facility?.type,
  facility?.ownership,
  facility?.verificationStatus,
].filter(Boolean);

const uniqueFacilities = (facilities = [], activeFacility = null) => {
  const byId = new Map();
  [activeFacility, ...facilities].filter(Boolean).forEach((facility) => {
    if (facility?.id && !byId.has(facility.id)) {
      byId.set(facility.id, facility);
    }
  });
  return Array.from(byId.values());
};

const getFacilitySelectOptions = (facilities = [], activeFacility = null) =>
  uniqueFacilities(facilities, activeFacility).map((facility) => ({
    label: facility.name,
    value: facility.id,
    icon: 'F',
    searchText: getFacilitySearchText(facility),
    facility,
  }));

const findFacilityById = (facilities = [], facilityId, activeFacility = null) => {
  if (!facilityId) return activeFacility || null;
  return uniqueFacilities(facilities, activeFacility).find((facility) => facility.id === facilityId) || null;
};

export {
  ACTION_GLYPHS,
  STATUS_GLYPHS,
  findFacilityById,
  getFacilityMeta,
  getFacilitySelectOptions,
};
