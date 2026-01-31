/**
 * Disclaimer Route Tests
 * File: (settings)/disclaimer.test.js
 */
const React = require('react');
const { render } = require('@testing-library/react-native');

jest.mock('@platform/screens', () => {
  const React = require('react');
  return {
    DisclaimerScreen: () => React.createElement('div', { testID: 'disclaimer-screen' }),
  };
});

describe('app/(settings)/disclaimer.jsx', () => {
  it('renders DisclaimerScreen', () => {
    const DisclaimerRoute = require('../../../app/(settings)/disclaimer').default;
    const { getByTestId } = render(React.createElement(DisclaimerRoute));
    expect(getByTestId('disclaimer-screen')).toBeTruthy();
  });
});

