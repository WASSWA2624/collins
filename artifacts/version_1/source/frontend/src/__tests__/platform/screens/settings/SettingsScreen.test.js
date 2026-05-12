/**
 * SettingsScreen Component Tests
 */
const React = require('react');
const { render, waitFor } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');
const { useDispatch, useSelector } = require('react-redux');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('@services/storage', () => ({
  async: {
    setItem: jest.fn(),
  },
}));

jest.mock('@features/settings', () => ({
  canManageFacilitySettings: jest.fn((roles) => roles.includes('FACILITY_ADMIN')),
  canSeeGovernanceSettings: jest.fn(() => true),
  getRoleLabel: jest.fn((role) => role),
  loadMySettingsUseCase: jest.fn().mockResolvedValue({
    account: { id: 'user-1', name: 'Ada Clinician', phone: null },
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
    offlineSyncPreferences: {
      offlineModeEnabled: true,
      syncOnWifiOnly: false,
      autoSyncEnabled: true,
      backgroundSyncEnabled: true,
      retryFailedSyncAutomatically: true,
      syncIntervalMinutes: 15,
      purgeSyncedDraftsAfterDays: 30,
      conflictResolutionMode: 'manual_review',
    },
    privacyControls: {
      hidePatientIdentifiersInLists: false,
      requireUnlockForIdentifiers: true,
      shareUsageDiagnostics: false,
      allowDeidentifiedAnalytics: true,
      allowDeidentifiedTrainingDatasetContribution: false,
    },
    displayPreferences: {
      themePreference: 'light',
    },
  }),
  loadFacilitySettingsUseCase: jest.fn().mockResolvedValue({
    facility: { id: 'facility-1', name: 'Mulago ICU' },
    referenceSettings: {
      activeReferenceRuleIds: [],
      requireVerifiedReferenceRules: true,
      defaultReferenceRuleScope: 'global',
      showReferenceVersionToClinicians: true,
    },
    workflowSettings: {
      requireReasonForClinicalOverride: true,
      requireSecondReviewerForCriticalFlags: false,
      lockReviewedClinicalRecords: true,
    },
    privacyControls: {
      allowDeidentifiedExports: false,
      requireExportAuditReason: true,
      exportPatientIdentifiers: false,
      allowRawNotesInExports: false,
    },
    governanceSettings: {
      datasetExportsRequireEthicsApproval: true,
      datasetExportsRequireReview: true,
      allowUnreviewedDatasetExports: false,
    },
    modelVisibility: {
      liveClinicalPredictionEnabled: false,
      clinicianVisibleModelVersionIds: [],
      showShadowModelOutputsToClinicians: false,
    },
  }),
  updateMySettingsUseCase: jest.fn(),
  updateFacilitySettingsUseCase: jest.fn(),
}));

jest.mock('@platform/components', () => {
  const mockReact = require('react');
  const RN = require('react-native');
  return {
    Text: ({ children, testID }) => mockReact.createElement(RN.Text, { testID }, children),
    Select: ({ testID }) => mockReact.createElement(RN.View, { testID }),
    Switch: ({ testID }) => mockReact.createElement(RN.View, { testID }),
    TextField: ({ testID }) => mockReact.createElement(RN.TextInput, { testID }),
    Button: ({ children, testID }) => mockReact.createElement(RN.Text, { testID }, children),
    Stack: ({ children, testID }) => mockReact.createElement(RN.View, { testID }, children),
    ThemeControls: ({ testID }) => mockReact.createElement(RN.View, { testID }),
    LanguageControls: ({ testID }) => mockReact.createElement(RN.View, { testID }),
  };
});

const SettingsScreenAndroid = require('@platform/screens/settings/SettingsScreen/SettingsScreen.android').default;
const SettingsScreenIOS = require('@platform/screens/settings/SettingsScreen/SettingsScreen.ios').default;
const SettingsScreenWeb = require('@platform/screens/settings/SettingsScreen/SettingsScreen.web').default;

const lightThemeModule = require('@theme/light.theme');
const lightTheme = lightThemeModule.default || lightThemeModule;

const renderWithTheme = (component) =>
  render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);

describe('SettingsScreen', () => {
  const mockT = jest.fn((key, params) => {
    if (key === 'settings.sync.intervalOption') return `${params.value} minutes`;
    if (key === 'settings.sync.purgeOption') return `${params.value} days`;
    const translations = {
      'settings.title': 'Settings',
      'settings.screen.label': 'Settings screen',
      'settings.account.title': 'Account and facility',
      'settings.accessibility.title': 'Appearance and accessibility',
      'settings.theme.label': 'Theme',
      'settings.density.label': 'Density',
      'settings.density.options.compact': 'Compact',
      'settings.density.options.comfortable': 'Comfortable',
      'settings.language.label': 'Language',
      'settings.sync.title': 'Offline and sync',
      'settings.privacyControls.title': 'Privacy and logging',
      'settings.governance.title': 'Governance and clinical workflow',
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
    useSelector.mockImplementation((selector) => {
      const mockState = {
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
      return selector(mockState);
    });
  });

  const expectSettingsSections = (getByTestId) => {
    expect(getByTestId('settings-screen')).toBeTruthy();
    expect(getByTestId('settings-title')).toBeTruthy();
    expect(getByTestId('settings-account-section')).toBeTruthy();
    expect(getByTestId('settings-theme-section')).toBeTruthy();
    expect(getByTestId('settings-density-section')).toBeTruthy();
    expect(getByTestId('settings-language-section')).toBeTruthy();
    expect(getByTestId('settings-sync-section')).toBeTruthy();
    expect(getByTestId('settings-privacy-section')).toBeTruthy();
    expect(getByTestId('settings-governance-section')).toBeTruthy();
    expect(getByTestId('settings-model-visibility-status')).toBeTruthy();
  };

  it('renders on Android', async () => {
    const { getByTestId } = renderWithTheme(<SettingsScreenAndroid />);
    await waitFor(() => expectSettingsSections(getByTestId));
  });

  it('renders on iOS', async () => {
    const { getByTestId } = renderWithTheme(<SettingsScreenIOS />);
    await waitFor(() => expectSettingsSections(getByTestId));
  });

  it('renders on Web', async () => {
    const { getByTestId } = renderWithTheme(<SettingsScreenWeb />);
    await waitFor(() => expectSettingsSections(getByTestId));
  });
});
