const React = require('react');
const { render } = require('@testing-library/react-native');

jest.mock('@navigation/guards', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    PublicAuthGuard: ({ children }) =>
      React.createElement(View, { testID: 'public-auth-guard' }, children),
  };
});

jest.mock('@platform/screens', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    RegisterScreen: () => React.createElement(Text, { testID: 'register-screen' }, 'Register'),
  };
});

describe('Register route', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders registration behind the public auth guard', () => {
    const RegisterRoute = require('../../app/register').default;
    const { getByTestId } = render(<RegisterRoute />);

    expect(getByTestId('public-auth-guard')).toBeTruthy();
    expect(getByTestId('register-screen')).toBeTruthy();
  });

  it('uses a default route component export', () => {
    const mod = require('../../app/register');

    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });
});
