/**
 * Root Index Route Tests
 * Tests root index redirect behavior
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { Provider } = require('react-redux');

jest.mock('expo-router', () => {
  const React = require('react');
  return {
    Redirect: ({ href }) => React.createElement('div', { testID: 'redirect', 'data-href': href }),
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

  it('should redirect to /(main)', () => {
    const IndexRoute = require('../../app/index').default;
    const { getByTestId } = renderWithTheme(<IndexRoute />);
    const redirect = getByTestId('redirect');
    expect(redirect).toBeDefined();
    expect(redirect.props['data-href']).toBe('/(main)');
  });

  it('should use default export', () => {
    const mod = require('../../app/index');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });
});
