import { prisma } from '../config/prisma.js';
import {
  CLINICAL_WRITE_ROLES,
  DATASET_GOVERNANCE_ROLES,
  FACILITY_ADMIN_ROLES,
  MEMBERSHIP_ROLES,
  MODEL_GOVERNANCE_ROLES,
  PLATFORM_ADMIN_ROLES,
  READ_ROLES,
  REVIEW_ROLES,
} from '../constants/roles.js';
import { forbidden, notFound, unauthorized } from './errors.js';

export {
  DATASET_GOVERNANCE_ROLES,
  FACILITY_ADMIN_ROLES,
  MODEL_GOVERNANCE_ROLES,
  PLATFORM_ADMIN_ROLES,
  READ_ROLES,
  REVIEW_ROLES,
};

export const WRITE_ROLES = CLINICAL_WRITE_ROLES;
export const DATASET_EXPORT_ROLES = DATASET_GOVERNANCE_ROLES;

const getApprovedMemberships = (userId) => prisma.facilityMembership.findMany({
  where: { userId, status: 'APPROVED' },
  include: { facility: true },
});

export const requireUserId = (userId) => {
  if (!userId) throw unauthorized();
  return userId;
};

export const hasPlatformRole = async (userId) => {
  requireUserId(userId);
  const count = await prisma.facilityMembership.count({
    where: { userId, status: 'APPROVED', role: MEMBERSHIP_ROLES.PLATFORM_ADMIN },
  });
  return count > 0;
};

export const hasAnyApprovedRole = async (userId, allowedRoles) => {
  requireUserId(userId);
  const roles = [...new Set(allowedRoles || [])];
  if (roles.length === 0) return false;

  const count = await prisma.facilityMembership.count({
    where: { userId, status: 'APPROVED', role: { in: roles } },
  });
  return count > 0;
};

export const assertPlatformRole = async (userId) => {
  if (!(await hasPlatformRole(userId))) throw forbidden('Platform administrator permission is required');
};

export const assertAnyApprovedRole = async (
  userId,
  allowedRoles,
  message = 'Required role permission is missing'
) => {
  if (!(await hasAnyApprovedRole(userId, allowedRoles))) throw forbidden(message);
};

export const assertFacilityRole = async (userId, facilityId, allowedRoles = READ_ROLES) => {
  requireUserId(userId);
  if (!facilityId) throw forbidden('Facility scope is required');

  if (allowedRoles.includes(MEMBERSHIP_ROLES.PLATFORM_ADMIN) && await hasPlatformRole(userId)) {
    return { role: MEMBERSHIP_ROLES.PLATFORM_ADMIN, facilityId };
  }

  const membership = await prisma.facilityMembership.findFirst({
    where: {
      userId,
      facilityId,
      status: 'APPROVED',
      role: { in: allowedRoles.filter((role) => role !== MEMBERSHIP_ROLES.PLATFORM_ADMIN) },
    },
  });

  if (!membership) throw forbidden('You do not have permission for this facility');
  return membership;
};

export const resolveFacilityScope = async (userId, requestedFacilityId = undefined, allowedRoles = READ_ROLES) => {
  requireUserId(userId);
  if (requestedFacilityId) {
    await assertFacilityRole(userId, requestedFacilityId, allowedRoles);
    return requestedFacilityId;
  }

  if (allowedRoles.includes(MEMBERSHIP_ROLES.PLATFORM_ADMIN) && await hasPlatformRole(userId)) return undefined;

  const memberships = await getApprovedMemberships(userId);
  const scoped = memberships.filter((membership) => allowedRoles.includes(membership.role));
  const uniqueFacilityIds = [...new Set(scoped.map((membership) => membership.facilityId))];

  if (uniqueFacilityIds.length === 1) return uniqueFacilityIds[0];
  throw forbidden('facilityId is required when the user has zero or multiple active facilities');
};

export const assertAdmissionAccess = async (userId, admissionId, allowedRoles = READ_ROLES) => {
  requireUserId(userId);
  let admission = await prisma.admission.findUnique({
    where: { id: admissionId },
    select: { id: true, facilityId: true, reviewStatus: true, status: true },
  });

  if (!admission) {
    const isPlatformScoped = allowedRoles.includes(MEMBERSHIP_ROLES.PLATFORM_ADMIN) && await hasPlatformRole(userId);
    const memberships = isPlatformScoped ? [] : await getApprovedMemberships(userId);
    const allowedFacilityIds = memberships
      .filter((membership) => allowedRoles.includes(membership.role))
      .map((membership) => membership.facilityId);

    if (isPlatformScoped || allowedFacilityIds.length > 0) {
      admission = await prisma.admission.findFirst({
        where: {
          clientRecordId: admissionId,
          ...(!isPlatformScoped ? { facilityId: { in: allowedFacilityIds } } : {}),
        },
        select: { id: true, facilityId: true, reviewStatus: true, status: true },
        orderBy: { createdAt: 'desc' },
      });
    }
  }

  if (!admission) throw notFound('Admission not found');
  await assertFacilityRole(userId, admission.facilityId, allowedRoles);
  return admission;
};
