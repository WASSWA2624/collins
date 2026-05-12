const React = require('react');
const { render } = require('@testing-library/react-native');

jest.mock('@platform/screens', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    OnboardingScreen: () =>
      React.createElement(Text, { testID: 'onboarding-screen' }, 'Onboarding'),
  };
});

describe('app/(main)/onboarding.jsx', () => {
  it('renders OnboardingScreen instead of redirecting to training', () => {
    const OnboardingRoute = require('../../../app/(main)/onboarding').default;
    const { getByTestId } = render(<OnboardingRoute />);
    expect(getByTestId('onboarding-screen')).toBeDefined();
  });
});
