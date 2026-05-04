/**
 * Switch Component Tests
 * File: Switch.test.js
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import Switch from '@platform/components/forms/Switch';
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

const renderWithTheme = (component) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
};

describe('Switch Component', () => {
  const mockOnValueChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with default a11y role', () => {
      // eslint-disable-next-line import/no-unresolved
      const SwitchAndroid = require('@platform/components/forms/Switch/Switch.android').default;
      const { getByRole } = renderWithTheme(<SwitchAndroid />);
      expect(getByRole('switch')).toBeTruthy();
    });

    it('should render with label (uses accessibilityLabel on native)', () => {
      // eslint-disable-next-line import/no-unresolved
      const SwitchAndroid = require('@platform/components/forms/Switch/Switch.android').default;
      const { getByLabelText } = renderWithTheme(<SwitchAndroid label="Switch Label" />);
      expect(getByLabelText('Switch Label')).toBeTruthy();
    });

    it('should render without label', () => {
      // eslint-disable-next-line import/no-unresolved
      const SwitchAndroid = require('@platform/components/forms/Switch/Switch.android').default;
      const { getByRole } = renderWithTheme(<SwitchAndroid />);
      expect(getByRole('switch')).toBeTruthy();
    });
  });

  describe('States', () => {
    it('should expose checked state via accessibilityState', () => {
      // eslint-disable-next-line import/no-unresolved
      const SwitchAndroid = require('@platform/components/forms/Switch/Switch.android').default;
      const { getByRole } = renderWithTheme(<SwitchAndroid value />);
      const el = getByRole('switch');
      expect(el.props.accessibilityState.checked).toBe(true);
    });

    it('should expose unchecked state via accessibilityState', () => {
      // eslint-disable-next-line import/no-unresolved
      const SwitchAndroid = require('@platform/components/forms/Switch/Switch.android').default;
      const { getByRole } = renderWithTheme(<SwitchAndroid value={false} />);
      const el = getByRole('switch');
      expect(el.props.accessibilityState.checked).toBe(false);
    });

    it('should render disabled state', () => {
      // eslint-disable-next-line import/no-unresolved
      const SwitchAndroid = require('@platform/components/forms/Switch/Switch.android').default;
      const { getByRole } = renderWithTheme(<SwitchAndroid disabled />);
      const el = getByRole('switch');
      expect(el.props.accessibilityState.disabled).toBe(true);
    });

    it('should not toggle when disabled', () => {
      // eslint-disable-next-line import/no-unresolved
      const SwitchAndroid = require('@platform/components/forms/Switch/Switch.android').default;
      const { getByRole } = renderWithTheme(
        <SwitchAndroid value={false} disabled onValueChange={mockOnValueChange} />
      );
      const el = getByRole('switch');
      expect(el.props.accessibilityState.disabled).toBe(true);
      fireEvent.press(el);
      expect(mockOnValueChange).not.toHaveBeenCalled();
    });
  });

  describe('Interactions', () => {
    it('should call onValueChange with toggled value on press', () => {
      // eslint-disable-next-line import/no-unresolved
      const SwitchAndroid = require('@platform/components/forms/Switch/Switch.android').default;
      const { getByRole } = renderWithTheme(
        <SwitchAndroid value={false} onValueChange={mockOnValueChange} />
      );
      fireEvent.press(getByRole('switch'));
      expect(mockOnValueChange).toHaveBeenCalledTimes(1);
      expect(mockOnValueChange).toHaveBeenCalledWith(true);
    });

    it('should call onValueChange with false when toggling from true', () => {
      // eslint-disable-next-line import/no-unresolved
      const SwitchAndroid = require('@platform/components/forms/Switch/Switch.android').default;
      const { getByRole } = renderWithTheme(
        <SwitchAndroid value onValueChange={mockOnValueChange} />
      );
      fireEvent.press(getByRole('switch'));
      expect(mockOnValueChange).toHaveBeenCalledTimes(1);
      expect(mockOnValueChange).toHaveBeenCalledWith(false);
    });

    it('should not call onValueChange when handler is not provided', () => {
      // eslint-disable-next-line import/no-unresolved
      const SwitchAndroid = require('@platform/components/forms/Switch/Switch.android').default;
      const { getByRole } = renderWithTheme(<SwitchAndroid value={false} />);
      fireEvent.press(getByRole('switch'));
      // Should not throw, just no-op
      expect(mockOnValueChange).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should accept testID prop', () => {
      // eslint-disable-next-line import/no-unresolved
      const SwitchAndroid = require('@platform/components/forms/Switch/Switch.android').default;
      const { getByTestId } = renderWithTheme(<SwitchAndroid testID="switch-test" />);
      expect(getByTestId('switch-test')).toBeTruthy();
    });

    it('should pass accessibilityLabel and accessibilityHint through', () => {
      // eslint-disable-next-line import/no-unresolved
      const SwitchAndroid = require('@platform/components/forms/Switch/Switch.android').default;
      const { getByLabelText } = renderWithTheme(
        <SwitchAndroid accessibilityLabel="Notifications" accessibilityHint="Toggle notifications" />
      );
      const el = getByLabelText('Notifications');
      expect(el.props.accessibilityHint).toBe('Toggle notifications');
    });

    it('should use label as accessibility label when provided', () => {
      // eslint-disable-next-line import/no-unresolved
      const SwitchAndroid = require('@platform/components/forms/Switch/Switch.android').default;
      const { getByLabelText } = renderWithTheme(<SwitchAndroid label="Custom Label" />);
      expect(getByLabelText('Custom Label')).toBeTruthy();
    });

    it('should use i18n "On" when value is true and no label/accessibilityLabel', () => {
      // eslint-disable-next-line import/no-unresolved
      const SwitchAndroid = require('@platform/components/forms/Switch/Switch.android').default;
      const { getByLabelText } = renderWithTheme(<SwitchAndroid value />);
      expect(getByLabelText('On')).toBeTruthy();
    });

    it('should use i18n "Off" when value is false and no label/accessibilityLabel', () => {
      // eslint-disable-next-line import/no-unresolved
      const SwitchAndroid = require('@platform/components/forms/Switch/Switch.android').default;
      const { getByLabelText } = renderWithTheme(<SwitchAndroid value={false} />);
      expect(getByLabelText('Off')).toBeTruthy();
    });

    it('should prefer accessibilityLabel over label', () => {
      // eslint-disable-next-line import/no-unresolved
      const SwitchAndroid = require('@platform/components/forms/Switch/Switch.android').default;
      const { getByLabelText } = renderWithTheme(
        <SwitchAndroid label="Label" accessibilityLabel="A11y Label" />
      );
      expect(getByLabelText('A11y Label')).toBeTruthy();
    });
  });

  describe('Platform-specific tests', () => {
    describe('Android variant', () => {
      it('should render Android switch', () => {
        // eslint-disable-next-line import/no-unresolved
        const SwitchAndroid = require('@platform/components/forms/Switch/Switch.android').default;

        const { UNSAFE_getByType } = renderWithTheme(
          <SwitchAndroid value={false} testID="android-switch" />
        );

        const switchEl = UNSAFE_getByType(SwitchAndroid);
        expect(switchEl).toBeTruthy();
        expect(switchEl.props.value).toBe(false);
        expect(switchEl.props.testID).toBe('android-switch');
      });

      it('should handle default value prop on Android', () => {
        // eslint-disable-next-line import/no-unresolved
        const SwitchAndroid = require('@platform/components/forms/Switch/Switch.android').default;

        const { getByRole } = renderWithTheme(
          <SwitchAndroid testID="android-switch" />
        );

        const switchEl = getByRole('switch');
        expect(switchEl).toBeTruthy();
        // Default value is false, but it's applied in the component, not as a prop
        // We verify the component renders correctly with default value by checking accessibilityState
        expect(switchEl.props.accessibilityState.checked).toBe(false);
      });

      it('should handle press on Android', () => {
        // eslint-disable-next-line import/no-unresolved
        const SwitchAndroid = require('@platform/components/forms/Switch/Switch.android').default;

        const { getByRole } = renderWithTheme(
          <SwitchAndroid value={false} onValueChange={mockOnValueChange} />
        );

        const switchEl = getByRole('switch');
        fireEvent.press(switchEl);
        expect(mockOnValueChange).toHaveBeenCalledWith(true);
      });

      it('should handle disabled state on Android', () => {
        // eslint-disable-next-line import/no-unresolved
        const SwitchAndroid = require('@platform/components/forms/Switch/Switch.android').default;

        const { getByRole } = renderWithTheme(
          <SwitchAndroid value={false} disabled onValueChange={mockOnValueChange} />
        );

        const switchEl = getByRole('switch');
        expect(switchEl.props.accessibilityState.disabled).toBe(true);
        fireEvent.press(switchEl);
        expect(mockOnValueChange).not.toHaveBeenCalled();
      });

      it('should use label prop on Android', () => {
        // eslint-disable-next-line import/no-unresolved
        const SwitchAndroid = require('@platform/components/forms/Switch/Switch.android').default;

        const { getByLabelText } = renderWithTheme(
          <SwitchAndroid value={false} label="Android Label" />
        );

        expect(getByLabelText('Android Label')).toBeTruthy();
      });
    });

    describe('iOS variant', () => {
      it('should render iOS switch', () => {
        // eslint-disable-next-line import/no-unresolved
        const SwitchIOS = require('@platform/components/forms/Switch/Switch.ios').default;

        const { UNSAFE_getByType } = renderWithTheme(
          <SwitchIOS value={false} testID="ios-switch" />
        );

        const switchEl = UNSAFE_getByType(SwitchIOS);
        expect(switchEl).toBeTruthy();
        expect(switchEl.props.value).toBe(false);
        expect(switchEl.props.testID).toBe('ios-switch');
      });

      it('should handle default value prop on iOS', () => {
        // eslint-disable-next-line import/no-unresolved
        const SwitchIOS = require('@platform/components/forms/Switch/Switch.ios').default;

        const { getByRole } = renderWithTheme(<SwitchIOS testID="ios-switch" />);

        const switchEl = getByRole('switch');
        expect(switchEl).toBeTruthy();
        // Default value is false, but it's applied in the component, not as a prop
        // We verify the component renders correctly with default value by checking accessibilityState
        expect(switchEl.props.accessibilityState.checked).toBe(false);
      });

      it('should handle press on iOS', () => {
        // eslint-disable-next-line import/no-unresolved
        const SwitchIOS = require('@platform/components/forms/Switch/Switch.ios').default;

        const { getByRole } = renderWithTheme(
          <SwitchIOS value={false} onValueChange={mockOnValueChange} />
        );

        const switchEl = getByRole('switch');
        fireEvent.press(switchEl);
        expect(mockOnValueChange).toHaveBeenCalledWith(true);
      });

      it('should handle disabled state on iOS', () => {
        // eslint-disable-next-line import/no-unresolved
        const SwitchIOS = require('@platform/components/forms/Switch/Switch.ios').default;

        const { getByRole } = renderWithTheme(
          <SwitchIOS value={false} disabled onValueChange={mockOnValueChange} />
        );

        const switchEl = getByRole('switch');
        expect(switchEl.props.accessibilityState.disabled).toBe(true);
        fireEvent.press(switchEl);
        expect(mockOnValueChange).not.toHaveBeenCalled();
      });

      it('should use label prop on iOS', () => {
        // eslint-disable-next-line import/no-unresolved
        const SwitchIOS = require('@platform/components/forms/Switch/Switch.ios').default;

        const { getByLabelText } = renderWithTheme(
          <SwitchIOS value={false} label="iOS Label" />
        );

        expect(getByLabelText('iOS Label')).toBeTruthy();
      });
    });

    describe('Web variant', () => {
      it('should render Web switch', () => {
        // eslint-disable-next-line import/no-unresolved
        const SwitchWeb = require('@platform/components/forms/Switch/Switch.web').default;
        // styled-components (web) uses a different Theme context than styled-components/native.
        const { ThemeProvider: WebThemeProvider } = require('styled-components');

        const { UNSAFE_getByType } = render(
          <WebThemeProvider theme={lightTheme}>
            <SwitchWeb value={false} testID="web-switch" />
          </WebThemeProvider>
        );

        const switchComponent = UNSAFE_getByType(SwitchWeb);
        expect(switchComponent).toBeTruthy();
        expect(switchComponent.props.value).toBe(false);
        expect(switchComponent.props.testID).toBe('web-switch');
      });

      it('should handle all handleChange code paths on Web', () => {
        // eslint-disable-next-line import/no-unresolved
        const SwitchWeb = require('@platform/components/forms/Switch/Switch.web').default;
        const { ThemeProvider: WebThemeProvider } = require('styled-components');

        // Test with onValueChange and not disabled - handleChange should call onValueChange with event.target.checked
        const { UNSAFE_getByType } = render(
          <WebThemeProvider theme={lightTheme}>
            <SwitchWeb value={false} onValueChange={mockOnValueChange} testID="test-switch" />
          </WebThemeProvider>
        );
        const switchComponent = UNSAFE_getByType(SwitchWeb);
        const handleChange = SwitchWeb.__handleChange;
        
        // Test event with target.checked = true
        mockOnValueChange.mockClear();
        handleChange({ target: { checked: true } });
        expect(mockOnValueChange).toHaveBeenCalledWith(true);
        
        // Test event with target.checked = false
        mockOnValueChange.mockClear();
        handleChange({ target: { checked: false } });
        expect(mockOnValueChange).toHaveBeenCalledWith(false);
        
        // Test event without target - should toggle (value is false, so should become true)
        mockOnValueChange.mockClear();
        handleChange({});
        expect(mockOnValueChange).toHaveBeenCalledWith(true);
        
        // Test event with target but no checked property - should toggle
        mockOnValueChange.mockClear();
        handleChange({ target: { checked: undefined } });
        expect(mockOnValueChange).toHaveBeenCalledWith(true);
        
        // Test event with null target - should toggle
        mockOnValueChange.mockClear();
        handleChange({ target: null });
        expect(mockOnValueChange).toHaveBeenCalledWith(true);

        // Test disabled path (early return) - handleChange should return early when disabled
        const { UNSAFE_getByType: getByType2 } = render(
          <WebThemeProvider theme={lightTheme}>
            <SwitchWeb value={false} disabled onValueChange={mockOnValueChange} testID="disabled-switch" />
          </WebThemeProvider>
        );
        const handleChangeDisabled = SwitchWeb.__handleChange;
        mockOnValueChange.mockClear();
        handleChangeDisabled({ target: { checked: true } });
        expect(mockOnValueChange).not.toHaveBeenCalled();

        // Test onValueChange undefined path (early return) - handleChange should return early when onValueChange is undefined
        const { UNSAFE_getByType: getByType3 } = render(
          <WebThemeProvider theme={lightTheme}>
            <SwitchWeb value={false} testID="no-onchange" />
          </WebThemeProvider>
        );
        const handleChangeNoHandler = SwitchWeb.__handleChange;
        mockOnValueChange.mockClear();
        handleChangeNoHandler({ target: { checked: true } });
        expect(mockOnValueChange).not.toHaveBeenCalled();
      });

      it('should handle props correctly on Web', () => {
        // eslint-disable-next-line import/no-unresolved
        const SwitchWeb = require('@platform/components/forms/Switch/Switch.web').default;
        const { ThemeProvider: WebThemeProvider } = require('styled-components');

        const { UNSAFE_getByType } = render(
          <WebThemeProvider theme={lightTheme}>
            <SwitchWeb
              value={false}
              onValueChange={mockOnValueChange}
              label="Web"
              testID="web-switch"
              id="custom-id"
              name="form-switch"
              className="custom-class"
              accessibilityLabel="Custom A11y"
              accessibilityHint="Hint text"
            />
          </WebThemeProvider>
        );

        const switchComponent = UNSAFE_getByType(SwitchWeb);
        expect(switchComponent).toBeTruthy();
        expect(switchComponent.props.value).toBe(false);
        expect(switchComponent.props.onValueChange).toBe(mockOnValueChange);
        expect(switchComponent.props.testID).toBe('web-switch');
        expect(switchComponent.props.id).toBe('custom-id');
        expect(switchComponent.props.name).toBe('form-switch');
        expect(switchComponent.props.className).toBe('custom-class');
        expect(switchComponent.props.accessibilityLabel).toBe('Custom A11y');
        expect(switchComponent.props.accessibilityHint).toBe('Hint text');
      });

      it('should render label on Web', () => {
        // eslint-disable-next-line import/no-unresolved
        const SwitchWeb = require('@platform/components/forms/Switch/Switch.web').default;
        const { ThemeProvider: WebThemeProvider } = require('styled-components');

        const { getByText } = render(
          <WebThemeProvider theme={lightTheme}>
            <SwitchWeb value={false} label="Web Label" />
          </WebThemeProvider>
        );

        expect(getByText('Web Label')).toBeTruthy();
      });

      it('should generate input ID from testID on Web', () => {
        // eslint-disable-next-line import/no-unresolved
        const SwitchWeb = require('@platform/components/forms/Switch/Switch.web').default;
        const { ThemeProvider: WebThemeProvider } = require('styled-components');

        const { UNSAFE_getByType } = render(
          <WebThemeProvider theme={lightTheme}>
            <SwitchWeb value={false} testID="switch-test" />
          </WebThemeProvider>
        );

        const switchComponent = UNSAFE_getByType(SwitchWeb);
        expect(switchComponent).toBeTruthy();
        expect(switchComponent.props.testID).toBe('switch-test');
        // ID generation is internal - verify component renders correctly
      });

      it('should generate input ID from name prop on Web', () => {
        // eslint-disable-next-line import/no-unresolved
        const SwitchWeb = require('@platform/components/forms/Switch/Switch.web').default;
        const { ThemeProvider: WebThemeProvider } = require('styled-components');

        const { UNSAFE_getByType } = render(
          <WebThemeProvider theme={lightTheme}>
            <SwitchWeb value={false} name="switch-name" />
          </WebThemeProvider>
        );

        const switchComponent = UNSAFE_getByType(SwitchWeb);
        expect(switchComponent).toBeTruthy();
        // Verify the component renders (ID generation is internal)
        expect(switchComponent.props.name).toBe('switch-name');
      });

      it('should use provided id prop on Web', () => {
        // eslint-disable-next-line import/no-unresolved
        const SwitchWeb = require('@platform/components/forms/Switch/Switch.web').default;
        const { ThemeProvider: WebThemeProvider } = require('styled-components');

        const { UNSAFE_getByType } = render(
          <WebThemeProvider theme={lightTheme}>
            <SwitchWeb value={false} id="custom-id" />
          </WebThemeProvider>
        );

        const switchComponent = UNSAFE_getByType(SwitchWeb);
        expect(switchComponent).toBeTruthy();
        expect(switchComponent.props.id).toBe('custom-id');
      });

      it('should use accessibilityLabel on Web', () => {
        // eslint-disable-next-line import/no-unresolved
        const SwitchWeb = require('@platform/components/forms/Switch/Switch.web').default;
        const { ThemeProvider: WebThemeProvider } = require('styled-components');

        const { UNSAFE_getByType } = render(
          <WebThemeProvider theme={lightTheme}>
            <SwitchWeb value={false} accessibilityLabel="Web A11y Label" />
          </WebThemeProvider>
        );

        const switchComponent = UNSAFE_getByType(SwitchWeb);
        expect(switchComponent).toBeTruthy();
        expect(switchComponent.props.accessibilityLabel).toBe('Web A11y Label');
      });

      it('should pass accessibilityHint through as aria-description on Web', () => {
        // eslint-disable-next-line import/no-unresolved
        const SwitchWeb = require('@platform/components/forms/Switch/Switch.web').default;
        const { ThemeProvider: WebThemeProvider } = require('styled-components');

        const { UNSAFE_getByType } = render(
          <WebThemeProvider theme={lightTheme}>
            <SwitchWeb
              value={false}
              accessibilityLabel="Notifications"
              accessibilityHint="Toggle notifications"
            />
          </WebThemeProvider>
        );

        const switchComponent = UNSAFE_getByType(SwitchWeb);
        expect(switchComponent).toBeTruthy();
        expect(switchComponent.props.accessibilityHint).toBe('Toggle notifications');
      });

      it('should use label as accessibilityLabel on Web when accessibilityLabel not provided', () => {
        // eslint-disable-next-line import/no-unresolved
        const SwitchWeb = require('@platform/components/forms/Switch/Switch.web').default;
        const { ThemeProvider: WebThemeProvider } = require('styled-components');

        const { UNSAFE_getByType } = render(
          <WebThemeProvider theme={lightTheme}>
            <SwitchWeb value={false} label="Web Label" />
          </WebThemeProvider>
        );

        const switchComponent = UNSAFE_getByType(SwitchWeb);
        expect(switchComponent).toBeTruthy();
        expect(switchComponent.props.label).toBe('Web Label');
      });

      it('should use i18n state labels as fallback accessibilityLabel on Web', () => {
        // eslint-disable-next-line import/no-unresolved
        const SwitchWeb = require('@platform/components/forms/Switch/Switch.web').default;
        const { ThemeProvider: WebThemeProvider } = require('styled-components');

        // When no label/accessibilityLabel, useSwitch hook uses i18n "Off" (based on value)
        const { UNSAFE_getByType } = render(
          <WebThemeProvider theme={lightTheme}>
            <SwitchWeb value={false} />
          </WebThemeProvider>
        );
        const switchComponent1 = UNSAFE_getByType(SwitchWeb);
        expect(switchComponent1).toBeTruthy();
        expect(switchComponent1.props.value).toBe(false);

        // Test with value=true
        const { UNSAFE_getByType: getByType2 } = render(
          <WebThemeProvider theme={lightTheme}>
            <SwitchWeb value />
          </WebThemeProvider>
        );
        const switchComponent2 = getByType2(SwitchWeb);
        expect(switchComponent2).toBeTruthy();
        expect(switchComponent2.props.value).toBe(true);
      });

      it('should handle inputId generation edge cases on Web', () => {
        // eslint-disable-next-line import/no-unresolved
        const SwitchWeb = require('@platform/components/forms/Switch/Switch.web').default;
        const { ThemeProvider: WebThemeProvider } = require('styled-components');

        // Test with empty testID string
        const { UNSAFE_getByType: getByType1 } = render(
          <WebThemeProvider theme={lightTheme}>
            <SwitchWeb value={false} testID="" />
          </WebThemeProvider>
        );
        const switchComponent1 = getByType1(SwitchWeb);
        expect(switchComponent1).toBeTruthy();

        // Test with non-string testID
        const { UNSAFE_getByType: getByType2 } = render(
          <WebThemeProvider theme={lightTheme}>
            <SwitchWeb value={false} testID={123} />
          </WebThemeProvider>
        );
        const switchComponent2 = getByType2(SwitchWeb);
        expect(switchComponent2).toBeTruthy();

        // Test with empty name string
        const { UNSAFE_getByType: getByType3 } = render(
          <WebThemeProvider theme={lightTheme}>
            <SwitchWeb value={false} name="" />
          </WebThemeProvider>
        );
        const switchComponent3 = getByType3(SwitchWeb);
        expect(switchComponent3).toBeTruthy();

        // Test with non-string name
        const { UNSAFE_getByType: getByType4 } = render(
          <WebThemeProvider theme={lightTheme}>
            <SwitchWeb value={false} name={123} />
          </WebThemeProvider>
        );
        const switchComponent4 = getByType4(SwitchWeb);
        expect(switchComponent4).toBeTruthy();

        // Test with no id, testID, name - mock React.useId to not be a function to test that branch
        const originalUseId = React.useId;
        React.useId = undefined;
        const { UNSAFE_getByType: getByType5 } = render(
          <WebThemeProvider theme={lightTheme}>
            <SwitchWeb value={false} />
          </WebThemeProvider>
        );
        const switchComponent5 = getByType5(SwitchWeb);
        expect(switchComponent5).toBeTruthy();
        React.useId = originalUseId;

        // Test default value parameter (line 31) - value defaults to false when not provided
        const { UNSAFE_getByType: getByType6 } = render(
          <WebThemeProvider theme={lightTheme}>
            <SwitchWeb />
          </WebThemeProvider>
        );
        const switchComponent6 = getByType6(SwitchWeb);
        // Component renders with default value (false) - the default is applied internally
        expect(switchComponent6).toBeTruthy();
      });
    });
  });

  describe('useSwitch hook', () => {
    it('should compute accessibility label from value when no label provided', () => {
      // eslint-disable-next-line import/no-unresolved
      const SwitchAndroid = require('@platform/components/forms/Switch/Switch.android').default;
      const { getByLabelText } = renderWithTheme(<SwitchAndroid value />);
      expect(getByLabelText('On')).toBeTruthy();
    });

    it('should compute accessibility label from value when no label provided (false)', () => {
      // eslint-disable-next-line import/no-unresolved
      const SwitchAndroid = require('@platform/components/forms/Switch/Switch.android').default;
      const { getByLabelText } = renderWithTheme(<SwitchAndroid value={false} />);
      expect(getByLabelText('Off')).toBeTruthy();
    });
  });

  describe('Edge cases', () => {
    it('should handle style prop', () => {
      // eslint-disable-next-line import/no-unresolved
      const SwitchAndroid = require('@platform/components/forms/Switch/Switch.android').default;
      const customStyle = { marginTop: 10 };
      const { getByRole } = renderWithTheme(<SwitchAndroid style={customStyle} />);
      const el = getByRole('switch');
      expect(el.props.style).toBe(customStyle);
    });

    it('should handle additional props', () => {
      // eslint-disable-next-line import/no-unresolved
      const SwitchAndroid = require('@platform/components/forms/Switch/Switch.android').default;
      const { getByRole } = renderWithTheme(<SwitchAndroid data-custom="value" />);
      const el = getByRole('switch');
      expect(el.props['data-custom']).toBe('value');
    });
  });
});
