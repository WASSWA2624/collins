/**
 * Review Queue Route Tests
 * File: review-queue.test.js
 */

const React = require('react');
const { render } = require('@testing-library/react-native');

jest.mock('@platform/screens', () => {
  const React = require('react');
  return {
    ReviewQueueScreen: () =>
      React.createElement('div', { testID: 'review-queue-screen', 'data-testid': 'review-queue-screen' }, 'Mock ReviewQueueScreen'),
  };
});

describe('app/(main)/review-queue.jsx', () => {
  it('renders ReviewQueueScreen', () => {
    const ReviewQueueRoute = require('../../../app/(main)/review-queue').default;
    const { getByTestId } = render(<ReviewQueueRoute />);
    expect(getByTestId('review-queue-screen')).toBeDefined();
  });
});
