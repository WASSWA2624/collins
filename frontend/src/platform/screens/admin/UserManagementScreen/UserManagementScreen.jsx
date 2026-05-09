import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Icon, Select, Text, TextField } from '@platform/components';
import useUserManagementScreen from './useUserManagementScreen';

const statusToneStyles = {
  ACTIVE: 'successBadge',
  APPROVED: 'successBadge',
  INVITED: 'infoBadge',
  PENDING: 'warningBadge',
  SUSPENDED: 'dangerBadge',
  DEACTIVATED: 'neutralBadge',
  REJECTED: 'neutralBadge',
};

const SummaryItem = ({ label, value }) => (
  <View style={styles.summaryItem}>
    <Text variant="caption">{label}</Text>
    <Text variant="h2">{String(value)}</Text>
  </View>
);

const StatusBadge = ({ status }) => {
  const toneStyle = statusToneStyles[status] || 'neutralBadge';
  return (
    <View style={[styles.badge, styles[toneStyle]]}>
      <Text variant="caption">{status}</Text>
    </View>
  );
};

const Capability = ({ label, active }) => (
  <View style={[styles.capability, active ? styles.capabilityActive : null]}>
    <Text variant="caption">{label}</Text>
  </View>
);

const Section = ({ children, meta, testID, title }) => (
  <View style={styles.section} testID={testID}>
    <View style={styles.sectionHeader}>
      <Text variant="h2">{title}</Text>
      {meta ? <Text variant="caption">{meta}</Text> : null}
    </View>
    {children}
  </View>
);

const EmptyState = ({ title, detail }) => (
  <View style={styles.emptyState}>
    <Text variant="label">{title}</Text>
    {detail ? <Text variant="caption">{detail}</Text> : null}
  </View>
);

const formatFacilityMeta = (facility = {}) =>
  [facility.registryCode, facility.district, facility.region, facility.verificationStatus]
    .filter(Boolean)
    .join(' - ');

const getRoleOptionsForMembership = (roleOptions, membership) => {
  if (roleOptions.some((option) => option.value === membership.role)) return roleOptions;
  return [
    { label: membership.roleLabel || membership.role, value: membership.role, disabled: true },
    ...roleOptions,
  ];
};

const getAssignedFacilitiesForUser = (user = {}) => {
  const byId = new Map();
  (user.memberships || []).forEach((membership) => {
    const facility = membership.facility || {};
    const id = facility.id || membership.facilityId;
    if (!id) return;
    const current = byId.get(id) || {
      id,
      name: facility.name || id,
      roles: [],
      statuses: [],
    };
    current.roles = [...new Set([...current.roles, membership.roleLabel || membership.role].filter(Boolean))];
    current.statuses = [...new Set([...current.statuses, membership.status].filter(Boolean))];
    byId.set(id, current);
  });
  return [...byId.values()];
};

const AssignedFacilities = ({ facilities }) => (
  <View style={styles.facilityChips}>
    {facilities.length ? (
      facilities.map((facility) => (
        <View key={facility.id} style={styles.facilityChip}>
          <Text variant="label">{facility.name}</Text>
          <Text variant="caption">
            {[...(facility.roles || []), ...(facility.statuses || [])].filter(Boolean).join(' - ')}
          </Text>
        </View>
      ))
    ) : (
      <Text variant="caption">No assigned facilities</Text>
    )}
  </View>
);

