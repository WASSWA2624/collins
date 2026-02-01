/**
 * UI Slice Tests
 * File: ui.slice.test.js
 */
const { actions, reducer } = require('@store/slices/ui.slice');
const { selectTheme, selectLocale, selectIsLoading } = require('@store/selectors');

// Mock i18n
jest.mock('@i18n', () => ({
  getDeviceLocale: jest.fn(() => 'en'),
}));

describe('UI Slice', () => {
  const initialState = {
    theme: 'light',
    locale: 'en',
    isLoading: false,
    sidebarWidth: 260,
    isSidebarCollapsed: false,
    isHeaderHidden: false,
    headerActionVisibility: {
      notifications: true,
      network: true,
      fullscreen: true,
    },
    footerVisible: true,
    isAuthenticated: false,
    user: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initialState', () => {
    it('should have correct initial state', () => {
      const state = reducer(undefined, { type: 'unknown' });
      expect(state).toEqual(initialState);
    });
  });

  describe('setTheme', () => {
    it('should update theme to dark', () => {
      const state = reducer(initialState, actions.setTheme('dark'));
      expect(state.theme).toBe('dark');
    });

    it('should update theme to high-contrast', () => {
      const state = reducer(initialState, actions.setTheme('high-contrast'));
      expect(state.theme).toBe('high-contrast');
    });

    it('should update theme back to light', () => {
      const darkState = reducer(initialState, actions.setTheme('dark'));
      const lightState = reducer(darkState, actions.setTheme('light'));
      expect(lightState.theme).toBe('light');
    });
  });

  describe('setLocale', () => {
    it('should update locale', () => {
      const state = reducer(initialState, actions.setLocale('fr'));
      expect(state.locale).toBe('fr');
    });

    it('should update locale to different language', () => {
      const state = reducer(initialState, actions.setLocale('sw'));
      expect(state.locale).toBe('sw');
    });
  });

  describe('setLoading', () => {
    it('should set loading to true', () => {
      const state = reducer(initialState, actions.setLoading(true));
      expect(state.isLoading).toBe(true);
    });

    it('should set loading to false', () => {
      const loadingState = reducer(initialState, actions.setLoading(true));
      const notLoadingState = reducer(loadingState, actions.setLoading(false));
      expect(notLoadingState.isLoading).toBe(false);
    });
  });

  describe('setAuthenticated', () => {
    it('should set isAuthenticated to true', () => {
      const state = reducer(initialState, actions.setAuthenticated(true));
      expect(state.isAuthenticated).toBe(true);
    });

    it('should set isAuthenticated to false', () => {
      const authenticatedState = reducer(initialState, actions.setAuthenticated(true));
      const unauthenticatedState = reducer(authenticatedState, actions.setAuthenticated(false));
      expect(unauthenticatedState.isAuthenticated).toBe(false);
    });
  });

  describe('setUser', () => {
    it('should set user data', () => {
      const user = { id: '1', name: 'Test User', role: 'USER' };
      const state = reducer(initialState, actions.setUser(user));
      expect(state.user).toEqual(user);
    });

    it('should update user data', () => {
      const user1 = { id: '1', name: 'Test User', role: 'USER' };
      const user2 = { id: '1', name: 'Updated User', role: 'ADMIN' };
      const state1 = reducer(initialState, actions.setUser(user1));
      const state2 = reducer(state1, actions.setUser(user2));
      expect(state2.user).toEqual(user2);
    });

    it('should set user to null', () => {
      const user = { id: '1', name: 'Test User' };
      const state1 = reducer(initialState, actions.setUser(user));
      const state2 = reducer(state1, actions.setUser(null));
      expect(state2.user).toBeNull();
    });
  });

  describe('clearAuth', () => {
    it('should clear authentication state', () => {
      const user = { id: '1', name: 'Test User', role: 'USER' };
      const authenticatedState = reducer(initialState, actions.setAuthenticated(true));
      const userState = reducer(authenticatedState, actions.setUser(user));
      const clearedState = reducer(userState, actions.clearAuth());
      
      expect(clearedState.isAuthenticated).toBe(false);
      expect(clearedState.user).toBeNull();
    });
  });

  describe('multiple actions', () => {
    it('should handle multiple state updates', () => {
      let state = reducer(initialState, actions.setTheme('dark'));
      state = reducer(state, actions.setLocale('fr'));
      state = reducer(state, actions.setLoading(true));

      expect(state.theme).toBe('dark');
      expect(state.locale).toBe('fr');
      expect(state.isLoading).toBe(true);
    });
  });

  describe('selectors', () => {
    it('should select theme, locale, and loading from root state', () => {
      const rootState = { ui: initialState };

      expect(selectTheme(rootState)).toBe('light');
      expect(selectLocale(rootState)).toBe('en');
      expect(selectIsLoading(rootState)).toBe(false);
    });
  });
});

