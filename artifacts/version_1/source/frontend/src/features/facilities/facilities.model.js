const asArray = (value) => (Array.isArray(value) ? value : []);
const asText = (value) => String(value || '').trim();
const asCount = (value) => Number(value || 0);

const normalizeFacilityCounts = (facility = {}) => {
  const source = facility._count || facility.counts || {};
  return {
    memberships: asCount(source.memberships),
    onboardingSelections: asCount(source.onboardingSelections),
    patients: asCount(source.patients),
    admissions: asCount(source.admissions),
    datasetCases: asCount(source.datasetCases),
    referenceRules: asCount(source.referenceRules),
    reviewActions: asCount(source.reviewActions),
    idempotencyRecords: asCount(source.idempotencyRecords),
    syncEvents: asCount(source.syncEvents),
    activeUserSettings: asCount(source.activeUserSettings),
  };
};

const normalizeFacility = (facility = {}) => ({
  id: asText(facility.id || facility.facilityId),
  name: asText(facility.name) || 'Unnamed facility',
  registryCode: facility.registryCode || null,
  district: facility.district || null,
  region: facility.region || null,
  type: facility.type || null,
  ownership: facility.ownership || null,
  verificationStatus: facility.verificationStatus || null,
  abgAvailability: facility.abgAvailability || null,
  oxygenProfileJson: facility.oxygenProfileJson || null,
  ventilatorProfileJson: facility.ventilatorProfileJson || null,
  counts: normalizeFacilityCounts(facility),
  createdAt: facility.createdAt || null,
  updatedAt: facility.updatedAt || null,
});

const normalizeFacilitiesResponse = (response = {}) => {
  const facilities = asArray(response.items || response.data).map(normalizeFacility);
  return {
    facilities,
    meta: {
      total: Number(response.meta?.total || facilities.length),
      page: Number(response.meta?.page || 1),
      limit: Number(response.meta?.limit || 20),
      hasNextPage: response.meta?.hasNextPage === true,
    },
  };
};

const normalizeAdminFacilitiesResponse = (response = {}) =>
  normalizeFacilitiesResponse({
    data: response.data || response.items || response.facilities || [],
    meta: response.meta || {},
  });

const normalizeFacilityResponse = (response = {}) =>
  normalizeFacility(response.facility || response.data?.facility || response.data || response);

export {
  normalizeAdminFacilitiesResponse,
  normalizeFacilitiesResponse,
  normalizeFacility,
  normalizeFacilityCounts,
  normalizeFacilityResponse,
};
