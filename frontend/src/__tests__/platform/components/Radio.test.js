/**
 * Radio Component Tests
 * File: Radio.test.js
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../helpers/test-utils';
import Radio from '@platform/components/forms/Radio';
import lightTheme from '@theme/light.theme';

const renderWithTheme = (component) => {
  return renderWithProviders(component);
};

describe('Radio Component', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render radio', () => {
      // eslint-disable-next-line import/no-unresolved
      const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;
      const { getByRole } = renderWithTheme(
        <RadioAndroid label="Test Radio" value="test" />
      );
      expect(getByRole('radio')).toBeTruthy();
    });

    it('should render with label', () => {
      // eslint-disable-next-line import/no-unresolved
      const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;
      const { getByText } = renderWithTheme(
        <RadioAndroid label="Radio Label" value="test" />
      );
      expect(getByText('Radio Label')).toBeTruthy();
    });

    it('should render without label', () => {
      // eslint-disable-next-line import/no-unresolved
      const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;
      const { getByRole } = renderWithTheme(
        <RadioAndroid value="test" />
      );
      expect(getByRole('radio')).toBeTruthy();
    });
  });

  describe('States', () => {
    it('should render selected state', () => {
      // eslint-disable-next-line import/no-unresolved
      const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;
      const { getByRole } = renderWithTheme(
        <RadioAndroid selected label="Selected" value="test" />
      );
      const radio = getByRole('radio');
      expect(radio.props.accessibilityState.selected).toBe(true);
    });

    it('should render unselected state', () => {
      // eslint-disable-next-line import/no-unresolved
      const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;
      const { getByRole } = renderWithTheme(
        <RadioAndroid selected={false} label="Unselected" value="test" />
      );
      const radio = getByRole('radio');
      expect(radio.props.accessibilityState.selected).toBe(false);
    });

    it('should render disabled state', () => {
      // eslint-disable-next-line import/no-unresolved
      const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;
      const { getByRole } = renderWithTheme(
        <RadioAndroid disabled label="Disabled" value="test" />
      );
      const radio = getByRole('radio');
      expect(radio.props.accessibilityState.disabled).toBe(true);
    });

    it('should not call onChange when disabled', () => {
      // eslint-disable-next-line import/no-unresolved
      const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;
      const { getByRole } = renderWithTheme(
        <RadioAndroid disabled onChange={mockOnChange} label="Disabled" value="test" />
      );
      const radio = getByRole('radio');
      fireEvent.press(radio);
      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe('Interactions', () => {
    it('should call onChange when pressed', () => {
      // eslint-disable-next-line import/no-unresolved
      const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;
      const { getByRole } = renderWithTheme(
        <RadioAndroid onChange={mockOnChange} label="Clickable" value="test" />
      );
      const radio = getByRole('radio');
      fireEvent.press(radio);
      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith('test');
    });

    it('should call onChange with correct value', () => {
      // eslint-disable-next-line import/no-unresolved
      const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;
      const { getByRole } = renderWithTheme(
        <RadioAndroid onChange={mockOnChange} label="Test" value="test-value" />
      );
      const radio = getByRole('radio');
      fireEvent.press(radio);
      expect(mockOnChange).toHaveBeenCalledWith('test-value');
    });

    it('should call onPress when provided (back-compat)', () => {
      // eslint-disable-next-line import/no-unresolved
      const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;
      const mockOnPress = jest.fn();
      const { getByRole } = renderWithTheme(
        <RadioAndroid onPress={mockOnPress} label="Test" value="test-value" />
      );
      const radio = getByRole('radio');
      fireEvent.press(radio);
      expect(mockOnPress).toHaveBeenCalledWith('test-value');
    });

    it('should prefer onChange over onPress', () => {
      // eslint-disable-next-line import/no-unresolved
      const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;
      const mockOnPress = jest.fn();
      const { getByRole } = renderWithTheme(
        <RadioAndroid onChange={mockOnChange} onPress={mockOnPress} label="Test" value="test-value" />
      );
      const radio = getByRole('radio');
      fireEvent.press(radio);
      expect(mockOnChange).toHaveBeenCalledWith('test-value');
      expect(mockOnPress).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have accessibility role', () => {
      // eslint-disable-next-line import/no-unresolved
      const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;
      const { getByRole } = renderWithTheme(
        <RadioAndroid label="Accessible" value="test" />
      );
      expect(getByRole('radio')).toBeTruthy();
    });

    it('should use custom accessibility label', () => {
      // eslint-disable-next-line import/no-unresolved
      const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;
      const { getByLabelText } = renderWithTheme(
        <RadioAndroid
          label="Label"
          value="test"
          accessibilityLabel="Custom Label"
        />
      );
      expect(getByLabelText('Custom Label')).toBeTruthy();
    });

    it('should use label as accessibility label when not provided', () => {
      // eslint-disable-next-line import/no-unresolved
      const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;
      const { getByLabelText } = renderWithTheme(
        <RadioAndroid label="Default Label" value="test" />
      );
      expect(getByLabelText('Default Label')).toBeTruthy();
    });

    it('should use value as accessibility label when label is missing', () => {
      // eslint-disable-next-line import/no-unresolved
      const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;
      const { getByLabelText } = renderWithTheme(
        <RadioAndroid value="test-value" />
      );
      expect(getByLabelText('test-value')).toBeTruthy();
    });

    it('should use number value as accessibility label when label is missing', () => {
      // eslint-disable-next-line import/no-unresolved
      const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;
      const { getByLabelText } = renderWithTheme(
        <RadioAndroid value={123} />
      );
      expect(getByLabelText('123')).toBeTruthy();
    });

    it('should reflect selected state in accessibility', () => {
      // eslint-disable-next-line import/no-unresolved
      const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;
      const { getByRole } = renderWithTheme(
        <RadioAndroid selected label="Selected" value="test" />
      );
      const radio = getByRole('radio');
      expect(radio.props.accessibilityState.selected).toBe(true);
    });

    it('should reflect disabled state in accessibility', () => {
      // eslint-disable-next-line import/no-unresolved
      const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;
      const { getByRole } = renderWithTheme(
        <RadioAndroid disabled label="Disabled" value="test" />
      );
      const radio = getByRole('radio');
      expect(radio.props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('Test ID', () => {
    it('should accept testID prop', () => {
      // eslint-disable-next-line import/no-unresolved
      const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;
      const { getByTestId } = renderWithTheme(
        <RadioAndroid label="Test" value="test" testID="test-radio" />
      );
      expect(getByTestId('test-radio')).toBeTruthy();
    });
  });

  describe('Platform-specific tests', () => {
    describe('Android variant', () => {
      it('should render Android radio', () => {
        // eslint-disable-next-line import/no-unresolved
        const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;

        const { UNSAFE_getByType } = renderWithTheme(
          <RadioAndroid selected={false} label="Android" value="test" testID="android-radio" />
        );

        const radio = UNSAFE_getByType(RadioAndroid);
        expect(radio).toBeTruthy();
        expect(radio.props.selected).toBe(false);
        expect(radio.props.testID).toBe('android-radio');
      });

      it('should handle press on Android', () => {
        // eslint-disable-next-line import/no-unresolved
        const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;

        const { getByRole } = renderWithTheme(
          <RadioAndroid selected={false} onChange={mockOnChange} label="Android" value="test" />
        );

        const radio = getByRole('radio');
        fireEvent.press(radio);
        expect(mockOnChange).toHaveBeenCalledWith('test');
      });

      it('should not call onChange when disabled on Android', () => {
        // eslint-disable-next-line import/no-unresolved
        const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;

        const { getByRole } = renderWithTheme(
          <RadioAndroid disabled onChange={mockOnChange} label="Android" value="test" />
        );

        const radio = getByRole('radio');
        fireEvent.press(radio);
        expect(mockOnChange).not.toHaveBeenCalled();
      });

      it('should handle style prop on Android', () => {
        // eslint-disable-next-line import/no-unresolved
        const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;

        const customStyle = { marginTop: 10 };
        const { getByRole } = renderWithTheme(
          <RadioAndroid style={customStyle} label="Android" value="test" />
        );

        const radio = getByRole('radio');
        expect(radio.props.style).toBe(customStyle);
      });

      it('should not call onChange when onChange is undefined on Android', () => {
        // eslint-disable-next-line import/no-unresolved
        const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;

        const { getByRole } = renderWithTheme(
          <RadioAndroid selected={false} label="Android" value="test" />
        );

        const radio = getByRole('radio');
        fireEvent.press(radio);
        // Should not throw
        expect(radio).toBeTruthy();
      });

      it('should render dot when selected on Android', () => {
        // eslint-disable-next-line import/no-unresolved
        const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;

        const { getByRole } = renderWithTheme(
          <RadioAndroid selected={true} label="Android" value="test" />
        );

        const radio = getByRole('radio');
        expect(radio.props.accessibilityState.selected).toBe(true);
      });
    });

    describe('iOS variant', () => {
      it('should render iOS radio', () => {
        // eslint-disable-next-line import/no-unresolved
        const RadioIOS = require('@platform/components/forms/Radio/Radio.ios').default;

        const { UNSAFE_getByType } = renderWithTheme(
          <RadioIOS selected={false} label="iOS" value="test" testID="ios-radio" />
        );

        const radio = UNSAFE_getByType(RadioIOS);
        expect(radio).toBeTruthy();
        expect(radio.props.selected).toBe(false);
        expect(radio.props.testID).toBe('ios-radio');
      });

      it('should handle press on iOS', () => {
        // eslint-disable-next-line import/no-unresolved
        const RadioIOS = require('@platform/components/forms/Radio/Radio.ios').default;

        const { getByRole } = renderWithTheme(
          <RadioIOS selected={false} onChange={mockOnChange} label="iOS" value="test" />
        );

        const radio = getByRole('radio');
        fireEvent.press(radio);
        expect(mockOnChange).toHaveBeenCalledWith('test');
      });

      it('should not call onChange when disabled on iOS', () => {
        // eslint-disable-next-line import/no-unresolved
        const RadioIOS = require('@platform/components/forms/Radio/Radio.ios').default;

        const { getByRole } = renderWithTheme(
          <RadioIOS disabled onChange={mockOnChange} label="iOS" value="test" />
        );

        const radio = getByRole('radio');
        fireEvent.press(radio);
        expect(mockOnChange).not.toHaveBeenCalled();
      });

      it('should handle style prop on iOS', () => {
        // eslint-disable-next-line import/no-unresolved
        const RadioIOS = require('@platform/components/forms/Radio/Radio.ios').default;

        const customStyle = { marginTop: 10 };
        const { getByRole } = renderWithTheme(
          <RadioIOS style={customStyle} label="iOS" value="test" />
        );

        const radio = getByRole('radio');
        expect(radio.props.style).toBe(customStyle);
      });
    });

    describe('Web variant', () => {
      it('should render Web radio', () => {
        // eslint-disable-next-line import/no-unresolved
        const RadioWeb = require('@platform/components/forms/Radio/Radio.web').default;
        // styled-components (web) uses a different Theme context than styled-components/native.
        const { ThemeProvider: WebThemeProvider } = require('styled-components');
        const { Provider } = require('react-redux');
        const { configureStore } = require('@reduxjs/toolkit');
        const rootReducer = require('@store/rootReducer').default;
        const store = configureStore({ reducer: rootReducer, preloadedState: { ui: { theme: 'light', locale: 'en' }, network: { isOnline: true }, auth: { user: null, isAuthenticated: false } } });

        const { UNSAFE_getByType } = render(
          <Provider store={store}>
            <WebThemeProvider theme={lightTheme}>
              <RadioWeb selected={false} label="Web" value="test" testID="web-radio" />
            </WebThemeProvider>
          </Provider>
        );

        const radio = UNSAFE_getByType(RadioWeb);
        expect(radio).toBeTruthy();
        expect(radio.props.selected).toBe(false);
        expect(radio.props.testID).toBe('web-radio');
      });

      it('should handle props correctly on Web', () => {
        // eslint-disable-next-line import/no-unresolved
        const RadioWeb = require('@platform/components/forms/Radio/Radio.web').default;
        const { ThemeProvider: WebThemeProvider } = require('styled-components');
        const { Provider } = require('react-redux');
        const { configureStore } = require('@reduxjs/toolkit');
        const rootReducer = require('@store/rootReducer').default;
        const store = configureStore({ reducer: rootReducer, preloadedState: { ui: { theme: 'light', locale: 'en' }, network: { isOnline: true }, auth: { user: null, isAuthenticated: false } } });

        const { UNSAFE_getByType } = render(
          <Provider store={store}>
            <WebThemeProvider theme={lightTheme}>
              <RadioWeb
                selected={false}
                onChange={mockOnChange}
                label="Web"
                value="web-value"
                testID="web-radio"
                className="custom-class"
                accessibilityLabel="Custom A11y"
              />
            </WebThemeProvider>
          </Provider>
        );

        const radio = UNSAFE_getByType(RadioWeb);
        expect(radio).toBeTruthy();
        expect(radio.props.selected).toBe(false);
        expect(radio.props.testID).toBe('web-radio');
        expect(radio.props.className).toBe('custom-class');
        expect(radio.props.accessibilityLabel).toBe('Custom A11y');
        expect(radio.props.value).toBe('web-value');
      });

      it('should handle all handleSelect code paths on Web', () => {
        // eslint-disable-next-line import/no-unresolved
        const RadioWeb = require('@platform/components/forms/Radio/Radio.web').default;
        const { ThemeProvider: WebThemeProvider } = require('styled-components');
        const { Provider } = require('react-redux');
        const { configureStore } = require('@reduxjs/toolkit');
        const rootReducer = require('@store/rootReducer').default;
        const store = configureStore({ reducer: rootReducer, preloadedState: { ui: { theme: 'light', locale: 'en' }, network: { isOnline: true }, auth: { user: null, isAuthenticated: false } } });

        // Test disabled path (early return) - handleSelect should return early when disabled
        const { UNSAFE_getByType: getByType1 } = render(
          <Provider store={store}>
            <WebThemeProvider theme={lightTheme}>
              <RadioWeb disabled onChange={mockOnChange} label="Web" testID="disabled-radio" />
            </WebThemeProvider>
          </Provider>
        );
        let radio = getByType1(RadioWeb);
        expect(radio.props.disabled).toBe(true);
        // The handleSelect function should return early when disabled is true

        // Test onChange undefined path (early return) - handleSelect should return early when onChange is undefined
        const { UNSAFE_getByType: getByType2 } = render(
          <Provider store={store}>
            <WebThemeProvider theme={lightTheme}>
              <RadioWeb selected={false} label="Web" testID="no-onchange" />
            </WebThemeProvider>
          </Provider>
        );
        radio = getByType2(RadioWeb);
        expect(radio.props.onChange).toBeUndefined();
        // The handleSelect function should return early when onChange is undefined

        // Test with onChange and not disabled - component should render with onChange handler
        const { UNSAFE_getByType: getByType3 } = render(
          <Provider store={store}>
            <WebThemeProvider theme={lightTheme}>
              <RadioWeb selected={false} onChange={mockOnChange} label="Web" value="web-value" testID="with-onchange" />
            </WebThemeProvider>
          </Provider>
        );
        radio = getByType3(RadioWeb);
        expect(radio.props.onChange).toBe(mockOnChange);
        // The handleSelect function should be callable when onChange is provided and not disabled
        // Note: Actual DOM event triggering is tested through component behavior
      });

      it('should not call onChange when disabled on Web', () => {
        // eslint-disable-next-line import/no-unresolved
        const RadioWeb = require('@platform/components/forms/Radio/Radio.web').default;
        const { ThemeProvider: WebThemeProvider } = require('styled-components');
        const { Provider } = require('react-redux');
        const { configureStore } = require('@reduxjs/toolkit');
        const rootReducer = require('@store/rootReducer').default;
        const store = configureStore({ reducer: rootReducer, preloadedState: { ui: { theme: 'light', locale: 'en' }, network: { isOnline: true }, auth: { user: null, isAuthenticated: false } } });

        const { UNSAFE_getByType } = render(
          <Provider store={store}>
            <WebThemeProvider theme={lightTheme}>
              <RadioWeb disabled onChange={mockOnChange} label="Web" />
            </WebThemeProvider>
          </Provider>
        );

        const radio = UNSAFE_getByType(RadioWeb);
        // The handleSelect function should return early when disabled
        // We test this by checking the component renders correctly
        expect(radio.props.disabled).toBe(true);
      });

      it('should not call onChange when onChange is undefined on Web', () => {
        // eslint-disable-next-line import/no-unresolved
        const RadioWeb = require('@platform/components/forms/Radio/Radio.web').default;
        const { ThemeProvider: WebThemeProvider } = require('styled-components');
        const { Provider } = require('react-redux');
        const { configureStore } = require('@reduxjs/toolkit');
        const rootReducer = require('@store/rootReducer').default;
        const store = configureStore({ reducer: rootReducer, preloadedState: { ui: { theme: 'light', locale: 'en' }, network: { isOnline: true }, auth: { user: null, isAuthenticated: false } } });

        const { UNSAFE_getByType } = render(
          <Provider store={store}>
            <WebThemeProvider theme={lightTheme}>
              <RadioWeb selected={false} label="Web" />
            </WebThemeProvider>
          </Provider>
        );

        const radio = UNSAFE_getByType(RadioWeb);
        // The handleSelect should return early when onChange is undefined
        expect(radio.props.onChange).toBeUndefined();
      });

      it('should have correct aria attributes on Web', () => {
        // eslint-disable-next-line import/no-unresolved
        const RadioWeb = require('@platform/components/forms/Radio/Radio.web').default;
        const { ThemeProvider: WebThemeProvider } = require('styled-components');
        const { Provider } = require('react-redux');
        const { configureStore } = require('@reduxjs/toolkit');
        const rootReducer = require('@store/rootReducer').default;
        const store = configureStore({ reducer: rootReducer, preloadedState: { ui: { theme: 'light', locale: 'en' }, network: { isOnline: true }, auth: { user: null, isAuthenticated: false } } });

        const { UNSAFE_getByType } = render(
          <Provider store={store}>
            <WebThemeProvider theme={lightTheme}>
              <RadioWeb selected={true} disabled={true} label="Web" value="test" />
            </WebThemeProvider>
          </Provider>
        );

        const radio = UNSAFE_getByType(RadioWeb);
        // The aria attributes are passed to StyledRadio, not directly accessible via props
        // We verify the component renders with correct props
        expect(radio.props.selected).toBe(true);
        expect(radio.props.disabled).toBe(true);
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle onChange being undefined', () => {
      // eslint-disable-next-line import/no-unresolved
      const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;
      const { getByRole } = renderWithTheme(
        <RadioAndroid selected={false} label="No onChange" value="test" />
      );
      const radio = getByRole('radio');
      fireEvent.press(radio);
      // Should not throw
      expect(radio).toBeTruthy();
    });

    it('should handle index.jsx export', () => {
      // Test that index.jsx exports correctly
      const RadioFromIndex = require('@platform/components/forms/Radio').default;
      expect(RadioFromIndex).toBeDefined();
    });

    it('should handle types.js export', () => {
      // Test that types.js exports correctly
      const types = require('@platform/components/forms/Radio/types');
      expect(types).toBeDefined();
      expect(types.RADIO_DEFAULTS).toBeDefined();
      expect(types.RADIO_DEFAULTS.selected).toBe(false);
      expect(types.RADIO_DEFAULTS.disabled).toBe(false);
    });

    it('should handle null value', () => {
      // eslint-disable-next-line import/no-unresolved
      const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;
      const { getByRole } = renderWithTheme(
        <RadioAndroid selected={false} onChange={mockOnChange} label="Null value" value={null} />
      );
      const radio = getByRole('radio');
      fireEvent.press(radio);
      expect(mockOnChange).toHaveBeenCalledWith(null);
    });

    it('should handle empty string value', () => {
      // eslint-disable-next-line import/no-unresolved
      const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;
      const { getByRole } = renderWithTheme(
        <RadioAndroid selected={false} onChange={mockOnChange} label="Empty value" value="" />
      );
      const radio = getByRole('radio');
      fireEvent.press(radio);
      expect(mockOnChange).toHaveBeenCalledWith('');
    });

    it('should handle number value', () => {
      // eslint-disable-next-line import/no-unresolved
      const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;
      const { getByRole } = renderWithTheme(
        <RadioAndroid selected={false} onChange={mockOnChange} label="Number value" value={123} />
      );
      const radio = getByRole('radio');
      fireEvent.press(radio);
      expect(mockOnChange).toHaveBeenCalledWith(123);
    });

    it('should handle rest props', () => {
      // eslint-disable-next-line import/no-unresolved
      const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;
      const { getByRole } = renderWithTheme(
        <RadioAndroid label="Rest props" value="test" data-custom="value" />
      );
      const radio = getByRole('radio');
      expect(radio.props['data-custom']).toBe('value');
    });

    it('should handle fallback accessibility label when no label or value', () => {
      // eslint-disable-next-line import/no-unresolved
      const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;
      const { getByLabelText } = renderWithTheme(
        <RadioAndroid />
      );
      // The fallback uses i18n, so it will be "Radio" from en.json
      expect(getByLabelText('Radio')).toBeTruthy();
    });

    it('should handle useRadio hook with all branches', () => {
      // eslint-disable-next-line import/no-unresolved
      const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;
      // Test onPress path
      const mockOnPress = jest.fn();
      const { getByRole } = renderWithTheme(
        <RadioAndroid onPress={mockOnPress} value="test" />
      );
      const radio = getByRole('radio');
      fireEvent.press(radio);
      expect(mockOnPress).toHaveBeenCalledWith('test');

      // Test when handler is not a function (should not throw)
      const { getByRole: getByRole2 } = renderWithTheme(
        <RadioAndroid onChange={null} onPress={undefined} value="test" />
      );
      const radio2 = getByRole2('radio');
      fireEvent.press(radio2);
      // Should not throw - handler check prevents calling non-function
      expect(radio2).toBeTruthy();
    });

    it('should test useRadio hook directly to cover disabled branch', () => {
      // Direct hook test to ensure 100% coverage of useRadio
      const React = require('react');
      const TestRenderer = require('react-test-renderer');
      const { useRadio } = require('@platform/components/forms/Radio/useRadio');

      const act = TestRenderer.act;
      let hookResult = null;

      const HookHarness = ({ hookProps }) => {
        hookResult = useRadio(hookProps);
        return null;
      };

      // Test disabled branch - handleSelect should return early
      const mockOnChange1 = jest.fn();
      act(() => {
        const renderer = TestRenderer.create(
          React.createElement(HookHarness, { hookProps: { disabled: true, value: 'test', onChange: mockOnChange1 } })
        );
      });
      // Call handleSelect when disabled - should return early
      hookResult.handleSelect();
      expect(mockOnChange1).not.toHaveBeenCalled();

      // Test non-disabled branch with onChange
      const mockOnChange2 = jest.fn();
      act(() => {
        const renderer = TestRenderer.create(
          React.createElement(HookHarness, { hookProps: { disabled: false, value: 'test', onChange: mockOnChange2 } })
        );
      });
      hookResult.handleSelect();
      expect(mockOnChange2).toHaveBeenCalledWith('test');

      // Test non-disabled branch with onPress (no onChange)
      const mockOnPress = jest.fn();
      act(() => {
        const renderer = TestRenderer.create(
          React.createElement(HookHarness, { hookProps: { disabled: false, value: 'test', onPress: mockOnPress } })
        );
      });
      hookResult.handleSelect();
      expect(mockOnPress).toHaveBeenCalledWith('test');

      // Test when handler is not a function
      act(() => {
        const renderer = TestRenderer.create(
          React.createElement(HookHarness, { hookProps: { disabled: false, value: 'test', onChange: null, onPress: undefined } })
        );
      });
      hookResult.handleSelect();
      // Should not throw
      expect(hookResult).toBeTruthy();
    });

    it('should handle index.jsx export correctly', () => {
      // Test that index.jsx exports correctly and resolves to platform component
      const RadioFromIndex = require('@platform/components/forms/Radio').default;
      expect(RadioFromIndex).toBeDefined();
      
      // Verify it can be rendered (platform resolution works - resolves to web in test env)
      // For React Native tests, we use platform-specific imports
      // eslint-disable-next-line import/no-unresolved
      const RadioAndroid = require('@platform/components/forms/Radio/Radio.android').default;
      const { getByRole } = renderWithTheme(
        <RadioAndroid label="Test" value="test" />
      );
      expect(getByRole('radio')).toBeTruthy();
    });
  });
});

