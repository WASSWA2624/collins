/**
 * useDashboardScreen Tests
 * File: useDashboardScreen.test.js
 */
const React = require('react');
const { render, waitFor } = require('@testing-library/react-native');
const { useAuth } = require('@hooks');
const { DASHBOARD_TYPES, loadDashboardUseCase } = require('@features/dashboard');
const useDashboardScreen = require('@platform/screens/dashboard/DashboardScreen/useDashboardScreen').default;

jest.mock('@hooks', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@features/dashboard', () => {
  const actual = jest.requireActual('@features/dashboard');
  return {
    ...actual,
    loadDashboardUseCase: jest.fn(),
  };
});

const platformAdminUser = {
  id: 'admin-1',
  roles: ['PLATFORM_ADMIN'],
  activeFacility: {
    id: 'facility-1',
    facilityId: 'facility-1',
    name: 'Development Admin Facility',
    roles: ['PLATFORM_ADMIN'],
  },
  memberships: [
    {
      id: 'membership-1',
      facilityId: 'facility-1',
      role: 'PLATFORM_ADMIN',
      status: 'APPROVED',
      facility: { id: 'facility-1', name: 'Development Admin Facility' },
    },
  ],
};

const TestComponent = ({ onResult }) => {
  const result = useDashboardScreen();
  React.useEffect(() => {
    onResult(result);
  }, [onResult, result]);
  return null;
};

describe('useDashboardScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      user: platformAdminUser,
      roles: ['platform_admin'],
    });
  });

  it('loads platform-scoped dashboard data for platform admins by default', async () => {
    let screen;
    loadDashboardUseCase.mockResolvedValue({
      dashboard: DASHBOARD_TYPES.OPERATIONAL,
      scope: { scope: 'platform' },
      counts: { activeAdmissions: 3 },
    });

    render(<TestComponent onResult={(value) => { screen = value; }} />);

    await waitFor(() => {
      expect(loadDashboardUseCase).toHaveBeenCalledWith(DASHBOARD_TYPES.OPERATIONAL, { days: 14 });
    });
    await waitFor(() => {
      expect(screen.scopeLabel).toBe('Platform scope');
    });
  });

  it('returns tab-specific error copy for in-place dashboard failures', async () => {
    let screen;
    loadDashboardUseCase.mockRejectedValue({
      safeMessage: 'Server error occurred',
      code: 'SERVER_ERROR',
    });

    render(<TestComponent onResult={(value) => { screen = value; }} />);

    await waitFor(() => {
      expect(screen.errorTitle).toBe('Unable to load operations dashboard');
      expect(screen.errorMessage).toBe('Something went wrong while loading the dashboard. Please try again.');
      expect(screen.dashboard).toBeNull();
    });
  });

  it('uses friendly connection copy for dashboard network failures', async () => {
    let screen;
    loadDashboardUseCase.mockRejectedValue({
      safeMessage: 'Backend database request failed',
      code: 'NETWORK_ERROR',
    });

    render(<TestComponent onResult={(value) => { screen = value; }} />);

    await waitFor(() => {
      expect(screen.errorMessage).toBe('Unable to load dashboard data. Please check your connection and try again.');
    });
  });
});
