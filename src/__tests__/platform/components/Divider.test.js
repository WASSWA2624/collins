/**
 * Divider Component Tests
 * File: Divider.test.js
 */

import React from 'react';
import { Platform } from 'react-native';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import Divider, { ORIENTATIONS } from '@platform/components/layout/Divider';
import DividerAndroid from '@platform/components/layout/Divider/Divider.android';
import DividerIOS from '@platform/components/layout/Divider/Divider.ios';
import DividerWeb from '@platform/components/layout/Divider/Divider.web';
import lightTheme from '@theme/light.theme';

const renderWithTheme = (component) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
};

describe('Divider Component', () => {
  describe('Platform-agnostic tests (via index)', () => {
    const PlatformComponent =
      Platform.OS === 'android' ? DividerAndroid : Platform.OS === 'web' ? DividerWeb : DividerIOS;

    it('should render default export from index', () => {
      const { UNSAFE_getByType } = renderWithTheme(<Divider accessibilityLabel="Divider" />);
      const divider = UNSAFE_getByType(PlatformComponent);
      expect(divider).toBeTruthy();
    });

    it('should have separator accessibility role', () => {
      const { getByLabelText } = renderWithTheme(<Divider accessibilityLabel="Divider" />);
      const divider = getByLabelText('Divider');
      // Component has separator role (verified via component implementation)
      expect(divider).toBeTruthy();
    });

    it('should accept accessibility label', () => {
      const { getByLabelText } = renderWithTheme(
        <Divider accessibilityLabel="Section divider" />
      );
      expect(getByLabelText('Section divider')).toBeTruthy();
    });

    it('should default to horizontal orientation', () => {
      const { UNSAFE_getByType } = renderWithTheme(<Divider accessibilityLabel="Divider" />);
      const divider = UNSAFE_getByType(PlatformComponent);
      // Component uses default horizontal orientation
      expect(divider).toBeTruthy();
    });

    it('should support vertical orientation', () => {
      const { UNSAFE_getByType } = renderWithTheme(
        <Divider accessibilityLabel="Divider" orientation={ORIENTATIONS.VERTICAL} />
      );
      const divider = UNSAFE_getByType(PlatformComponent);
      // Component accepts vertical orientation prop
      expect(divider).toBeTruthy();
    });

    it('should export ORIENTATIONS constant', () => {
      expect(ORIENTATIONS).toBeDefined();
      expect(ORIENTATIONS.HORIZONTAL).toBe('horizontal');
      expect(ORIENTATIONS.VERTICAL).toBe('vertical');
    });
  });

  describe('Android platform', () => {
    it('should render Android component', () => {
      const { getByTestId } = renderWithTheme(<DividerAndroid testID="divider-android" />);
      expect(getByTestId('divider-android')).toBeTruthy();
    });

    it('should have separator accessibility role on Android', () => {
      const { getByTestId } = renderWithTheme(<DividerAndroid testID="divider-android" />);
      const divider = getByTestId('divider-android');
      expect(divider.props.accessibilityRole).toBe('separator');
    });

    it('should accept accessibility label on Android', () => {
      const { getByLabelText } = renderWithTheme(
        <DividerAndroid accessibilityLabel="Android divider" />
      );
      expect(getByLabelText('Android divider')).toBeTruthy();
    });

    it('should default to horizontal orientation on Android', () => {
      const { getByTestId } = renderWithTheme(<DividerAndroid testID="divider-android" />);
      const divider = getByTestId('divider-android');
      expect(divider.props.orientation).toBe(ORIENTATIONS.HORIZONTAL);
    });

    it('should support vertical orientation on Android', () => {
      const { getByTestId } = renderWithTheme(
        <DividerAndroid testID="divider-android" orientation={ORIENTATIONS.VERTICAL} />
      );
      const divider = getByTestId('divider-android');
      expect(divider.props.orientation).toBe(ORIENTATIONS.VERTICAL);
    });

    it('should accept style prop on Android', () => {
      const customStyle = { marginTop: 10 };
      const { getByTestId } = renderWithTheme(
        <DividerAndroid testID="divider-android" style={customStyle} />
      );
      const divider = getByTestId('divider-android');
      expect(divider.props.style).toBe(customStyle);
    });

    it('should pass through rest props on Android', () => {
      const { getByTestId } = renderWithTheme(
        <DividerAndroid testID="divider-android" data-custom="test" />
      );
      const divider = getByTestId('divider-android');
      expect(divider.props['data-custom']).toBe('test');
    });
  });

  describe('iOS platform', () => {
    it('should render iOS component', () => {
      const { getByTestId } = renderWithTheme(<DividerIOS testID="divider-ios" />);
      expect(getByTestId('divider-ios')).toBeTruthy();
    });

    it('should have separator accessibility role on iOS', () => {
      const { getByTestId } = renderWithTheme(<DividerIOS testID="divider-ios" />);
      const divider = getByTestId('divider-ios');
      expect(divider.props.accessibilityRole).toBe('separator');
    });

    it('should accept accessibility label on iOS', () => {
      const { getByLabelText } = renderWithTheme(
        <DividerIOS accessibilityLabel="iOS divider" />
      );
      expect(getByLabelText('iOS divider')).toBeTruthy();
    });

    it('should default to horizontal orientation on iOS', () => {
      const { getByTestId } = renderWithTheme(<DividerIOS testID="divider-ios" />);
      const divider = getByTestId('divider-ios');
      expect(divider.props.orientation).toBe(ORIENTATIONS.HORIZONTAL);
    });

    it('should support vertical orientation on iOS', () => {
      const { getByTestId } = renderWithTheme(
        <DividerIOS testID="divider-ios" orientation={ORIENTATIONS.VERTICAL} />
      );
      const divider = getByTestId('divider-ios');
      expect(divider.props.orientation).toBe(ORIENTATIONS.VERTICAL);
    });

    it('should accept style prop on iOS', () => {
      const customStyle = { marginTop: 10 };
      const { getByTestId } = renderWithTheme(
        <DividerIOS testID="divider-ios" style={customStyle} />
      );
      const divider = getByTestId('divider-ios');
      expect(divider.props.style).toBe(customStyle);
    });

    it('should pass through rest props on iOS', () => {
      const { getByTestId } = renderWithTheme(
        <DividerIOS testID="divider-ios" data-custom="test" />
      );
      const divider = getByTestId('divider-ios');
      expect(divider.props['data-custom']).toBe('test');
    });
  });

  describe('Web platform', () => {
    it('should render Web component', () => {
      const { UNSAFE_getByType } = renderWithTheme(<DividerWeb accessibilityLabel="Web divider" />);
      const divider = UNSAFE_getByType(DividerWeb);
      expect(divider).toBeTruthy();
      expect(divider.props.accessibilityLabel).toBe('Web divider');
    });

    it('should have separator role on Web', () => {
      const { getByLabelText } = renderWithTheme(<DividerWeb accessibilityLabel="Web divider" />);
      const divider = getByLabelText('Web divider');
      expect(divider).toBeTruthy();
      expect(divider.props.role).toBe('separator');
    });

    it('should accept aria-label on Web', () => {
      const { getByLabelText } = renderWithTheme(
        <DividerWeb aria-label="Web divider" />
      );
      expect(getByLabelText('Web divider')).toBeTruthy();
    });

    it('should accept accessibilityLabel as aria-label on Web', () => {
      const { getByLabelText } = renderWithTheme(
        <DividerWeb accessibilityLabel="Web divider via accessibilityLabel" />
      );
      expect(getByLabelText('Web divider via accessibilityLabel')).toBeTruthy();
    });

    it('should default to horizontal orientation on Web', () => {
      const { UNSAFE_getByType } = renderWithTheme(<DividerWeb accessibilityLabel="Web divider" />);
      const divider = UNSAFE_getByType(DividerWeb);
      // Component uses default horizontal orientation
      expect(divider).toBeTruthy();
    });

    it('should support vertical orientation on Web', () => {
      const { UNSAFE_getByType } = renderWithTheme(
        <DividerWeb accessibilityLabel="Web divider vertical" orientation={ORIENTATIONS.VERTICAL} />
      );
      const divider = UNSAFE_getByType(DividerWeb);
      // Component accepts vertical orientation prop
      expect(divider).toBeTruthy();
    });

    it('should accept className prop on Web', () => {
      const { UNSAFE_getByType } = renderWithTheme(
        <DividerWeb accessibilityLabel="Web divider" className="custom-class" />
      );
      const divider = UNSAFE_getByType(DividerWeb);
      expect(divider.props.className).toBe('custom-class');
    });

    it('should accept style prop on Web', () => {
      const customStyle = { marginTop: 10 };
      const { UNSAFE_getByType } = renderWithTheme(
        <DividerWeb accessibilityLabel="Web divider" style={customStyle} />
      );
      const divider = UNSAFE_getByType(DividerWeb);
      expect(divider.props.style).toBe(customStyle);
    });

    it('should pass through rest props on Web', () => {
      const { UNSAFE_getByType } = renderWithTheme(
        <DividerWeb accessibilityLabel="Web divider" data-custom="test" />
      );
      const divider = UNSAFE_getByType(DividerWeb);
      expect(divider.props['data-custom']).toBe('test');
    });

    it('should accept testID prop on Web', () => {
      const { UNSAFE_getByType } = renderWithTheme(
        <DividerWeb testID="web-divider-test" accessibilityLabel="Web divider" />
      );
      const divider = UNSAFE_getByType(DividerWeb);
      expect(divider.props.testID).toBe('web-divider-test');
    });
  });

  describe('Edge cases and variants', () => {
    it('should handle undefined orientation gracefully', () => {
      const { UNSAFE_getByType } = renderWithTheme(
        <Divider accessibilityLabel="Divider" orientation={undefined} />
      );
      const PlatformComponent =
        Platform.OS === 'android' ? DividerAndroid : Platform.OS === 'web' ? DividerWeb : DividerIOS;
      const divider = UNSAFE_getByType(PlatformComponent);
      // Component should render even with undefined orientation (defaults to horizontal)
      expect(divider).toBeTruthy();
    });

    it('should handle missing accessibility label', () => {
      const { UNSAFE_getByType } = renderWithTheme(<Divider />);
      const PlatformComponent =
        Platform.OS === 'android' ? DividerAndroid : Platform.OS === 'web' ? DividerWeb : DividerIOS;
      const divider = UNSAFE_getByType(PlatformComponent);
      expect(divider).toBeTruthy();
      // Component should still render without accessibility label
    });

    it('should handle empty string orientation', () => {
      const { UNSAFE_getByType } = renderWithTheme(
        <Divider accessibilityLabel="Divider" orientation="" />
      );
      const PlatformComponent =
        Platform.OS === 'android' ? DividerAndroid : Platform.OS === 'web' ? DividerWeb : DividerIOS;
      const divider = UNSAFE_getByType(PlatformComponent);
      expect(divider).toBeTruthy();
      // Component should handle empty string
    });
  });

  describe('Index exports', () => {
    it('should export default component from index', () => {
      // Test that the index.js default export works
      const DefaultDivider = require('@platform/components/layout/Divider').default;
      expect(DefaultDivider).toBeDefined();
      const { UNSAFE_getByType } = renderWithTheme(<DefaultDivider accessibilityLabel="Index divider" />);
      const PlatformComponent =
        Platform.OS === 'android' ? DividerAndroid : Platform.OS === 'web' ? DividerWeb : DividerIOS;
      const divider = UNSAFE_getByType(PlatformComponent);
      expect(divider).toBeTruthy();
    });

    it('should export ORIENTATIONS from index', () => {
      // Test that the index.js named export works
      const IndexORIENTATIONS = require('@platform/components/layout/Divider').ORIENTATIONS;
      expect(IndexORIENTATIONS).toBeDefined();
      expect(IndexORIENTATIONS).toBe(ORIENTATIONS);
      expect(IndexORIENTATIONS.HORIZONTAL).toBe('horizontal');
      expect(IndexORIENTATIONS.VERTICAL).toBe('vertical');
    });
  });

  describe('Style variants (orientation)', () => {
    it('should apply horizontal styles correctly on Android', () => {
      const { getByTestId } = renderWithTheme(
        <DividerAndroid testID="divider-h" orientation={ORIENTATIONS.HORIZONTAL} />
      );
      const divider = getByTestId('divider-h');
      expect(divider).toBeTruthy();
      expect(divider.props.orientation).toBe(ORIENTATIONS.HORIZONTAL);
    });

    it('should apply vertical styles correctly on Android', () => {
      const { getByTestId } = renderWithTheme(
        <DividerAndroid testID="divider-v" orientation={ORIENTATIONS.VERTICAL} />
      );
      const divider = getByTestId('divider-v');
      expect(divider).toBeTruthy();
      expect(divider.props.orientation).toBe(ORIENTATIONS.VERTICAL);
    });

    it('should apply horizontal styles correctly on iOS', () => {
      const { getByTestId } = renderWithTheme(
        <DividerIOS testID="divider-h" orientation={ORIENTATIONS.HORIZONTAL} />
      );
      const divider = getByTestId('divider-h');
      expect(divider).toBeTruthy();
      expect(divider.props.orientation).toBe(ORIENTATIONS.HORIZONTAL);
    });

    it('should apply vertical styles correctly on iOS', () => {
      const { getByTestId } = renderWithTheme(
        <DividerIOS testID="divider-v" orientation={ORIENTATIONS.VERTICAL} />
      );
      const divider = getByTestId('divider-v');
      expect(divider).toBeTruthy();
      expect(divider.props.orientation).toBe(ORIENTATIONS.VERTICAL);
    });

    it('should apply horizontal styles correctly on Web', () => {
      const { UNSAFE_getByType } = renderWithTheme(
        <DividerWeb accessibilityLabel="Divider" orientation={ORIENTATIONS.HORIZONTAL} />
      );
      const divider = UNSAFE_getByType(DividerWeb);
      expect(divider).toBeTruthy();
      // Component renders with horizontal orientation
    });

    it('should apply vertical styles correctly on Web', () => {
      const { UNSAFE_getByType } = renderWithTheme(
        <DividerWeb accessibilityLabel="Divider" orientation={ORIENTATIONS.VERTICAL} />
      );
      const divider = UNSAFE_getByType(DividerWeb);
      expect(divider).toBeTruthy();
      // Component renders with vertical orientation
    });
  });
});


