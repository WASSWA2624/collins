import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth, useDebounce, useI18n } from '@hooks';
import { MEMBERSHIP_ROLES } from '@config/accessControl';
import {
  MEMBERSHIP_STATUS_OPTIONS,
  ROLE_OPTIONS,
  USER_STATUS_OPTIONS,
  buildUserManagementSummary,
  canManageUsers,
  createManagedUserUseCase,
  listManagedUsersUseCase,
  searchFacilitiesForUserManagementUseCase,
  syncManagedUserFacilitiesUseCase,
  updateManagedUserStatusUseCase,
  updateManagedUserMembershipUseCase,
} from '@features/user-management';
import { USER_MANAGEMENT_TEST_IDS } from './types';

const DEFAULT_ROLE = MEMBERSHIP_ROLES.CLINICIAN;
const DEFAULT_STATUS = 'APPROVED';

const emptyNewUser = {
  name: '',
  email: '',
  phone: '',
  password: '',
};

const getErrorMessage = (error) =>
  error?.safeMessage || error?.message || 'Unable to update user access';

const unique = (values) => [...new Set(values.filter(Boolean))];

const getMembershipSaveMessage = (status) => {
  if (status === 'APPROVED') return 'Approval saved';
  if (status === 'SUSPENDED') return 'Suspension saved';
  if (status === 'REJECTED') return 'Rejection saved';
  return 'Membership saved';
};

const getUserStatusMessage = (status) => {
  if (status === 'ACTIVE') return 'User reactivated';
  if (status === 'SUSPENDED') return 'User suspended';
  if (status === 'DEACTIVATED') return 'User deactivated';
  if (status === 'INVITED') return 'User marked invited';
  return 'User status updated';
};

const replaceUser = (users, nextUser) => {
  if (!nextUser?.id) return users;
  const exists = users.some((user) => user.id === nextUser.id);
  if (!exists) return [nextUser, ...users];
  return users.map((user) => (user.id === nextUser.id ? nextUser : user));
};

const normalizeMembershipFacility = (membership = {}) => {
  const facility = membership.facility || {};
  const id = facility.id || membership.facilityId;
  if (!id) return null;
  return {
    id,
    name: facility.name || id,
    registryCode: facility.registryCode || null,
    district: facility.district || null,
    region: facility.region || null,
    verificationStatus: facility.verificationStatus || null,
  };
};

const matchesFacilityQuery = (facility, query) => {
  const term = String(query || '').trim().toLowerCase();
  if (!term) return true;
  return [facility.name, facility.registryCode, facility.district, facility.region]
    .some((value) => String(value || '').toLowerCase().includes(term));
};

const getAssignedFacilities = (user = {}) => {
  const byId = new Map();
  (user.memberships || []).forEach((membership) => {
    const facility = normalizeMembershipFacility(membership);
    if (!facility?.id) return;
    const current = byId.get(facility.id) || {
      ...facility,
      roles: [],
      statuses: [],
      membershipIds: [],
    };
    current.roles = unique([...current.roles, membership.roleLabel || membership.role]);
    current.statuses = unique([...current.statuses, membership.status]);
    current.membershipIds = unique([...current.membershipIds, membership.id]);
    byId.set(facility.id, current);
  });
  return [...byId.values()];
};

const getUserFacilityIds = (user = {}) => getAssignedFacilities(user).map((facility) => facility.id);

const mergeFacilities = (...facilityLists) => {
  const byId = new Map();
  facilityLists.flat().filter(Boolean).forEach((facility) => {
    if (!facility.id) return;
    byId.set(facility.id, {
      ...(byId.get(facility.id) || {}),
      ...facility,
    });
  });
  return [...byId.values()];
};

const toRoleOption = (role) => ({
  label: role.label,
  value: role.value,
  searchText: [role.label, role.value],
});

