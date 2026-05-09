import { readFileSync } from 'node:fs';

export const CORE_ADMIN_EMAIL = 'admin@admin.com';
export const CORE_CLINICIAN_EMAIL = 'clinician@clinician.com';
export const CORE_ADMIN_FACILITY_REGISTRY_CODE = 'ug-hospital-098';

const facilitiesDataUrl = new URL('./data/uganda-facilities.json', import.meta.url);

const asText = (value) => String(value || '').trim();

const normalizeSeedFacility = (facility) => ({
  registryCode: asText(facility.id),
  name: asText(facility.name),
  district: asText(facility.district) || null,
  region: asText(facility.region) || null,
  type: asText(facility.type) || null,
  ownership: asText(facility.ownership) || null,
  verificationStatus: 'VERIFIED',
});

export const loadUgandaFacilitySeedData = () =>
  JSON.parse(readFileSync(facilitiesDataUrl, 'utf8')).map(normalizeSeedFacility);

export const seedUgandaFacilities = async (prisma) => {
  const facilities = loadUgandaFacilitySeedData();
  const summary = { created: 0, updated: 0, total: facilities.length };

  for (const facility of facilities) {
    const existing =
      (await prisma.facility.findUnique({
        where: { registryCode: facility.registryCode },
        select: { id: true },
      })) ||
      (await prisma.facility.findFirst({
        where: {
          name: facility.name,
          ...(facility.district ? { district: facility.district } : {}),
        },
        select: { id: true },
      }));

    if (existing) {
      await prisma.facility.update({
        where: { id: existing.id },
        data: facility,
      });
      summary.updated += 1;
    } else {
      await prisma.facility.create({ data: facility });
      summary.created += 1;
    }
  }

  return summary;
};

export const getCoreAdminFacility = async (prisma) => {
  const facility = await prisma.facility.findUnique({
    where: { registryCode: CORE_ADMIN_FACILITY_REGISTRY_CODE },
  });
  if (facility) return facility;

  return prisma.facility.findFirst({
    where: { name: 'International Hospital Kampala' },
  });
};
