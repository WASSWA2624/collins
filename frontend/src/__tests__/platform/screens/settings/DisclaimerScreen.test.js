/**
 * DisclaimerScreen Component Tests (P011 11.S.11)
 * File: DisclaimerScreen.test.js
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');
const { useDispatch, useSelector } = require('react-redux');

jest.mock('@hooks', () => ({ useI18n: jest.fn() }));
jest.mock('react-redux', () => ({ useDispatch: jest.fn(), useSelector: jest.fn() }));
jest.mock('expo-router', () => ({ useRouter: () => ({ replace: jest.fn() }) }));
jest.mock('@services/storage', () => ({ async: { setItem: jest.fn() } }));
jest.mock('@features/ventilation/ventilation.model', () => ({
  getDefaultVentilationDataset: () => ({}),
  getVentilationDatasetIntendedUse: () => ({ warning: 'Test warning', validationRequirement: 'Test validation' }),
}));

jest.mock('@platform/components', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    Text: ({ children, testID }) => React.createElement(RN.Text, { testID }, children),
    Button: ({ text, label, onPress, testID }) =>
      React.createElement(RN.Pressable, { onPress, testID }, text ?? label),
    Stack: ({ children }) => React.createElement(RN.View, null, children),
  };
});

const DisclaimerScreenAndroid = require('@platform/screens/settings/DisclaimerScreen/DisclaimerScreen.android').default;
const DisclaimerScreenIOS = require('@platform/screens/settings/DisclaimerScreen/DisclaimerScreen.ios').default;
const DisclaimerScreenWeb = require('@platform/screens/settings/DisclaimerScreen/DisclaimerScreen.web').default;

const lightThemeModule = require('@theme/light.theme');
const lightTheme = lightThemeModule.default || lightThemeModule;

const renderWithTheme = (component) =>
  render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);

describe('DisclaimerScreen', () => {
  const mockT = jest.fn((key) => {
    const translations = {
      'settings.disclaimer.screen.label': 'Disclaimer screen',
      'settings.disclaimer.title': 'Disclaimer',
      'settings.disclaimer.prototypeFraming': 'Prototype framing',
      'settings.disclaimer.datasetNotice': 'Dataset notice',
      'settings.disclaimer.acknowledge': 'I acknowledge',
      'settings.disclaimer.acknowledgeHint': 'Confirm acknowledgement',
      'settings.disclaimer.decline': 'I disagree',
      'settings.disclaimer.declineHint': 'Exit the app without acknowledging',
    };
    return translations[key] || key;
  });
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selector) => {
      const mockState = { ui: { disclaimerAcknowledged: false } };
      return selector(mockState);
    });
  });

  it('renders on Android', () => {
    const { getByTestId } = renderWithTheme(<DisclaimerScreenAndroid />);
    expect(getByTestId('disclaimer-screen')).toBeTruthy();
    expect(getByTestId('disclaimer-dataset-notice')).toBeTruthy();
    expect(getByTestId('disclaimer-acknowledge-button')).toBeTruthy();
    expect(getByTestId('disclaimer-decline-button')).toBeTruthy();
  });

  it('renders on iOS', () => {
    const { getByTestId } = renderWithTheme(<DisclaimerScreenIOS />);
    expect(getByTestId('disclaimer-screen')).toBeTruthy();
    expect(getByTestId('disclaimer-acknowledge-button')).toBeTruthy();
    expect(getByTestId('disclaimer-decline-button')).toBeTruthy();
  });

  it('renders on Web', () => {
    const { getByTestId } = renderWithTheme(<DisclaimerScreenWeb />);
    expect(getByTestId('disclaimer-screen')).toBeTruthy();
    expect(getByTestId('disclaimer-acknowledge-button')).toBeTruthy();
    expect(getByTestId('disclaimer-decline-button')).toBeTruthy();
  });

  it('hides acknowledge and decline buttons when already acknowledged', () => {
    useSelector.mockImplementation((selector) => {
      const mockState = { ui: { disclaimerAcknowledged: true } };
      return selector(mockState);
    });
    const { queryByTestId } = renderWithTheme(<DisclaimerScreenAndroid />);
    expect(queryByTestId('disclaimer-acknowledge-button')).toBeNull();
    expect(queryByTestId('disclaimer-decline-button')).toBeNull();
  });
});
