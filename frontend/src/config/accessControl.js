/**
 * Frontend access-control helpers.
 * UI visibility only; backend RBAC and facility isolation remain authoritative.
 */

export const MEMBERSHIP_ROLES = Object.freeze({
  PLATFORM_ADMIN: 'PLATFORM_ADMIN',
  FACILITY_ADMIN: 'FACILITY_ADMIN',
  CLINICIAN: 'CLINICIAN',
  ICU_NURSE: 'ICU_NURSE',
  SPECIALIST_REVIEWER: 'SPECIALIST_REVIEWER',
  RESEARCH_GOVERNANCE_OFFICER: 'RESEARCH_GOVERNANCE_OFFICER',
  MODEL_GOVERNANCE_OFFICER: 'MODEL_GOVERNANCE_OFFICER',
  READ_ONLY_REVIEWER: 'READ_ONLY_REVIEWER',
});

export const PERMISSIONS = Object.freeze({
  FACILITY_VERIFY: 'facility:verify',
  FACILITY_ADMIN: 'facility:admin',
  CLINICAL_READ: 'clinical:read',
  CLINICAL_WRITE: 'clinical:write',
  REVIEW_WRITE: 'review:write',
  DATASET_EXPORT: 'dataset:export',
  MODEL_GOVERN: 'model:govern',
  AUDIT_READ: 'audit:read',
});

export const ROLE_PERMISSIONS = Object.freeze({
  [MEMBERSHIP_ROLES.PLATFORM_ADMIN]: Object.freeze([
    PERMISSIONS.FACILITY_VERIFY,
    PERMISSIONS.FACILITY_ADMIN,
    PERMISSIONS.CLINICAL_READ,
    PERMISSIONS.CLINICAL_WRITE,
    PERMISSIONS.REVIEW_WRITE,
    PERMISSIONS.DATASET_EXPORT,
    PERMISSIONS.MODEL_GOVERN,
    PERMISSIONS.AUDIT_READ,
  ]),
  [MEMBERSHIP_ROLES.FACILITY_ADMIN]: Object.freeze([
    PERMISSIONS.FACILITY_ADMIN,
    PERMISSIONS.CLINICAL_READ,
    PERMISSIONS.CLINICAL_WRITE,
    PERMISSIONS.REVIEW_WRITE,
    PERMISSIONS.AUDIT_READ,
  ]),
  [MEMBERSHIP_ROLES.CLINICIAN]: Object.freeze([
    PERMISSIONS.CLINICAL_READ,
    PERMISSIONS.CLINICAL_WRITE,
  ]),
  [MEMBERSHIP_ROLES.ICU_NURSE]: Object.freeze([
    PERMISSIONS.CLINICAL_READ,
    PERMISSIONS.CLINICAL_WRITE,
  ]),
  [MEMBERSHIP_ROLES.SPECIALIST_REVIEWER]: Object.freeze([
    PERMISSIONS.CLINICAL_READ,
    PERMISSIONS.CLINICAL_WRITE,
    PERMISSIONS.REVIEW_WRITE,
  ]),
  [MEMBERSHIP_ROLES.RESEARCH_GOVERNANCE_OFFICER]: Object.freeze([
    PERMISSIONS.CLINICAL_READ,
    PERMISSIONS.REVIEW_WRITE,
    PERMISSIONS.DATASET_EXPORT,
  ]),
  [MEMBERSHIP_ROLES.MODEL_GOVERNANCE_OFFICER]: Object.freeze([
    PERMISSIONS.CLINICAL_READ,
    PERMISSIONS.MODEL_GOVERN,
  ]),
  [MEMBERSHIP_ROLES.READ_ONLY_REVIEWER]: Object.freeze([PERMISSIONS.CLINICAL_READ]),
});

