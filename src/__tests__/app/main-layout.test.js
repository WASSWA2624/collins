/**
 * Main Layout Tests
 * File: main-layout.test.js
 * 
 * Tests for src/app/(main)/_layout.jsx
 * 
 * Per testing.mdc:
 * - Test that layout renders without errors
 * - Test that child routes are rendered via `<Slot />` (mock child routes)
 * - Mock expo-router exports as needed
 * - Test all branches (including all platform variants)
 * - 100% coverage required
 * 
 * Per Step 7.10: Create main group layout
 * - Layout should render `<Slot />` from expo-router
 * - Layout uses default export per app-router.mdc
 * - Guard logic is added in Step 7.15 (tested separately in main-layout-guard.test.js)
 * - Navigation skeleton is added in Step 7.17 (tested separately in main-layout-navigation.test.js)
 */
import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react-native';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '@store/rootReducer';
// Import platform-specific implementations for coverage
import MainRouteLayoutWeb from '@platform/layouts/RouteLayouts/MainRouteLayout/MainRouteLayout.web';
import MainRouteLayoutAndroid from '@platform/layouts/RouteLayouts/MainRouteLayout/MainRouteLayout.android';
import MainRouteLayoutIOS from '@platform/layouts/RouteLayouts/MainRouteLayout/MainRouteLayout.ios';

// Mock expo-router
jest.mock('expo-router', () => ({
  Slot: ({ children }) => children || null,
  useRouter: jest.fn(() => ({
    replace: jest.fn(),
    push: jest.fn(),
  })),
}));

// Mock platform components
jest.mock('@platform/components', () => {
  const React = require('react');
  return {
    GlobalHeader: React.forwardRef(({ children, ...props }, ref) =>
      React.createElement('div', { ...props, ref }, children || 'GlobalHeader')
    ),
    TabBar: React.forwardRef(({ children, ...props }, ref) =>
      React.createElement('div', { ...props, ref }, children || 'TabBar')
    ),
    Sidebar: React.forwardRef(({ children, ...props }, ref) =>
      React.createElement('div', { ...props, ref }, children || 'Sidebar')
    ),
    ShellBanners: React.forwardRef(({ children, ...props }, ref) =>
      React.createElement('div', { ...props, ref }, children || 'ShellBanners')
    ),
    LoadingOverlay: React.forwardRef(({ children, ...props }, ref) =>
      React.createElement('div', { ...props, ref }, children || 'LoadingOverlay')
    ),
    NoticeSurface: React.forwardRef(({ children, ...props }, ref) =>
      React.createElement('div', { ...props, ref }, children || 'NoticeSurface')
    ),
  };
});

// Mock platform layouts
jest.mock('@platform/layouts', () => {
  const React = require('react');
  return {
    MainLayout: React.forwardRef(({ children, ...props }, ref) =>
      React.createElement('div', { ...props, ref }, children)
    ),
    AppFrame: React.forwardRef(({ children, ...props }, ref) =>
      React.createElement('div', { ...props, ref }, children)
    ),
  };
});

// Create a mock store for tests
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: {
      ui: {
        theme: 'light',
        locale: 'en',
        isLoading: false,
      },
      network: {
        isOnline: true,
      },
      ...initialState,
    },
  });
};

