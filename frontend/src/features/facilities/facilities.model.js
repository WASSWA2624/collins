const asArray = (value) => (Array.isArray(value) ? value : []);
const asText = (value) => String(value || '').trim();

const normalizeFacility = (facility = {}) => ({
  id: asText(facility.id || facility.facilityId),
  name: asText(facility.name) || 'Unnamed facility',
  registryCode: facility.registryCode || null,
  district: facility.district || null,
  region: facility.region || null,
  type: facility.type || null,
  ownership: facility.ownership || null,
  verificationStatus: facility.verificationStatus || null,
});

const normalizeFacilitiesResponse = (response = {}) => ({
  facilities: asArray(response.items || response.data).map(normalizeFacility),
  meta: {
    total: Number(response.meta?.total || 0),
    page: Number(response.meta?.page || 1),
    limit: Number(response.meta?.limit || 20),
    hasNextPage: response.meta?.hasNextPage === true,
  },
});

export {
  normalizeFacilitiesResponse,
  normalizeFacility,
};
