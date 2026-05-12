import { prisma } from '../../config/prisma.js';
import { MEMBERSHIP_ROLES } from '../../constants/roles.js';
import { assertFacilityRole, assertPlatformRole, FACILITY_ADMIN_ROLES, READ_ROLES } from '../../utils/authorization.js';
import { conflict, notFound } from '../../utils/errors.js';
import { writeAudit } from '../../utils/audit.js';
import { stripUndefined } from '../../utils/object.js';

const publicFacilitySelect = {
  id: true,
  registryCode: true,
  name: true,
  district: true,
  region: true,
  type: true,
  ownership: true,
  verificationStatus: true,
  createdAt: true,
  updatedAt: true,
};

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

const facilityDependencyLabels = Object.freeze({
  memberships: 'facility memberships',
  onboardingSelections: 'onboarding selections',
  patients: 'patients',
  admissions: 'admissions',
  datasetCases: 'dataset cases',
  referenceRules: 'reference rules',
  reviewActions: 'review actions',
  idempotencyRecords: 'idempotency records',
  syncEvents: 'sync events',
  activeUserSettings: 'active user settings',
});

const cleanNullableText = (value) => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const trimmed = String(value).trim();
  return trimmed || null;
};

const cleanFacilityPayload = (payload = {}) => stripUndefined({
  registryCode: cleanNullableText(payload.registryCode),
  name: payload.name === undefined ? undefined : String(payload.name).trim(),
  district: cleanNullableText(payload.district),
  region: cleanNullableText(payload.region),
  type: cleanNullableText(payload.type),
  ownership: cleanNullableText(payload.ownership),
  verificationStatus: payload.verificationStatus,
  oxygenProfileJson: payload.oxygenProfileJson,
  ventilatorProfileJson: payload.ventilatorProfileJson,
  abgAvailability: cleanNullableText(payload.abgAvailability),
});

const assertFacilityUnique = async (tx, payload, excludeId = null) => {
  if (payload.registryCode) {
    const existingRegistry = await tx.facility.findUnique({
      where: { registryCode: payload.registryCode },
      select: { id: true },
    });
    if (existingRegistry && existingRegistry.id !== excludeId) {
      throw conflict('A facility with this registry code already exists');
    }
  }

  if (payload.name) {
    const existingName = await tx.facility.findFirst({
      where: {
        name: payload.name,
        district: payload.district || null,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    });
    if (existingName) throw conflict('A facility with this name and district already exists');
  }
};

const getEffectiveFacilityValue = (data, before, key) =>
  (Object.prototype.hasOwnProperty.call(data, key) ? data[key] : before[key]);

const getBlockingFacilityDependencies = (counts = {}) => Object.entries(facilityDependencyLabels)
  .filter(([key]) => Number(counts[key] || 0) > 0)
  .map(([key, label]) => ({ key, label, count: counts[key] }));

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
      select: publicFacilitySelect,
      orderBy: { name: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.facility.count({ where }),
  ]);

  return { items, total, page, limit };
};

export const createFacility = async (payload, userId, auditContext = {}) => prisma.$transaction(async (tx) => {
  const data = cleanFacilityPayload({
    ...payload,
    verificationStatus: 'PENDING',
  });
  await assertFacilityUnique(tx, data);

  const facility = await tx.facility.create({ data, select: facilitySelect });

  if (userId) {
    const membership = await tx.facilityMembership.upsert({
      where: {
        userId_facilityId_role: {
          userId,
          facilityId: facility.id,
          role: MEMBERSHIP_ROLES.FACILITY_ADMIN,
        },
      },
      update: { status: 'APPROVED' },
      create: {
        userId,
        facilityId: facility.id,
        role: MEMBERSHIP_ROLES.FACILITY_ADMIN,
        status: 'APPROVED',
        approvedByUserId: userId,
      },
    });

    await writeAudit({
      tx,
      ...auditContext,
      userId,
      facilityId: facility.id,
      action: 'FACILITY_MEMBERSHIP_AUTO_APPROVE',
      entityType: 'FacilityMembership',
      entityId: membership.id,
      afterJson: {
        role: membership.role,
        status: membership.status,
        approvedByUserId: membership.approvedByUserId,
      },
    });
  }

  await writeAudit({
    tx,
    ...auditContext,
    userId,
    facilityId: facility.id,
    action: 'FACILITY_CREATE',
    entityType: 'Facility',
    entityId: facility.id,
    afterJson: facility,
  });

  return facility;
});

