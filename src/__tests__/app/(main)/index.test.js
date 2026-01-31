/**
 * Main Group Index Route Tests
 * Tests Home screen rendering inside main group index route.
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { Provider } = require('react-redux');

jest.mock('@platform/screens', () => {
  const React = require('react');
  return {
    HomeScreen: () => React.createElement('div', { testID: 'home-screen' }, 'Mock HomeScreen'),
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

describe('app/(main)/index.jsx', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should render HomeScreen', () => {
    const MainIndexRoute = require('../../../app/(main)/index').default;
    const { getByTestId } = renderWithTheme(<MainIndexRoute />);
    expect(getByTestId('home-screen')).toBeDefined();
  });
});
