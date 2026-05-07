/**
 * useSettingsScreen Hook Tests
 */
const React = require('react');
const TestRenderer = require('react-test-renderer');
const { useDispatch, useSelector } = require('react-redux');
const { useI18n } = require('@hooks');
const {
  loadFacilitySettingsUseCase,
  loadMySettingsUseCase,
  updateMySettingsUseCase,
} = require('@features/settings');

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@services/storage', () => ({
  async: {
    setItem: jest.fn(),
  },
}));

jest.mock('@features/settings', () => ({
  canManageFacilitySettings: jest.fn((roles) =>
    roles.includes('PLATFORM_ADMIN') || roles.includes('FACILITY_ADMIN')
  ),
  canSeeGovernanceSettings: jest.fn((roles) =>
    roles.includes('PLATFORM_ADMIN') ||
    roles.includes('FACILITY_ADMIN') ||
    roles.includes('RESEARCH_GOVERNANCE_OFFICER') ||
    roles.includes('MODEL_GOVERNANCE_OFFICER')
  ),
  getRoleLabel: jest.fn((role) => role),
  loadMySettingsUseCase: jest.fn(),
  loadFacilitySettingsUseCase: jest.fn(),
  updateMySettingsUseCase: jest.fn(),
  updateFacilitySettingsUseCase: jest.fn(),
}));

const useSettingsScreen = require('@platform/screens/settings/SettingsScreen/useSettingsScreen').default;
const { DENSITY_MODES } = require('@platform/screens/settings/SettingsScreen/types');

const act = TestRenderer.act;
const renderHook = async (hook) => {
  const result = {};
  const HookHarness = () => {
    Object.assign(result, hook());
    return null;
  };
  let renderer;
  await act(async () => {
    renderer = TestRenderer.create(React.createElement(HookHarness));
    await Promise.resolve();
    await Promise.resolve();
  });
  return { result: { current: result }, unmount: () => renderer.unmount() };
};

const userSettingsFixture = {
  account: { id: 'user-1', name: 'Ada Clinician', phone: '+256700000000' },
  activeFacilityId: 'facility-1',
  memberships: [
    {
      id: 'membership-1',
      facilityId: 'facility-1',
      role: 'FACILITY_ADMIN',
      status: 'APPROVED',
      facility: { id: 'facility-1', name: 'Mulago ICU' },
    },
  ],
  roleVisibility: {
    activeRole: 'FACILITY_ADMIN',
    visibleRoles: ['FACILITY_ADMIN'],
    showFacilitySwitcher: true,
  },
  displayPreferences: {
    themePreference: 'dark',
  },
  offlineSyncPreferences: {
    offlineModeEnabled: true,
    autoSyncEnabled: true,
    conflictResolutionMode: 'manual_review',
    syncIntervalMinutes: 15,
    purgeSyncedDraftsAfterDays: 30,
  },
  privacyControls: {
    hidePatientIdentifiersInLists: false,
    requireUnlockForIdentifiers: true,
  },
};

describe('useSettingsScreen', () => {
  const mockT = jest.fn((key, params) => {
    if (key === 'settings.sync.intervalOption') return `${params.value} minutes`;
    if (key === 'settings.sync.purgeOption') return `${params.value} days`;
    const translations = {
      'settings.density.options.compact': 'Compact',
      'settings.density.options.comfortable': 'Comfortable',
      'settings.account.noActiveFacility': 'No active facility',
      'settings.governance.referenceScope.global': 'Global verified rules',
      'settings.governance.referenceScope.facility': 'Facility verified rules',
    };
    return translations[key] || key;
  });

  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useDispatch.mockReturnValue(mockDispatch);
    const state = {
      ui: {
        theme: 'light',
        density: 'comfortable',
        footerVisible: true,
      },
      network: {
        isOnline: true,
        isSyncing: false,
        quality: 'good',
      },
    };
    useSelector.mockImplementation((selector) => selector(state));
    loadMySettingsUseCase.mockResolvedValue(userSettingsFixture);
    loadFacilitySettingsUseCase.mockResolvedValue({
      facility: { id: 'facility-1', name: 'Mulago ICU' },
      modelVisibility: {
        liveClinicalPredictionEnabled: false,
        clinicianVisibleModelVersionIds: [],
        showShadowModelOutputsToClinicians: false,
      },
    });
    updateMySettingsUseCase.mockResolvedValue(userSettingsFixture);
  });

  it('returns test ids and local display state', async () => {
    const { result } = await renderHook(() => useSettingsScreen());

    expect(result.current.testIds.screen).toBe('settings-screen');
    expect(result.current.density).toBe('comfortable');
    expect(result.current.densityOptions).toHaveLength(2);
    expect(result.current.densityOptions[0].value).toBe(DENSITY_MODES.COMPACT);
  });

  it('loads account, facility, and role settings', async () => {
    const { result } = await renderHook(() => useSettingsScreen());

    expect(result.current.accountDraft.name).toBe('Ada Clinician');
    expect(result.current.activeFacilityValue).toBe('facility-1');
    expect(result.current.facilityOptions[0]).toEqual({
      label: 'Mulago ICU',
      value: 'facility-1',
    });
    expect(result.current.roleOptions[0].value).toBe('FACILITY_ADMIN');
    expect(result.current.canManageActiveFacility).toBe(true);
  });

  it('saves account updates through the settings use case', async () => {
    const { result } = await renderHook(() => useSettingsScreen());

    await act(async () => {
      result.current.setAccountField('name', 'Ada Updated');
    });
    await act(async () => {
      await result.current.saveAccountSettings();
    });

    expect(updateMySettingsUseCase).toHaveBeenCalledWith({
      account: {
        name: 'Ada Updated',
        phone: '+256700000000',
      },
      reason: 'Account settings updated by user',
    });
  });

  it('scopes manage access to the selected facility roles', async () => {
    loadMySettingsUseCase.mockResolvedValue({
      ...userSettingsFixture,
      activeFacilityId: 'facility-2',
      memberships: [
        ...userSettingsFixture.memberships,
        {
          id: 'membership-2',
          facilityId: 'facility-2',
          role: 'CLINICIAN',
          status: 'APPROVED',
          facility: { id: 'facility-2', name: 'Kiruddu ICU' },
        },
      ],
      roleVisibility: {
        activeRole: 'CLINICIAN',
        visibleRoles: ['FACILITY_ADMIN', 'CLINICIAN'],
        showFacilitySwitcher: true,
      },
    });
    loadFacilitySettingsUseCase.mockResolvedValue({
      facility: { id: 'facility-2', name: 'Kiruddu ICU' },
      modelVisibility: {
        liveClinicalPredictionEnabled: false,
        clinicianVisibleModelVersionIds: [],
        showShadowModelOutputsToClinicians: false,
      },
    });

    const { result } = await renderHook(() => useSettingsScreen());

    expect(result.current.activeFacilityRoles).toEqual(['CLINICIAN']);
    expect(result.current.canManageActiveFacility).toBe(false);
  });

  it('validates required profile fields before saving', async () => {
    const { result } = await renderHook(() => useSettingsScreen());

    await act(async () => {
      result.current.setAccountField('name', ' ');
    });
    await act(async () => {
      await result.current.saveAccountSettings();
    });

    expect(updateMySettingsUseCase).not.toHaveBeenCalled();
    expect(result.current.errorMessageKey).toBe('settings.account.validation.profileInvalid');
    expect(result.current.accountErrors.name).toBe('settings.account.validation.nameRequired');
  });
});
