/**
 * Checkbox Component Web Tests
 * File: Checkbox.web.test.js
 * @jest-environment jsdom
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import lightTheme from '@theme/light.theme';

const CheckboxWeb = require('@platform/components/forms/Checkbox/Checkbox.web').default;

const renderWebWithProviders = (component) =>
  render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);

describe('Checkbox Component - Web', () => {
  it('toggles when clicked with a mouse', () => {
    const onChange = jest.fn();
    const { getByText } = renderWebWithProviders(
      <CheckboxWeb checked={false} label="Confirm admission" onChange={onChange} testID="confirm-admission" />
    );

    fireEvent.click(getByText('Confirm admission'));

    expect(onChange).toHaveBeenCalledWith(true, undefined);
  });

  it('toggles from the hidden input activation path', () => {
    const onChange = jest.fn();
    const { getByTestId } = renderWebWithProviders(
      <CheckboxWeb checked={false} label="Confirm admission" onChange={onChange} testID="confirm-admission" />
    );

    fireEvent.click(getByTestId('confirm-admission'));

    expect(onChange).toHaveBeenCalledWith(true, undefined);
  });
});