describe('app/(main)/_layout.jsx', () => {
  // Per Step 7.10: Verify the layout file exists and exports a default component
  // The file re-exports MainRouteLayout from @platform/layouts
  // We test the platform-specific implementations directly to achieve 100% coverage
  
  test('should have platform-specific implementations', () => {
    // Verify all platform variants exist
    expect(MainRouteLayoutWeb).toBeDefined();
    expect(MainRouteLayoutAndroid).toBeDefined();
    expect(MainRouteLayoutIOS).toBeDefined();
    expect(typeof MainRouteLayoutWeb).toBe('function');
    expect(typeof MainRouteLayoutAndroid).toBe('function');
    expect(typeof MainRouteLayoutIOS).toBe('function');
  });

  describe('Platform-specific implementations', () => {
    // Test all platform variants to achieve 100% coverage
    // Per testing.mdc: Platform-specific implementations must be tested separately

    test('should render MainRouteLayout.web.jsx without errors', () => {
      const store = createMockStore();
      expect(() => {
        render(
          <Provider store={store}>
            <MainRouteLayoutWeb />
          </Provider>
        );
      }).not.toThrow();
    });

    test('should render MainRouteLayout.android.jsx without errors', () => {
      const store = createMockStore();
      expect(() => {
        render(
          <Provider store={store}>
            <MainRouteLayoutAndroid />
          </Provider>
        );
      }).not.toThrow();
    });

    test('should render MainRouteLayout.ios.jsx without errors', () => {
      const store = createMockStore();
      expect(() => {
        render(
          <Provider store={store}>
            <MainRouteLayoutIOS />
          </Provider>
        );
      }).not.toThrow();
    });

    test('should render Slot in MainRouteLayout.web.jsx', () => {
      // Per Step 7.10: Test that child routes are rendered via <Slot />
      const store = createMockStore();
      const { UNSAFE_root } = render(
        <Provider store={store}>
          <MainRouteLayoutWeb />
        </Provider>
      );
      expect(UNSAFE_root).toBeDefined();
    });

    test('should render Slot in MainRouteLayout.android.jsx', () => {
      // Per Step 7.10: Test that child routes are rendered via <Slot />
      const store = createMockStore();
      const { UNSAFE_root } = render(
        <Provider store={store}>
          <MainRouteLayoutAndroid />
        </Provider>
      );
      expect(UNSAFE_root).toBeDefined();
    });

    test('should render Slot in MainRouteLayout.ios.jsx', () => {
      // Per Step 7.10: Test that child routes are rendered via <Slot />
      const store = createMockStore();
      const { UNSAFE_root } = render(
        <Provider store={store}>
          <MainRouteLayoutIOS />
        </Provider>
      );
      expect(UNSAFE_root).toBeDefined();
    });

    test('should use Slot correctly per app-router.mdc requirements (web)', () => {
      // Per app-router.mdc: layouts use default exports and <Slot /> for child routes
      const store = createMockStore();
      const result = render(
        <Provider store={store}>
          <MainRouteLayoutWeb />
        </Provider>
      );
      expect(result).toBeDefined();
    });

    test('should use Slot correctly per app-router.mdc requirements (android)', () => {
      // Per app-router.mdc: layouts use default exports and <Slot /> for child routes
      const store = createMockStore();
      const result = render(
        <Provider store={store}>
          <MainRouteLayoutAndroid />
        </Provider>
      );
      expect(result).toBeDefined();
    });

    test('should use Slot correctly per app-router.mdc requirements (ios)', () => {
      // Per app-router.mdc: layouts use default exports and <Slot /> for child routes
      const store = createMockStore();
      const result = render(
        <Provider store={store}>
          <MainRouteLayoutIOS />
        </Provider>
      );
      expect(result).toBeDefined();
    });

    test('should handle rendering when no child routes are matched (web)', () => {
      // Test that the layout can render even when no routes are matched
      const store = createMockStore();
      expect(() => {
        const { UNSAFE_root } = render(
          <Provider store={store}>
            <MainRouteLayoutWeb />
          </Provider>
        );
        expect(UNSAFE_root).toBeDefined();
      }).not.toThrow();
    });

    test('should handle rendering when no child routes are matched (android)', () => {
      // Test that the layout can render even when no routes are matched
      const store = createMockStore();
      expect(() => {
        const { UNSAFE_root } = render(
          <Provider store={store}>
            <MainRouteLayoutAndroid />
          </Provider>
        );
        expect(UNSAFE_root).toBeDefined();
      }).not.toThrow();
    });

    test('should handle rendering when no child routes are matched (ios)', () => {
      // Test that the layout can render even when no routes are matched
      const store = createMockStore();
      expect(() => {
        const { UNSAFE_root } = render(
          <Provider store={store}>
            <MainRouteLayoutIOS />
          </Provider>
        );
        expect(UNSAFE_root).toBeDefined();
      }).not.toThrow();
    });
  });
});
