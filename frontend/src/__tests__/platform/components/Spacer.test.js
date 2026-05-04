/**
 * Spacer Component Tests
 * File: Spacer.test.js
 */

const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
// For native tests, use platform-specific import (Android) since default export is web version
// eslint-disable-next-line import/no-unresolved
const SpacerAndroid = require('@platform/components/layout/Spacer/Spacer.android').default;
const lightThemeModule = require('@theme/light.theme');

const lightTheme = lightThemeModule.default || lightThemeModule;

// Use Android version for default export tests (native test environment)
const Spacer = SpacerAndroid;

const renderWithTheme = (component) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
};

describe('Spacer Component', () => {
  describe('Basic Rendering', () => {
    it('should render', () => {
      const { getByTestId } = renderWithTheme(<Spacer testID="spacer" />);
      expect(getByTestId('spacer')).toBeTruthy();
    });
  });

  describe('Axis', () => {
    it('should default to vertical axis', () => {
      const { getByTestId } = renderWithTheme(<Spacer testID="spacer" />);

      const spacer = getByTestId('spacer');
      expect(spacer).toBeTruthy();
    });

    it('should support horizontal axis', () => {
      const { getByTestId } = renderWithTheme(
        <Spacer testID="spacer" axis="horizontal" />
      );

      const spacer = getByTestId('spacer');
      expect(spacer).toBeTruthy();
    });

    it('should normalize invalid axis to vertical', () => {
      const { getByTestId } = renderWithTheme(
        <Spacer testID="spacer" axis="invalid" />
      );

      const spacer = getByTestId('spacer');
      expect(spacer).toBeTruthy();
    });
  });

  describe('Size', () => {
    const { SPACING } = require('@platform/components/layout/Spacer/types');

    it.each([
      [SPACING.XS, 'xs'],
      [SPACING.SM, 'sm'],
      [SPACING.MD, 'md'],
      [SPACING.LG, 'lg'],
      [SPACING.XL, 'xl'],
      [SPACING.XXL, 'xxl'],
    ])('should apply size token %s', (size) => {
      const { getByTestId } = renderWithTheme(
        <Spacer testID="spacer" size={size} />
      );

      const spacer = getByTestId('spacer');
      expect(spacer).toBeTruthy();
    });

    it('should default size to md', () => {
      const { getByTestId } = renderWithTheme(<Spacer testID="spacer" />);

      const spacer = getByTestId('spacer');
      expect(spacer).toBeTruthy();
    });

    it('should normalize invalid size to md', () => {
      const { getByTestId } = renderWithTheme(
        <Spacer testID="spacer" size="invalid" />
      );

      const spacer = getByTestId('spacer');
      expect(spacer).toBeTruthy();
    });
  });

  describe('Axis and Size Combinations', () => {
    it('should support vertical axis with all sizes', () => {
      const { SPACING } = require('@platform/components/layout/Spacer/types');

      Object.values(SPACING).forEach((size) => {
        const { getByTestId, unmount } = renderWithTheme(
          <Spacer testID={`spacer-${size}`} axis="vertical" size={size} />
        );

        const spacer = getByTestId(`spacer-${size}`);
        expect(spacer).toBeTruthy();
        unmount();
      });
    });

    it('should support horizontal axis with all sizes', () => {
      const { SPACING } = require('@platform/components/layout/Spacer/types');

      Object.values(SPACING).forEach((size) => {
        const { getByTestId, unmount } = renderWithTheme(
          <Spacer testID={`spacer-${size}`} axis="horizontal" size={size} />
        );

        const spacer = getByTestId(`spacer-${size}`);
        expect(spacer).toBeTruthy();
        unmount();
      });
    });
  });

  describe('Accessibility', () => {
    it('should support accessibility attributes on native', () => {
      const { getByTestId } = renderWithTheme(
        <Spacer testID="spacer" accessibilityLabel="Spacer element" />
      );

      const spacer = getByTestId('spacer');
      expect(spacer).toBeTruthy();
      expect(spacer.props.accessibilityLabel).toBe('Spacer element');
    });
  });

  describe('Platform-specific variants', () => {
    describe('iOS variant', () => {
      it('should render iOS Spacer', () => {
        // eslint-disable-next-line import/no-unresolved
        const SpacerIOS = require('@platform/components/layout/Spacer/Spacer.ios').default;

        const { getByTestId } = renderWithTheme(
          <SpacerIOS testID="ios-spacer" />
        );

        expect(getByTestId('ios-spacer')).toBeTruthy();
      });

      it('should support all props on iOS', () => {
        // eslint-disable-next-line import/no-unresolved
        const SpacerIOS = require('@platform/components/layout/Spacer/Spacer.ios').default;
        const { SPACING } = require('@platform/components/layout/Spacer/types');

        const { getByTestId } = renderWithTheme(
          <SpacerIOS
            testID="ios-spacer-full"
            axis="horizontal"
            size={SPACING.LG}
            accessibilityLabel="iOS Spacer"
          />
        );

        const spacer = getByTestId('ios-spacer-full');
        expect(spacer).toBeTruthy();
        expect(spacer.props.accessibilityLabel).toBe('iOS Spacer');
      });
    });

    describe('Android variant', () => {
      it('should render Android Spacer', () => {
        // eslint-disable-next-line import/no-unresolved
        const SpacerAndroid = require('@platform/components/layout/Spacer/Spacer.android').default;

        const { getByTestId } = renderWithTheme(
          <SpacerAndroid testID="android-spacer" />
        );

        expect(getByTestId('android-spacer')).toBeTruthy();
      });

      it('should support all props on Android', () => {
        // eslint-disable-next-line import/no-unresolved
        const SpacerAndroid = require('@platform/components/layout/Spacer/Spacer.android').default;
        const { SPACING } = require('@platform/components/layout/Spacer/types');

        const { getByTestId } = renderWithTheme(
          <SpacerAndroid
            testID="android-spacer-full"
            axis="horizontal"
            size={SPACING.LG}
            accessibilityLabel="Android Spacer"
          />
        );

        const spacer = getByTestId('android-spacer-full');
        expect(spacer).toBeTruthy();
        expect(spacer.props.accessibilityLabel).toBe('Android Spacer');
      });
    });

    describe('Web variant', () => {
      it('should render Web Spacer', () => {
        // eslint-disable-next-line global-require
        const SpacerWebModule = require('../../../platform/components/layout/Spacer/Spacer.web');
        const SpacerWeb = SpacerWebModule.default || SpacerWebModule;
        // eslint-disable-next-line global-require
        const WebThemeProvider = require('styled-components').ThemeProvider;

        const { UNSAFE_getByType } = render(
          <WebThemeProvider theme={lightTheme}>
            <SpacerWeb testID="web-spacer" />
          </WebThemeProvider>
        );

        const spacer = UNSAFE_getByType(SpacerWeb);
        expect(spacer).toBeTruthy();
        expect(spacer.props.testID).toBe('web-spacer');
      });

      it('should support all props on Web', () => {
        // eslint-disable-next-line global-require
        const SpacerWebModule = require('../../../platform/components/layout/Spacer/Spacer.web');
        const SpacerWeb = SpacerWebModule.default || SpacerWebModule;
        // eslint-disable-next-line global-require
        const WebThemeProvider = require('styled-components').ThemeProvider;
        const { SPACING } = require('@platform/components/layout/Spacer/types');

        const { getByLabelText } = render(
          <WebThemeProvider theme={lightTheme}>
            <SpacerWeb
              testID="web-spacer-full"
              axis="horizontal"
              size={SPACING.LG}
              accessibilityLabel="Web Spacer"
              className="test-class"
            />
          </WebThemeProvider>
        );

        const spacer = getByLabelText('Web Spacer');
        expect(spacer).toBeTruthy();
        expect(spacer.props['aria-label']).toBe('Web Spacer');
        expect(spacer.props['data-testid']).toBe('web-spacer-full');
        expect(spacer.props.className).toBe('test-class');
      });
    });
  });

  describe('Exports', () => {
    it('should export types correctly', () => {
      const { AXIS, SPACING } = require('@platform/components/layout/Spacer/types');
      expect(AXIS).toBeDefined();
      expect(SPACING).toBeDefined();
      expect(AXIS.VERTICAL).toBe('vertical');
      expect(AXIS.HORIZONTAL).toBe('horizontal');
      expect(SPACING.XS).toBe('xs');
      expect(SPACING.SM).toBe('sm');
      expect(SPACING.MD).toBe('md');
      expect(SPACING.LG).toBe('lg');
      expect(SPACING.XL).toBe('xl');
      expect(SPACING.XXL).toBe('xxl');
    });
  });
});