export default function useUserManagementScreen() {
  const { t } = useI18n();
  const auth = useAuth();
  const authRoleKeys = useMemo(
    () => auth.roleKeys || auth.roles || [],
    [auth.roleKeys, auth.roles]
  );
  const canManage = canManageUsers({
    ...(auth.user || {}),
    roles: authRoleKeys,
    permissions: auth.permissions,
    memberships: auth.memberships || auth.user?.memberships,
    activeFacility: auth.activeFacility || auth.user?.activeFacility,
  });

  const [userQuery, setUserQuery] = useState('');
  const [facilityQuery, setFacilityQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('');
  const debouncedUserQuery = useDebounce(userQuery, 250);
  const debouncedFacilityQuery = useDebounce(facilityQuery, 250);
  const [users, setUsers] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [userMeta, setUserMeta] = useState({});
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedFacilityIds, setSelectedFacilityIds] = useState([]);
  const [selectedRole, setSelectedRole] = useState(DEFAULT_ROLE);
  const [selectedStatus, setSelectedStatus] = useState(DEFAULT_STATUS);
  const [newUser, setNewUser] = useState(emptyNewUser);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingFacilities, setIsLoadingFacilities] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savingMembership, setSavingMembership] = useState(null);
  const [savedMembership, setSavedMembership] = useState(null);
  const [savingUserStatus, setSavingUserStatus] = useState(null);
  const [savedUserStatus, setSavedUserStatus] = useState(null);
  const [notice, setNotice] = useState(null);
  const usersRequestRef = useRef(0);
  const facilitiesRequestRef = useRef(0);
  const selectedUserRef = useRef('');

  const isPlatformAdmin = useMemo(
    () => authRoleKeys.includes(MEMBERSHIP_ROLES.PLATFORM_ADMIN),
    [authRoleKeys]
  );
  const canManageAccountStatus = isPlatformAdmin;

  const managedLocalFacilities = useMemo(() => {
    const byId = new Map();
    (auth.memberships || auth.user?.memberships || [])
      .filter((membership) => membership?.role === MEMBERSHIP_ROLES.FACILITY_ADMIN)
      .map(normalizeMembershipFacility)
      .filter(Boolean)
      .forEach((facility) => byId.set(facility.id, facility));
    return [...byId.values()];
  }, [auth.memberships, auth.user?.memberships]);

  const summary = useMemo(() => buildUserManagementSummary(users), [users]);
  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) || users[0] || null,
    [selectedUserId, users]
  );
  const assignedFacilities = useMemo(() => getAssignedFacilities(selectedUser || {}), [selectedUser]);
  const facilityOptions = useMemo(
    () => mergeFacilities(facilities, assignedFacilities),
    [assignedFacilities, facilities]
  );
  const selectedFacilities = useMemo(
    () => selectedFacilityIds.map((id) => (
      facilityOptions.find((facility) => facility.id === id) || { id, name: id }
    )),
    [facilityOptions, selectedFacilityIds]
  );
  const selectedFacilityId = selectedFacilityIds[0] || '';
  const selectedFacility = selectedFacilities[0] || null;

  const userOptions = useMemo(
    () => users.map((user) => ({
      label: `${user.name}${user.email ? ` (${user.email})` : ''}`,
      value: user.id,
      searchText: [
        user.name,
        user.email,
        user.phone,
        user.status,
        ...(user.memberships || []).flatMap((membership) => [
          membership.roleLabel,
          membership.role,
          membership.status,
          membership.facility?.name,
          membership.facility?.district,
          membership.facility?.region,
        ]),
      ],
    })),
    [users]
  );
  const roleOptions = useMemo(
    () => ROLE_OPTIONS
      .filter((role) => isPlatformAdmin || role.value !== MEMBERSHIP_ROLES.PLATFORM_ADMIN)
      .map(toRoleOption),
    [isPlatformAdmin]
  );
  const userRoleFilterOptions = useMemo(
    () => [{ label: 'Any role', value: '' }, ...roleOptions],
    [roleOptions]
  );
  const userStatusOptions = useMemo(
    () => [{ label: 'Any account status', value: '' }, ...USER_STATUS_OPTIONS],
    []
  );
  const statusOptions = useMemo(() => MEMBERSHIP_STATUS_OPTIONS, []);
  const hasUserFilters = Boolean(userQuery.trim() || userRoleFilter || userStatusFilter);

  useEffect(() => {
    if (users.length === 0) {
      setSelectedUserId('');
      return;
    }
    if (!selectedUserId || !users.some((user) => user.id === selectedUserId)) {
      setSelectedUserId(users[0].id);
    }
  }, [selectedUserId, users]);

  useEffect(() => {
    if (!selectedUser?.id) {
      selectedUserRef.current = '';
      setSelectedFacilityIds([]);
      return;
    }

    if (selectedUserRef.current === selectedUser.id) return;
    selectedUserRef.current = selectedUser.id;
    setSelectedFacilityIds(getUserFacilityIds(selectedUser));

    const [firstMembership] = selectedUser.memberships || [];
    if (firstMembership?.role && roleOptions.some((option) => option.value === firstMembership.role)) {
      setSelectedRole(firstMembership.role);
    }
    if (firstMembership?.status) setSelectedStatus(firstMembership.status);
  }, [roleOptions, selectedUser]);

  useEffect(() => {
    if (!roleOptions.some((option) => option.value === selectedRole)) {
      setSelectedRole(roleOptions[0]?.value || DEFAULT_ROLE);
    }
  }, [roleOptions, selectedRole]);

  const loadUsers = useCallback(async () => {
    if (!canManage) return;
    const requestId = usersRequestRef.current + 1;
    usersRequestRef.current = requestId;
    setIsLoadingUsers(true);
    setNotice(null);
    try {
      const response = await listManagedUsersUseCase({
        q: debouncedUserQuery || undefined,
        role: userRoleFilter || undefined,
        status: userStatusFilter || undefined,
        page: 1,
        limit: 50,
      });
      if (usersRequestRef.current === requestId) {
        setUsers(response.users);
        setUserMeta(response.meta);
      }
    } catch (error) {
      if (usersRequestRef.current === requestId) {
        setNotice({ type: 'error', message: getErrorMessage(error) });
      }
    } finally {
      if (usersRequestRef.current === requestId) setIsLoadingUsers(false);
    }
  }, [canManage, debouncedUserQuery, userRoleFilter, userStatusFilter]);

  const loadFacilities = useCallback(async () => {
    if (!canManage) return;
    if (!isPlatformAdmin) {
      setFacilities(managedLocalFacilities.filter((facility) => matchesFacilityQuery(facility, debouncedFacilityQuery)));
      setIsLoadingFacilities(false);
      return;
    }
    const requestId = facilitiesRequestRef.current + 1;
    facilitiesRequestRef.current = requestId;
    setIsLoadingFacilities(true);
    try {
      const response = await searchFacilitiesForUserManagementUseCase({
        q: debouncedFacilityQuery || undefined,
        page: 1,
        limit: 500,
      });
      if (facilitiesRequestRef.current === requestId) setFacilities(response.facilities);
    } catch (error) {
      if (facilitiesRequestRef.current === requestId) {
        setNotice({ type: 'error', message: getErrorMessage(error) });
      }
    } finally {
      if (facilitiesRequestRef.current === requestId) setIsLoadingFacilities(false);
    }
  }, [canManage, debouncedFacilityQuery, isPlatformAdmin, managedLocalFacilities]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    void loadFacilities();
  }, [loadFacilities]);

  const refresh = useCallback(() => {
    void loadUsers();
    void loadFacilities();
  }, [loadFacilities, loadUsers]);

  const clearUserFilters = useCallback(() => {
    setUserQuery('');
    setUserRoleFilter('');
    setUserStatusFilter('');
  }, []);

  const updateNewUser = useCallback((field, value) => {
    setNewUser((current) => ({ ...current, [field]: value }));
  }, []);

  const setSelectedFacilityId = useCallback((facilityId) => {
    setSelectedFacilityIds(facilityId ? [facilityId] : []);
  }, []);

  const toggleSelectedFacilityId = useCallback((facilityId) => {
    if (!facilityId) return;
    setSelectedFacilityIds((current) => (
      current.includes(facilityId)
        ? current.filter((id) => id !== facilityId)
        : [...current, facilityId]
    ));
  }, []);

  const removeSelectedFacilityId = useCallback((facilityId) => {
    setSelectedFacilityIds((current) => current.filter((id) => id !== facilityId));
  }, []);

  const handleCreateUser = useCallback(async () => {
    setIsSaving(true);
    setSavedMembership(null);
    setSavedUserStatus(null);
    setNotice(null);
    try {
      const memberships = selectedFacilityIds.map((facilityId) => ({
        facilityId,
        role: selectedRole,
        status: selectedStatus,
      }));
      const created = await createManagedUserUseCase({
        ...newUser,
        email: newUser.email.trim(),
        phone: newUser.phone.trim() || undefined,
        memberships,
      });
      setUsers((current) => replaceUser(current, created));
      setSelectedUserId(created.id);
      setSelectedFacilityIds(getUserFacilityIds(created));
      setNewUser(emptyNewUser);
      setNotice({ type: 'success', message: 'User added' });
    } catch (error) {
      setNotice({ type: 'error', message: getErrorMessage(error) });
    } finally {
      setIsSaving(false);
    }
  }, [newUser, selectedFacilityIds, selectedRole, selectedStatus]);

  const handleAssignMembership = useCallback(async () => {
    if (!selectedUser?.id || !selectedRole) return;
    setIsSaving(true);
    setSavedMembership(null);
    setSavedUserStatus(null);
    setNotice(null);
    try {
      const updatedUser = await syncManagedUserFacilitiesUseCase(selectedUser.id, {
        facilityIds: selectedFacilityIds,
        role: selectedRole,
        status: selectedStatus,
      });
      setUsers((current) => replaceUser(current, updatedUser));
      setSelectedFacilityIds(getUserFacilityIds(updatedUser));
      setNotice({
        type: 'success',
        message: selectedFacilityIds.length
          ? `Access updated for ${selectedFacilityIds.length} ${selectedFacilityIds.length === 1 ? 'facility' : 'facilities'}`
          : 'Facility access removed',
      });
    } catch (error) {
      setNotice({ type: 'error', message: getErrorMessage(error) });
    } finally {
      setIsSaving(false);
    }
  }, [selectedFacilityIds, selectedRole, selectedStatus, selectedUser]);

  const updateMembershipStatus = useCallback(
    async (userId, membership, status) => {
      if (!userId || !membership?.id || membership.status === status) return;
      const membershipState = { userId, membershipId: membership.id, field: 'status', value: status };
      setIsSaving(true);
      setSavingMembership(membershipState);
      setSavedMembership(null);
      setSavedUserStatus(null);
      setNotice(null);
      try {
        const updated = await updateManagedUserMembershipUseCase(
          userId,
          membership.id,
          { status }
        );
        const message = getMembershipSaveMessage(status);
        setUsers((current) => replaceUser(current, updated));
        if (selectedUser?.id === userId) setSelectedFacilityIds(getUserFacilityIds(updated));
        setSavedMembership({ ...membershipState, status, message });
        setNotice({ type: 'success', message });
      } catch (error) {
        setNotice({ type: 'error', message: getErrorMessage(error) });
      } finally {
        setSavingMembership(null);
        setIsSaving(false);
      }
    },
    [selectedUser?.id]
  );

  const updateMembershipRole = useCallback(
    async (userId, membership, role) => {
      if (!userId || !membership?.id || !role || membership.role === role) return;
      const membershipState = { userId, membershipId: membership.id, field: 'role', value: role };
      setIsSaving(true);
      setSavingMembership(membershipState);
      setSavedMembership(null);
      setSavedUserStatus(null);
      setNotice(null);
      try {
        const updated = await updateManagedUserMembershipUseCase(
          userId,
          membership.id,
          { role }
        );
        setUsers((current) => replaceUser(current, updated));
        if (selectedUser?.id === userId) setSelectedFacilityIds(getUserFacilityIds(updated));
        setSavedMembership({ ...membershipState, message: 'Role saved' });
        setNotice({ type: 'success', message: 'Role saved' });
      } catch (error) {
        setNotice({ type: 'error', message: getErrorMessage(error) });
      } finally {
        setSavingMembership(null);
        setIsSaving(false);
      }
    },
    [selectedUser?.id]
  );

  const updateUserStatus = useCallback(
    async (userId, status) => {
      if (!canManageAccountStatus || !userId || !status) return;
      const currentUser = users.find((user) => user.id === userId);
      if (currentUser?.status === status) return;
      const statusState = { userId, status };
      setIsSaving(true);
      setSavingUserStatus(statusState);
      setSavedMembership(null);
      setSavedUserStatus(null);
      setNotice(null);
      try {
        const updated = await updateManagedUserStatusUseCase(userId, { status });
        const message = getUserStatusMessage(status);
        setUsers((current) => replaceUser(current, updated));
        setSavedUserStatus({ ...statusState, message });
        setNotice({ type: 'success', message });
      } catch (error) {
        setNotice({ type: 'error', message: getErrorMessage(error) });
      } finally {
        setSavingUserStatus(null);
        setIsSaving(false);
      }
    },
    [canManageAccountStatus, users]
  );

  return {
    t,
    auth,
    assignedFacilities,
    canManage,
    canManageAccountStatus,
    clearUserFilters,
    facilities,
    facilityOptions,
    hasUserFilters,
    isLoadingFacilities,
    isLoadingUsers,
    isSaving,
    newUser,
    notice,
    removeSelectedFacilityId,
    roleOptions,
    selectedFacilities,
    selectedFacility,
    selectedFacilityId,
    selectedFacilityIds,
    selectedRole,
    selectedStatus,
    selectedUser,
    selectedUserId,
    savedMembership,
    savedUserStatus,
    savingMembership,
    savingUserStatus,
    setFacilityQuery,
    setSelectedFacilityId,
    setSelectedFacilityIds,
    setSelectedRole,
    setSelectedStatus,
    setSelectedUserId,
    setUserQuery,
    setUserRoleFilter,
    setUserStatusFilter,
    statusOptions,
    summary,
    testIds: USER_MANAGEMENT_TEST_IDS,
    toggleSelectedFacilityId,
    updateMembershipRole,
    updateMembershipStatus,
    updateNewUser,
    updateUserStatus,
    userMeta,
    userOptions,
    userQuery,
    userRoleFilter,
    userRoleFilterOptions,
    userStatusFilter,
    userStatusOptions,
    users,
    facilityQuery,
    handleAssignMembership,
    handleCreateUser,
    refresh,
  };
}
