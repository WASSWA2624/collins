/**
 * Dropdown Component Web Tests
 * File: Dropdown.web.test.js
 * @jest-environment jsdom
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import lightTheme from '@theme/light.theme';

jest.mock('@hooks', () => ({
  useI18n: () => ({
    t: (key) => ({
      'common.searchPlaceholder': 'Search...',
      'common.noResults': 'No results',
      'common.dropdownMenu': 'Dropdown menu',
    }[key] || key),
  }),
}));

describe('Dropdown Component - Web', () => {
  // eslint-disable-next-line import/no-unresolved
  const DropdownWeb = require('@platform/components/forms/Dropdown/Dropdown.web').default;

  const items = [
    { label: 'First action', value: 'first', onPress: jest.fn() },
    { label: 'Second action', value: 'second', onPress: jest.fn() },
  ];

  const renderWebWithProviders = (component) =>
    render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('filters menu items by default on Web', () => {
    const { getByTestId, getByText, queryByText } = renderWebWithProviders(
      <DropdownWeb
        testID="dropdown"
        trigger={<span>Open</span>}
        items={items}
      />
    );

    fireEvent.click(getByTestId('dropdown-trigger'));
    expect(getByText('First action')).toBeTruthy();

    fireEvent.change(getByTestId('dropdown-search'), { target: { value: 'Second' } });

    expect(getByText('Second action')).toBeTruthy();
    expect(queryByText('First action')).toBeFalsy();
  });
});
