/**
 * Root Layout Tests
 * File: root-layout.test.js
 * 
 * Step 7.1: Create root layout file structure
 * 
 * Per Step 7.1 requirements:
 * - File exists and exports a default component
 * - Component accepts and renders children (via <Slot /> in Expo Router)
 * 
 * Per app-router.mdc: Root layouts use <Slot /> to render child routes, not {children} props.
 * Per testing.mdc: All tests must verify behavior, not implementation details.
 */
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';

// Mock expo-router Slot component
// Per app-router.mdc: Layouts use <Slot /> to render child routes
// In tests, we mock Slot to accept and render children for verification
const mockSlotChildren = jest.fn();
jest.mock('expo-router', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    Slot: ({ children, testID }) => {
      mockSlotChildren(children);
      return React.createElement(
        View,
        { testID },
        children || React.createElement(Text, null, 'Mock Slot - No Child Routes')
      );
    },
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
    }),
  };
});

// Mock bootstrap module before importing RootLayout
const mockBootstrapApp = jest.fn();
jest.mock('@bootstrap', () => ({
  bootstrapApp: (...args) => mockBootstrapApp(...args),
}), { virtual: true });

// Mock i18n BEFORE store (store imports ui.slice which calls getDeviceLocale at module load time)
jest.mock('@i18n', () => {
  const React = require('react');
  return {
    getDeviceLocale: jest.fn(() => 'en'),
    I18nProvider: ({ children }) => React.createElement(React.Fragment, null, children),
  };
}, { virtual: true });

// Mock store module
jest.mock('@store', () => {
  const { configureStore } = require('@reduxjs/toolkit');
  const rootReducer = require('@store/rootReducer').default;
  
  const store = configureStore({
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
    },
  });
  
  const mockPersistor = {
    purge: jest.fn(),
    pause: jest.fn(),
    persist: jest.fn(),
    flush: jest.fn(),
  };
  store.persistor = mockPersistor;
  
  return store;
}, { virtual: true });

// Mock PersistGate to render children immediately
jest.mock('redux-persist/integration/react', () => {
  const React = require('react');
  return {
    PersistGate: ({ children }) => React.createElement(React.Fragment, null, children),
  };
});

// Mock ErrorBoundary to render children normally
jest.mock('@errors', () => {
  const React = require('react');
  return {
    ErrorBoundary: ({ children }) => React.createElement(React.Fragment, null, children),
  };
}, { virtual: true });

// Mock ThemeProvider
jest.mock('@theme', () => {
  const React = require('react');
  return {
    ThemeProvider: ({ children }) => React.createElement(React.Fragment, null, children),
  };
}, { virtual: true });

// Mock ThemeProviderWrapper
jest.mock('@platform/layouts/common/ThemeProviderWrapper', () => {
  const React = require('react');
  return ({ children }) => React.createElement(React.Fragment, null, children);
}, { virtual: true });

// Mock RootLayoutStyles
jest.mock('@platform/layouts/common/RootLayoutStyles', () => {
  const React = require('react');
  const { View, ActivityIndicator } = require('react-native');
  return {
    StyledRootContainer: ({ children, testID }) =>
      React.createElement(View, { testID }, children),
    StyledLoadingContainer: ({ children, testID }) =>
      React.createElement(View, { testID }, children),
    StyledActivityIndicator: (props) => React.createElement(ActivityIndicator, props),
  };
}, { virtual: true });

// Mock logging
jest.mock('@logging', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}), { virtual: true });

// Mock store selectors
jest.mock('@store/selectors', () => ({
  selectTheme: jest.fn(() => 'light'),
}), { virtual: true });

// Import RootLayout after mocks are set up
import RootLayout from '@app/_layout';

describe('app/_layout.jsx', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBootstrapApp.mockResolvedValue(undefined);
    mockSlotChildren.mockClear();
  });

  test('should export default component', () => {
    // Per Step 7.1: Test that file exists and exports a default component
    expect(RootLayout).toBeDefined();
    expect(typeof RootLayout).toBe('function');
  });

  test('should render without error', async () => {
    // Per Step 7.1: Test that component accepts and renders children
    // Per app-router.mdc: Root layout uses <Slot /> to render child routes
    expect(() => {
      render(<RootLayout />);
    }).not.toThrow();
    
    // Wait for bootstrap to complete
    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  test('should render Slot component for child routes', async () => {
    // Per Step 7.1: Test that component renders children (via <Slot />)
    // Per app-router.mdc: Layouts use <Slot /> to render child routes
    const { getByText } = render(<RootLayout />);
    
    // Verify that Slot is rendered (allows child routes to be displayed).
    // Our Slot mock renders a fallback text when no child routes are provided.
    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
      expect(getByText('Mock Slot - No Child Routes')).toBeTruthy();
    }, { timeout: 3000 });
  });

  test('should handle empty state without error', async () => {
    // Per Step 7.1: Test that component can render even with no child routes
    // Per app-router.mdc: Root layout should handle cases with no matched routes
    expect(() => {
      render(<RootLayout />);
    }).not.toThrow();
    
    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });
  });
});

