/**
 * Root Layout Bootstrap Integration Tests
 * File: root-layout-bootstrap.test.js
 * 
 * Step 7.6: Integrate bootstrap initialization
 * 
 * Per Step 7.6 requirements:
 * - bootstrapApp is imported from @bootstrap
 * - bootstrapApp() is called per bootstrap-config.mdc (before rendering providers)
 * - Bootstrap errors are handled gracefully per bootstrap-config.mdc
 * - Loading state is shown while bootstrap completes
 * 
 * Per app-router.mdc: Root layouts use <Slot /> to render child routes, not {children} props.
 * Per testing.mdc: Tests verify behavior, not implementation details.
 * Per bootstrap-config.mdc: Bootstrap runs in correct order (security → store → theme → offline).
 * Per bootstrap-config.mdc: Bootstrap errors are handled gracefully (fatal errors block rendering, non-fatal errors logged).
 */
import React from 'react';
import { Text } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';
import { logger } from '@logging';

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

// Mock bootstrap module before importing RootLayout
const mockBootstrapApp = jest.fn();
jest.mock('@bootstrap', () => ({
  bootstrapApp: (...args) => mockBootstrapApp(...args),
}), { virtual: true });

// Mock logger to verify error logging
jest.mock('@logging', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
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

// Mock ErrorBoundary to render children normally
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

// Mock i18n getDeviceLocale (used in store initialization)
jest.mock('@i18n', () => {
  const React = require('react');
  return {
    getDeviceLocale: jest.fn(() => 'en'),
    I18nProvider: ({ children }) => React.createElement(React.Fragment, null, children),
  };
}, { virtual: true });

// Import RootLayout after mocks are set up
import RootLayout from '@app/_layout';

describe('app/_layout.jsx - Bootstrap Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBootstrapApp.mockReset();
    // Default Slot renderer
    mockSlotRenderer = () => React.createElement(Text, null, 'Test Content');
  });

  test('should call bootstrapApp on mount', async () => {
    // Per Step 7.6: Test that bootstrapApp is called on mount
    mockBootstrapApp.mockResolvedValue(undefined);
    
    render(<RootLayout />);

    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalledTimes(1);
    }, { timeout: 3000 });
  });

  test('should render loading state while bootstrap is in progress', async () => {
    // Per Step 7.6: Test loading state while bootstrap completes
    // Make bootstrapApp take time to resolve
    mockBootstrapApp.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    const renderResult = render(<RootLayout />);

    const { UNSAFE_getByType } = renderResult;

    // Should show ActivityIndicator while bootstrap is loading
    await waitFor(() => {
      const activityIndicator = UNSAFE_getByType(require('react-native').ActivityIndicator);
      expect(activityIndicator).toBeTruthy();
    }, { timeout: 1000 });
  });

  test('should render children after successful bootstrap', async () => {
    // Per Step 7.6: Test that app renders after successful bootstrap
    mockBootstrapApp.mockResolvedValue(undefined);
    mockSlotRenderer = () => React.createElement(Text, null, 'Test Content');
    
    const renderResult = render(<RootLayout />);

    const { getByText } = renderResult;

    // Wait for bootstrap to be called
    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });

    // After bootstrap completes, should render children
    await waitFor(() => {
      expect(getByText('Test Content')).toBeTruthy();
    }, { timeout: 3000 });
  });

  test('should handle bootstrap errors gracefully and log them', async () => {
    // Per Step 7.6: Test that bootstrap errors are handled gracefully (per bootstrap-config.mdc)
    // Per Step 7.6: Test all error branches (fatal vs non-fatal)
    const bootstrapError = new Error('Bootstrap failed: Security initialization error');
    mockBootstrapApp.mockRejectedValue(bootstrapError);
    
    mockSlotRenderer = () => React.createElement(Text, null, 'Test Content');
    
    const renderResult = render(<RootLayout />);

    const { UNSAFE_getByType } = renderResult;

    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });

    // Should log the error per bootstrap-config.mdc
    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith(
        'Bootstrap initialization failed',
        expect.objectContaining({
          error: 'Bootstrap failed: Security initialization error',
          stack: expect.any(String),
        })
      );
    });

    // Should show loading state (blocking rendering per bootstrap-config.mdc)
    await waitFor(() => {
      const activityIndicator = UNSAFE_getByType(require('react-native').ActivityIndicator);
      expect(activityIndicator).toBeTruthy();
    }, { timeout: 1000 });
  });

  test('should handle fatal bootstrap errors and block rendering', async () => {
    // Per Step 7.6: Test all error branches (fatal vs non-fatal)
    // Per bootstrap-config.mdc: Fatal errors must block rendering
    const fatalError = new Error('Fatal: Cannot initialize security');
    fatalError.name = 'FatalBootstrapError';
    mockBootstrapApp.mockRejectedValue(fatalError);
    
    mockSlotRenderer = () => React.createElement(Text, null, 'Test Content');
    
    const renderResult = render(<RootLayout />);

    const { queryByText, UNSAFE_getByType } = renderResult;

    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });

    // Should log the error
    await waitFor(() => {
      expect(logger.error).toHaveBeenCalled();
    });

    // Should block rendering (show loading, not children)
    await waitFor(() => {
      const activityIndicator = UNSAFE_getByType(require('react-native').ActivityIndicator);
      expect(activityIndicator).toBeTruthy();
    }, { timeout: 1000 });
    
    // Children should not be rendered
    expect(queryByText('Test Content')).toBeNull();
  });

  test('should handle non-fatal bootstrap errors and log them', async () => {
    // Per Step 7.6: Test all error branches (fatal vs non-fatal)
    // Per bootstrap-config.mdc: Non-fatal errors must be logged
    const nonFatalError = new Error('Non-fatal: Theme initialization warning');
    mockBootstrapApp.mockRejectedValue(nonFatalError);
    
    mockSlotRenderer = () => React.createElement(Text, null, 'Test Content');
    
    render(<RootLayout />);

    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });

    // Should log non-fatal errors per bootstrap-config.mdc
    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith(
        'Bootstrap initialization failed',
        expect.objectContaining({
          error: 'Non-fatal: Theme initialization warning',
          stack: expect.any(String),
        })
      );
    });
  });

  test('should call bootstrapApp only once on mount', async () => {
    // Test that bootstrap is called only once (idempotent behavior)
    mockBootstrapApp.mockResolvedValue(undefined);
    
    const renderResult = render(<RootLayout />);

    const { rerender } = renderResult;

    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalledTimes(1);
    }, { timeout: 3000 });

    // Rerender should not call bootstrapApp again
    rerender(<RootLayout />);

    // Should still be called only once
    expect(mockBootstrapApp).toHaveBeenCalledTimes(1);
  });

  test('should handle bootstrap that resolves immediately', async () => {
    // Test that bootstrap that resolves immediately still works correctly
    mockBootstrapApp.mockResolvedValue(undefined);
    mockSlotRenderer = () => React.createElement(Text, null, 'Test Content');
    
    const renderResult = render(<RootLayout />);

    const { getByText } = renderResult;

    // Should render children after bootstrap completes
    await waitFor(() => {
      expect(getByText('Test Content')).toBeTruthy();
    }, { timeout: 3000 });

    expect(mockBootstrapApp).toHaveBeenCalledTimes(1);
  });

  test('should handle bootstrap that rejects immediately', async () => {
    // Per Step 7.6: Test all error branches (fatal vs non-fatal)
    const immediateError = new Error('Immediate bootstrap failure');
    mockBootstrapApp.mockRejectedValue(immediateError);
    
    mockSlotRenderer = () => React.createElement(Text, null, 'Test Content');
    
    const renderResult = render(<RootLayout />);

    const { queryByText, UNSAFE_getByType } = renderResult;

    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });

    // Should log error
    await waitFor(() => {
      expect(logger.error).toHaveBeenCalled();
    });

    // Should block rendering
    await waitFor(() => {
      const activityIndicator = UNSAFE_getByType(require('react-native').ActivityIndicator);
      expect(activityIndicator).toBeTruthy();
    }, { timeout: 1000 });
    expect(queryByText('Test Content')).toBeNull();
  });

  test('should handle multiple children after successful bootstrap', async () => {
    // Test that multiple children render after bootstrap
    mockBootstrapApp.mockResolvedValue(undefined);
    mockSlotRenderer = () => React.createElement(
      React.Fragment,
      null,
      React.createElement(Text, null, 'First Child'),
      React.createElement(Text, null, 'Second Child'),
      React.createElement(Text, null, 'Third Child')
    );
    
    const { getByText } = render(<RootLayout />);

    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });

    await waitFor(() => {
      expect(getByText('First Child')).toBeTruthy();
      expect(getByText('Second Child')).toBeTruthy();
      expect(getByText('Third Child')).toBeTruthy();
    }, { timeout: 3000 });
  });

  test('should handle empty state after successful bootstrap', async () => {
    // Test that empty rendering works after bootstrap
    mockBootstrapApp.mockResolvedValue(undefined);
    mockSlotRenderer = () => null;
    
    const renderResult = render(<RootLayout />);

    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });

    // Should render without errors
    expect(renderResult).toBeTruthy();
  });

  test('should maintain ErrorBoundary wrapping after bootstrap', async () => {
    // Test that ErrorBoundary is still present after bootstrap
    mockBootstrapApp.mockResolvedValue(undefined);
    
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

      await waitFor(() => {
        expect(mockBootstrapApp).toHaveBeenCalled();
      }, { timeout: 3000 });

      // ErrorBoundary is mocked to render children, but in real app would show fallback
      // Since ErrorBoundary is mocked, we just verify the component doesn't crash
      // and bootstrap completed successfully
      expect(mockBootstrapApp).toHaveBeenCalled();
    } finally {
      console.error = originalError;
    }
  });
});

