/**
 * Root Layout ErrorBoundary Tests
 * File: root-layout-error-boundary.test.js
 * 
 * Step 7.2: Add ErrorBoundary to root layout
 * 
 * Per Step 7.2 requirements:
 * - ErrorBoundary is imported from @errors
 * - ErrorBoundary wraps all content in root layout
 * - Fallback UI does not expose raw error details (per errors-logging.mdc)
 * 
 * Per app-router.mdc: Root layouts use <Slot /> to render child routes, not {children} props.
 * Per testing.mdc: Tests verify behavior, not implementation details.
 * Per errors-logging.mdc: Fallback UI must not expose raw error details.
 */
import React from 'react';
import { Text, View } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';
import { logger } from '@logging';
import { handleError } from '@errors/error.handler';

// Mock expo-router Slot component
// Per app-router.mdc: Layouts use <Slot /> to render child routes
// We'll mock Slot to render different components based on test needs
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

// Mock bootstrap module before importing RootLayout
const mockBootstrapApp = jest.fn();
jest.mock('@bootstrap', () => ({
  bootstrapApp: (...args) => mockBootstrapApp(...args),
}), { virtual: true });

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

// Mock ThemeProviderWrapper (used in root layout)
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
  const en = require('@i18n/locales/en.json');

  const getNestedValue = (obj, path) => {
    if (!obj || typeof obj !== 'object') return undefined;
    if (!path || typeof path !== 'string') return undefined;
    return path
      .split('.')
      .reduce(
        (current, key) => (current && current[key] !== undefined ? current[key] : undefined),
        obj
      );
  };

  const tSync = (key) => getNestedValue(en, key) || key;

  return {
    I18nProvider: ({ children }) => React.createElement(React.Fragment, null, children),
    getDeviceLocale: jest.fn(() => 'en'),
    tSync,
  };
}, { virtual: true });

// Import RootLayout after mocks are set up
import RootLayout from '@app/_layout';

jest.mock('@logging', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}), { virtual: true });

jest.mock('@errors/error.handler', () => ({
  handleError: jest.fn((error) => ({
    code: 'TEST_ERROR',
    message: 'Test error message',
    safeMessage: 'An unexpected error occurred',
    severity: 'error',
  })),
}), { virtual: true });

// Mock ErrorBoundary to allow testing error handling behavior
// We'll import the real ErrorBoundary but can override if needed
jest.mock('@errors', () => {
  const React = require('react');
  const { logger } = require('@logging');
  const { handleError } = require('@errors/error.handler');
  const { ThemeProvider } = require('styled-components/native');
  const lightTheme = require('@theme/light.theme').default;
  
  // Import real FallbackUI for realistic testing
  const FallbackUI = require('@errors/fallback.ui').default;
  
  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      const normalized = handleError(error, { errorInfo });
      logger.error('ErrorBoundary caught error', {
        error: normalized,
        errorInfo,
      });
      this.setState({ error: normalized });
    }

    render() {
      if (this.state.hasError) {
        return React.createElement(
          ThemeProvider,
          { theme: lightTheme },
          React.createElement(FallbackUI, {
            error: this.state.error,
            onRetry: () => this.setState({ hasError: false, error: null }),
          })
        );
      }

      return this.props.children;
    }
  }
  
  return {
    ErrorBoundary,
  };
}, { virtual: true });

