/**
 * Training Layout Tests
 * File: training-layout.test.js
 *
 * Tests for `src/app/(training)/_layout.jsx`.
 *
 * Step 7.10 requirements:
 * - renders without errors
 * - renders child routes via `<Slot />` (mock child routes)
 * - mocks `expo-router` as needed
 */
import React from 'react';
import { render } from '@testing-library/react-native';

import TrainingLayout from '@app/(training)/_layout';

jest.mock('@navigation/guards', () => ({
  useAcknowledgementGuard: jest.fn(),
}));

jest.mock('expo-router', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    Slot: () => React.createElement(Text, null, 'MOCK_SLOT_CHILD'),
  };
});

describe('app/(training)/_layout.jsx', () => {
  test('renders without errors and renders child routes via <Slot />', () => {
    const { getByText } = render(<TrainingLayout />);
    expect(getByText('MOCK_SLOT_CHILD')).toBeTruthy();
  });
});

