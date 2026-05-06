import { MEMBERSHIP_ROLES, PERMISSIONS, hasAnyPermission, hasAnyRole } from '@config/accessControl';

const APPROVED_STATUS = 'APPROVED';

const USER_MANAGEMENT_ROLES = Object.freeze([
  MEMBERSHIP_ROLES.PLATFORM_ADMIN,
  MEMBERSHIP_ROLES.FACILITY_ADMIN,
]);

const CAPTURE_ROLES = Object.freeze([
  MEMBERSHIP_ROLES.PLATFORM_ADMIN,
  MEMBERSHIP_ROLES.FACILITY_ADMIN,
  MEMBERSHIP_ROLES.CLINICIAN,
  MEMBERSHIP_ROLES.ICU_NURSE,
  MEMBERSHIP_ROLES.SPECIALIST_REVIEWER,
]);

const VALIDATE_ROLES = Object.freeze([
  MEMBERSHIP_ROLES.PLATFORM_ADMIN,
  MEMBERSHIP_ROLES.FACILITY_ADMIN,
  MEMBERSHIP_ROLES.SPECIALIST_REVIEWER,
  MEMBERSHIP_ROLES.RESEARCH_GOVERNANCE_OFFICER,
]);

const ROLE_OPTIONS = Object.freeze([
  { value: MEMBERSHIP_ROLES.CLINICIAN, label: 'Clinician', capture: true, validate: false },
  { value: MEMBERSHIP_ROLES.ICU_NURSE, label: 'ICU nurse', capture: true, validate: false },
  { value: MEMBERSHIP_ROLES.SPECIALIST_REVIEWER, label: 'Capture and validate', capture: true, validate: true },
  { value: MEMBERSHIP_ROLES.FACILITY_ADMIN, label: 'Facility administrator', capture: true, validate: true, admin: true },
  { value: MEMBERSHIP_ROLES.RESEARCH_GOVERNANCE_OFFICER, label: 'Dataset validator', capture: false, validate: true },
  { value: MEMBERSHIP_ROLES.MODEL_GOVERNANCE_OFFICER, label: 'Model governance', capture: false, validate: false },
  { value: MEMBERSHIP_ROLES.READ_ONLY_REVIEWER, label: 'Read-only reviewer', capture: false, validate: false },
  { value: MEMBERSHIP_ROLES.PLATFORM_ADMIN, label: 'Platform administrator', capture: true, validate: true, admin: true },
]);

const ROLE_LABELS = Object.freeze(Object.fromEntries(ROLE_OPTIONS.map((option) => [option.value, option.label])));

const asArray = (value) => (Array.isArray(value) ? value : []);
const asText = (value) => String(value || '').trim();
const unique = (values) => [...new Set(values.filter(Boolean))];

const normalizeFacility = (facility = {}) => ({
  id: asText(facility.id || facility.facilityId),
  name: asText(facility.name) || 'Unnamed facility',
  registryCode: facility.registryCode || null,
  district: facility.district || null,
  region: facility.region || null,
  verificationStatus: facility.verificationStatus || null,
});

const normalizeMembership = (membership = {}) => {
  const role = asText(membership.role).toUpperCase();
  return {
    id: asText(membership.id),
    facilityId: asText(membership.facilityId || membership.facility?.id),
    role,
    roleLabel: ROLE_LABELS[role] || role,
    status: asText(membership.status).toUpperCase() || 'PENDING',
    permissions: asArray(membership.permissions),
    approvedByUserId: membership.approvedByUserId || null,
    approvedBy: membership.approvedBy || null,
    facility: normalizeFacility(membership.facility),
    createdAt: membership.createdAt || null,
    updatedAt: membership.updatedAt || null,
  };
};

const deriveCapabilities = (memberships = [], provided = {}) => {
  const approvedRoles = unique(
    memberships
      .filter((membership) => membership.status === APPROVED_STATUS)
      .map((membership) => membership.role)
  );
  return {
    canCaptureData: provided.canCaptureData ?? approvedRoles.some((role) => CAPTURE_ROLES.includes(role)),
    canValidateData: provided.canValidateData ?? approvedRoles.some((role) => VALIDATE_ROLES.includes(role)),
    canManageUsers: provided.canManageUsers ?? approvedRoles.some((role) => USER_MANAGEMENT_ROLES.includes(role)),
  };
};

const normalizeManagedUser = (user = {}) => {
  const memberships = asArray(user.memberships || user.facilityMemberships).map(normalizeMembership);
  return {
    id: asText(user.id),
    name: asText(user.name) || 'Unnamed user',
    email: asText(user.email),
    phone: user.phone || null,
    status: asText(user.status).toUpperCase() || 'ACTIVE',
    memberships,
    capabilities: deriveCapabilities(memberships, user.capabilities || {}),
    createdAt: user.createdAt || null,
    updatedAt: user.updatedAt || null,
  };
};

const normalizeManagedUsersResponse = (response = {}) => ({
  users: asArray(response.items || response.data).map(normalizeManagedUser),
  meta: {
    total: Number(response.meta?.total || 0),
    page: Number(response.meta?.page || 1),
    limit: Number(response.meta?.limit || 20),
    hasNextPage: response.meta?.hasNextPage === true,
  },
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

const buildUserManagementSummary = (users = []) => {
  const list = asArray(users);
  return {
    total: list.length,
    clinicians: list.filter((user) => user.capabilities.canCaptureData).length,
    validators: list.filter((user) => user.capabilities.canValidateData).length,
    administrators: list.filter((user) => user.capabilities.canManageUsers).length,
  };
};

const canManageUsers = (user = {}) => {
  const roles = [
    ...asArray(user.roles),
    ...asArray(user.roleKeys),
    ...asArray(user.activeFacility?.roles),
    ...asArray(user.memberships).map((membership) => membership?.role),
  ];
  const permissions = [
    ...asArray(user.permissions),
    ...asArray(user.activeFacility?.permissions),
    ...asArray(user.memberships).flatMap((membership) => asArray(membership?.permissions)),
  ];
  return (
    hasAnyRole(roles, USER_MANAGEMENT_ROLES) ||
    hasAnyPermission(permissions, [PERMISSIONS.FACILITY_ADMIN])
  );
};

const getRoleLabel = (role) => ROLE_LABELS[asText(role).toUpperCase()] || asText(role);

export {
  APPROVED_STATUS,
  CAPTURE_ROLES,
  ROLE_OPTIONS,
  USER_MANAGEMENT_ROLES,
  VALIDATE_ROLES,
  buildUserManagementSummary,
  canManageUsers,
  getRoleLabel,
  normalizeFacilitiesResponse,
  normalizeManagedUser,
  normalizeManagedUsersResponse,
};
