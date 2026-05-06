/**
 * Home Workflow Route Alias Tests
 * File: home-workflow-routes.test.js
 */
const React = require('react');
const { render } = require('@testing-library/react-native');

jest.mock('@platform/screens', () => {
  const React = require('react');
  const makeScreen = (testID, label) => () =>
    React.createElement('div', { testID, 'data-testid': testID }, label);

  return {
    AbgVentUpdateScreen: makeScreen('abg-vent-update-screen', 'Update ABG & Ventilator Settings'),
    AssessmentScreen: makeScreen('admit-screen', 'Admit'),
    DashboardScreen: makeScreen('dashboard-screen', 'Dashboard'),
    DataSourcesScreen: makeScreen('dataset-capture-screen', 'Dataset Capture'),
    HistoryScreen: makeScreen('tracking-screen', 'Tracking'),
  };
});

describe('home workflow route aliases', () => {
  it.each([
    ['admit', 'admit-screen'],
    ['tracking', 'tracking-screen'],
    ['abg-ventilator-updates', 'abg-vent-update-screen'],
    ['abg-vent-update', 'abg-vent-update-screen'],
    ['dataset-capture', 'dataset-capture-screen'],
    ['dashboard', 'dashboard-screen'],
  ])('renders %s route', (route, testID) => {
    const RouteComponent = require(`../../../app/(main)/${route}`).default;
    const { getByTestId } = render(<RouteComponent />);
    expect(getByTestId(testID)).toBeDefined();
  });
});
