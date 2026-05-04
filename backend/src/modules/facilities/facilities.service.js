import { prisma } from '../../config/prisma.js';

const facilitySelect = {
  id: true,
  registryCode: true,
  name: true,
  district: true,
  region: true,
  type: true,
  ownership: true,
  verificationStatus: true,
  oxygenProfileJson: true,
  ventilatorProfileJson: true,
  abgAvailability: true,
  createdAt: true,
  updatedAt: true,
};

export const searchFacilities = async ({ q, district, region, verificationStatus, page, limit }) => {
  const where = {
    ...(verificationStatus ? { verificationStatus } : {}),
    ...(district ? { district: { contains: district } } : {}),
    ...(region ? { region: { contains: region } } : {}),
    ...(q ? {
      OR: [
        { name: { contains: q } },
        { registryCode: { contains: q } },
        { district: { contains: q } },
        { region: { contains: q } },
      ],
    } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.facility.findMany({
      where,
      select: facilitySelect,
      orderBy: { name: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.facility.count({ where }),
  ]);

  return { items, total, page, limit };
};

export const createFacility = (data) => prisma.facility.create({
  data,
  select: facilitySelect,
});

export const getFacilityById = async (id) => {
  const facility = await prisma.facility.findUnique({ where: { id }, select: facilitySelect });
  if (!facility) {
    const error = new Error('Facility not found');
    error.status = 404;
    throw error;
  }
  return facility;
};

export const updateEquipmentProfile = (id, data) => prisma.facility.update({
  where: { id },
  data,
  select: facilitySelect,
});

export const requestFacilityVerification = (id) => prisma.facility.update({
  where: { id },
  data: { verificationStatus: 'PENDING' },
  select: facilitySelect,
});

export const requestMembership = ({ facilityId, userId, role }) => prisma.facilityMembership.create({
  data: {
    facilityId,
    userId,
    role,
    status: 'PENDING',
  },
});

export const getMyFacilities = (userId) => prisma.facilityMembership.findMany({
  where: { userId },
  include: { facility: true },
  orderBy: { createdAt: 'desc' },
});