const ROLE_ALIASES = Object.freeze({
  ADMIN: MEMBERSHIP_ROLES.FACILITY_ADMIN,
  SUPER_ADMIN: MEMBERSHIP_ROLES.PLATFORM_ADMIN,
  USER: MEMBERSHIP_ROLES.CLINICIAN,
  REVIEWER: MEMBERSHIP_ROLES.SPECIALIST_REVIEWER,
  DATASET_GOVERNANCE: MEMBERSHIP_ROLES.RESEARCH_GOVERNANCE_OFFICER,
  GOVERNANCE: MEMBERSHIP_ROLES.RESEARCH_GOVERNANCE_OFFICER,
  MODEL_GOVERNANCE: MEMBERSHIP_ROLES.MODEL_GOVERNANCE_OFFICER,
});

const APPROVED_STATUS = 'APPROVED';

const unique = (values) => [...new Set(values.filter(Boolean))];

export const normalizeRoleKey = (role) => {
  if (role == null) return null;
  const normalized = String(role)
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase();
  if (!normalized) return null;
  return ROLE_ALIASES[normalized] || normalized;
};

export const normalizeRoleSlug = (role) => {
  const key = normalizeRoleKey(role);
  return key ? key.toLowerCase() : null;
};

export const normalizePermission = (permission) => {
  if (permission == null) return null;
  const normalized = String(permission).trim().toLowerCase();
  return normalized || null;
};

export const normalizeRoleKeys = (roles) => {
  const list = Array.isArray(roles) ? roles : [roles];
  return unique(list.map(normalizeRoleKey));
};

export const normalizeRoleSlugs = (roles) => normalizeRoleKeys(roles).map((role) => role.toLowerCase());

export const getPermissionsForRoleKeys = (roles = []) =>
  unique(normalizeRoleKeys(roles).flatMap((role) => ROLE_PERMISSIONS[role] || [])).sort();

export const normalizePermissions = (permissions = []) => {
  const list = Array.isArray(permissions) ? permissions : [permissions];
  return unique(list.map(normalizePermission)).sort();
};

export const normalizeMembership = (membership) => {
  if (!membership || typeof membership !== 'object') return null;
  const role = normalizeRoleKey(membership.role);
  const status = membership.status ? String(membership.status).trim().toUpperCase() : APPROVED_STATUS;
  const facilityId = membership.facilityId || membership.facility_id || membership.facility?.id || null;
  if (!role || !facilityId) return null;
  return {
    ...membership,
    role,
    status,
    facilityId,
    permissions: normalizePermissions(membership.permissions?.length ? membership.permissions : getPermissionsForRoleKeys([role])),
  };
};

export const getApprovedMemberships = (user) => {
  const memberships = Array.isArray(user?.memberships) ? user.memberships : [];
  return memberships
    .map(normalizeMembership)
    .filter((membership) => membership?.status === APPROVED_STATUS);
};

export const getRoleKeysForUser = (user) => {
  const directRoles = normalizeRoleKeys(user?.roles || user?.role || []);
  const membershipRoles = getApprovedMemberships(user).map((membership) => membership.role);
  return unique([...directRoles, ...membershipRoles]);
};

export const getPermissionsForUser = (user) => {
  const directPermissions = normalizePermissions(user?.permissions || []);
  const rolePermissions = getPermissionsForRoleKeys(getRoleKeysForUser(user));
  return unique([...directPermissions, ...rolePermissions]).sort();
};

export const getFacilityOptionsForUser = (user) => {
  const byFacility = new Map();
  getApprovedMemberships(user).forEach((membership) => {
    const existing = byFacility.get(membership.facilityId) || {
      id: membership.facilityId,
      facilityId: membership.facilityId,
      facility: membership.facility || { id: membership.facilityId },
      roles: [],
      permissions: [],
      membershipIds: [],
    };
    existing.roles = unique([...existing.roles, membership.role]);
    existing.permissions = unique([...existing.permissions, ...(membership.permissions || [])]).sort();
    existing.membershipIds = unique([...existing.membershipIds, membership.id]);
    byFacility.set(membership.facilityId, existing);
  });
  return [...byFacility.values()];
};

export const buildActiveFacilityFromMemberships = (user, activeFacilityId) => {
  const facilityId = activeFacilityId || null;
  if (!facilityId) return null;
  const option = getFacilityOptionsForUser(user).find((item) => item.facilityId === facilityId);
  if (!option) return null;
  return {
    ...(option.facility || {}),
    id: facilityId,
    facilityId,
    roles: option.roles,
    permissions: option.permissions,
    membershipIds: option.membershipIds,
  };
};