const UserStatusActions = ({
  canManageAccountStatus,
  isSaving,
  onStatusChange,
  savedMessage,
  savingUserStatus,
  testIds,
  user,
}) => {
  const actionFor = (status) => ({
    disabled: isSaving || user.status === status || !canManageAccountStatus,
    loading: savingUserStatus?.userId === user.id && savingUserStatus?.status === status,
    onPress: () => onStatusChange(user.id, status),
  });

  return (
    <View style={styles.actionBlock}>
      <View style={styles.compactActions}>
        <Button
          variant={user.status === 'ACTIVE' ? 'primary' : 'outline'}
          size="small"
          {...actionFor('ACTIVE')}
          testID={`${testIds.userStatusActivate}-${user.id}`}
        >
          Activate
        </Button>
        <Button
          variant={user.status === 'SUSPENDED' ? 'primary' : 'outline'}
          size="small"
          {...actionFor('SUSPENDED')}
          testID={`${testIds.userStatusSuspend}-${user.id}`}
        >
          Suspend
        </Button>
        <Button
          variant={user.status === 'DEACTIVATED' ? 'primary' : 'outline'}
          size="small"
          {...actionFor('DEACTIVATED')}
          testID={`${testIds.userStatusDeactivate}-${user.id}`}
        >
          Deactivate
        </Button>
      </View>
      {!canManageAccountStatus ? (
        <Text variant="caption">Account status requires platform administrator access.</Text>
      ) : null}
      {savedMessage ? (
        <Text
          variant="caption"
          style={styles.savedStatus}
          accessibilityLiveRegion="polite"
          testID={`${testIds.userStatusSaved}-${user.id}`}
        >
          {savedMessage}
        </Text>
      ) : null}
    </View>
  );
};

const UserMembership = ({
  isSaving,
  membership,
  onRoleChange,
  onStatusChange,
  roleOptions,
  savedMessage,
  savingMembership,
  testIds,
  userId,
}) => {
  const savingThisMembership =
    savingMembership?.userId === userId &&
    savingMembership?.membershipId === membership.id;
  const savingStatus = savingThisMembership && savingMembership.field === 'status'
    ? savingMembership.value
    : null;
  const savingRole = savingThisMembership && savingMembership.field === 'role';
  const disabled = isSaving || savingThisMembership;

  return (
    <View style={styles.membership}>
      <View style={styles.membershipHeader}>
        <View style={styles.membershipText}>
          <Text variant="label">{membership.facility?.name || membership.facilityId}</Text>
          <Text variant="caption">{formatFacilityMeta(membership.facility)}</Text>
        </View>
        <StatusBadge status={membership.status} />
      </View>

      <View style={styles.membershipControls}>
        <Select
          label="Role"
          options={getRoleOptionsForMembership(roleOptions, membership)}
          value={membership.role}
          onValueChange={(role) => onRoleChange(userId, membership, role)}
          disabled={disabled}
          searchable
          compact
          style={styles.roleSelect}
          testID={`${testIds.membershipRole}-${membership.id}`}
        />
        <View style={styles.membershipActions}>
          <Button
            variant={membership.status === 'APPROVED' ? 'primary' : 'outline'}
            size="small"
            disabled={disabled || membership.status === 'APPROVED'}
            loading={savingStatus === 'APPROVED'}
            onPress={() => onStatusChange(userId, membership, 'APPROVED')}
            testID={`${testIds.membershipApprove}-${membership.id}`}
          >
            Approve
          </Button>
          <Button
            variant={membership.status === 'SUSPENDED' ? 'primary' : 'outline'}
            size="small"
            disabled={disabled || membership.status === 'SUSPENDED'}
            loading={savingStatus === 'SUSPENDED'}
            onPress={() => onStatusChange(userId, membership, 'SUSPENDED')}
            testID={`${testIds.membershipSuspend}-${membership.id}`}
          >
            Suspend
          </Button>
          <Button
            variant={membership.status === 'REJECTED' ? 'primary' : 'outline'}
            size="small"
            disabled={disabled || membership.status === 'REJECTED'}
            loading={savingStatus === 'REJECTED'}
            onPress={() => onStatusChange(userId, membership, 'REJECTED')}
            testID={`${testIds.membershipDeactivate}-${membership.id}`}
          >
            Reject
          </Button>
        </View>
      </View>

      {membership.approvedBy ? (
        <Text variant="caption">
          Approved by {membership.approvedBy.name || membership.approvedBy.email}
        </Text>
      ) : null}
      {savingRole ? <Text variant="caption">Saving role...</Text> : null}
      {savedMessage ? (
        <Text
          variant="caption"
          style={styles.savedStatus}
          accessibilityLiveRegion="polite"
          testID={`${testIds.membershipSaved}-${membership.id}`}
        >
          {savedMessage}
        </Text>
      ) : null}
    </View>
  );
};

