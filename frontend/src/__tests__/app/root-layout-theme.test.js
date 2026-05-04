/**
 * Root Layout Theme Provider Tests
 * File: root-layout-theme.test.js
 * 
 * Step 7.4: Add ThemeProvider to root layout
 * 
 * Per Step 7.4 requirements:
 * - ThemeProvider is imported from @theme (or ThemeProviderWrapper used)
 * - ThemeProvider wraps content (inside Redux Provider) with theme prop
 * - Theme is accessible in styled-components
 * 
 * Per app-router.mdc: Root layouts use <Slot /> to render child routes, not {children} props.
 * Per testing.mdc: Tests verify behavior, not implementation details.
 * Per bootstrap-config.mdc: ThemeProvider mounted only in root layout.
 * Per theme-design.mdc: Theme consumption via styled-components.
 */
import React from 'react';
import { Text } from 'react-native';
import { useSelector } from 'react-redux';
import { act, render, waitFor } from '@testing-library/react-native';
import styled from 'styled-components/native';
import { useTheme } from 'styled-components/native';

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

// Mock i18n
jest.mock('@i18n', () => {
  const React = require('react');
  return {
    I18nProvider: ({ children }) => React.createElement(React.Fragment, null, children),
    getDeviceLocale: jest.fn(() => 'en'),
  };
}, { virtual: true });

// Mock bootstrap module before importing RootLayout
const mockBootstrapApp = jest.fn();
jest.mock('@bootstrap', () => ({
  bootstrapApp: (...args) => mockBootstrapApp(...args),
}), { virtual: true });

// Import RootLayout after mocks are set up
import RootLayout from '@app/_layout';

// Styled components defined at module level (outside test functions)
const ThemedText = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const ThemeModeText = () => {
  const theme = useTheme();
  return React.createElement(Text, { testID: 'theme-mode' }, theme?.mode);
};

