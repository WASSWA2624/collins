/**
 * Legacy Assessment Route Tests
 * File: assessment.test.js
 */
const React = require('react');
const { render } = require('@testing-library/react-native');

jest.mock('expo-router', () => {
  const React = require('react');
  return {
    Redirect: ({ href }) => React.createElement('redirect', { testID: 'legacy-assessment-redirect', href }),
  };
});

describe('app/(main)/assessment.jsx', () => {
  beforeEach(() => jest.clearAllMocks());

  it('redirects legacy assessment links to New Patient', () => {
    const AssessmentRoute = require('../../../app/(main)/assessment').default;
    const { getByTestId } = render(<AssessmentRoute />);
    expect(getByTestId('legacy-assessment-redirect').props.href).toBe('/new-patient');
  });
});
