/**
 * NotFoundScreen Component Tests
 * File: NotFoundScreen.test.js
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
const NotFoundScreenAndroid = require('@platform/screens/common/NotFoundScreen/NotFoundScreen.android').default;
const NotFoundScreenIOS = require('@platform/screens/common/NotFoundScreen/NotFoundScreen.ios').default;
const NotFoundScreenWeb = require('@platform/screens/common/NotFoundScreen/NotFoundScreen.web').default;

const lightThemeModule = require('@theme/light.theme');
const lightTheme = lightThemeModule.default || lightThemeModule;

const renderWithTheme = (component) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
};

describe('NotFoundScreen Component', () => {
  const mockT = jest.fn((key) => {
    const translations = {
      'notFound.title': 'Page Not Found',
      'notFound.message': "The page you're looking for doesn't exist or has been moved.",
      'notFound.goHome': 'Go to Home',
      'notFound.goHomeHint': 'Navigate back to the home page',
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
      const { getByTestId } = renderWithTheme(<NotFoundScreenAndroid />);
      expect(getByTestId('not-found-screen')).toBeTruthy();
    });

    it('should display not found title', () => {
      const { getByTestId } = renderWithTheme(<NotFoundScreenAndroid />);
      expect(getByTestId('not-found-title')).toBeTruthy();
      expect(mockT).toHaveBeenCalledWith('notFound.title');
    });

    it('should display not found message', () => {
      const { getByTestId } = renderWithTheme(<NotFoundScreenAndroid />);
      expect(getByTestId('not-found-message')).toBeTruthy();
      expect(mockT).toHaveBeenCalledWith('notFound.message');
    });

    it('should render Go Home button', () => {
      const { getByTestId } = renderWithTheme(<NotFoundScreenAndroid />);
      const button = getByTestId('not-found-go-home-button');
      expect(button).toBeTruthy();
    });

    it('should handle Go Home button press', () => {
      const { getByTestId } = renderWithTheme(<NotFoundScreenAndroid />);
      const button = getByTestId('not-found-go-home-button');
      fireEvent.press(button);
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });

    it('should have correct accessibility labels', () => {
      const { getByTestId } = renderWithTheme(<NotFoundScreenAndroid />);
      const screen = getByTestId('not-found-screen');
      expect(screen.props.accessibilityLabel).toBe('Page Not Found');
    });
  });

  describe('iOS Implementation', () => {
    it('should render without errors', () => {
      const { getByTestId } = renderWithTheme(<NotFoundScreenIOS />);
      expect(getByTestId('not-found-screen')).toBeTruthy();
    });

    it('should display not found title', () => {
      const { getByTestId } = renderWithTheme(<NotFoundScreenIOS />);
      expect(getByTestId('not-found-title')).toBeTruthy();
      expect(mockT).toHaveBeenCalledWith('notFound.title');
    });

    it('should display not found message', () => {
      const { getByTestId } = renderWithTheme(<NotFoundScreenIOS />);
      expect(getByTestId('not-found-message')).toBeTruthy();
      expect(mockT).toHaveBeenCalledWith('notFound.message');
    });

    it('should render Go Home button', () => {
      const { getByTestId } = renderWithTheme(<NotFoundScreenIOS />);
      const button = getByTestId('not-found-go-home-button');
      expect(button).toBeTruthy();
    });

    it('should handle Go Home button press', () => {
      const { getByTestId } = renderWithTheme(<NotFoundScreenIOS />);
      const button = getByTestId('not-found-go-home-button');
      fireEvent.press(button);
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });

  describe('Web Implementation', () => {
    it('should render without errors', () => {
      const { getByTestId } = renderWithTheme(<NotFoundScreenWeb />);
      expect(getByTestId('not-found-screen')).toBeTruthy();
    });

    it('should display not found title', () => {
      const { getByTestId } = renderWithTheme(<NotFoundScreenWeb />);
      expect(getByTestId('not-found-title')).toBeTruthy();
      expect(mockT).toHaveBeenCalledWith('notFound.title');
    });

    it('should display not found message', () => {
      const { getByTestId } = renderWithTheme(<NotFoundScreenWeb />);
      expect(getByTestId('not-found-message')).toBeTruthy();
      expect(mockT).toHaveBeenCalledWith('notFound.message');
    });

    it('should render Go Home button', () => {
      const { getByTestId } = renderWithTheme(<NotFoundScreenWeb />);
      const button = getByTestId('not-found-go-home-button');
      expect(button).toBeTruthy();
    });

    it('should handle Go Home button press', () => {
      const { getByTestId } = renderWithTheme(<NotFoundScreenWeb />);
      const button = getByTestId('not-found-go-home-button');
      fireEvent.press(button);
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });

  describe('i18n Integration', () => {
    it('should use i18n for all text (Android)', () => {
      renderWithTheme(<NotFoundScreenAndroid />);
      expect(mockT).toHaveBeenCalledWith('notFound.title');
      expect(mockT).toHaveBeenCalledWith('notFound.message');
      expect(mockT).toHaveBeenCalledWith('notFound.goHome');
    });
  });

  describe('Accessibility', () => {
    it('should have accessibility labels', () => {
      const { getByTestId } = renderWithTheme(<NotFoundScreenAndroid />);
      const screen = getByTestId('not-found-screen');
      expect(screen.props.accessibilityLabel).toBeDefined();
    });

    it('should have accessibility hints for buttons', () => {
      const { getByTestId } = renderWithTheme(<NotFoundScreenAndroid />);
      const button = getByTestId('not-found-go-home-button');
      expect(button.props.accessibilityHint).toBeDefined();
    });
  });
});

