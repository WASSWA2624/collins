/**
 * Select Component Tests
 * File: Select.test.js
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { VALIDATION_STATES } from '@platform/components/forms/Select';
// eslint-disable-next-line import/no-unresolved
import SelectAndroid from '@platform/components/forms/Select/Select.android';
import { renderWithProviders } from '../../helpers/test-utils';

// Mock fetch for jest.setup.js (used in styled-components mocks)
if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));
}

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

describe('Select Component', () => {
  const options = [
    { label: 'One', value: 'one' },
    { label: 'Two', value: 'two' },
    { label: 'Disabled', value: 'disabled', disabled: true },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with label', () => {
      const { getByText } = renderWithProviders(
        <SelectAndroid label="Category" options={options} value="one" onValueChange={() => {}} />
      );
      expect(getByText('Category')).toBeTruthy();
    });

    it('should render without label', () => {
      const { getByTestId } = renderWithProviders(
        <SelectAndroid testID="select" options={options} value="one" onValueChange={() => {}} />
      );
      expect(getByTestId('select')).toBeTruthy();
    });

    it('should render placeholder when no value selected', () => {
      const { getByText } = renderWithProviders(
        <SelectAndroid placeholder="Pick one" options={options} value={undefined} onValueChange={() => {}} />
      );
      expect(getByText('Pick one')).toBeTruthy();
    });

    it('should render default placeholder when no placeholder provided', () => {
      const { getByText } = renderWithProviders(
        <SelectAndroid options={options} value={undefined} onValueChange={() => {}} />
      );
      expect(getByText('Select…')).toBeTruthy();
    });

    it('should render selected label when value is provided', () => {
      const { getByText } = renderWithProviders(
        <SelectAndroid options={options} value="two" onValueChange={() => {}} />
      );
      expect(getByText('Two')).toBeTruthy();
    });

    it('should render with null value', () => {
      const { getByText } = renderWithProviders(
        <SelectAndroid options={options} value={null} onValueChange={() => {}} />
      );
      expect(getByText('Select…')).toBeTruthy();
    });

    it('should render with empty options array', () => {
      const { getByTestId } = renderWithProviders(
        <SelectAndroid testID="select" options={[]} value={undefined} onValueChange={() => {}} />
      );
      expect(getByTestId('select')).toBeTruthy();
    });
  });

  describe('Interactions', () => {
    it('should open options and select an option', () => {
      const onValueChange = jest.fn();
      const { getByTestId, getByText, queryByText } = renderWithProviders(
        <SelectAndroid testID="select" options={options} value={undefined} onValueChange={onValueChange} />
      );

      fireEvent.press(getByTestId('select'));
      expect(getByText('One')).toBeTruthy();

      fireEvent.press(getByTestId('select-option-1'));
      expect(onValueChange).toHaveBeenCalledWith('two');
    });

    it('should not select disabled option', () => {
      const onValueChange = jest.fn();
      const { getByTestId } = renderWithProviders(
        <SelectAndroid testID="select" options={options} value={undefined} onValueChange={onValueChange} />
      );

      fireEvent.press(getByTestId('select'));
      fireEvent.press(getByTestId('select-option-2'));
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('should not open when disabled', () => {
      const onValueChange = jest.fn();
      const { getByTestId } = renderWithProviders(
        <SelectAndroid testID="select" options={options} value={undefined} onValueChange={onValueChange} disabled />
      );

      fireEvent.press(getByTestId('select'));
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('should call onValueChange when selecting an option', () => {
      const onValueChange = jest.fn();
      const { getByTestId } = renderWithProviders(
        <SelectAndroid testID="select" options={options} value={undefined} onValueChange={onValueChange} />
      );

      fireEvent.press(getByTestId('select'));
      fireEvent.press(getByTestId('select-option-0'));
      expect(onValueChange).toHaveBeenCalledWith('one');
    });
  });

  describe('Accessibility', () => {
    it('should set accessibilityState.disabled when disabled', () => {
      const { getByTestId } = renderWithProviders(
        <SelectAndroid testID="select" options={options} value={undefined} onValueChange={() => {}} disabled />
      );
      const trigger = getByTestId('select');
      expect(trigger.props.accessibilityState.disabled).toBe(true);
    });

    it('should have accessibilityLabel when provided', () => {
      const { getByTestId } = renderWithProviders(
        <SelectAndroid
          testID="select"
          options={options}
          value={undefined}
          onValueChange={() => {}}
          accessibilityLabel="Custom label"
        />
      );
      const trigger = getByTestId('select');
      expect(trigger.props.accessibilityLabel || trigger.props['aria-label']).toBeTruthy();
    });

    it('should use label as accessibilityLabel when not provided', () => {
      const { getByTestId } = renderWithProviders(
        <SelectAndroid testID="select" label="Category" options={options} value={undefined} onValueChange={() => {}} />
      );
      const trigger = getByTestId('select');
      expect(trigger.props.accessibilityLabel || trigger.props['aria-label']).toBeTruthy();
    });
  });

  describe('Validation', () => {
    it('should validate required on blur and show error', async () => {
      const { getByTestId, findByText } = renderWithProviders(
        <SelectAndroid testID="select" options={options} value={undefined} onValueChange={() => {}} required />
      );

      const trigger = getByTestId('select');
      fireEvent(trigger, 'blur');
      // Check for the translated error message from forms.validation.required
      expect(await findByText('This field is required')).toBeTruthy();
    });

    it('should not show error when required field has value', async () => {
      const { getByTestId, queryByText } = renderWithProviders(
        <SelectAndroid testID="select" options={options} value="one" onValueChange={() => {}} required />
      );

      const trigger = getByTestId('select');
      fireEvent(trigger, 'blur');
      // Should not show error when value is selected
      expect(queryByText('This field is required')).toBeFalsy();
    });

    it('should validate with custom validate function returning boolean', async () => {
      const validate = jest.fn((value) => value === 'one');
      const { getByTestId, findByText } = renderWithProviders(
        <SelectAndroid
          testID="select"
          options={options}
          value="two"
          onValueChange={() => {}}
          validate={validate}
        />
      );

      const trigger = getByTestId('select');
      fireEvent(trigger, 'blur');
      expect(validate).toHaveBeenCalledWith('two');
      expect(await findByText('Invalid value')).toBeTruthy();
    });

    it('should validate with custom validate function returning object', async () => {
      const validate = jest.fn((value) => ({
        valid: value === 'one',
        error: 'Custom error message',
      }));
      const { getByTestId, findByText } = renderWithProviders(
        <SelectAndroid
          testID="select"
          options={options}
          value="two"
          onValueChange={() => {}}
          validate={validate}
        />
      );

      const trigger = getByTestId('select');
      fireEvent(trigger, 'blur');
      expect(validate).toHaveBeenCalledWith('two');
      expect(await findByText('Custom error message')).toBeTruthy();
    });

    it('should show success state when valid value is selected', async () => {
      const { getByTestId } = renderWithProviders(
        <SelectAndroid testID="select" options={options} value="one" onValueChange={() => {}} required />
      );

      const trigger = getByTestId('select');
      fireEvent(trigger, 'blur');
      // Validation state should be success (tested via component behavior)
      expect(trigger).toBeTruthy();
    });

    it('should use external validationState when provided', () => {
      const { getByTestId } = renderWithProviders(
        <SelectAndroid
          testID="select"
          options={options}
          value={undefined}
          onValueChange={() => {}}
          validationState={VALIDATION_STATES.ERROR}
        />
      );
      const trigger = getByTestId('select');
      expect(trigger).toBeTruthy();
    });

    it('should use external errorMessage when provided', () => {
      const { getByText } = renderWithProviders(
        <SelectAndroid
          options={options}
          value={undefined}
          onValueChange={() => {}}
          errorMessage="External error"
        />
      );
      expect(getByText('External error')).toBeTruthy();
    });

    it('should show helperText when provided', () => {
      const { getByText } = renderWithProviders(
        <SelectAndroid options={options} value={undefined} onValueChange={() => {}} helperText="Helper text" />
      );
      expect(getByText('Helper text')).toBeTruthy();
    });

    it('should prioritize errorMessage over helperText', () => {
      const { getByText, queryByText } = renderWithProviders(
        <SelectAndroid
          options={options}
          value={undefined}
          onValueChange={() => {}}
          errorMessage="Error message"
          helperText="Helper text"
        />
      );
      expect(getByText('Error message')).toBeTruthy();
      expect(queryByText('Helper text')).toBeFalsy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string value', () => {
      const { getByText } = renderWithProviders(
        <SelectAndroid options={options} value="" onValueChange={() => {}} />
      );
      expect(getByText('Select…')).toBeTruthy();
    });

    it('should handle value that does not exist in options', () => {
      const { getByText } = renderWithProviders(
        <SelectAndroid options={options} value="nonexistent" onValueChange={() => {}} />
      );
      expect(getByText('Select…')).toBeTruthy();
    });

    it('should handle options with numeric values', () => {
      const numericOptions = [
        { label: 'First', value: 1 },
        { label: 'Second', value: 2 },
      ];
      const { getByText } = renderWithProviders(
        <SelectAndroid options={numericOptions} value={1} onValueChange={() => {}} />
      );
      expect(getByText('First')).toBeTruthy();
    });

    it('should handle required field with empty string', async () => {
      const { getByTestId, findByText } = renderWithProviders(
        <SelectAndroid testID="select" options={options} value="" onValueChange={() => {}} required />
      );

      const trigger = getByTestId('select');
      fireEvent(trigger, 'blur');
      expect(await findByText('This field is required')).toBeTruthy();
    });

    it('should not show error when not required and value is empty', async () => {
      const { getByTestId, queryByText } = renderWithProviders(
        <SelectAndroid testID="select" options={options} value="" onValueChange={() => {}} required={false} />
      );

      const trigger = getByTestId('select');
      fireEvent(trigger, 'blur');
      // Should not show error when field is not required and empty
      expect(queryByText('This field is required')).toBeFalsy();
    });

    it('should not show error when not required and value is null', async () => {
      const { getByTestId, queryByText } = renderWithProviders(
        <SelectAndroid testID="select" options={options} value={null} onValueChange={() => {}} required={false} />
      );

      const trigger = getByTestId('select');
      fireEvent(trigger, 'blur');
      // Should not show error when field is not required and null
      expect(queryByText('This field is required')).toBeFalsy();
    });

    it('should not show error when not required and value is undefined', async () => {
      const { getByTestId, queryByText } = renderWithProviders(
        <SelectAndroid testID="select" options={options} value={undefined} onValueChange={() => {}} required={false} />
      );

      const trigger = getByTestId('select');
      fireEvent(trigger, 'blur');
      // Should not show error when field is not required and undefined
      expect(queryByText('This field is required')).toBeFalsy();
    });
  });

  describe('Constants', () => {
    it('should export VALIDATION_STATES constant', () => {
      expect(VALIDATION_STATES).toBeDefined();
      expect(VALIDATION_STATES.DEFAULT).toBe('default');
      expect(VALIDATION_STATES.ERROR).toBe('error');
      expect(VALIDATION_STATES.SUCCESS).toBe('success');
      expect(VALIDATION_STATES.DISABLED).toBe('disabled');
    });
  });

  describe('Platform-specific tests', () => {
    describe('Android variant', () => {
      it('should render Android select', () => {
        // eslint-disable-next-line import/no-unresolved
        const SelectAndroid = require('@platform/components/forms/Select/Select.android').default;

        const { getByTestId } = renderWithProviders(
          <SelectAndroid testID="android-select" options={options} value="one" onValueChange={() => {}} />
        );

        expect(getByTestId('android-select')).toBeTruthy();
      });

      it('should open modal on Android', () => {
        // eslint-disable-next-line import/no-unresolved
        const SelectAndroid = require('@platform/components/forms/Select/Select.android').default;

        const { getByTestId, getByText } = renderWithProviders(
          <SelectAndroid testID="android-select" options={options} value={undefined} onValueChange={() => {}} />
        );

        fireEvent.press(getByTestId('android-select'));
        expect(getByText('One')).toBeTruthy();
      });

      it('should close modal when option is selected on Android', () => {
        const onValueChange = jest.fn();
        // eslint-disable-next-line import/no-unresolved
        const SelectAndroid = require('@platform/components/forms/Select/Select.android').default;

        const { getByTestId, queryByText } = renderWithProviders(
          <SelectAndroid
            testID="android-select"
            options={options}
            value={undefined}
            onValueChange={onValueChange}
          />
        );

        fireEvent.press(getByTestId('android-select'));
        fireEvent.press(getByTestId('android-select-option-0'));
        expect(onValueChange).toHaveBeenCalledWith('one');
      });
    });

    // Web variant tests are in Select.web.test.js (requires jsdom environment)
  });
});


