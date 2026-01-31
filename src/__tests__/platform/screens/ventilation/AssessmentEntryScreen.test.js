/**
 * AssessmentEntryScreen Component Tests
 * File: AssessmentEntryScreen.test.js
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');
const { useRouter } = require('expo-router');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

const AssessmentEntryScreenAndroid =
  require('@platform/screens/ventilation/AssessmentEntryScreen/AssessmentEntryScreen.android').default;
const AssessmentEntryScreenIOS =
  require('@platform/screens/ventilation/AssessmentEntryScreen/AssessmentEntryScreen.ios').default;
const AssessmentEntryScreenWeb =
  require('@platform/screens/ventilation/AssessmentEntryScreen/AssessmentEntryScreen.web').default;

const lightThemeModule = require('@theme/light.theme');
const lightTheme = lightThemeModule.default || lightThemeModule;

const renderWithTheme = (component) =>
  render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);

describe('AssessmentEntryScreen', () => {
  const mockT = jest.fn((key) => {
    const translations = {
      'assessment.entry.title': 'Assessment',
      'assessment.entry.description': 'Start assessment',
      'assessment.entry.start': 'Start assessment',
      'assessment.entry.startHint': 'Start a new assessment session',
    };
    return translations[key] || key;
  });

  const mockRouter = { replace: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useRouter.mockReturnValue(mockRouter);
  });

  it('renders on Android', () => {
    const { getByTestId } = renderWithTheme(<AssessmentEntryScreenAndroid />);
    expect(getByTestId('assessment-entry-screen')).toBeTruthy();
  });

  it('renders on iOS', () => {
    const { getByTestId } = renderWithTheme(<AssessmentEntryScreenIOS />);
    expect(getByTestId('assessment-entry-screen')).toBeTruthy();
  });

  it('renders on Web', () => {
    const { getByTestId } = renderWithTheme(<AssessmentEntryScreenWeb />);
    expect(getByTestId('assessment-entry-screen')).toBeTruthy();
  });

  it('calls router.replace(/assessment) when Start pressed (Android)', () => {
    const { getByTestId } = renderWithTheme(<AssessmentEntryScreenAndroid />);
    fireEvent.press(getByTestId('assessment-entry-start'));
    expect(mockRouter.replace).toHaveBeenCalledWith('/assessment');
  });
});