const UserRow = ({
  assignedFacilities,
  canManageAccountStatus,
  isSaving,
  onMembershipRoleChange,
  onMembershipStatusChange,
  onSelect,
  onUserStatusChange,
  roleOptions,
  savedMembership,
  savedUserStatus,
  savingMembership,
  savingUserStatus,
  selected,
  testIds,
  user,
}) => (
  <Pressable
    onPress={onSelect}
    style={[styles.userItem, selected ? styles.selectedItem : null]}
    accessibilityRole="button"
    accessibilityState={{ selected }}
    testID={`${testIds.userItem}-${user.id}`}
  >
    <View style={styles.userHeading}>
      <View style={styles.flex}>
        <Text variant="h3">{user.name}</Text>
        <Text variant="body">{user.email}</Text>
        {user.phone ? <Text variant="caption">{user.phone}</Text> : null}
      </View>
      <StatusBadge status={user.status} />
    </View>

    <View style={styles.capabilities}>
      <Capability label="Capture" active={user.capabilities.canCaptureData} />
      <Capability label="Validate" active={user.capabilities.canValidateData} />
      <Capability label="Admin" active={user.capabilities.canManageUsers} />
    </View>

    <View style={styles.groupBlock}>
      <Text variant="label">Assigned facilities</Text>
      <AssignedFacilities facilities={assignedFacilities} />
    </View>

    <View style={styles.groupBlock}>
      <Text variant="label">Status management</Text>
      <UserStatusActions
        canManageAccountStatus={canManageAccountStatus}
        isSaving={isSaving}
        onStatusChange={onUserStatusChange}
        savedMessage={savedUserStatus?.userId === user.id ? savedUserStatus.message : null}
        savingUserStatus={savingUserStatus}
        testIds={testIds}
        user={user}
      />
    </View>

    <View style={styles.groupBlock}>
      <Text variant="label">Role management</Text>
      <View style={styles.membershipList}>
        {user.memberships.length ? (
          user.memberships.map((membership) => (
            <UserMembership
              key={membership.id}
              isSaving={isSaving}
              membership={membership}
              roleOptions={roleOptions}
              savingMembership={savingMembership}
              savedMessage={
                savedMembership?.userId === user.id &&
                savedMembership?.membershipId === membership.id
                  ? savedMembership.message
                  : null
              }
              testIds={testIds}
              userId={user.id}
              onRoleChange={onMembershipRoleChange}
              onStatusChange={onMembershipStatusChange}
            />
          ))
        ) : (
          <Text variant="caption">No facility roles</Text>
        )}
      </View>
    </View>
  </Pressable>
);

const FacilityOption = ({ facility, onToggle, selected, testId }) => (
  <Pressable
    onPress={() => onToggle(facility.id)}
    style={[styles.facilityItem, selected ? styles.selectedItem : null]}
    accessibilityRole="checkbox"
    accessibilityState={{ checked: selected }}
    testID={`${testId}-${facility.id}`}
  >
    <View style={styles.optionCheck}>
      <Text variant="label">{selected ? 'x' : '+'}</Text>
    </View>
    <View style={styles.flex}>
      <Text variant="label">{facility.name}</Text>
      <Text variant="caption">{formatFacilityMeta(facility)}</Text>
    </View>
  </Pressable>
);

const FacilityMultiSelect = ({
  facilities,
  facilityQuery,
  isLoadingFacilities,
  onRemove,
  onSearch,
  onToggle,
  selectedFacilities,
  selectedFacilityIds,
  testIds,
}) => (
  <View style={styles.multiSelect}>
    <TextField
      label="Find facilities"
      placeholder="Search facility, registry code, district, or region"
      type="search"
      value={facilityQuery}
      onChangeText={onSearch}
      testID={testIds.facilitySearch}
      style={styles.fullField}
    />

    <View style={styles.selectedFacilities}>
      {selectedFacilities.length ? (
        selectedFacilities.map((facility) => (
          <Pressable
            key={facility.id}
            onPress={() => onRemove(facility.id)}
            style={styles.selectedFacility}
            accessibilityRole="button"
            testID={`${testIds.facilitySelected}-${facility.id}`}
          >
            <Text variant="label">{facility.name}</Text>
            <Text variant="caption">Remove</Text>
          </Pressable>
        ))
      ) : (
        <Text variant="caption">No facilities selected</Text>
      )}
    </View>

    <View style={styles.facilityList} testID={testIds.facilityList}>
      {isLoadingFacilities ? <Text variant="body">Loading facilities...</Text> : null}
      {!isLoadingFacilities && facilities.length === 0 ? (
        <EmptyState title="No facilities found" detail="Try a different facility search." />
      ) : null}
      {facilities.map((facility) => (
        <FacilityOption
          key={facility.id}
          facility={facility}
          selected={selectedFacilityIds.includes(facility.id)}
          onToggle={onToggle}
          testId={testIds.facilityItem}
        />
      ))}
    </View>
  </View>
);

