/**
 * Root Index Route Tests
 * Tests Landing screen route rendering
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { Provider } = require('react-redux');

jest.mock('@platform/screens', () => {
  const React = require('react');
  return {
    LandingScreen: () =>
      React.createElement('div', { testID: 'landing-screen' }, 'Mock LandingScreen'),
  };
});
const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');
const createMockStore = () => ({
  getState: () => ({}),
  subscribe: () => () => {},
  dispatch: () => {},
});

const renderWithTheme = (component, store = createMockStore()) =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
    </Provider>
  );

describe('Index Route (index.jsx)', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should render LandingScreen', () => {
    const IndexRoute = require('../../app/index').default;
    const { getByTestId } = renderWithTheme(<IndexRoute />);
    expect(getByTestId('landing-screen')).toBeDefined();
  });

  it('should use default export', () => {
    const mod = require('../../app/index');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });
});
