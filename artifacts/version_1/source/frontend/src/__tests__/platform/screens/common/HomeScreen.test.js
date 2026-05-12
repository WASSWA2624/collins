/**
 * HomeScreen Component Tests
 * File: HomeScreen.test.js
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@hooks/useNetwork', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    isOnline: true,
    isOffline: false,
    isSyncing: false,
    networkQuality: 'good',
    isLowQuality: false,
  })),
}));

jest.mock('@hooks/useAuth', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    user: {
      id: 'clinician-1',
      memberships: [
        {
          id: 'membership-1',
          facilityId: 'facility-1',
          role: 'CLINICIAN',
          status: 'APPROVED',
          facility: { id: 'facility-1', name: 'City ICU' },
        },
      ],
    },
  })),
}));

jest.mock('@features/home', () => ({
  loadHomeSummaryUseCase: jest.fn(() => new Promise(() => {})),
}));

const HomeScreenAndroid = require('@platform/screens/common/HomeScreen/HomeScreen.android').default;
const HomeScreenIOS = require('@platform/screens/common/HomeScreen/HomeScreen.ios').default;
const HomeScreenWeb = require('@platform/screens/common/HomeScreen/HomeScreen.web').default;

const lightThemeModule = require('@theme/light.theme');
const lightTheme = lightThemeModule.default || lightThemeModule;

const renderWithTheme = (component) =>
  render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);

describe('HomeScreen', () => {
  const mockT = jest.fn((key, opts) => {
    const translations = {
      'home.title': 'Home',
      'home.welcome.title': 'Clinical workflow',
      'home.welcome.message': 'Status message',
      'home.welcome.logoLabel': 'App logo',
      'home.actions.title': 'Workflow actions',
      'home.actions.accessibilityLabel': opts?.name ? `Open ${opts.name}` : 'Open {{name}}',
      'home.actions.settings.title': 'Settings',
      'home.actions.meta.open': 'Open',
      'home.status.title': 'Operational status',
      'home.status.facility.label': 'Facility',
      'home.status.facility.empty': 'Not selected',
      'home.status.network.label': 'Network',
      'home.status.network.values.online': 'Online',
      'home.status.activeAdmissions.label': 'Active admissions',
      'home.status.activeAdmissions.detail': `${opts?.count ?? 0} active patients`,
      'home.status.drafts.label': 'Drafts',
      'home.status.drafts.detail': `${opts?.count ?? 0} waiting to sync`,
      'home.status.syncAttention.label': 'Sync attention',
      'home.status.syncAttention.detail': `${opts?.count ?? 0} conflicts`,
    };
    return translations[key] ?? key;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
  });

  it('renders on Android', () => {
    const { getByTestId } = renderWithTheme(<HomeScreenAndroid />);
    expect(getByTestId('home-screen')).toBeTruthy();
  });

  it('renders on iOS', () => {
    const { getByTestId } = renderWithTheme(<HomeScreenIOS />);
    expect(getByTestId('home-screen')).toBeTruthy();
  });

  it('renders on Web', () => {
    const { getByTestId } = renderWithTheme(<HomeScreenWeb />);
    expect(getByTestId('home-screen')).toBeTruthy();
  });
});