export const createAdminFacility = async (payload, userId, auditContext = {}) => {
  await assertPlatformRole(userId);
  return prisma.$transaction(async (tx) => {
    const data = cleanFacilityPayload({
      verificationStatus: 'VERIFIED',
      ...payload,
    });
    await assertFacilityUnique(tx, data);

    const facility = await tx.facility.create({ data, select: facilitySelect });
    await writeAudit({
      tx,
      ...auditContext,
      userId,
      facilityId: facility.id,
      action: 'ADMIN_FACILITY_CREATE',
      entityType: 'Facility',
      entityId: facility.id,
      afterJson: facility,
    });
    return facility;
  });
};

export const getFacilityById = async (id, userId) => {
  await assertFacilityRole(userId, id, READ_ROLES);
  const facility = await prisma.facility.findUnique({ where: { id }, select: facilitySelect });
  if (!facility) throw notFound('Facility not found');
  return facility;
};

export const updateEquipmentProfile = async (id, data, userId, auditContext = {}) => {
  await assertFacilityRole(userId, id, FACILITY_ADMIN_ROLES);
  return prisma.$transaction(async (tx) => {
    const before = await tx.facility.findUnique({ where: { id }, select: facilitySelect });
    if (!before) throw notFound('Facility not found');

    const facility = await tx.facility.update({ where: { id }, data, select: facilitySelect });
    await writeAudit({
      tx,
      ...auditContext,
      userId,
      facilityId: id,
      action: 'FACILITY_EQUIPMENT_UPDATE',
      entityType: 'Facility',
      entityId: id,
      beforeJson: before,
      afterJson: facility,
    });
    return facility;
  });
};

export const updateFacilityDetails = async (id, payload, userId, auditContext = {}) => {
  await assertPlatformRole(userId);
  return prisma.$transaction(async (tx) => {
    const before = await tx.facility.findUnique({ where: { id }, select: facilitySelect });
    if (!before) throw notFound('Facility not found');

    const data = cleanFacilityPayload(payload);
    await assertFacilityUnique(tx, {
      name: getEffectiveFacilityValue(data, before, 'name'),
      district: getEffectiveFacilityValue(data, before, 'district'),
      registryCode: getEffectiveFacilityValue(data, before, 'registryCode'),
    }, id);

    const facility = await tx.facility.update({
      where: { id },
      data,
      select: facilitySelect,
    });
    await writeAudit({
      tx,
      ...auditContext,
      userId,
      facilityId: id,
      action: 'ADMIN_FACILITY_UPDATE',
      entityType: 'Facility',
      entityId: id,
      beforeJson: before,
      afterJson: facility,
      reason: payload.reason,
    });
    return facility;
  });
};

export const deleteFacility = async (id, userId, auditContext = {}) => {
  await assertPlatformRole(userId);
  return prisma.$transaction(async (tx) => {
    const facility = await tx.facility.findUnique({
      where: { id },
      select: {
        ...facilitySelect,
        _count: {
          select: {
            memberships: true,
            onboardingSelections: true,
            patients: true,
            admissions: true,
            datasetCases: true,
            referenceRules: true,
            reviewActions: true,
            idempotencyRecords: true,
            syncEvents: true,
            activeUserSettings: true,
          },
        },
      },
    });
    if (!facility) throw notFound('Facility not found');

    const blockingDependencies = getBlockingFacilityDependencies(facility._count);
    if (blockingDependencies.length > 0) {
      throw conflict(
        'Facility cannot be deleted while it is linked to users or operational data',
        blockingDependencies,
        { dependencies: blockingDependencies }
      );
    }

    await tx.facilitySettings.deleteMany({ where: { facilityId: id } });
    await tx.auditLog.updateMany({ where: { facilityId: id }, data: { facilityId: null } });
    await tx.facility.delete({ where: { id } });

    await writeAudit({
      tx,
      ...auditContext,
      userId,
      action: 'ADMIN_FACILITY_DELETE',
      entityType: 'Facility',
      entityId: id,
      beforeJson: facility,
    });

    return facility;
  });
};

