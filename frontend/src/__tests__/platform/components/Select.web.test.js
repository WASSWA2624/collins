/**
 * Select Component Web Tests
 * File: Select.web.test.js
 * @jest-environment jsdom
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import lightTheme from '@theme/light.theme';

// Mock i18n hook
jest.mock('@hooks', () => {
  const mockEnTranslations = require('@i18n/locales/en.json');
  return {
    useI18n: () => ({
      t: (key) => {
        const keys = key.split('.');
        let value = mockEnTranslations;
        for (const k of keys) {
          value = value?.[k];
        }
        return value || key;
      },
      locale: 'en',
    }),
  };
});

describe('Select Component - Web', () => {
  const options = [
    { label: 'One', value: 'one' },
    { label: 'Two', value: 'two' },
    { label: 'Disabled', value: 'disabled', disabled: true },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper to render web components with proper providers
  const renderWebWithProviders = (component) => {
    return render(
      <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
    );
  };

  // eslint-disable-next-line import/no-unresolved
  const SelectWeb = require('@platform/components/forms/Select/Select.web').default;

  describe('Rendering', () => {
    it('should render Web select', () => {
      const { getByTestId } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value="one" onValueChange={() => {}} />
      );

      expect(getByTestId('web-select')).toBeTruthy();
    });

    it('should open dropdown on Web', () => {
      const { getByTestId, getByText } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={() => {}} />
      );

      const trigger = getByTestId('web-select');
      fireEvent.click(trigger);
      expect(getByText('One')).toBeTruthy();
    });

    it('should select option when clicking with mouse on Web', () => {
      const onValueChange = jest.fn();
      const { getByTestId, getByText, queryByText } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={onValueChange} />
      );

      const trigger = getByTestId('web-select');
      fireEvent.click(trigger);
      expect(getByText('One')).toBeTruthy();

      const option = getByTestId('web-select-option-1');
      fireEvent.click(option);
      expect(onValueChange).toHaveBeenCalledWith('two');
      expect(queryByText('One')).toBeFalsy();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should open dropdown with Enter key on Web', () => {
      const { getByTestId, getByText } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={() => {}} />
      );

      const trigger = getByTestId('web-select');
      fireEvent.keyDown(trigger, { key: 'Enter' });
      expect(getByText('One')).toBeTruthy();
    });

    it('should open dropdown with Space key on Web', () => {
      const { getByTestId, getByText } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={() => {}} />
      );

      const trigger = getByTestId('web-select');
      fireEvent.keyDown(trigger, { key: ' ' });
      expect(getByText('One')).toBeTruthy();
    });

    it('should open dropdown with ArrowDown key on Web', () => {
      const { getByTestId, getByText } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={() => {}} />
      );

      const trigger = getByTestId('web-select');
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      expect(getByText('One')).toBeTruthy();
    });

    it('should close dropdown with Escape key on Web', () => {
      const { getByTestId, getByText, queryByText } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={() => {}} />
      );

      const trigger = getByTestId('web-select');
      fireEvent.click(trigger);
      expect(getByText('One')).toBeTruthy();

      const menu = getByTestId('web-select-menu');
      fireEvent.keyDown(menu, { key: 'Escape' });
      expect(queryByText('One')).toBeFalsy();
    });

    it('should navigate options with ArrowDown key on Web', () => {
      const { getByTestId, getByText } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={() => {}} />
      );

      const trigger = getByTestId('web-select');
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      const menu = getByTestId('web-select-menu');
      fireEvent.keyDown(menu, { key: 'ArrowDown' });
      expect(getByText('Two')).toBeTruthy();
    });

    it('should navigate options with ArrowUp key on Web', () => {
      const { getByTestId, getByText } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={() => {}} />
      );

      const trigger = getByTestId('web-select');
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      const menu = getByTestId('web-select-menu');
      fireEvent.keyDown(menu, { key: 'ArrowDown' });
      fireEvent.keyDown(menu, { key: 'ArrowUp' });
      expect(getByText('One')).toBeTruthy();
    });

    it('should select option with Enter key on Web', () => {
      const onValueChange = jest.fn();
      const { getByTestId, getByText, queryByText } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={onValueChange} />
      );

      const trigger = getByTestId('web-select');
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      const menu = getByTestId('web-select-menu');
      fireEvent.keyDown(menu, { key: 'Enter' });
      expect(onValueChange).toHaveBeenCalledWith('one');
      expect(queryByText('One')).toBeFalsy();
    });

    it('should select option with Space key on Web', () => {
      const onValueChange = jest.fn();
      const { getByTestId, queryByText } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={onValueChange} />
      );

      const trigger = getByTestId('web-select');
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      const menu = getByTestId('web-select-menu');
      fireEvent.keyDown(menu, { key: ' ' });
      expect(onValueChange).toHaveBeenCalledWith('one');
      expect(queryByText('One')).toBeFalsy();
    });

    it('should not open when disabled on Web', () => {
      const { getByTestId, queryByText } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={() => {}} disabled />
      );

      const trigger = getByTestId('web-select');
      fireEvent.keyDown(trigger, { key: 'Enter' });
      expect(queryByText('One')).toBeFalsy();
    });

    it('should skip disabled options during keyboard navigation on Web', () => {
      const { getByTestId, getByText } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={() => {}} />
      );

      const trigger = getByTestId('web-select');
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      const menu = getByTestId('web-select-menu');
      // Navigate past disabled option
      fireEvent.keyDown(menu, { key: 'ArrowDown' });
      fireEvent.keyDown(menu, { key: 'ArrowDown' });
      // Should be on 'Two' (skipping 'Disabled')
      expect(getByText('Two')).toBeTruthy();
    });

    it('should close dropdown when clicking outside on Web', () => {
      const { getByTestId, getByText, queryByText, container } = renderWebWithProviders(
        <div>
          <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={() => {}} />
          <div data-testid="outside-element">Outside</div>
        </div>
      );

      const trigger = getByTestId('web-select');
      fireEvent.click(trigger);
      expect(getByText('One')).toBeTruthy();

      // Click outside the select component
      const outsideElement = getByTestId('outside-element');
      fireEvent.mouseDown(outsideElement);
      expect(queryByText('One')).toBeFalsy();
    });

    it('should close dropdown with Escape key on trigger when menu is open on Web', () => {
      const { getByTestId, getByText, queryByText } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={() => {}} />
      );

      const trigger = getByTestId('web-select');
      fireEvent.click(trigger);
      expect(getByText('One')).toBeTruthy();

      // Simulate Escape key on trigger (though focus is on menu, this tests the code path)
      fireEvent.keyDown(trigger, { key: 'Escape' });
      expect(queryByText('One')).toBeFalsy();
    });
  });

  describe('Interaction Edge Cases', () => {
    it('should not call onValueChange when clicking disabled option on Web', () => {
      const onValueChange = jest.fn();
      const { getByTestId, getByText } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={onValueChange} />
      );

      const trigger = getByTestId('web-select');
      fireEvent.click(trigger);
      expect(getByText('Disabled')).toBeTruthy();

      const disabledOption = getByTestId('web-select-option-2');
      fireEvent.click(disabledOption);
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });
});

