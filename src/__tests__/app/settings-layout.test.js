/**
 * Settings Layout Tests
 * File: settings-layout.test.js
 *
 * Tests for `src/app/(settings)/_layout.jsx`.
 *
 * Step 7.10 requirements:
 * - renders without errors
 * - renders child routes via `<Slot />` (mock child routes)
 * - mocks `expo-router` as needed
 */
import React from 'react';
import { render } from '@testing-library/react-native';

import SettingsLayout from '@app/(settings)/_layout';

jest.mock('expo-router', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    Slot: () => React.createElement(Text, null, 'MOCK_SLOT_CHILD'),
  };
});

describe('app/(settings)/_layout.jsx', () => {
  test('renders without errors and renders child routes via <Slot />', () => {
    const { getByText } = render(<SettingsLayout />);
    expect(getByText('MOCK_SLOT_CHILD')).toBeTruthy();
  });
});