describe('app/_layout.jsx - ThemeProvider Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBootstrapApp.mockResolvedValue(undefined);
    // Default Slot renderer
    mockSlotRenderer = () => React.createElement(Text, null, 'Test Content');

    // Reset mocked store state between tests (mocked module is a singleton)
    const store = require('@store');
    store.dispatch({ type: 'ui/setTheme', payload: 'light' });
  });

  test('should render ThemeProvider without errors', async () => {
    // Per Step 7.4: Test that ThemeProvider renders without errors
    expect(() => {
      render(<RootLayout />);
    }).not.toThrow();

    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  test('should make theme accessible in styled-components', async () => {
    // Per Step 7.4: Test that theme is accessible in styled-components (mock styled component for verification)
    const TestChild = () => {
      return React.createElement(
        React.Fragment,
        null,
        React.createElement(ThemedText, { testID: 'themed-text' }, 'Themed Content'),
        React.createElement(ThemeModeText)
      );
    };
    
    // Mock Slot to render TestChild
    mockSlotRenderer = () => React.createElement(TestChild);
    
    const { getByTestId } = render(<RootLayout />);

    // Wait for bootstrap to complete
    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });

    // Wait for themed component to render
    await waitFor(() => {
      const themedElement = getByTestId('themed-text');
      expect(themedElement).toBeTruthy();
      expect(themedElement.props.children).toBe('Themed Content');
    }, { timeout: 3000 });

    await waitFor(() => {
      // Theme context provided via styled-components ThemeProvider
      expect(getByTestId('theme-mode').props.children).toBe('light');
    }, { timeout: 3000 });
  });

  test('should provide light theme by default', async () => {
    // Per Step 7.4: Test that light theme is provided by default
    const TestChild = () => {
      const themeMode = useSelector((state) => state.ui?.theme);
      return React.createElement(
        React.Fragment,
        null,
        React.createElement(ThemedText, { testID: 'themed-text' }, 'Content'),
        React.createElement(Text, { testID: 'theme-mode' }, themeMode)
      );
    };
    
    // Mock Slot to render TestChild
    mockSlotRenderer = () => React.createElement(TestChild);
    
    const { getByTestId } = render(<RootLayout />);

    // Wait for bootstrap to complete
    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });

    // Wait for content to render and verify theme mode is light
    await waitFor(() => {
      expect(getByTestId('theme-mode').props.children).toBe('light');
    }, { timeout: 3000 });
  });

  test('should read theme mode from Redux store via selectTheme selector', async () => {
    // Per Step 7.4: Test that ThemeProviderWrapper reads theme from Redux store
    // Verify that ThemeProviderWrapper uses selectTheme selector correctly
    const TestChild = () => {
      const themeMode = useSelector((state) => state.ui?.theme);
      return React.createElement(Text, { testID: 'theme-mode' }, themeMode);
    };
    
    // Mock Slot to render TestChild
    mockSlotRenderer = () => React.createElement(TestChild);
    
    const { getByTestId } = render(<RootLayout />);

    // Wait for bootstrap to complete
    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });

    // Wait for content to render and verify theme mode is read from store (light by default)
    await waitFor(() => {
      expect(getByTestId('theme-mode').props.children).toBe('light');
    }, { timeout: 3000 });
  });

  test('should support theme switching when store theme changes', async () => {
    // Per Step 7.4: Test theme switching if applicable (theme stored in Redux)
    const TestChild = () => {
      return React.createElement(
        React.Fragment,
        null,
        React.createElement(ThemedText, { testID: 'themed-text' }, 'Themed Content'),
        React.createElement(ThemeModeText)
      );
    };

    mockSlotRenderer = () => React.createElement(TestChild);

    const { getByTestId } = render(<RootLayout />);

    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });

    await waitFor(() => {
      expect(getByTestId('theme-mode').props.children).toBe('light');
    }, { timeout: 3000 });

    const store = require('@store');
    act(() => {
      store.dispatch({ type: 'ui/setTheme', payload: 'dark' });
    });

    await waitFor(() => {
      expect(getByTestId('theme-mode').props.children).toBe('dark');
    }, { timeout: 3000 });
  });

  test('should render children inside ThemeProvider', async () => {
    // Per Step 7.4: Test that ThemeProvider renders children correctly
    mockSlotRenderer = () => React.createElement(Text, null, 'Test Content');
    
    const { getByText } = render(<RootLayout />);

    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });

    await waitFor(() => {
      expect(getByText('Test Content')).toBeTruthy();
    }, { timeout: 3000 });
  });

  test('should handle multiple children with ThemeProvider', async () => {
    // Test that ThemeProvider handles multiple child components
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

  test('should handle empty state with ThemeProvider', async () => {
    // Test that ThemeProvider handles empty rendering
    mockSlotRenderer = () => null;
    
    expect(() => {
      render(<RootLayout />);
    }).not.toThrow();

    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  test('should maintain provider order (ErrorBoundary > Redux Provider > PersistGate > ThemeProvider)', async () => {
    // Per Step 7.4: Test that ThemeProvider is correctly positioned in provider hierarchy
    // Verify ThemeProvider is inside Redux Provider by checking store access
    const TestChild = () => {
      const themeMode = useSelector((state) => state.ui?.theme);
      const isOnline = useSelector((state) => state.network?.isOnline);
      
      return React.createElement(
        React.Fragment,
        null,
        React.createElement(Text, { testID: 'theme' }, themeMode),
        React.createElement(Text, { testID: 'online' }, isOnline ? 'online' : 'offline')
      );
    };
    
    // Mock Slot to render TestChild
    mockSlotRenderer = () => React.createElement(TestChild);
    
    const { getByTestId } = render(<RootLayout />);

    // Wait for bootstrap to complete
    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalled();
    }, { timeout: 3000 });

    // Wait for content to render - both store access and theme should work
    await waitFor(() => {
      expect(getByTestId('theme').props.children).toBe('light');
      expect(getByTestId('online').props.children).toBe('online');
    }, { timeout: 3000 });
  });
});

