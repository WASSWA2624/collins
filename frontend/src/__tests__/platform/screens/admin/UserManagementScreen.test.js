const React = require('react');
const { fireEvent, render } = require('@testing-library/react-native');

const mockUpdateMembershipStatus = jest.fn();

jest.mock(
  '@platform/screens/admin/UserManagementScreen/useUserManagementScreen',
  () => ({
    __esModule: true,
    default: jest.fn(),
  })
);

jest.mock('@platform/components', () => {
  const mockReact = require('react');
  const RN = require('react-native');

  return {
    Button: ({ children, disabled, loading, onPress, testID }) =>
      mockReact.createElement(
        RN.Pressable,
        {
          accessibilityState: {
            busy: Boolean(loading),
            disabled: Boolean(disabled || loading),
          },
          disabled: disabled || loading,
          onPress,
          testID,
        },
        children
      ),
    Select: ({ testID }) => mockReact.createElement(RN.View, { testID }),
    Text: ({ children, testID }) =>
      mockReact.createElement(RN.Text, { testID }, children),
    TextField: ({ testID }) =>
      mockReact.createElement(RN.TextInput, { testID }),
  };
});

const useUserManagementScreen =
  require('@platform/screens/admin/UserManagementScreen/useUserManagementScreen').default;
const UserManagementScreen =
  require('@platform/screens/admin/UserManagementScreen').default;

const baseScreenState = {
  canManage: true,
  facilities: [],
  facilityQuery: '',
  handleAssignMembership: jest.fn(),
  handleCreateUser: jest.fn(),
  isLoadingFacilities: false,
  isLoadingUsers: false,
  isSaving: false,
  newUser: { name: '', email: '', phone: '', password: '' },
  notice: null,
  refresh: jest.fn(),
  roleOptions: [],
  savedMembership: null,
  savingMembership: null,
  selectedFacility: null,
  selectedFacilityId: '',
  selectedRole: '',
  selectedStatus: '',
  selectedUser: null,
  selectedUserId: '',
  setFacilityQuery: jest.fn(),
  setSelectedFacilityId: jest.fn(),
  setSelectedRole: jest.fn(),
  setSelectedStatus: jest.fn(),
  setSelectedUserId: jest.fn(),
  setUserQuery: jest.fn(),
  statusOptions: [],
  summary: { total: 1, clinicians: 0, validators: 0, administrators: 0 },
  testIds: {
    screen: 'user-management-screen',
    forbidden: 'user-management-forbidden',
    userSearch: 'user-management-user-search',
    facilitySearch: 'user-management-facility-search',
    summary: 'user-management-summary',
    createForm: 'user-management-create-form',
    userList: 'user-management-user-list',
    userItem: 'user-management-user-item',
    facilityList: 'user-management-facility-list',
    facilityItem: 'user-management-facility-item',
    assignmentForm: 'user-management-assignment-form',
    assign: 'user-management-assign',
    create: 'user-management-create',
    refresh: 'user-management-refresh',
    notice: 'user-management-notice',
    membershipApprove: 'user-management-membership-approve',
    membershipSuspend: 'user-management-membership-suspend',
    membershipSaved: 'user-management-membership-saved',
  },
  updateMembershipStatus: mockUpdateMembershipStatus,
  updateNewUser: jest.fn(),
  userMeta: { total: 1 },
  userOptions: [],
  userQuery: '',
  users: [
    {
      id: 'user-1',
      name: 'Admin Managed',
      email: 'managed@example.com',
      status: 'ACTIVE',
      capabilities: {
        canCaptureData: false,
        canValidateData: false,
        canManageUsers: false,
      },
      memberships: [
        {
          id: 'membership-1',
          facilityId: 'facility-1',
          roleLabel: 'Clinician',
          status: 'PENDING',
          facility: { id: 'facility-1', name: 'Mulago ICU' },
        },
      ],
    },
  ],
};

describe('UserManagementScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useUserManagementScreen.mockReturnValue(baseScreenState);
  });

  it('sends the row user id when approving a membership', () => {
    const { getByTestId } = render(<UserManagementScreen />);

    fireEvent.press(
      getByTestId('user-management-membership-approve-membership-1')
    );

    expect(mockUpdateMembershipStatus).toHaveBeenCalledWith(
      'user-1',
      baseScreenState.users[0].memberships[0],
      'APPROVED'
    );
  });

  it('shows an inline saved confirmation for the approved membership', () => {
    useUserManagementScreen.mockReturnValue({
      ...baseScreenState,
      savedMembership: {
        userId: 'user-1',
        membershipId: 'membership-1',
        status: 'APPROVED',
        message: 'Approval saved',
      },
    });

    const { getByTestId, getByText } = render(<UserManagementScreen />);

    expect(getByText('Approval saved')).toBeTruthy();
    expect(
      getByTestId('user-management-membership-saved-membership-1')
    ).toBeTruthy();
  });
});
