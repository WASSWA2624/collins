/**
 * Root Layout i18n Provider Tests
 * File: root-layout-i18n.test.js
 * 
 * Step 7.5: Add Localization Provider to root layout
 * 
 * Per Step 7.5 requirements:
 * - Localization Provider is imported from @i18n
 * - Localization Provider wraps content (inside ThemeProvider) with locale handling
 * - i18n context is accessible via useI18n() hook in child components
 * 
 * Per app-router.mdc: Root layouts use <Slot /> to render child routes, not {children} props.
 * Per testing.mdc: Tests verify behavior, not implementation details.
 * Per bootstrap-config.mdc: Localization Provider mounted only in root layout.
 * Per i18n.mdc: i18n provider/registry, locale handling.
 */
import React from 'react';
import { Text } from 'react-native';
import { useSelector } from 'react-redux';
import { act, render, waitFor } from '@testing-library/react-native';

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

// Mock ErrorBoundary to render children normally (for successful renders)
// but allow testing error states
jest.mock('@errors', () => {
  const React = require('react');
  return {
    ErrorBoundary: ({ children }) => React.createElement(React.Fragment, null, children),
  };
}, { virtual: true });

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

// Mock PersistGate to render children immediately (simulating post-rehydration)
jest.mock('redux-persist/integration/react', () => {
  const React = require('react');
  
  return {
    PersistGate: ({ children, loading }) => {
      // PersistGate renders children after rehydration
      // For testing, we'll render children immediately
      return React.createElement(React.Fragment, null, children);
    },
  };
});

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

// Mock i18n module (never use real i18n in unit tests)
jest.mock('@i18n', () => {
  const React = require('react');

  const mockCreateI18n = jest.fn(({ initialLocale = 'en' } = {}) => {
    const supportedLocales = ['en', 'fr'];
    const resolvedLocale = supportedLocales.includes(initialLocale) ? initialLocale : 'en';

    return {
      tSync: jest.fn((key, params, overrideLocale = null) => {
        const locale = overrideLocale || resolvedLocale;

        if (key === 'common.save') return locale === 'fr' ? 'Enregistrer' : 'Save';
        if (key === 'common.cancel') return locale === 'fr' ? 'Annuler' : 'Cancel';
        if (key === 'common.loading') return locale === 'fr' ? 'Chargement...' : 'Loading...';

        if (key === 'greeting.hello' && params?.name) {
          return locale === 'fr' ? `Bonjour, ${params.name}` : `Hello, ${params.name}`;
        }

        return key;
      }),
      getCurrentLocale: jest.fn(() => Promise.resolve(resolvedLocale)),
      setLocale: jest.fn(() => Promise.resolve()),
      supportedLocales,
    };
  });

  return {
    I18nProvider: ({ children }) => React.createElement(React.Fragment, null, children),
    createI18n: mockCreateI18n,
    getDeviceLocale: jest.fn(() => 'en'),
    LOCALE_STORAGE_KEY: 'user_locale',
  };
}, { virtual: true });

// Mock useI18n hook (Step 7.5: "mock hook for verification")
jest.mock('@hooks/useI18n', () => {
  const { useCallback, useMemo } = require('react');
  const { useSelector } = require('react-redux');
  const { createI18n } = require('@i18n');

  const useI18n = () => {
    const locale = useSelector((state) => state.ui?.locale || 'en');

    const i18n = useMemo(
      () => createI18n({ initialLocale: locale }),
      [locale]
    );

    const t = useCallback(
      (key, params) => i18n.tSync(key, params, locale),
      [i18n, locale]
    );

    return { t, locale };
  };

  return { __esModule: true, default: useI18n };
});

// Import RootLayout after mocks are set up
import RootLayout from '@app/_layout';
import useI18n from '@hooks/useI18n';
import { logger } from '@logging';

