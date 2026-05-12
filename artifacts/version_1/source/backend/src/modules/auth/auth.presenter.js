import { MEMBERSHIP_ROLES, getPermissionsForRoles } from '../../constants/roles.js';
import { forbidden } from '../../utils/errors.js';

const unique = (values) => [...new Set(values.filter(Boolean))];

const serializeFacility = (facility) => {
  if (!facility) return null;
  return {
    id: facility.id,
    name: facility.name,
    registryCode: facility.registryCode,
    district: facility.district,
    region: facility.region,
    verificationStatus: facility.verificationStatus,
  };
};

export const resolveRequestedFacilityId = ({ activeFacilityId, facilityId } = {}) =>
  activeFacilityId || facilityId || null;

export const serializeMembership = (membership) => ({
  id: membership.id,
  facilityId: membership.facilityId,
  role: membership.role,
  status: membership.status,
  permissions: getPermissionsForRoles([membership.role]),
  facility: serializeFacility(membership.facility),
});

export const buildRoleSummaries = (memberships = []) => {
  const summaries = new Map();

  memberships.forEach((membership) => {
    if (!membership.role) return;
    const existing = summaries.get(membership.role) || {
      role: membership.role,
      facilityIds: new Set(),
      facilityCount: 0,
      permissions: getPermissionsForRoles([membership.role]),
    };

    if (membership.facilityId) existing.facilityIds.add(membership.facilityId);
    summaries.set(membership.role, existing);
  });

  return [...summaries.values()].map((summary) => ({
    ...summary,
    facilityIds: [...summary.facilityIds],
    facilityCount: summary.facilityIds.size,
  }));
};

export const resolveActiveFacilityContext = (memberships = [], requestedFacilityId = null) => {
  if (!memberships.length) {
    if (requestedFacilityId) throw forbidden('You do not have access to the requested facility');
    return null;
  }

  const facilityIds = unique(memberships.map((membership) => membership.facilityId));
  const hasPlatformRole = memberships.some((membership) => membership.role === MEMBERSHIP_ROLES.PLATFORM_ADMIN);
  const activeFacilityId = requestedFacilityId || (
    facilityIds.length === 1 || !hasPlatformRole ? facilityIds[0] : null
  );
  if (!activeFacilityId) return null;

  const activeMemberships = memberships.filter((membership) => membership.facilityId === activeFacilityId);
  if (!activeMemberships.length) throw forbidden('You do not have access to the requested facility');

  const roles = unique(activeMemberships.map((membership) => membership.role));
  const permissions = getPermissionsForRoles(roles);
  const facility = activeMemberships[0].facility || { id: activeFacilityId };

  return {
    ...facility,
    id: activeFacilityId,
    facilityId: activeFacilityId,
    roles,
    permissions,
    membershipIds: activeMemberships.map((membership) => membership.id),
  };
};

export const buildAuthContext = ({ user, memberships = [], requestedFacilityId = null }) => {
  const serializedMemberships = memberships.map(serializeMembership);
  const roles = unique(serializedMemberships.map((membership) => membership.role));
  const permissions = getPermissionsForRoles(roles);
  const roleSummaries = buildRoleSummaries(serializedMemberships);
  const activeFacility = resolveActiveFacilityContext(serializedMemberships, requestedFacilityId);
  const enrichedUser = {
    ...user,
    roles,
    permissions,
    roleSummaries,
    activeFacility,
    memberships: serializedMemberships,
  };

  return {
    user: enrichedUser,
    memberships: serializedMemberships,
    roles,
    permissions,
    roleSummaries,
    activeFacility,
  };
};
