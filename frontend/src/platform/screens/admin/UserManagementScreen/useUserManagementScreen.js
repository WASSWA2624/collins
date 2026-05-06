import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth, useDebounce, useI18n } from '@hooks';
import { MEMBERSHIP_ROLES } from '@config/accessControl';
import {
  ROLE_OPTIONS,
  buildUserManagementSummary,
  canManageUsers,
  createManagedUserUseCase,
  listManagedUsersUseCase,
  searchFacilitiesForUserManagementUseCase,
  assignManagedUserMembershipsUseCase,
  updateManagedUserMembershipUseCase,
} from '@features/user-management';
import { USER_MANAGEMENT_TEST_IDS } from './types';

const DEFAULT_ROLE = 'CLINICIAN';
const DEFAULT_STATUS = 'APPROVED';

const emptyNewUser = {
  name: '',
  email: '',
  phone: '',
  password: '',
};

const getErrorMessage = (error) =>
  error?.safeMessage || error?.message || 'Unable to update user access';

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

export default function useUserManagementScreen() {
  const { t } = useI18n();
  const auth = useAuth();
  const canManage = canManageUsers({
    ...(auth.user || {}),
    roles: auth.roleKeys || auth.roles,
    permissions: auth.permissions,
    memberships: auth.memberships || auth.user?.memberships,
    activeFacility: auth.activeFacility || auth.user?.activeFacility,
  });

  const [userQuery, setUserQuery] = useState('');
  const [facilityQuery, setFacilityQuery] = useState('');
  const debouncedUserQuery = useDebounce(userQuery, 250);
  const debouncedFacilityQuery = useDebounce(facilityQuery, 250);
  const [users, setUsers] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [userMeta, setUserMeta] = useState({});
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedFacilityId, setSelectedFacilityId] = useState('');
  const [selectedRole, setSelectedRole] = useState(DEFAULT_ROLE);
  const [selectedStatus, setSelectedStatus] = useState(DEFAULT_STATUS);
  const [newUser, setNewUser] = useState(emptyNewUser);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingFacilities, setIsLoadingFacilities] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const usersRequestRef = useRef(0);
  const facilitiesRequestRef = useRef(0);

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) || users[0] || null,
    [selectedUserId, users]
  );
  const selectedFacility = useMemo(
    () => facilities.find((facility) => facility.id === selectedFacilityId) || facilities[0] || null,
    [facilities, selectedFacilityId]
  );
  const isPlatformAdmin = useMemo(
    () => (auth.roleKeys || []).includes(MEMBERSHIP_ROLES.PLATFORM_ADMIN),
    [auth.roleKeys]
  );
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
  const userOptions = useMemo(
    () => users.map((user) => ({
      label: `${user.name}${user.email ? ` (${user.email})` : ''}`,
      value: user.id,
    })),
    [users]
  );
  const roleOptions = useMemo(
    () => ROLE_OPTIONS
      .filter((role) => isPlatformAdmin || role.value !== MEMBERSHIP_ROLES.PLATFORM_ADMIN)
      .map((role) => ({
        label: role.label,
        value: role.value,
      })),
    [isPlatformAdmin]
  );
  const statusOptions = useMemo(() => [
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Suspended', value: 'SUSPENDED' },
  ], []);

  useEffect(() => {
    if (!selectedUserId && users[0]?.id) setSelectedUserId(users[0].id);
  }, [selectedUserId, users]);

  useEffect(() => {
    if (!selectedFacilityId && facilities[0]?.id) setSelectedFacilityId(facilities[0].id);
  }, [facilities, selectedFacilityId]);

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
        facilityQ: debouncedFacilityQuery || undefined,
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
  }, [canManage, debouncedFacilityQuery, debouncedUserQuery]);

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
        limit: 20,
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

  const updateNewUser = useCallback((field, value) => {
    setNewUser((current) => ({ ...current, [field]: value }));
  }, []);

  const handleCreateUser = useCallback(async () => {
    setIsSaving(true);
    setNotice(null);
    try {
      const memberships = selectedFacilityId
        ? [{ facilityId: selectedFacilityId, role: selectedRole, status: selectedStatus }]
        : [];
      const created = await createManagedUserUseCase({
        ...newUser,
        email: newUser.email.trim(),
        phone: newUser.phone.trim() || undefined,
        memberships,
      });
      setUsers((current) => replaceUser(current, created));
      setSelectedUserId(created.id);
      setNewUser(emptyNewUser);
      setNotice({ type: 'success', message: 'User added' });
    } catch (error) {
      setNotice({ type: 'error', message: getErrorMessage(error) });
    } finally {
      setIsSaving(false);
    }
  }, [newUser, selectedFacilityId, selectedRole, selectedStatus]);

  const handleAssignMembership = useCallback(async () => {
    if (!selectedUser?.id || !selectedFacilityId || !selectedRole) return;
    setIsSaving(true);
    setNotice(null);
    try {
      const updated = await assignManagedUserMembershipsUseCase(selectedUser.id, {
        facilityId: selectedFacilityId,
        roles: [selectedRole],
        status: selectedStatus,
      });
      setUsers((current) => replaceUser(current, updated));
      setNotice({ type: 'success', message: 'Access updated' });
    } catch (error) {
      setNotice({ type: 'error', message: getErrorMessage(error) });
    } finally {
      setIsSaving(false);
    }
  }, [selectedFacilityId, selectedRole, selectedStatus, selectedUser?.id]);

  const updateMembershipStatus = useCallback(async (membership, status) => {
    if (!selectedUser?.id || !membership?.id) return;
    setIsSaving(true);
    setNotice(null);
    try {
      const updated = await updateManagedUserMembershipUseCase(selectedUser.id, membership.id, { status });
      setUsers((current) => replaceUser(current, updated));
      setNotice({ type: 'success', message: 'Membership updated' });
    } catch (error) {
      setNotice({ type: 'error', message: getErrorMessage(error) });
    } finally {
      setIsSaving(false);
    }
  }, [selectedUser?.id]);

  return {
    t,
    auth,
    canManage,
    facilities,
    isLoadingFacilities,
    isLoadingUsers,
    isSaving,
    newUser,
    notice,
    roleOptions,
    selectedFacility,
    selectedFacilityId,
    selectedRole,
    selectedStatus,
    selectedUser,
    selectedUserId,
    setFacilityQuery,
    setSelectedFacilityId,
    setSelectedRole,
    setSelectedStatus,
    setSelectedUserId,
    setUserQuery,
    statusOptions,
    summary,
    testIds: USER_MANAGEMENT_TEST_IDS,
    updateMembershipStatus,
    updateNewUser,
    userMeta,
    userOptions,
    users,
    userQuery,
    facilityQuery,
    handleAssignMembership,
    handleCreateUser,
    refresh,
  };
}