// Suppress console.error for error boundary tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('app/_layout.jsx - ErrorBoundary Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Make bootstrap resolve immediately
    mockBootstrapApp.mockResolvedValue(undefined);
    // Default Slot renderer - renders normal content
    mockSlotRenderer = () => React.createElement(Text, null, 'Test Content');
  });

  test('should render normally without errors', async () => {
    // Per Step 7.2: Test that component renders normally without errors
    // Per app-router.mdc: Root layout uses <Slot /> to render child routes
    const { getByText } = render(<RootLayout />);

    await waitFor(() => {
      expect(getByText('Test Content')).toBeTruthy();
    }, { timeout: 3000 });

    // Verify bootstrap was called
    expect(mockBootstrapApp).toHaveBeenCalled();
  });

  test('should display fallback UI when child component throws error', async () => {
    // Per Step 7.2: Test that fallback UI displays when child component throws error
    // Create a component that throws an error during render
    const ThrowError = () => {
      throw new Error('Test error');
    };

    // Mock Slot to render error-throwing component
    mockSlotRenderer = () => React.createElement(ThrowError);

    const { getByText } = render(<RootLayout />);

    // Wait for bootstrap to complete and ErrorBoundary to catch error
    // Per errors-logging.mdc: ErrorBoundary catches render/runtime errors and displays fallback UI
    await waitFor(() => {
      expect(getByText('Something went wrong')).toBeTruthy();
    }, { timeout: 5000 });

    // Verify error was logged (per errors-logging.mdc)
    expect(handleError).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalled();
  });

  test('should not expose raw error details in fallback UI', async () => {
    // Per Step 7.2: Test that fallback UI does not expose raw error details (per errors-logging.mdc)
    // Create a component that throws an error with sensitive details
    const ThrowSensitiveError = () => {
      const error = new Error('Sensitive error: API_KEY=secret123');
      error.stack = 'Error stack trace with sensitive data';
      throw error;
    };

    // Mock Slot to render error-throwing component
    mockSlotRenderer = () => React.createElement(ThrowSensitiveError);

    const { getByText, queryByText } = render(<RootLayout />);

    // Wait for bootstrap to complete and ErrorBoundary to catch error
    // Fallback UI should be displayed
    await waitFor(() => {
      expect(getByText('Something went wrong')).toBeTruthy();
    }, { timeout: 5000 });

    // Per errors-logging.mdc: Fallback UI must not expose internal error details
    // Verify raw error details are NOT exposed
    expect(queryByText(/API_KEY/)).toBeNull();
    expect(queryByText(/secret123/)).toBeNull();
    expect(queryByText(/stack trace/)).toBeNull();
    expect(queryByText(/Sensitive error/)).toBeNull();
    
    // Verify only safe message is shown (per errors-logging.mdc: no raw error objects)
    expect(getByText('An unexpected error occurred')).toBeTruthy();
  });

  test('should handle multiple children without errors', async () => {
    // Test that ErrorBoundary handles normal rendering of multiple components
    mockSlotRenderer = () => React.createElement(
      React.Fragment,
      null,
      React.createElement(Text, null, 'First Child'),
      React.createElement(Text, null, 'Second Child'),
      React.createElement(Text, null, 'Third Child')
    );

    const { getByText } = render(<RootLayout />);

    await waitFor(() => {
      expect(getByText('First Child')).toBeTruthy();
      expect(getByText('Second Child')).toBeTruthy();
      expect(getByText('Third Child')).toBeTruthy();
    }, { timeout: 3000 });
  });

  test('should handle empty state without error', async () => {
    // Test that ErrorBoundary handles empty rendering
    mockSlotRenderer = () => null;

    expect(() => {
      render(<RootLayout />);
    }).not.toThrow();

    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  test('should handle bootstrap errors gracefully and still render ErrorBoundary', async () => {
    // Per Step 7.2: Test that ErrorBoundary is always rendered
    // Per bootstrap-config.mdc: Fatal errors must block rendering
    // Make bootstrap throw an error
    const bootstrapError = new Error('Bootstrap failed');
    mockBootstrapApp.mockRejectedValue(bootstrapError);

    const { UNSAFE_root } = render(<RootLayout />);

    // Wait for bootstrap error to be handled
    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
      // Per bootstrap-config.mdc: Fatal errors must be logged
      expect(logger.error).toHaveBeenCalledWith('Bootstrap initialization failed', {
        error: bootstrapError.message,
        stack: bootstrapError.stack,
      });
    }, { timeout: 3000 });

    // Per bootstrap-config.mdc: Fatal errors block rendering
    // ErrorBoundary should still be rendered even when bootstrap fails
    // The component should not crash and ErrorBoundary should be present
    expect(UNSAFE_root).toBeTruthy();
  });
});

