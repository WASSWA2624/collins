/**
 * Home Workflow Route Alias Tests
 * File: home-workflow-routes.test.js
 */
const React = require('react');
const { render } = require('@testing-library/react-native');

jest.mock('expo-router', () => {
  const React = require('react');
  return {
    Redirect: ({ href }) => React.createElement('redirect', { testID: 'route-redirect', href }),
  };
});

jest.mock('@platform/screens', () => {
  const React = require('react');
  const makeScreen = (testID, label) => () =>
    React.createElement('div', { testID, 'data-testid': testID }, label);

  return {
    AbgVentUpdateScreen: makeScreen('abg-vent-update-screen', 'Update ABG & Ventilator Settings'),
    AssessmentScreen: makeScreen('new-patient-screen', 'New Patient'),
    DashboardScreen: makeScreen('dashboard-screen', 'Dashboard'),
    DatasetCaptureScreen: makeScreen('dataset-capture-screen', 'Dataset Capture'),
    FacilityManagementScreen: makeScreen('facility-management-screen', 'Facility Management'),
    HistoryScreen: makeScreen('tracking-screen', 'Tracking'),
    UserManagementScreen: makeScreen('user-management-screen', 'User Management'),
  };
});

describe('home workflow route aliases', () => {
  it.each([
    ['new-patient', 'new-patient-screen'],
    ['tracking', 'tracking-screen'],
    ['abg-ventilator-updates', 'abg-vent-update-screen'],
    ['abg-vent-update', 'abg-vent-update-screen'],
    ['dataset-capture', 'dataset-capture-screen'],
    ['dashboard', 'dashboard-screen'],
    ['user-management', 'user-management-screen'],
    ['facility-management', 'facility-management-screen'],
  ])('renders %s route', (route, testID) => {
    const RouteComponent = require(`../../../app/(main)/${route}`).default;
    const { getByTestId } = render(<RouteComponent />);
    expect(getByTestId(testID)).toBeDefined();
  });

  it('redirects legacy admit route to New Patient', () => {
    const RouteComponent = require('../../../app/(main)/admit').default;
    const { getByTestId } = render(<RouteComponent />);
    expect(getByTestId('route-redirect').props.href).toBe('/new-patient');
  });
});
