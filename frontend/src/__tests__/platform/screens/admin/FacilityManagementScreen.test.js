const React = require('react');
const { fireEvent, render } = require('@testing-library/react-native');

jest.mock(
  '@platform/screens/admin/FacilityManagementScreen/useFacilityManagementScreen',
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
    TextField: ({ onChangeText, testID, value }) =>
      mockReact.createElement(RN.TextInput, { onChangeText, testID, value }),
  };
});

const useFacilityManagementScreen =
  require('@platform/screens/admin/FacilityManagementScreen/useFacilityManagementScreen').default;
const FacilityManagementScreen =
  require('@platform/screens/admin/FacilityManagementScreen').default;

const baseScreenState = {
  canDelete: true,
  canManage: true,
  canSave: true,
  clearSearch: jest.fn(),
  deleteBlockers: [],
  deleteSelectedFacility: jest.fn(),
  deletingFacilityId: '',
  facilities: [
    {
      id: 'facility-1',
      name: 'Mulago National Referral Hospital',
      registryCode: 'UG-001',
      district: 'Kampala',
      region: 'Central',
      type: 'National referral hospital',
      ownership: 'Government',
      verificationStatus: 'VERIFIED',
      counts: { memberships: 0, admissions: 0, datasetCases: 0 },
    },
  ],
  filteredFacilities: [
    {
      id: 'facility-1',
      name: 'Mulago National Referral Hospital',
      registryCode: 'UG-001',
      district: 'Kampala',
      region: 'Central',
      type: 'National referral hospital',
      ownership: 'Government',
      verificationStatus: 'VERIFIED',
      counts: { memberships: 0, admissions: 0, datasetCases: 0 },
    },
  ],
  form: {
    registryCode: 'UG-001',
    name: 'Mulago National Referral Hospital',
    district: 'Kampala',
    region: 'Central',
    type: 'National referral hospital',
    ownership: 'Government',
    verificationStatus: 'VERIFIED',
    abgAvailability: '',
  },
  hasFilters: false,
  isCreating: false,
  isLoading: false,
  isSaving: false,
  notice: null,
  query: '',
  refresh: jest.fn(),
  saveFacility: jest.fn(),
  selectedFacility: {
    id: 'facility-1',
    name: 'Mulago National Referral Hospital',
    verificationStatus: 'VERIFIED',
  },
  selectedFacilityId: 'facility-1',
  setFormField: jest.fn(),
  setQuery: jest.fn(),
  setSelectedFacilityId: jest.fn(),
  startCreate: jest.fn(),
  statusOptions: [{ label: 'Verified', value: 'VERIFIED' }],
  summary: { total: 1, verified: 1, pending: 0, suspended: 0 },
  testIds: {
    screen: 'facility-management-screen',
    forbidden: 'facility-management-forbidden',
    search: 'facility-management-search',
    clearSearch: 'facility-management-clear-search',
    refresh: 'facility-management-refresh',
    createMode: 'facility-management-create-mode',
    save: 'facility-management-save',
    delete: 'facility-management-delete',
    notice: 'facility-management-notice',
    summary: 'facility-management-summary',
    list: 'facility-management-list',
    item: 'facility-management-item',
    form: 'facility-management-form',
    status: 'facility-management-status',
  },
};

describe('FacilityManagementScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useFacilityManagementScreen.mockReturnValue(baseScreenState);
  });

  it('selects a facility from the registry list', () => {
    const { getByTestId } = render(<FacilityManagementScreen />);

    fireEvent.press(getByTestId('facility-management-item-facility-1'));

    expect(baseScreenState.setSelectedFacilityId).toHaveBeenCalledWith('facility-1');
  });

  it('saves facility edits from the details panel', () => {
    const { getByTestId } = render(<FacilityManagementScreen />);

    fireEvent.press(getByTestId('facility-management-save'));

    expect(baseScreenState.saveFacility).toHaveBeenCalled();
  });

  it('disables delete when linked facility data exists', () => {
    useFacilityManagementScreen.mockReturnValue({
      ...baseScreenState,
      canDelete: false,
      deleteBlockers: [{ key: 'memberships', label: 'memberships', count: 1 }],
    });

    const { getByTestId } = render(<FacilityManagementScreen />);

    expect(getByTestId('facility-management-delete').props.accessibilityState.disabled).toBe(true);
  });
});
