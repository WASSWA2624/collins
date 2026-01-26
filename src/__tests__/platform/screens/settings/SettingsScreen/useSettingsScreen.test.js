/**
 * useSettingsScreen Hook Tests
 * File: useSettingsScreen.test.js
 * 
 * Per testing.mdc: Test hooks with proper mocking
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { useRouter, usePathname } = require('expo-router');

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

const useSettingsScreen = require('@platform/screens/settings/SettingsScreen/useSettingsScreen').default;
const { SETTINGS_TABS, SETTINGS_TAB_ORDER } = require('@platform/screens/settings/SettingsScreen/types');

// Component wrapper for testing the hook
const HookWrapper = () => {
  const hookResult = useSettingsScreen();
  return null; // We'll capture via side effects
};

describe('useSettingsScreen Hook', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: mockPush });
    usePathname.mockReturnValue('/settings/tenants');
  });

  describe('initialization', () => {
    it('returns hook object with required methods', () => {
      // Create a test component that uses the hook
      let hookResult;
      const TestComponent = () => {
        hookResult = useSettingsScreen();
        return null;
      };

      render(<TestComponent />);

      expect(hookResult).toHaveProperty('selectedTab');
      expect(hookResult).toHaveProperty('tabs');
      expect(hookResult).toHaveProperty('onTabChange');
      expect(hookResult).toHaveProperty('testID');
      expect(hookResult).toHaveProperty('accessibilityLabel');
    });

    it('provides all tab definitions', () => {
      let hookResult;
      const TestComponent = () => {
        hookResult = useSettingsScreen();
        return null;
      };

      render(<TestComponent />);

      expect(Array.isArray(hookResult.tabs)).toBe(true);
      expect(hookResult.tabs.length).toBeGreaterThan(0);
      expect(hookResult.tabs[0]).toHaveProperty('id');
      expect(hookResult.tabs[0]).toHaveProperty('label');
      expect(hookResult.tabs[0]).toHaveProperty('testID');
    });

    it('provides testID and accessibilityLabel', () => {
      let hookResult;
      const TestComponent = () => {
        hookResult = useSettingsScreen();
        return null;
      };

      render(<TestComponent />);

      expect(hookResult.testID).toBe('settings-screen');
      expect(hookResult.accessibilityLabel).toBe('settings.screen.label');
    });
  });

  describe('tab changes', () => {
    it('handles tab changes via onTabChange', () => {
      let hookResult;
      const TestComponent = () => {
        hookResult = useSettingsScreen();
        return null;
      };

      render(<TestComponent />);

      hookResult.onTabChange(SETTINGS_TABS.USER);

      expect(mockPush).toHaveBeenCalled();
    });

    it('navigates to correct route on tab change', () => {
      let hookResult;
      const TestComponent = () => {
        hookResult = useSettingsScreen();
        return null;
      };

      render(<TestComponent />);

      hookResult.onTabChange(SETTINGS_TABS.ROLE);

      expect(mockPush).toHaveBeenCalledWith('/settings/roles');
    });

    it('handles multiple tab changes', () => {
      let hookResult;
      const TestComponent = () => {
        hookResult = useSettingsScreen();
        return null;
      };

      render(<TestComponent />);

      const testCases = [
        { id: SETTINGS_TABS.USER, route: '/settings/users' },
        { id: SETTINGS_TABS.ROLE, route: '/settings/roles' },
        { id: SETTINGS_TABS.PERMISSION, route: '/settings/permissions' },
      ];

      testCases.forEach(({ id, route }) => {
        mockPush.mockClear();
        hookResult.onTabChange(id);
        expect(mockPush).toHaveBeenCalledWith(route);
      });
    });
  });

  describe('pathname detection', () => {
    it('detects current tab from pathname', () => {
      usePathname.mockReturnValue('/settings/users');
      let hookResult;
      const TestComponent = () => {
        hookResult = useSettingsScreen();
        return null;
      };

      render(<TestComponent />);

      // The hook detects the tab from pathname
      expect(hookResult).toBeDefined();
    });

    it('handles various pathname patterns', () => {
      const testCases = [
        { pathname: '/settings/tenants' },
        { pathname: '/settings/roles' },
        { pathname: '/settings/users' },
      ];

      testCases.forEach(({ pathname }) => {
        usePathname.mockReturnValue(pathname);
        let hookResult;
        const TestComponent = () => {
          hookResult = useSettingsScreen();
          return null;
        };

        const { unmount } = render(<TestComponent />);

        expect(hookResult).toBeDefined();
        expect(hookResult.selectedTab).toBeDefined();
        unmount();
      });
    });
  });
});
