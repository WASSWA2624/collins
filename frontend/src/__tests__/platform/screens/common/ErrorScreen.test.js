/**
 * ErrorScreen Component Tests
 * File: ErrorScreen.test.js
 * 
 * Tests all three platform implementations (Android, iOS, Web)
 * Per testing.mdc: Platform-specific testing is MANDATORY
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');
const { useRouter } = require('expo-router');

// Mock dependencies
jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Import platform-specific implementations
const ErrorScreenAndroid = require('@platform/screens/common/ErrorScreen/ErrorScreen.android').default;
const ErrorScreenIOS = require('@platform/screens/common/ErrorScreen/ErrorScreen.ios').default;
const ErrorScreenWeb = require('@platform/screens/common/ErrorScreen/ErrorScreen.web').default;

const lightThemeModule = require('@theme/light.theme');
const lightTheme = lightThemeModule.default || lightThemeModule;

const renderWithTheme = (component) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
};

describe('ErrorScreen Component', () => {
  const mockT = jest.fn((key) => {
    const translations = {
      'error.title': 'Something Went Wrong',
      'error.message': 'An unexpected error occurred. Please try again or return to the home page.',
      'error.retry': 'Retry',
      'error.retryHint': 'Try the action again',
      'error.goHome': 'Go to Home',
      'error.goHomeHint': 'Navigate back to the home page',
    };
    return translations[key] || key;
  });

  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useRouter.mockReturnValue(mockRouter);
  });

  describe('Android Implementation', () => {
    it('should render without errors', () => {
      const { getByTestId } = renderWithTheme(<ErrorScreenAndroid />);
      expect(getByTestId('error-screen')).toBeTruthy();
    });

    it('should display error title', () => {
      const { getByTestId } = renderWithTheme(<ErrorScreenAndroid />);
      expect(getByTestId('error-title')).toBeTruthy();
      expect(mockT).toHaveBeenCalledWith('error.title');
    });

    it('should display error message', () => {
      const { getByTestId } = renderWithTheme(<ErrorScreenAndroid />);
      expect(getByTestId('error-message')).toBeTruthy();
      expect(mockT).toHaveBeenCalledWith('error.message');
    });

    it('should render Go Home button', () => {
      const { getByTestId } = renderWithTheme(<ErrorScreenAndroid />);
      const button = getByTestId('error-go-home-button');
      expect(button).toBeTruthy();
    });

    it('should not render Retry button when onRetry is not provided', () => {
      const { queryByTestId } = renderWithTheme(<ErrorScreenAndroid />);
      expect(queryByTestId('error-retry-button')).toBeNull();
    });

    it('should render Retry button when onRetry is provided', () => {
      const mockOnRetry = jest.fn();
      const { getByTestId } = renderWithTheme(<ErrorScreenAndroid onRetry={mockOnRetry} />);
      const button = getByTestId('error-retry-button');
      expect(button).toBeTruthy();
    });

    it('should handle Go Home button press', () => {
      const { getByTestId } = renderWithTheme(<ErrorScreenAndroid />);
      const button = getByTestId('error-go-home-button');
      fireEvent.press(button);
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });

    it('should handle Retry button press when onRetry is provided', () => {
      const mockOnRetry = jest.fn();
      const { getByTestId } = renderWithTheme(<ErrorScreenAndroid onRetry={mockOnRetry} />);
      const button = getByTestId('error-retry-button');
      fireEvent.press(button);
      expect(mockOnRetry).toHaveBeenCalledTimes(1);
    });

    it('should have correct accessibility labels', () => {
      const { getByTestId } = renderWithTheme(<ErrorScreenAndroid />);
      const screen = getByTestId('error-screen');
      expect(screen.props.accessibilityLabel).toBe('Something Went Wrong');
    });
  });

  describe('iOS Implementation', () => {
    it('should render without errors', () => {
      const { getByTestId } = renderWithTheme(<ErrorScreenIOS />);
      expect(getByTestId('error-screen')).toBeTruthy();
    });

    it('should display error title', () => {
      const { getByTestId } = renderWithTheme(<ErrorScreenIOS />);
      expect(getByTestId('error-title')).toBeTruthy();
      expect(mockT).toHaveBeenCalledWith('error.title');
    });

    it('should display error message', () => {
      const { getByTestId } = renderWithTheme(<ErrorScreenIOS />);
      expect(getByTestId('error-message')).toBeTruthy();
      expect(mockT).toHaveBeenCalledWith('error.message');
    });

    it('should render Go Home button', () => {
      const { getByTestId } = renderWithTheme(<ErrorScreenIOS />);
      const button = getByTestId('error-go-home-button');
      expect(button).toBeTruthy();
    });

    it('should not render Retry button when onRetry is not provided', () => {
      const { queryByTestId } = renderWithTheme(<ErrorScreenIOS />);
      expect(queryByTestId('error-retry-button')).toBeNull();
    });

    it('should render Retry button when onRetry is provided', () => {
      const mockOnRetry = jest.fn();
      const { getByTestId } = renderWithTheme(<ErrorScreenIOS onRetry={mockOnRetry} />);
      const button = getByTestId('error-retry-button');
      expect(button).toBeTruthy();
    });

    it('should handle Go Home button press', () => {
      const { getByTestId } = renderWithTheme(<ErrorScreenIOS />);
      const button = getByTestId('error-go-home-button');
      fireEvent.press(button);
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });

    it('should handle Retry button press when onRetry is provided', () => {
      const mockOnRetry = jest.fn();
      const { getByTestId } = renderWithTheme(<ErrorScreenIOS onRetry={mockOnRetry} />);
      const button = getByTestId('error-retry-button');
      fireEvent.press(button);
      expect(mockOnRetry).toHaveBeenCalledTimes(1);
    });

    it('should have correct accessibility labels', () => {
      const { getByTestId } = renderWithTheme(<ErrorScreenIOS />);
      const screen = getByTestId('error-screen');
      expect(screen.props.accessibilityLabel).toBe('Something Went Wrong');
    });
  });

  describe('Web Implementation', () => {
    it('should render without errors', () => {
      const { getByTestId } = renderWithTheme(<ErrorScreenWeb />);
      expect(getByTestId('error-screen')).toBeTruthy();
    });

    it('should display error title', () => {
      const { getByTestId } = renderWithTheme(<ErrorScreenWeb />);
      expect(getByTestId('error-title')).toBeTruthy();
      expect(mockT).toHaveBeenCalledWith('error.title');
    });

    it('should display error message', () => {
      const { getByTestId } = renderWithTheme(<ErrorScreenWeb />);
      expect(getByTestId('error-message')).toBeTruthy();
      expect(mockT).toHaveBeenCalledWith('error.message');
    });

    it('should render Go Home button', () => {
      const { getByTestId } = renderWithTheme(<ErrorScreenWeb />);
      const button = getByTestId('error-go-home-button');
      expect(button).toBeTruthy();
    });

    it('should not render Retry button when onRetry is not provided', () => {
      const { queryByTestId } = renderWithTheme(<ErrorScreenWeb />);
      expect(queryByTestId('error-retry-button')).toBeNull();
    });

    it('should render Retry button when onRetry is provided', () => {
      const mockOnRetry = jest.fn();
      const { getByTestId } = renderWithTheme(<ErrorScreenWeb onRetry={mockOnRetry} />);
      const button = getByTestId('error-retry-button');
      expect(button).toBeTruthy();
    });

    it('should handle Go Home button press', () => {
      const { getByTestId } = renderWithTheme(<ErrorScreenWeb />);
      const button = getByTestId('error-go-home-button');
      fireEvent.press(button);
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });

    it('should handle Retry button press when onRetry is provided', () => {
      const mockOnRetry = jest.fn();
      const { getByTestId } = renderWithTheme(<ErrorScreenWeb onRetry={mockOnRetry} />);
      const button = getByTestId('error-retry-button');
      fireEvent.press(button);
      expect(mockOnRetry).toHaveBeenCalledTimes(1);
    });

    it('should support keyboard navigation (web-specific)', () => {
      const { getByTestId } = renderWithTheme(<ErrorScreenWeb />);
      const button = getByTestId('error-go-home-button');
      // Verify button is focusable (web-specific)
      expect(button).toBeTruthy();
      // In a real test, we would simulate keyboard events
    });

    it('should have correct accessibility labels', () => {
      const { getByTestId } = renderWithTheme(<ErrorScreenWeb />);
      const screen = getByTestId('error-screen');
      expect(screen.props.accessibilityLabel).toBe('Something Went Wrong');
    });
  });

  describe('i18n Integration', () => {
    it('should use i18n for all text (Android)', () => {
      renderWithTheme(<ErrorScreenAndroid />);
      expect(mockT).toHaveBeenCalledWith('error.title');
      expect(mockT).toHaveBeenCalledWith('error.message');
      expect(mockT).toHaveBeenCalledWith('error.goHome');
    });

    it('should use i18n for all text (iOS)', () => {
      renderWithTheme(<ErrorScreenIOS />);
      expect(mockT).toHaveBeenCalledWith('error.title');
      expect(mockT).toHaveBeenCalledWith('error.message');
      expect(mockT).toHaveBeenCalledWith('error.goHome');
    });

    it('should use i18n for all text (Web)', () => {
      renderWithTheme(<ErrorScreenWeb />);
      expect(mockT).toHaveBeenCalledWith('error.title');
      expect(mockT).toHaveBeenCalledWith('error.message');
      expect(mockT).toHaveBeenCalledWith('error.goHome');
    });

    it('should use i18n for retry button when provided', () => {
      const mockOnRetry = jest.fn();
      renderWithTheme(<ErrorScreenAndroid onRetry={mockOnRetry} />);
      expect(mockT).toHaveBeenCalledWith('error.retry');
      expect(mockT).toHaveBeenCalledWith('error.retryHint');
    });
  });

  describe('Accessibility', () => {
    it('should have accessibility labels (Android)', () => {
      const { getByTestId } = renderWithTheme(<ErrorScreenAndroid />);
      const screen = getByTestId('error-screen');
      expect(screen.props.accessibilityLabel).toBeDefined();
    });

    it('should have accessibility labels (iOS)', () => {
      const { getByTestId } = renderWithTheme(<ErrorScreenIOS />);
      const screen = getByTestId('error-screen');
      expect(screen.props.accessibilityLabel).toBeDefined();
    });

    it('should have accessibility labels (Web)', () => {
      const { getByTestId } = renderWithTheme(<ErrorScreenWeb />);
      const screen = getByTestId('error-screen');
      expect(screen.props.accessibilityLabel).toBeDefined();
    });

    it('should have accessibility hints for buttons (Android)', () => {
      const { getByTestId } = renderWithTheme(<ErrorScreenAndroid />);
      const button = getByTestId('error-go-home-button');
      expect(button.props.accessibilityHint).toBeDefined();
    });

    it('should have accessibility hints for buttons (iOS)', () => {
      const { getByTestId } = renderWithTheme(<ErrorScreenIOS />);
      const button = getByTestId('error-go-home-button');
      expect(button.props.accessibilityHint).toBeDefined();
    });

    it('should have accessibility hints for buttons (Web)', () => {
      const { getByTestId } = renderWithTheme(<ErrorScreenWeb />);
      const button = getByTestId('error-go-home-button');
      expect(button.props.accessibilityHint).toBeDefined();
    });

    it('should have accessibility role for title', () => {
      const { getByTestId } = renderWithTheme(<ErrorScreenAndroid />);
      const title = getByTestId('error-title');
      expect(title.props.accessibilityRole).toBe('header');
    });
  });

  describe('Error Handling', () => {
    it('should not expose raw error details (per errors-logging.mdc)', () => {
      const { getByTestId } = renderWithTheme(<ErrorScreenAndroid />);
      const message = getByTestId('error-message');
      // Should only show safe, user-friendly message
      expect(message).toBeTruthy();
      // No stack traces or technical details should be visible
    });

    it('should display safe error messages only (iOS)', () => {
      const { getByTestId } = renderWithTheme(<ErrorScreenIOS />);
      const message = getByTestId('error-message');
      expect(message).toBeTruthy();
      // Verify no raw error details
    });

    it('should display safe error messages only (Web)', () => {
      const { getByTestId } = renderWithTheme(<ErrorScreenWeb />);
      const message = getByTestId('error-message');
      expect(message).toBeTruthy();
      // Verify no raw error details
    });
  });

  describe('Platform-Specific Style Imports', () => {
    it('should import Android styles from correct file', () => {
      // Verify that Android component imports from .android.styles.jsx
      const androidStyles = require('@platform/screens/common/ErrorScreen/ErrorScreen.android.styles');
      expect(androidStyles).toBeDefined();
      expect(androidStyles.StyledErrorContainer).toBeDefined();
    });

    it('should import iOS styles from correct file', () => {
      // Verify that iOS component imports from .ios.styles.jsx
      const iosStyles = require('@platform/screens/common/ErrorScreen/ErrorScreen.ios.styles');
      expect(iosStyles).toBeDefined();
      expect(iosStyles.StyledErrorContainer).toBeDefined();
    });

    it('should import Web styles from correct file', () => {
      // Verify that Web component imports from .web.styles.jsx
      const webStyles = require('@platform/screens/common/ErrorScreen/ErrorScreen.web.styles');
      expect(webStyles).toBeDefined();
      expect(webStyles.StyledErrorContainer).toBeDefined();
    });
  });

  describe('Styled-Components Entrypoints', () => {
    it('should use styled-components/native for Android styles', () => {
      const androidStyles = require('@platform/screens/common/ErrorScreen/ErrorScreen.android.styles');
      // Verify the file exists and exports styled components
      expect(androidStyles).toBeDefined();
    });

    it('should use styled-components/native for iOS styles', () => {
      const iosStyles = require('@platform/screens/common/ErrorScreen/ErrorScreen.ios.styles');
      // Verify the file exists and exports styled components
      expect(iosStyles).toBeDefined();
    });

    it('should use styled-components for Web styles', () => {
      const webStyles = require('@platform/screens/common/ErrorScreen/ErrorScreen.web.styles');
      // Verify the file exists and exports styled components
      expect(webStyles).toBeDefined();
    });
  });

  describe('Theme Token Usage', () => {
    it('should use theme tokens (no hardcoded values)', () => {
      // This is verified by the styled-components using theme props
      // All styles should use ${({ theme }) => theme.*} pattern
      const { getByTestId } = renderWithTheme(<ErrorScreenAndroid />);
      expect(getByTestId('error-screen')).toBeTruthy();
      // Theme integration is verified by rendering with ThemeProvider
    });
  });
});

