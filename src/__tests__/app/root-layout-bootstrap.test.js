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
import mockReact from 'react';
import {
  ActivityIndicator as MockActivityIndicator,
  Text as MockText,
  View as MockView,
} from 'react-native';
import { render, waitFor } from '@testing-library/react-native';

// NOTE: Jest hoists `jest.mock()` calls. To keep mocks deterministic and avoid
// "out-of-scope variable" errors, all referenced variables are prefixed with `mock`.

let mockSlotRenderer = () => null;

let mockBootstrapApp;
let mockLogger;

jest.mock('expo-router', () => ({
  Slot: () => {
    const result = mockSlotRenderer();
    return (
      result ||
      mockReact.createElement(
        MockView,
        null,
        mockReact.createElement(MockText, null, 'Mock Slot - No Child Routes')
      )
    );
  },
}));

jest.mock('@bootstrap', () => {
  mockBootstrapApp = jest.fn();
  return {
    bootstrapApp: (...args) => mockBootstrapApp(...args),
  };
}, { virtual: true });

jest.mock('@logging', () => {
  mockLogger = {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };

  return {
    logger: mockLogger,
  };
}, { virtual: true });

jest.mock('react-redux', () => ({
  Provider: ({ children }) => mockReact.createElement(mockReact.Fragment, null, children),
}));

jest.mock('@store', () => ({}), { virtual: true });

jest.mock('redux-persist/integration/react', () => ({
  PersistGate: ({ children }) => children,
}));

jest.mock('@errors', () => ({
  ErrorBoundary: ({ children }) => children,
}), { virtual: true });

jest.mock('@platform/layouts/common/ThemeProviderWrapper', () => ({
  __esModule: true,
  default: ({ children }) => children,
}), { virtual: true });

jest.mock('@platform/layouts/common/RootLayoutStyles', () => ({
  StyledRootContainer: ({ children }) => mockReact.createElement(MockView, null, children),
  StyledLoadingContainer: ({ children }) => mockReact.createElement(MockView, null, children),
  StyledActivityIndicator: (props) => mockReact.createElement(MockActivityIndicator, props),
}), { virtual: true });

jest.mock('@i18n', () => ({
  I18nProvider: ({ children }) => children,
}), { virtual: true });

import RootLayout from '@app/_layout';

describe('app/_layout.jsx - Bootstrap Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSlotRenderer = () => mockReact.createElement(MockText, null, 'Test Content');
  });

  test('should call bootstrapApp on mount', async () => {
    mockBootstrapApp.mockResolvedValue(undefined);

    render(<RootLayout />);

    await waitFor(() => {
      expect(mockBootstrapApp).toHaveBeenCalledTimes(1);
    }, { timeout: 3000 });
  });

  test('should render loading state while bootstrap is in progress', async () => {
    mockBootstrapApp.mockImplementation(() => new Promise(() => {})); // never resolves

    const { UNSAFE_getByType } = render(<RootLayout />);

    await waitFor(() => {
      expect(UNSAFE_getByType(MockActivityIndicator)).toBeTruthy();
    }, { timeout: 1000 });
  });

  test('should render children after successful bootstrap', async () => {
    mockBootstrapApp.mockResolvedValue(undefined);

    const { getByText } = render(<RootLayout />);

    await waitFor(() => {
      expect(getByText('Test Content')).toBeTruthy();
    }, { timeout: 3000 });
  });

  test('should handle fatal bootstrap errors and block rendering', async () => {
    mockBootstrapApp.mockRejectedValue(new Error('Fatal: Cannot initialize security'));

    const { queryByText, UNSAFE_getByType } = render(<RootLayout />);

    await waitFor(() => {
      expect(mockLogger.error).toHaveBeenCalled();
    }, { timeout: 3000 });

    await waitFor(() => {
      expect(UNSAFE_getByType(MockActivityIndicator)).toBeTruthy();
    }, { timeout: 1000 });

    expect(queryByText('Test Content')).toBeNull();
  });

  test('should handle non-fatal bootstrap errors and still render', async () => {
    const nonFatalError = new Error('Non-fatal: Theme initialization warning');
    nonFatalError.name = 'NonFatalBootstrapError';
    mockBootstrapApp.mockRejectedValue(nonFatalError);

    const { getByText } = render(<RootLayout />);

    await waitFor(() => {
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Bootstrap initialization failed',
        expect.objectContaining({
          error: 'Non-fatal: Theme initialization warning',
          stack: expect.any(String),
        })
      );
    }, { timeout: 3000 });

    await waitFor(() => {
      expect(getByText('Test Content')).toBeTruthy();
    }, { timeout: 3000 });
  });
});

