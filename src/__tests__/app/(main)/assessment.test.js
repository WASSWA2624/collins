/**
 * Assessment Route Tests
 * File: (main)/assessment.test.js
 */
const React = require('react');
const { render } = require('@testing-library/react-native');

jest.mock('@platform/screens', () => {
  const React = require('react');
  return {
    AssessmentEntryScreen: () =>
      React.createElement('div', { testID: 'assessment-entry-screen' }),
  };
});

describe('app/(main)/assessment.jsx', () => {
  it('renders AssessmentEntryScreen', () => {
    const AssessmentRoute = require('../../../app/(main)/assessment').default;
    const { getByTestId } = render(React.createElement(AssessmentRoute));
    expect(getByTestId('assessment-entry-screen')).toBeTruthy();
  });
});