describe('app/_layout.jsx - I18nProvider Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBootstrapApp.mockResolvedValue(undefined);
    // Default Slot renderer
    mockSlotRenderer = () => React.createElement(Text, null, 'Test Content');

    // Reset mocked store state between tests (mocked module is a singleton)
    const store = require('@store');
    store.dispatch({ type: 'ui/setLocale', payload: 'en' });
  });

  test('should render I18nProvider without errors', async () => {
    // Per Step 7.5: Test that Localization Provider renders without errors
    expect(() => {
      render(<RootLayout />);
    }).not.toThrow();

    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  test('should make i18n context accessible via useI18n() hook in child components', async () => {
    // Per Step 7.5: Test that i18n context is accessible via useI18n() hook in child components
    // Create a test component that uses useI18n hook
    const TestChild = () => {
      const { t, locale } = useI18n();
      
      return React.createElement(
        React.Fragment,
        null,
        React.createElement(Text, { testID: 'translated-text' }, t('common.save')),
        React.createElement(Text, { testID: 'locale' }, locale)
      );
    };
    
    // Mock Slot to render TestChild
    mockSlotRenderer = () => React.createElement(TestChild);
    
    const { getByTestId } = render(<RootLayout />);

    // Wait for bootstrap to complete
    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });

    // Wait for content to render and verify i18n hook works and provides translations
    await waitFor(() => {
      const translatedElement = getByTestId('translated-text');
      expect(translatedElement).toBeTruthy();
      expect(translatedElement.props.children).toBe('Save');
      
      // Verify locale is accessible
      const localeElement = getByTestId('locale');
      expect(localeElement).toBeTruthy();
      expect(localeElement.props.children).toBe('en');
    }, { timeout: 3000 });
  });

  test('should provide locale from Redux store to useI18n hook', async () => {
    // Per Step 7.5: Test that locale is provided from Redux store
    const TestChild = () => {
      const { locale } = useI18n();
      const storeLocale = useSelector((state) => state.ui?.locale);
      
      return React.createElement(
        React.Fragment,
        null,
        React.createElement(Text, { testID: 'hook-locale' }, locale),
        React.createElement(Text, { testID: 'store-locale' }, storeLocale)
      );
    };
    
    // Mock Slot to render TestChild
    mockSlotRenderer = () => React.createElement(TestChild);
    
    const { getByTestId } = render(<RootLayout />);

    // Wait for bootstrap to complete
    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });

    // Wait for content to render and verify locale is read from store
    await waitFor(() => {
      expect(getByTestId('hook-locale').props.children).toBe('en');
      expect(getByTestId('store-locale').props.children).toBe('en');
    }, { timeout: 3000 });
  });

  test('should handle locale switching when store locale changes', async () => {
    // Per Step 7.5: Test locale switching if applicable (per i18n.mdc)
    // This test verifies that useI18n hook responds to locale changes in store
    const TestChild = () => {
      const { t, locale } = useI18n();
      
      return React.createElement(
        React.Fragment,
        null,
        React.createElement(Text, { testID: 'translated' }, t('common.save')),
        React.createElement(Text, { testID: 'current-locale' }, locale)
      );
    };
    
    // Mock Slot to render TestChild
    mockSlotRenderer = () => React.createElement(TestChild);
    
    const { getByTestId } = render(<RootLayout />);

    // Wait for bootstrap to complete
    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });

    // Wait for content to render - verify initial locale
    await waitFor(() => {
      expect(getByTestId('current-locale').props.children).toBe('en');
      expect(getByTestId('translated').props.children).toBe('Save');
    }, { timeout: 3000 });

    // Update locale in Redux and verify hook + translations update
    const store = require('@store');
    act(() => {
      store.dispatch({ type: 'ui/setLocale', payload: 'fr' });
    });

    await waitFor(() => {
      expect(getByTestId('current-locale').props.children).toBe('fr');
      expect(getByTestId('translated').props.children).toBe('Enregistrer');
    }, { timeout: 3000 });
  });

  test('should render children inside I18nProvider', async () => {
    // Per Step 7.5: Test that I18nProvider renders children correctly
    mockSlotRenderer = () => React.createElement(Text, null, 'Test Content');
    
    const { getByText } = render(<RootLayout />);

    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });

    await waitFor(() => {
      expect(getByText('Test Content')).toBeTruthy();
    }, { timeout: 3000 });
  });

  test('should handle multiple children with I18nProvider', async () => {
    // Test that I18nProvider handles multiple child components
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

  test('should handle empty state with I18nProvider', async () => {
    // Test that I18nProvider handles empty rendering
    mockSlotRenderer = () => null;
    
    expect(() => {
      render(<RootLayout />);
    }).not.toThrow();

    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  test('should maintain provider order (ErrorBoundary > Redux Provider > PersistGate > ThemeProvider > I18nProvider)', async () => {
    // Per Step 7.5: Test that I18nProvider is correctly positioned in provider hierarchy
    // Verify I18nProvider is inside ThemeProvider and Redux Provider
    // by checking that useI18n hook can access store
    const TestChild = () => {
      const { t, locale } = useI18n();
      const themeMode = useSelector((state) => state.ui?.theme);
      
      return React.createElement(
        React.Fragment,
        null,
        React.createElement(Text, { testID: 'translated' }, t('common.save')),
        React.createElement(Text, { testID: 'locale' }, locale),
        React.createElement(Text, { testID: 'theme' }, themeMode)
      );
    };
    
    // Mock Slot to render TestChild
    mockSlotRenderer = () => React.createElement(TestChild);
    
    const { getByTestId } = render(<RootLayout />);

    // Wait for bootstrap to complete
    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });

    // Wait for content to render - all providers should work together
    await waitFor(() => {
      expect(getByTestId('translated').props.children).toBe('Save');
      expect(getByTestId('locale').props.children).toBe('en');
      expect(getByTestId('theme').props.children).toBe('light');
    }, { timeout: 3000 });
  });

  test('should provide fallback translation when key is missing', async () => {
    // Test fallback behavior when translation key is missing
    const TestChild = () => {
      const { t } = useI18n();
      
      return React.createElement(Text, { testID: 'fallback' }, t('missing.key.path'));
    };
    
    // Mock Slot to render TestChild
    mockSlotRenderer = () => React.createElement(TestChild);
    
    const { getByTestId } = render(<RootLayout />);

    // Wait for bootstrap to complete
    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });

    // Wait for content to render - verify fallback behavior (returns key when translation missing)
    await waitFor(() => {
      const fallbackElement = getByTestId('fallback');
      expect(fallbackElement).toBeTruthy();
      // Mock returns the key when translation is missing
      expect(fallbackElement.props.children).toBe('missing.key.path');
    }, { timeout: 3000 });
  });

  test('should support translation with parameters', async () => {
    // Test translation interpolation with parameters
    const TestChild = () => {
      const { t } = useI18n();
      
      return React.createElement(Text, { testID: 'interpolated' }, t('greeting.hello', { name: 'World' }));
    };
    
    // Mock Slot to render TestChild
    mockSlotRenderer = () => React.createElement(TestChild);
    
    const { getByTestId } = render(<RootLayout />);

    // Wait for bootstrap to complete
    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });

    // Wait for content to render - verify interpolation works
    await waitFor(() => {
      const interpolatedElement = getByTestId('interpolated');
      expect(interpolatedElement).toBeTruthy();
      expect(interpolatedElement.props.children).toBe('Hello, World');
    }, { timeout: 3000 });
  });

  test('should handle bootstrap errors gracefully and log them', async () => {
    // Per bootstrap-config.mdc: Bootstrap errors are handled gracefully
    // Per errors-logging.mdc: Errors are logged via logger
    const bootstrapError = new Error('Bootstrap failed: i18n initialization error');
    mockBootstrapApp.mockRejectedValue(bootstrapError);
    
    mockSlotRenderer = () => React.createElement(Text, null, 'Test Content');
    
    const { UNSAFE_getByType, queryByText } = render(<RootLayout />);

    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });

    // Per bootstrap-config.mdc: Fatal errors must be logged
    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith(
        'Bootstrap initialization failed',
        expect.objectContaining({
          error: 'Bootstrap failed: i18n initialization error',
          stack: expect.any(String),
        })
      );
    });

    // Per bootstrap-config.mdc: Fatal errors block rendering
    // Should show loading state (ActivityIndicator) instead of children
    const activityIndicator = UNSAFE_getByType(require('react-native').ActivityIndicator);
    expect(activityIndicator).toBeTruthy();
    
    // Children should not be rendered when bootstrap fails
    expect(queryByText('Test Content')).toBeNull();
  });

  test('should block rendering when bootstrap error occurs', async () => {
    // Per bootstrap-config.mdc: Fatal errors must block rendering
    const fatalError = new Error('Fatal: Cannot initialize i18n');
    fatalError.name = 'FatalBootstrapError';
    mockBootstrapApp.mockRejectedValue(fatalError);
    
    mockSlotRenderer = () => React.createElement(Text, null, 'Test Content');
    
    const { queryByText, UNSAFE_getByType } = render(<RootLayout />);

    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });

    // Should log the error
    await waitFor(() => {
      expect(logger.error).toHaveBeenCalled();
    });

    // Should block rendering (show loading, not children)
    const activityIndicator = UNSAFE_getByType(require('react-native').ActivityIndicator);
    expect(activityIndicator).toBeTruthy();
    
    // Children should not be rendered
    expect(queryByText('Test Content')).toBeNull();
  });
});

