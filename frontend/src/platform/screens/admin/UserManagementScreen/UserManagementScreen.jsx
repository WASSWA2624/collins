import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Select, Text, TextField } from '@platform/components';
import useUserManagementScreen from './useUserManagementScreen';

const SummaryItem = ({ label, value }) => (
  <View style={styles.summaryItem}>
    <Text variant="caption">{label}</Text>
    <Text variant="h2">{String(value)}</Text>
  </View>
);

const Capability = ({ label, active }) => (
  <View style={[styles.capability, active ? styles.capabilityActive : null]}>
    <Text variant="caption">{label}</Text>
  </View>
);

const UserMembership = ({
  membership,
  onStatusChange,
  savedMessage,
  saving,
  savingStatus,
  testIds,
  userId,
}) => (
  <View style={styles.membership}>
    <View style={styles.membershipText}>
      <Text variant="label">{membership.facility?.name || membership.facilityId}</Text>
      <Text variant="caption">
        {membership.roleLabel} - {membership.status}
      </Text>
      {membership.approvedBy ? (
        <Text variant="caption">Approved by {membership.approvedBy.name || membership.approvedBy.email}</Text>
      ) : null}
    </View>
    <View style={styles.membershipActions}>
      <Button
        variant={membership.status === 'APPROVED' ? 'primary' : 'outline'}
        size="small"
        disabled={saving}
        loading={savingStatus === 'APPROVED'}
        onPress={() => onStatusChange(userId, membership, 'APPROVED')}
        testID={`${testIds.membershipApprove}-${membership.id}`}
      >
        Approve
      </Button>
      <Button
        variant={membership.status === 'SUSPENDED' ? 'primary' : 'outline'}
        size="small"
        disabled={saving}
        loading={savingStatus === 'SUSPENDED'}
        onPress={() => onStatusChange(userId, membership, 'SUSPENDED')}
        testID={`${testIds.membershipSuspend}-${membership.id}`}
      >
        Suspend
      </Button>
    </View>
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

const UserRow = ({ user, selected, onSelect, testId, children }) => (
  <Pressable
    onPress={onSelect}
    style={[styles.userItem, selected ? styles.selectedItem : null]}
    accessibilityRole="button"
    accessibilityState={{ selected }}
    testID={`${testId}-${user.id}`}
  >
    <View style={styles.userHeading}>
      <View style={styles.flex}>
        <Text variant="h3">{user.name}</Text>
        <Text variant="body">{user.email}</Text>
      </View>
      <Text variant="label">{user.status}</Text>
    </View>
    <View style={styles.capabilities}>
      <Capability label="Capture" active={user.capabilities.canCaptureData} />
      <Capability label="Validate" active={user.capabilities.canValidateData} />
      <Capability label="Admin" active={user.capabilities.canManageUsers} />
    </View>
    {children}
  </Pressable>
);

const FacilityRow = ({ facility, selected, onSelect, testId }) => (
  <Pressable
    onPress={onSelect}
    style={[styles.facilityItem, selected ? styles.selectedItem : null]}
    accessibilityRole="button"
    accessibilityState={{ selected }}
    testID={`${testId}-${facility.id}`}
  >
    <Text variant="label">{facility.name}</Text>
    <Text variant="caption">
      {[facility.district, facility.region, facility.verificationStatus].filter(Boolean).join(' - ')}
    </Text>
  </Pressable>
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

  const canCreate = screen.newUser.name.trim() && screen.newUser.email.trim() && screen.newUser.password.length >= 8;
  const canAssign = Boolean(screen.selectedUser?.id && screen.selectedFacilityId && screen.selectedRole);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      testID={screen.testIds.screen}
      accessibilityLabel="User management screen"
    >
      <View style={styles.header}>
        <Text variant="h1">User Management</Text>
        <Button variant="outline" onPress={screen.refresh} loading={screen.isLoadingUsers} testID={screen.testIds.refresh}>
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

      <View style={styles.searchRow}>
        <TextField
          label="Search users"
          placeholder="Name, email, or phone"
          value={screen.userQuery}
          onChangeText={screen.setUserQuery}
          testID={screen.testIds.userSearch}
          style={styles.searchInput}
        />
        <TextField
          label="Search facilities"
          placeholder="Facility, district, or region"
          value={screen.facilityQuery}
          onChangeText={screen.setFacilityQuery}
          testID={screen.testIds.facilitySearch}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.section} testID={screen.testIds.createForm}>
        <Text variant="h2">Add User</Text>
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
        <Button
          disabled={!canCreate || screen.isSaving}
          loading={screen.isSaving}
          onPress={screen.handleCreateUser}
          testID={screen.testIds.create}
        >
          Add User
        </Button>
      </View>

      <View style={styles.section} testID={screen.testIds.assignmentForm}>
        <Text variant="h2">Facility Access</Text>
        <View style={styles.formGrid}>
          <Select
            label="User"
            options={screen.userOptions}
            value={screen.selectedUser?.id || screen.selectedUserId}
            onValueChange={screen.setSelectedUserId}
            searchable
            style={styles.formField}
          />
          <Select
            label="Role"
            options={screen.roleOptions}
            value={screen.selectedRole}
            onValueChange={screen.setSelectedRole}
            style={styles.formField}
          />
          <Select
            label="Status"
            options={screen.statusOptions}
            value={screen.selectedStatus}
            onValueChange={screen.setSelectedStatus}
            style={styles.formField}
          />
        </View>
        <Text variant="label">
          {screen.selectedFacility ? screen.selectedFacility.name : 'No facility selected'}
        </Text>
        <Button
          disabled={!canAssign || screen.isSaving}
          loading={screen.isSaving}
          onPress={screen.handleAssignMembership}
          testID={screen.testIds.assign}
        >
          Save Rights
        </Button>
      </View>

      <View style={styles.section} testID={screen.testIds.facilityList}>
        <Text variant="h2">Facilities</Text>
        {screen.isLoadingFacilities ? <Text variant="body">Loading facilities...</Text> : null}
        {screen.facilities.map((facility) => (
          <FacilityRow
            key={facility.id}
            facility={facility}
            selected={facility.id === screen.selectedFacilityId}
            onSelect={() => screen.setSelectedFacilityId(facility.id)}
            testId={screen.testIds.facilityItem}
          />
        ))}
      </View>

      <View style={styles.section} testID={screen.testIds.userList}>
        <View style={styles.sectionHeader}>
          <Text variant="h2">Users</Text>
          <Text variant="caption">{screen.userMeta.total || screen.users.length} total</Text>
        </View>
        {screen.isLoadingUsers ? <Text variant="body">Loading users...</Text> : null}
        {!screen.isLoadingUsers && screen.users.length === 0 ? <Text variant="body">No users found.</Text> : null}
        {screen.users.map((user) => (
          <UserRow
            key={user.id}
            user={user}
            selected={user.id === screen.selectedUser?.id}
            onSelect={() => screen.setSelectedUserId(user.id)}
            testId={screen.testIds.userItem}
          >
            <View style={styles.membershipList}>
              {user.memberships.length ? (
                user.memberships.map((membership) => (
                  <UserMembership
                    key={membership.id}
                    membership={membership}
                    saving={screen.isSaving}
                    savingStatus={
                      screen.savingMembership?.userId === user.id &&
                      screen.savingMembership?.membershipId === membership.id
                        ? screen.savingMembership.status
                        : null
                    }
                    savedMessage={
                      screen.savedMembership?.userId === user.id &&
                      screen.savedMembership?.membershipId === membership.id
                        ? screen.savedMembership.message
                        : null
                    }
                    testIds={screen.testIds}
                    userId={user.id}
                    onStatusChange={screen.updateMembershipStatus}
                  />
                ))
              ) : (
                <Text variant="caption">No facility roles</Text>
              )}
            </View>
          </UserRow>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    gap: 16,
    padding: 16,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  notice: {
    borderLeftWidth: 3,
    gap: 6,
    padding: 10,
  },
  errorNotice: {
    backgroundColor: '#FFEBEE',
    borderLeftColor: '#FF3B30',
  },
  successNotice: {
    backgroundColor: '#EAF7EE',
    borderLeftColor: '#248A3D',
  },
  summary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryItem: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    minWidth: 120,
    padding: 12,
  },
  searchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  searchInput: {
    flexGrow: 1,
    minWidth: 220,
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    gap: 10,
    paddingTop: 14,
  },
  sectionHeader: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: 8,
  },
  formGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  formField: {
    flexGrow: 1,
    minWidth: 220,
  },
  facilityItem: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    gap: 4,
    padding: 10,
  },
  selectedItem: {
    borderColor: '#007AFF',
    backgroundColor: '#EAF3FF',
  },
  userItem: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    gap: 10,
    padding: 12,
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
    borderWidth: 1,
    borderColor: '#D1D1D6',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  capabilityActive: {
    backgroundColor: '#EAF7EE',
    borderColor: '#248A3D',
  },
  membershipList: {
    gap: 8,
  },
  membership: {
    alignItems: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  membershipText: {
    flex: 1,
    gap: 2,
    minWidth: 180,
  },
  membershipActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  savedStatus: {
    color: '#248A3D',
    width: '100%',
  },
});

export default UserManagementScreen;
