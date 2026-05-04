import { prisma } from '../config/prisma.js';
import { MEMBERSHIP_ROLES } from '../constants/roles.js';
import { forbidden, notFound, unauthorized } from './errors.js';

export const READ_ROLES = Object.freeze([
  MEMBERSHIP_ROLES.PLATFORM_ADMIN,
  MEMBERSHIP_ROLES.FACILITY_ADMIN,
  MEMBERSHIP_ROLES.CLINICIAN,
  MEMBERSHIP_ROLES.ICU_NURSE,
  MEMBERSHIP_ROLES.SPECIALIST_REVIEWER,
  MEMBERSHIP_ROLES.RESEARCH_GOVERNANCE_OFFICER,
  MEMBERSHIP_ROLES.READ_ONLY_REVIEWER,
]);

export const WRITE_ROLES = Object.freeze([
  MEMBERSHIP_ROLES.FACILITY_ADMIN,
  MEMBERSHIP_ROLES.CLINICIAN,
  MEMBERSHIP_ROLES.ICU_NURSE,
  MEMBERSHIP_ROLES.SPECIALIST_REVIEWER,
]);

export const REVIEW_ROLES = Object.freeze([
  MEMBERSHIP_ROLES.PLATFORM_ADMIN,
  MEMBERSHIP_ROLES.FACILITY_ADMIN,
  MEMBERSHIP_ROLES.SPECIALIST_REVIEWER,
  MEMBERSHIP_ROLES.RESEARCH_GOVERNANCE_OFFICER,
]);

export const DATASET_EXPORT_ROLES = Object.freeze([
  MEMBERSHIP_ROLES.PLATFORM_ADMIN,
  MEMBERSHIP_ROLES.RESEARCH_GOVERNANCE_OFFICER,
]);

export const FACILITY_ADMIN_ROLES = Object.freeze([
  MEMBERSHIP_ROLES.PLATFORM_ADMIN,
  MEMBERSHIP_ROLES.FACILITY_ADMIN,
]);

export const PLATFORM_ADMIN_ROLES = Object.freeze([MEMBERSHIP_ROLES.PLATFORM_ADMIN]);

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

export const assertPlatformRole = async (userId) => {
  if (!(await hasPlatformRole(userId))) throw forbidden('Platform administrator permission is required');
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

  if (await hasPlatformRole(userId)) return undefined;

  const memberships = await getApprovedMemberships(userId);
  const scoped = memberships.filter((membership) => allowedRoles.includes(membership.role));
  const uniqueFacilityIds = [...new Set(scoped.map((membership) => membership.facilityId))];

  if (uniqueFacilityIds.length === 1) return uniqueFacilityIds[0];
  throw forbidden('facilityId is required when the user has zero or multiple active facilities');
};

export const assertAdmissionAccess = async (userId, admissionId, allowedRoles = READ_ROLES) => {
  requireUserId(userId);
  const admission = await prisma.admission.findUnique({
    where: { id: admissionId },
    select: { id: true, facilityId: true, reviewStatus: true, status: true },
  });

  if (!admission) throw notFound('Admission not found');
  await assertFacilityRole(userId, admission.facilityId, allowedRoles);
  return admission;
};