export const requestFacilityVerification = async (id, userId, auditContext = {}) => {
  await assertFacilityRole(userId, id, FACILITY_ADMIN_ROLES);
  return prisma.$transaction(async (tx) => {
    const facility = await tx.facility.update({
      where: { id },
      data: { verificationStatus: 'PENDING' },
      select: facilitySelect,
    });
    await writeAudit({
      tx,
      ...auditContext,
      userId,
      facilityId: id,
      action: 'FACILITY_VERIFICATION_REQUEST',
      entityType: 'Facility',
      entityId: id,
      afterJson: facility,
    });
    return facility;
  });
};

export const decideFacilityVerification = async (id, { verificationStatus, reason }, userId, auditContext = {}) => {
  await assertPlatformRole(userId);
  return prisma.$transaction(async (tx) => {
    const before = await tx.facility.findUnique({ where: { id }, select: facilitySelect });
    if (!before) throw notFound('Facility not found');

    const facility = await tx.facility.update({
      where: { id },
      data: { verificationStatus },
      select: facilitySelect,
    });

    await writeAudit({
      tx,
      ...auditContext,
      userId,
      facilityId: id,
      action: 'FACILITY_VERIFICATION_DECISION',
      entityType: 'Facility',
      entityId: id,
      beforeJson: before,
      afterJson: facility,
      reason,
    });
    return facility;
  });
};

export const requestMembership = async ({ facilityId, userId, role }, auditContext = {}) => prisma.$transaction(async (tx) => {
  const facility = await tx.facility.findUnique({ where: { id: facilityId }, select: { id: true } });
  if (!facility) throw notFound('Facility not found');

  const existing = await tx.facilityMembership.findUnique({
    where: { userId_facilityId_role: { userId, facilityId, role } },
  });
  if (existing && existing.status !== 'REJECTED') {
    throw conflict('A membership request for this role already exists');
  }

  const membership = existing
    ? await tx.facilityMembership.update({
      where: { id: existing.id },
      data: { status: 'PENDING', approvedByUserId: null },
      include: { facility: true },
    })
    : await tx.facilityMembership.create({
      data: { facilityId, userId, role, status: 'PENDING' },
      include: { facility: true },
    });

  await writeAudit({
    tx,
    ...auditContext,
    userId,
    facilityId,
    action: 'FACILITY_MEMBERSHIP_REQUEST',
    entityType: 'FacilityMembership',
    entityId: membership.id,
    afterJson: { role, status: membership.status },
  });

  return membership;
});

export const updateMembershipDecision = async (facilityId, membershipId, data, userId, auditContext = {}) => {
  await assertFacilityRole(userId, facilityId, FACILITY_ADMIN_ROLES);
  return prisma.$transaction(async (tx) => {
    const before = await tx.facilityMembership.findFirst({
      where: { id: membershipId, facilityId },
      include: { user: { select: { id: true, name: true, email: true } }, facility: true },
    });
    if (!before) throw notFound('Membership not found');

    const membership = await tx.facilityMembership.update({
      where: { id: membershipId },
      data: {
        status: data.status,
        ...(data.role ? { role: data.role } : {}),
        approvedByUserId: data.status === 'APPROVED' ? userId : null,
      },
      include: { user: { select: { id: true, name: true, email: true } }, facility: true },
    });

    await writeAudit({
      tx,
      ...auditContext,
      userId,
      facilityId,
      action: 'FACILITY_MEMBERSHIP_DECISION',
      entityType: 'FacilityMembership',
      entityId: membership.id,
      beforeJson: { role: before.role, status: before.status },
      afterJson: { role: membership.role, status: membership.status },
    });

    return membership;
  });
};

export const getMyFacilities = (userId) => prisma.facilityMembership.findMany({
  where: { userId },
  include: { facility: true },
  orderBy: { createdAt: 'desc' },
});
