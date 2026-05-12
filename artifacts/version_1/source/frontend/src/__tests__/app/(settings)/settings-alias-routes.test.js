/**
 * Settings Route Alias Tests
 * File: settings-alias-routes.test.js
 */
const React = require('react');
const { render } = require('@testing-library/react-native');

jest.mock('@platform/screens', () => {
  const React = require('react');
  const makeScreen = (testID, label) => () =>
    React.createElement('div', { testID, 'data-testid': testID }, label);

  return {
    AboutScreen: makeScreen('about-screen', 'About'),
    DataSourcesScreen: makeScreen('data-sources-screen', 'Data sources'),
    HelpScreen: makeScreen('help-screen', 'Help'),
    PrivacyScreen: makeScreen('privacy-screen', 'Privacy'),
  };
});

describe('settings route aliases', () => {
  it.each([
    ['about', 'about-screen'],
    ['data-sources', 'data-sources-screen'],
    ['help', 'help-screen'],
    ['privacy', 'privacy-screen'],
  ])('renders /settings/%s route', (route, testID) => {
    const RouteComponent = require(`../../../app/(settings)/settings/${route}`).default;
    const { getByTestId } = render(<RouteComponent />);
    expect(getByTestId(testID)).toBeDefined();
  });
});