export const getActiveFacilityContext = (user) => {
  const active = user?.activeFacility;
  const activeFacilityId = active?.facilityId || active?.id || user?.activeFacilityId || null;
  const fromMemberships = activeFacilityId ? buildActiveFacilityFromMemberships(user, activeFacilityId) : null;

  if (activeFacilityId && active) {
    const activeRoles = normalizeRoleKeys(active.roles || fromMemberships?.roles || []);
    const activePermissions = normalizePermissions(
      active.permissions?.length ? active.permissions : getPermissionsForRoleKeys(activeRoles)
    );
    return {
      ...active,
      id: activeFacilityId,
      facilityId: activeFacilityId,
      roles: activeRoles,
      permissions: activePermissions,
      membershipIds: active.membershipIds || fromMemberships?.membershipIds || [],
    };
  }

  if (fromMemberships) return fromMemberships;

  const options = getFacilityOptionsForUser(user);
  if (options.length === 1) {
    const [only] = options;
    return {
      ...(only.facility || {}),
      id: only.facilityId,
      facilityId: only.facilityId,
      roles: only.roles,
      permissions: only.permissions,
      membershipIds: only.membershipIds,
    };
  }

  return null;
};

export const getActiveFacilityRoleKeys = (user) => getActiveFacilityContext(user)?.roles || [];

export const getAuthFacilityScope = (authState = {}) => {
  const user = authState?.user || null;
  const activeFacility = getActiveFacilityContext(user);
  return {
    userId: user?.id || null,
    activeFacilityId: activeFacility?.facilityId || null,
  };
};

export const hasAnyRole = (roles, allowedRoles) => {
  const roleSet = new Set(normalizeRoleKeys(roles));
  return normalizeRoleKeys(allowedRoles).some((role) => roleSet.has(role));
};

export const hasEveryPermission = (permissions, requiredPermissions) => {
  const permissionSet = new Set(normalizePermissions(permissions));
  return normalizePermissions(requiredPermissions).every((permission) => permissionSet.has(permission));
};

export const hasAnyPermission = (permissions, allowedPermissions) => {
  const permissionSet = new Set(normalizePermissions(permissions));
  return normalizePermissions(allowedPermissions).some((permission) => permissionSet.has(permission));
};

export const canAccessNavigationItem = ({ item, user, isAuthenticated }) => {
  if (!item) return false;
  if (item.isVisible === false || item.enabled === false) return false;
  if (item.requiresAuth !== false && !isAuthenticated) return false;

  const activeFacility = getActiveFacilityContext(user);
  const allRoles = getRoleKeysForUser(user);
  const activeRoles = activeFacility?.roles || [];
  const allPermissions = getPermissionsForUser(user);
  const activePermissions = activeFacility?.permissions?.length
    ? activeFacility.permissions
    : getPermissionsForRoleKeys(activeRoles);
  const platformScoped = hasAnyRole(allRoles, [MEMBERSHIP_ROLES.PLATFORM_ADMIN]) && item.allowPlatformScope === true;

  if (item.requireActiveFacility && !activeFacility && !platformScoped) return false;

  const rolesToCheck = item.facilityScoped && !platformScoped ? activeRoles : allRoles;
  const permissionsToCheck = item.facilityScoped && !platformScoped ? activePermissions : allPermissions;

  if (Array.isArray(item.roles) && item.roles.length > 0 && !hasAnyRole(rolesToCheck, item.roles)) {
    return false;
  }

  if (
    Array.isArray(item.anyPermissions) &&
    item.anyPermissions.length > 0 &&
    !hasAnyPermission(permissionsToCheck, item.anyPermissions)
  ) {
    return false;
  }

  if (
    Array.isArray(item.permissions) &&
    item.permissions.length > 0 &&
    !hasEveryPermission(permissionsToCheck, item.permissions)
  ) {
    return false;
  }

  return true;
};
