/**
 * Dropdown Component Tests
 * File: Dropdown.test.js
 */

import React from 'react';
import { Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
// eslint-disable-next-line import/no-unresolved
import DropdownAndroid from '@platform/components/forms/Dropdown/Dropdown.android';
import { renderWithProviders } from '../../helpers/test-utils';

jest.mock('@hooks', () => ({
  useI18n: () => ({
    t: (key) => ({
      'common.searchPlaceholder': 'Search...',
      'common.noResults': 'No results',
      'common.dropdownMenu': 'Dropdown menu',
    }[key] || key),
  }),
}));

describe('Dropdown Component', () => {
  const items = [
    { label: 'First action', value: 'first', onPress: jest.fn() },
    { label: 'Second action', value: 'second', onPress: jest.fn() },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('filters menu items by default on Android', () => {
    const { getByTestId, getByText, queryByText } = renderWithProviders(
      <DropdownAndroid
        testID="dropdown"
        trigger={<Text>Open</Text>}
        items={items}
      />
    );

    fireEvent.press(getByTestId('dropdown-trigger'));
    expect(getByText('First action')).toBeTruthy();

    fireEvent.changeText(getByTestId('dropdown-search'), 'Second');

    expect(getByText('Second action')).toBeTruthy();
    expect(queryByText('First action')).toBeFalsy();
  });
});
