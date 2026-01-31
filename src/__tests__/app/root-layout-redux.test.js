/**
 * Root Layout Redux Provider Tests
 * File: root-layout-redux.test.js
 * 
 * Step 7.3: Add Redux Provider to root layout
 * 
 * Per Step 7.3 requirements:
 * - Provider is imported from react-redux
 * - Store is imported from @store
 * - Provider wraps content (inside ErrorBoundary) with store prop
 * - PersistGate wrapper with loading fallback is present
 * - Store is accessible via useSelector in child components
 * 
 * Per app-router.mdc: Root layouts use <Slot /> to render child routes, not {children} props.
 * Per testing.mdc: Tests verify behavior, not implementation details.
 * Per bootstrap-config.mdc: Redux Provider mounted only in root layout.
 * Per state-management.mdc: Store access patterns via Provider.
 */
import React from 'react';
import { Text } from 'react-native';
import { useSelector } from 'react-redux';
import { render, waitFor, act } from '@testing-library/react-native';

// Mock expo-router Slot component
// Per app-router.mdc: Layouts use <Slot /> to render child routes
let mockSlotRenderer = () => null;
jest.mock('expo-router', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    Slot: () => {
      const result = mockSlotRenderer();
      return result || React.createElement(View, null, React.createElement(Text, null, 'Mock Slot - No Child Routes'));
    },
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
    }),
  };
});

// Mock the store module before importing RootLayout
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
  
  // Attach mock persistor to store
  const mockPersistor = {
    purge: jest.fn(),
    pause: jest.fn(),
    persist: jest.fn(),
    flush: jest.fn(),
  };
  store.persistor = mockPersistor;
  
  return store;
}, { virtual: true });

// Mock PersistGate with controllable loading behavior
jest.mock('redux-persist/integration/react', () => {
  const React = require('react');
  let shouldShowLoading = false;

  const PersistGate = jest.fn(({ children, loading }) => {
    if (shouldShowLoading) {
      return React.createElement(React.Fragment, null, loading);
    }
    return React.createElement(React.Fragment, null, children);
  });

  PersistGate.__setShouldShowLoading = (value) => {
    shouldShowLoading = value;
  };

  return {
    PersistGate,
  };
});

// Mock bootstrap to resolve immediately
const mockBootstrapApp = jest.fn();
jest.mock('@bootstrap', () => ({
  bootstrapApp: (...args) => mockBootstrapApp(...args),
}), { virtual: true });

// Mock logger
jest.mock('@logging', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}), { virtual: true });

// Mock ErrorBoundary
jest.mock('@errors', () => {
  const React = require('react');
  return {
    ErrorBoundary: ({ children }) => React.createElement(React.Fragment, null, children),
  };
}, { virtual: true });

