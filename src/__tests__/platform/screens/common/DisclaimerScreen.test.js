/**
 * DisclaimerScreen Component Tests
 * File: DisclaimerScreen.test.js
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { Provider } = require('react-redux');
const { configureStore } = require('@reduxjs/toolkit');
const rootReducer = require('@store/rootReducer').default || require('@store/rootReducer');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

const DisclaimerScreenAndroid = require('@platform/screens/common/DisclaimerScreen/DisclaimerScreen.android').default;
const DisclaimerScreenIOS = require('@platform/screens/common/DisclaimerScreen/DisclaimerScreen.ios').default;
const DisclaimerScreenWeb = require('@platform/screens/common/DisclaimerScreen/DisclaimerScreen.web').default;

const lightThemeModule = require('@theme/light.theme');
const lightTheme = lightThemeModule.default || lightThemeModule;

const createStore = (disclaimerAcknowledged = false) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      ui: { disclaimerAcknowledged },
      network: { isOnline: true },
    },
  });

const renderWithProviders = (component, store) =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
    </Provider>
  );

describe('DisclaimerScreen', () => {
  const mockT = jest.fn((key) => {
    const translations = {
      'settings.disclaimer.title': 'Prototype disclaimer',
      'settings.disclaimer.message': 'Disclaimer body',
      'settings.disclaimer.acknowledge': 'Acknowledge',
      'settings.disclaimer.acknowledged': 'Acknowledged',
      'settings.disclaimer.acknowledgeHint': 'Acknowledge hint',
    };
    return translations[key] || key;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
  });

  it('renders on Android', () => {
    const store = createStore(false);
    const { getByTestId } = renderWithProviders(<DisclaimerScreenAndroid />, store);
    expect(getByTestId('disclaimer-screen')).toBeTruthy();
  });

  it('renders on iOS', () => {
    const store = createStore(false);
    const { getByTestId } = renderWithProviders(<DisclaimerScreenIOS />, store);
    expect(getByTestId('disclaimer-screen')).toBeTruthy();
  });

  it('renders on Web', () => {
    const store = createStore(false);
    const { getByTestId } = renderWithProviders(<DisclaimerScreenWeb />, store);
    expect(getByTestId('disclaimer-screen')).toBeTruthy();
  });

  it('acknowledges disclaimer when button pressed', () => {
    const store = createStore(false);
    const { getByTestId } = renderWithProviders(<DisclaimerScreenAndroid />, store);
    fireEvent.press(getByTestId('disclaimer-acknowledge-button'));
    expect(store.getState().ui.disclaimerAcknowledged).toBe(true);
  });
});