const UserSearchPanel = ({ screen }) => (
  <View style={styles.searchPanel}>
    <TextField
      label="Search registered users"
      placeholder="Name, email, phone, role, status, or facility"
      type="search"
      value={screen.userQuery}
      onChangeText={screen.setUserQuery}
      testID={screen.testIds.userSearch}
      style={styles.searchInput}
    />
    <Select
      label="Role"
      options={screen.userRoleFilterOptions}
      value={screen.userRoleFilter}
      onValueChange={screen.setUserRoleFilter}
      searchable
      compact
      style={styles.filterSelect}
      testID={screen.testIds.userRoleFilter}
    />
    <Select
      label="Account status"
      options={screen.userStatusOptions}
      value={screen.userStatusFilter}
      onValueChange={screen.setUserStatusFilter}
      searchable={false}
      compact
      style={styles.filterSelect}
      testID={screen.testIds.userStatusFilter}
    />
    <Button
      variant="outline"
      size="small"
      disabled={!screen.hasUserFilters}
      onPress={screen.clearUserFilters}
      testID={screen.testIds.clearFilters}
    >
      Clear
    </Button>
  </View>
);

const UserManagementScreen = () => {
  const screen = useUserManagementScreen();

  if (!screen.canManage) {
    return (
      <View style={styles.content} testID={screen.testIds.forbidden}>
        <Text variant="h1">User Management</Text>
        <Text variant="body">Administrator access is required.</Text>
      </View>
    );
  }

  const canCreate =
    screen.newUser.name.trim() &&
    screen.newUser.email.trim() &&
    screen.newUser.password.length >= 8;
  const canAssign = Boolean(
    screen.selectedUser?.id &&
    screen.selectedFacilityIds.length > 0 &&
    screen.selectedRole
  );
  const noUsersTitle = screen.hasUserFilters ? 'No users match this search' : 'No registered users found';
  const noUsersDetail = screen.hasUserFilters
    ? 'Adjust the search, role, or status filters.'
    : 'Registered users will appear here when they are available.';

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      testID={screen.testIds.screen}
      accessibilityLabel="User management screen"
    >
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text variant="h1">User Management</Text>
          <Text variant="body">Access administration</Text>
        </View>
        <Button
          variant="outline"
          onPress={screen.refresh}
          loading={screen.isLoadingUsers}
          testID={screen.testIds.refresh}
        >
          Refresh
        </Button>
      </View>

      {screen.notice ? (
        <View
          style={[styles.notice, screen.notice.type === 'error' ? styles.errorNotice : styles.successNotice]}
          testID={screen.testIds.notice}
        >
          <Text variant="body">{screen.notice.message}</Text>
        </View>
      ) : null}

      <View style={styles.summary} testID={screen.testIds.summary}>
        <SummaryItem label="Users" value={screen.summary.total} />
        <SummaryItem label="Clinicians" value={screen.summary.clinicians} />
        <SummaryItem label="Validators" value={screen.summary.validators} />
        <SummaryItem label="Admins" value={screen.summary.administrators} />
      </View>

      <Section
        title="User Directory"
        meta={`${screen.userMeta.total || screen.users.length} total`}
        testID={screen.testIds.userList}
      >
        <UserSearchPanel screen={screen} />
        {screen.isLoadingUsers && screen.users.length === 0 ? (
          <EmptyState title="Loading registered users..." />
        ) : null}
        {screen.isLoadingUsers && screen.users.length > 0 ? (
          <Text variant="caption">Refreshing users...</Text>
        ) : null}
        {!screen.isLoadingUsers && screen.users.length === 0 ? (
          <EmptyState title={noUsersTitle} detail={noUsersDetail} />
        ) : null}
        <View style={styles.userList}>
          {screen.users.map((user) => (
            <UserRow
              key={user.id}
              assignedFacilities={getAssignedFacilitiesForUser(user)}
              canManageAccountStatus={screen.canManageAccountStatus}
              isSaving={screen.isSaving}
              onMembershipRoleChange={screen.updateMembershipRole}
              onMembershipStatusChange={screen.updateMembershipStatus}
              onSelect={() => screen.setSelectedUserId(user.id)}
              onUserStatusChange={screen.updateUserStatus}
              roleOptions={screen.roleOptions}
              savedMembership={screen.savedMembership}
              savedUserStatus={screen.savedUserStatus}
              savingMembership={screen.savingMembership}
              savingUserStatus={screen.savingUserStatus}
              selected={user.id === screen.selectedUser?.id}
              testIds={screen.testIds}
              user={user}
            />
          ))}
        </View>
      </Section>

      <Section title="Facility Assignment" testID={screen.testIds.assignmentForm}>
        <View style={styles.selectedUserPanel}>
          <View style={styles.flex}>
            <Text variant="label">Selected user</Text>
            <Text variant="h3">{screen.selectedUser?.name || 'No user selected'}</Text>
            {screen.selectedUser?.email ? <Text variant="caption">{screen.selectedUser.email}</Text> : null}
          </View>
          {screen.selectedUser ? <StatusBadge status={screen.selectedUser.status} /> : null}
        </View>

        <View style={styles.formGrid}>
          <Select
            label="User"
            options={screen.userOptions}
            value={screen.selectedUser?.id || screen.selectedUserId}
            onValueChange={screen.setSelectedUserId}
            searchable
            compact
            style={styles.formField}
          />
          <Select
            label="Role to assign"
            options={screen.roleOptions}
            value={screen.selectedRole}
            onValueChange={screen.setSelectedRole}
            searchable
            compact
            style={styles.formField}
          />
          <Select
            label="Membership status"
            options={screen.statusOptions}
            value={screen.selectedStatus}
            onValueChange={screen.setSelectedStatus}
            searchable={false}
            compact
            style={styles.formField}
          />
        </View>

        <View style={styles.groupBlock}>
          <Text variant="label">Currently assigned facilities</Text>
          <AssignedFacilities facilities={screen.assignedFacilities} />
        </View>

        <FacilityMultiSelect
          facilities={screen.facilityOptions}
          facilityQuery={screen.facilityQuery}
          isLoadingFacilities={screen.isLoadingFacilities}
          onRemove={screen.removeSelectedFacilityId}
          onSearch={screen.setFacilityQuery}
          onToggle={screen.toggleSelectedFacilityId}
          selectedFacilities={screen.selectedFacilities}
          selectedFacilityIds={screen.selectedFacilityIds}
          testIds={screen.testIds}
        />

        <View style={styles.actionsRow}>
          <Button
            disabled={!canAssign || screen.isSaving}
            loading={screen.isSaving}
            onPress={screen.handleAssignMembership}
            icon={<Icon glyph="+" size="sm" tone="primary" decorative />}
            testID={screen.testIds.assign}
          >
            Save Access
          </Button>
        </View>
      </Section>

      <Section title="Add User" testID={screen.testIds.createForm}>
        <View style={styles.formGrid}>
          <TextField
            label="Full name"
            value={screen.newUser.name}
            onChangeText={(value) => screen.updateNewUser('name', value)}
            style={styles.formField}
          />
          <TextField
            label="Email"
            type="email"
            value={screen.newUser.email}
            onChangeText={(value) => screen.updateNewUser('email', value)}
            style={styles.formField}
          />
          <TextField
            label="Phone"
            value={screen.newUser.phone}
            onChangeText={(value) => screen.updateNewUser('phone', value)}
            style={styles.formField}
          />
          <TextField
            label="Temporary password"
            type="password"
            value={screen.newUser.password}
            onChangeText={(value) => screen.updateNewUser('password', value)}
            style={styles.formField}
          />
        </View>
        <View style={styles.actionsRow}>
          <Button
            disabled={!canCreate || screen.isSaving}
            loading={screen.isSaving}
            onPress={screen.handleCreateUser}
            icon={<Icon glyph="+" size="sm" tone="primary" decorative />}
            testID={screen.testIds.create}
          >
            Add User
          </Button>
        </View>
      </Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  content: {
    gap: 14,
    padding: 16,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
    gap: 4,
    minWidth: 240,
  },
  notice: {
    borderLeftWidth: 3,
    gap: 6,
    padding: 10,
  },
  errorNotice: {
    backgroundColor: '#FFF1F1',
    borderLeftColor: '#B42318',
  },
  successNotice: {
    backgroundColor: '#ECFDF3',
    borderLeftColor: '#067647',
  },
  summary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  summaryItem: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D8DEE8',
    borderWidth: 1,
    minWidth: 116,
    padding: 12,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D8DEE8',
    borderWidth: 1,
    gap: 12,
    padding: 14,
  },
  sectionHeader: {
    alignItems: 'baseline',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  searchPanel: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  searchInput: {
    flexGrow: 1,
    minWidth: 260,
  },
  filterSelect: {
    flexGrow: 1,
    minWidth: 180,
  },
  userList: {
    gap: 10,
  },
  userItem: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D8DEE8',
    borderWidth: 1,
    gap: 12,
    padding: 12,
  },
  selectedItem: {
    backgroundColor: '#F0F7FF',
    borderColor: '#1D4ED8',
  },
  userHeading: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  flex: {
    flex: 1,
  },
  capabilities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  capability: {
    borderColor: '#CBD5E1',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  capabilityActive: {
    backgroundColor: '#ECFDF3',
    borderColor: '#067647',
  },
  groupBlock: {
    borderTopColor: '#E5E7EB',
    borderTopWidth: 1,
    gap: 8,
    paddingTop: 10,
  },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  successBadge: {
    backgroundColor: '#ECFDF3',
    borderColor: '#067647',
  },
  infoBadge: {
    backgroundColor: '#EFF6FF',
    borderColor: '#1D4ED8',
  },
  warningBadge: {
    backgroundColor: '#FFFBEB',
    borderColor: '#B45309',
  },
  dangerBadge: {
    backgroundColor: '#FFF1F1',
    borderColor: '#B42318',
  },
  neutralBadge: {
    backgroundColor: '#F4F4F5',
    borderColor: '#A1A1AA',
  },
  facilityChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  facilityChip: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
    borderWidth: 1,
    gap: 2,
    maxWidth: 260,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  actionBlock: {
    gap: 6,
  },
  compactActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  membershipList: {
    gap: 8,
  },
  membership: {
    backgroundColor: '#FAFAFA',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    gap: 8,
    padding: 10,
  },
  membershipHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  membershipText: {
    flex: 1,
    gap: 2,
    minWidth: 180,
  },
  membershipControls: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  roleSelect: {
    flexGrow: 1,
    minWidth: 220,
  },
  membershipActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  savedStatus: {
    color: '#067647',
    width: '100%',
  },
  selectedUserPanel: {
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    padding: 12,
  },
  formGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  formField: {
    flexGrow: 1,
    minWidth: 220,
  },
  multiSelect: {
    gap: 10,
  },
  fullField: {
    width: '100%',
  },
  selectedFacilities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedFacility: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
    borderWidth: 1,
    gap: 2,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  facilityList: {
    gap: 8,
  },
  facilityItem: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#D8DEE8',
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 10,
  },
  optionCheck: {
    alignItems: 'center',
    borderColor: '#CBD5E1',
    borderWidth: 1,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  actionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-end',
  },
  emptyState: {
    backgroundColor: '#F8FAFC',
    borderColor: '#D8DEE8',
    borderWidth: 1,
    gap: 4,
    padding: 12,
  },
});

export default UserManagementScreen;