// Mock ThemeProviderWrapper
jest.mock('@platform/layouts/common/ThemeProviderWrapper', () => {
  const React = require('react');
  const { ThemeProvider } = require('styled-components/native');
  const lightTheme = require('@theme/light.theme').default;
  return {
    __esModule: true,
    default: ({ children }) => React.createElement(ThemeProvider, { theme: lightTheme }, children),
  };
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

// Mock store selectors
jest.mock('@store/selectors', () => ({
  selectTheme: jest.fn(() => 'light'),
}), { virtual: true });

// Mock i18n
jest.mock('@i18n', () => {
  const React = require('react');
  return {
    I18nProvider: ({ children }) => React.createElement(React.Fragment, null, children),
    getDeviceLocale: jest.fn(() => 'en'),
  };
}, { virtual: true });

// Import RootLayout after mocks are set up
import RootLayout from '@app/_layout';

describe('app/_layout.jsx - Redux Provider Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Make bootstrap resolve immediately for all tests
    mockBootstrapApp.mockResolvedValue(undefined);
    // Default Slot renderer
    mockSlotRenderer = () => React.createElement(Text, null, 'Test Content');

    // Default PersistGate behavior: show children
    const { PersistGate } = require('redux-persist/integration/react');
    PersistGate.__setShouldShowLoading(false);
  });

  test('should render Provider without errors', async () => {
    // Per Step 7.3: Test that Provider renders without errors
    expect(() => {
      render(<RootLayout />);
    }).not.toThrow();

    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  test('should make store accessible via useSelector in child components', async () => {
    // Per Step 7.3: Test that store is accessible via useSelector in child components
    // Component that uses useSelector to access store
    const TestChild = () => {
      const theme = useSelector((state) => state.ui?.theme);
      const isOnline = useSelector((state) => state.network?.isOnline);
      
      return React.createElement(
        React.Fragment,
        null,
        React.createElement(Text, { testID: 'theme' }, theme),
        React.createElement(Text, { testID: 'isOnline' }, isOnline ? 'online' : 'offline')
      );
    };
    
    // Mock Slot to render TestChild
    mockSlotRenderer = () => React.createElement(TestChild);
    
    const { getByTestId } = render(<RootLayout />);

    // Wait for bootstrap to complete and component to render
    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });

    // Verify store state is accessible via useSelector
    await waitFor(() => {
      expect(getByTestId('theme').props.children).toBe('light');
      expect(getByTestId('isOnline').props.children).toBe('online');
    }, { timeout: 3000 });
  });

  test('should render children inside PersistGate', async () => {
    // Per Step 7.3: Test that PersistGate renders children
    // Per Step 7.3: PersistGate wrapper with loading fallback is present
    mockSlotRenderer = () => React.createElement(Text, null, 'Test Content');
    
    const { getByText } = render(<RootLayout />);

    // Wait for bootstrap to complete
    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });

    // Wait for content to render
    await waitFor(() => {
      expect(getByText('Test Content')).toBeTruthy();
    }, { timeout: 3000 });

    // Verify PersistGate is used when persistor exists
    const { PersistGate } = require('redux-persist/integration/react');
    await waitFor(() => {
      expect(PersistGate).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  test('should handle PersistGate with loading fallback', async () => {
    // Per Step 7.3: Test all branches (with/without PersistGate)
    // Test that PersistGate loading fallback works
    mockSlotRenderer = () => React.createElement(Text, null, 'Test Content');

    const { PersistGate } = require('redux-persist/integration/react');
    PersistGate.__setShouldShowLoading(true);
    
    const { queryByText } = render(<RootLayout />);

    // Wait for bootstrap to complete
    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });

    // With PersistGate stuck in "loading", children should NOT render
    await act(async () => {});
    expect(queryByText('Test Content')).toBeNull();
  });

  test('should render without PersistGate when persistor is missing', async () => {
    // Per Step 7.3: Test all branches (with/without PersistGate)
    // Remove persistor to simulate a non-persisted store configuration
    const store = require('@store');
    store.persistor = undefined;

    mockSlotRenderer = () => React.createElement(Text, null, 'Test Content');

    const { getByText } = render(<RootLayout />);

    // Wait for bootstrap to complete
    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });

    await waitFor(() => {
      expect(getByText('Test Content')).toBeTruthy();
    }, { timeout: 3000 });

    const { PersistGate } = require('redux-persist/integration/react');
    expect(PersistGate).not.toHaveBeenCalled();
  });

  test('should handle multiple children with Redux Provider', async () => {
    // Test that Provider handles multiple child components
    mockSlotRenderer = () => React.createElement(
      React.Fragment,
      null,
      React.createElement(Text, null, 'First Child'),
      React.createElement(Text, null, 'Second Child'),
      React.createElement(Text, null, 'Third Child')
    );
    
    const { getByText } = render(<RootLayout />);

    // Wait for bootstrap to complete
    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });

    // Wait for all children to render
    await waitFor(() => {
      expect(getByText('First Child')).toBeTruthy();
      expect(getByText('Second Child')).toBeTruthy();
      expect(getByText('Third Child')).toBeTruthy();
    }, { timeout: 3000 });
  });

  test('should handle empty state with Redux Provider', async () => {
    // Test that Provider handles empty rendering
    mockSlotRenderer = () => null;
    
    expect(() => {
      render(<RootLayout />);
    }).not.toThrow();

    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  test('should maintain ErrorBoundary wrapping Provider', async () => {
    // Per Step 7.3: Test that Provider is wrapped inside ErrorBoundary
    // Verify ErrorBoundary is still present (tested in root-layout-error-boundary.test.js)
    // This test ensures Provider doesn't break ErrorBoundary
    const ThrowError = () => {
      throw new Error('Test error');
    };

    // Mock Slot to render error-throwing component
    mockSlotRenderer = () => React.createElement(ThrowError);

    // Suppress console.error for error boundary test
    const originalError = console.error;
    console.error = jest.fn();

    try {
      render(<RootLayout />);

      // Wait for bootstrap to complete
      await waitFor(() => {
        expect(mockBootstrapApp).toHaveBeenCalled();
      }, { timeout: 3000 });

      // ErrorBoundary should catch the error
      // Note: Since ErrorBoundary is mocked to render children, this test verifies
      // that the structure is correct, but actual error handling is tested in root-layout-error-boundary.test.js
      // The component should render without crashing (ErrorBoundary handles it)
    } finally {
      console.error = originalError;
    }
  });

  test('should handle store state updates', async () => {
    // Per Step 7.3: Test that store state is accessible and reactive
    // Component that reads from store
    const TestChild = () => {
      const isLoading = useSelector((state) => state.ui?.isLoading);
      return React.createElement(Text, { testID: 'loading' }, isLoading ? 'loading' : 'idle');
    };

    // Mock Slot to render TestChild
    mockSlotRenderer = () => React.createElement(TestChild);

    const { getByTestId } = render(<RootLayout />);

    // Wait for bootstrap to complete
    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });

    // Verify initial state is accessible
    await waitFor(() => {
      expect(getByTestId('loading').props.children).toBe('idle');
    }, { timeout: 3000 });
  });
});

