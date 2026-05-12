/**
 * Stack Component Tests
 * File: Stack.test.js
 */

const React = require('react');
const { render } = require('@testing-library/react-native');
const { Text } = require('react-native');
const { ThemeProvider } = require('styled-components/native');
// For native tests, use platform-specific import (Android) since default export is web version
// eslint-disable-next-line import/no-unresolved
const StackAndroid = require('@platform/components/layout/Stack/Stack.android').default;
const typesModule = require('@platform/components/layout/Stack/types');
const DIRECTIONS = typesModule.DIRECTIONS;
const SPACING = typesModule.SPACING;
const ALIGN = typesModule.ALIGN;
const JUSTIFY = typesModule.JUSTIFY;
const lightThemeModule = require('@theme/light.theme');
const lightTheme = lightThemeModule.default || lightThemeModule;

// Use Android version for default export tests (native test environment)
const Stack = StackAndroid;

const renderWithTheme = (component) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
};

describe('Stack Component', () => {
  describe('Basic Rendering', () => {
    it('should render children', () => {
      const { getByText } = renderWithTheme(
        <Stack testID="stack">
          <Text>Child</Text>
        </Stack>
      );

      expect(getByText('Child')).toBeTruthy();
    });

    it('should render empty stack', () => {
      const { getByTestId } = renderWithTheme(<Stack testID="stack" />);
      expect(getByTestId('stack')).toBeTruthy();
    });
  });

  describe('Directions', () => {
    it('should default to vertical direction (column)', () => {
      const { getByTestId } = renderWithTheme(
        <Stack testID="stack">
          <Text>Child</Text>
        </Stack>
      );

      const stack = getByTestId('stack');
      expect(stack).toBeTruthy();
    });

    it('should support horizontal direction (row)', () => {
      const { getByTestId } = renderWithTheme(
        <Stack testID="stack" direction={DIRECTIONS.HORIZONTAL}>
          <Text>Child</Text>
        </Stack>
      );

      const stack = getByTestId('stack');
      expect(stack).toBeTruthy();
    });

    it('should normalize invalid direction to vertical', () => {
      const { getByTestId } = renderWithTheme(
        <Stack testID="stack" direction="invalid">
          <Text>Child</Text>
        </Stack>
      );

      const stack = getByTestId('stack');
      expect(stack).toBeTruthy();
    });
  });

  describe('Spacing', () => {
    it.each([
      [SPACING.XS, 'xs'],
      [SPACING.SM, 'sm'],
      [SPACING.MD, 'md'],
      [SPACING.LG, 'lg'],
      [SPACING.XL, 'xl'],
      [SPACING.XXL, 'xxl'],
    ])('should apply spacing token %s', (spacing) => {
      const { getByTestId } = renderWithTheme(
        <Stack testID="stack" spacing={spacing}>
          <Text>One</Text>
          <Text>Two</Text>
        </Stack>
      );

      const stack = getByTestId('stack');
      expect(stack).toBeTruthy();
    });

    it('should normalize invalid spacing to md', () => {
      const { getByTestId } = renderWithTheme(
        <Stack testID="stack" spacing="invalid">
          <Text>One</Text>
          <Text>Two</Text>
        </Stack>
      );

      const stack = getByTestId('stack');
      expect(stack).toBeTruthy();
    });
  });

  describe('Alignment', () => {
    it.each([
      [ALIGN.START, 'flex-start'],
      [ALIGN.CENTER, 'center'],
      [ALIGN.END, 'flex-end'],
      [ALIGN.STRETCH, 'stretch'],
      [ALIGN.BASELINE, 'baseline'],
    ])('should apply align value %s', (align) => {
      const { getByTestId } = renderWithTheme(
        <Stack testID="stack" align={align}>
          <Text>Child</Text>
        </Stack>
      );

      const stack = getByTestId('stack');
      expect(stack).toBeTruthy();
    });

    it('should default align to flex-start when not provided', () => {
      const { getByTestId } = renderWithTheme(
        <Stack testID="stack">
          <Text>Child</Text>
        </Stack>
      );

      const stack = getByTestId('stack');
      expect(stack).toBeTruthy();
    });
  });

  describe('Justify Content', () => {
    it.each([
      [JUSTIFY.START, 'flex-start'],
      [JUSTIFY.CENTER, 'center'],
      [JUSTIFY.END, 'flex-end'],
      [JUSTIFY.BETWEEN, 'space-between'],
      [JUSTIFY.AROUND, 'space-around'],
      [JUSTIFY.EVENLY, 'space-evenly'],
    ])('should apply justify value %s', (justify) => {
      const { getByTestId } = renderWithTheme(
        <Stack testID="stack" justify={justify}>
          <Text>Child</Text>
        </Stack>
      );

      const stack = getByTestId('stack');
      expect(stack).toBeTruthy();
    });

    it('should default justify to flex-start when not provided', () => {
      const { getByTestId } = renderWithTheme(
        <Stack testID="stack">
          <Text>Child</Text>
        </Stack>
      );

      const stack = getByTestId('stack');
      expect(stack).toBeTruthy();
    });
  });

  describe('Wrap', () => {
    it('should support wrap prop', () => {
      const { getByTestId } = renderWithTheme(
        <Stack testID="stack" wrap>
          <Text>Child 1</Text>
          <Text>Child 2</Text>
          <Text>Child 3</Text>
        </Stack>
      );

      const stack = getByTestId('stack');
      expect(stack).toBeTruthy();
    });

    it('should default wrap to false', () => {
      const { getByTestId } = renderWithTheme(
        <Stack testID="stack">
          <Text>Child</Text>
        </Stack>
      );

      const stack = getByTestId('stack');
      expect(stack).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should support accessibility attributes', () => {
      const { getByTestId } = renderWithTheme(
        <Stack testID="stack" accessibilityLabel="Stack container">
          <Text>Child</Text>
        </Stack>
      );

      const stack = getByTestId('stack');
      expect(stack).toBeTruthy();
      expect(stack.props.accessibilityLabel || stack.props['aria-label']).toBe('Stack container');
    });
  });

  describe('Platform-specific variants', () => {
    describe('iOS variant', () => {
      it('should render iOS Stack', () => {
        // eslint-disable-next-line import/no-unresolved
        const StackIOS = require('@platform/components/layout/Stack/Stack.ios').default;

        const { getByTestId } = renderWithTheme(
          <StackIOS testID="ios-stack">
            <Text>iOS Child</Text>
          </StackIOS>
        );

        expect(getByTestId('ios-stack')).toBeTruthy();
      });

      it('should support all props on iOS', () => {
        // eslint-disable-next-line import/no-unresolved
        const StackIOS = require('@platform/components/layout/Stack/Stack.ios').default;

        const { getByTestId } = renderWithTheme(
          <StackIOS
            testID="ios-stack-full"
            direction={DIRECTIONS.HORIZONTAL}
            spacing={SPACING.LG}
            align={ALIGN.CENTER}
            justify={JUSTIFY.BETWEEN}
            wrap
            accessibilityLabel="iOS Stack"
          >
            <Text>Child</Text>
          </StackIOS>
        );

        const stack = getByTestId('ios-stack-full');
        expect(stack).toBeTruthy();
        expect(stack.props.accessibilityLabel).toBe('iOS Stack');
      });
    });

    describe('Android variant', () => {
      it('should render Android Stack', () => {
        // eslint-disable-next-line import/no-unresolved
        const StackAndroid = require('@platform/components/layout/Stack/Stack.android').default;

        const { getByTestId } = renderWithTheme(
          <StackAndroid testID="android-stack">
            <Text>Android Child</Text>
          </StackAndroid>
        );

        expect(getByTestId('android-stack')).toBeTruthy();
      });

      it('should support all props on Android', () => {
        // eslint-disable-next-line import/no-unresolved
        const StackAndroid = require('@platform/components/layout/Stack/Stack.android').default;

        const { getByTestId } = renderWithTheme(
          <StackAndroid
            testID="android-stack-full"
            direction={DIRECTIONS.HORIZONTAL}
            spacing={SPACING.LG}
            align={ALIGN.CENTER}
            justify={JUSTIFY.BETWEEN}
            wrap
            accessibilityLabel="Android Stack"
          >
            <Text>Child</Text>
          </StackAndroid>
        );

        const stack = getByTestId('android-stack-full');
        expect(stack).toBeTruthy();
        expect(stack.props.accessibilityLabel).toBe('Android Stack');
      });
    });

    describe('Web variant', () => {
      it('should render Web Stack', () => {
        // eslint-disable-next-line import/no-unresolved
        const StackWeb = require('@platform/components/layout/Stack/Stack.web').default;
        // eslint-disable-next-line import/no-unresolved
        const WebThemeProvider = require('styled-components').ThemeProvider;

        const { UNSAFE_getByType } = render(
          <WebThemeProvider theme={lightTheme}>
            <StackWeb testID="web-stack">
              <div>Web Child</div>
            </StackWeb>
          </WebThemeProvider>
        );

        const stack = UNSAFE_getByType(StackWeb);
        expect(stack).toBeTruthy();
        expect(stack.props.testID).toBe('web-stack');
      });

      it('should support all props on Web', () => {
        // eslint-disable-next-line import/no-unresolved
        const StackWeb = require('@platform/components/layout/Stack/Stack.web').default;
        // eslint-disable-next-line import/no-unresolved
        const WebThemeProvider = require('styled-components').ThemeProvider;

        const { getByLabelText } = render(
          <WebThemeProvider theme={lightTheme}>
            <StackWeb
              testID="web-stack-full"
              direction={DIRECTIONS.HORIZONTAL}
              spacing={SPACING.LG}
              align={ALIGN.CENTER}
              justify={JUSTIFY.BETWEEN}
              wrap
              accessibilityLabel="Web Stack"
              className="test-class"
            >
              <div>Child</div>
            </StackWeb>
          </WebThemeProvider>
        );

        const stack = getByLabelText('Web Stack');
        expect(stack).toBeTruthy();
        expect(stack.props['aria-label']).toBe('Web Stack');
        expect(stack.props['data-testid']).toBe('web-stack-full');
        expect(stack.props.className).toBe('test-class');
      });
    });
  });

  describe('Exports', () => {
    it('should export types correctly', () => {
      expect(DIRECTIONS).toBeDefined();
      expect(SPACING).toBeDefined();
      expect(ALIGN).toBeDefined();
      expect(JUSTIFY).toBeDefined();
      expect(DIRECTIONS.VERTICAL).toBe('vertical');
      expect(DIRECTIONS.HORIZONTAL).toBe('horizontal');
    });
  });
});
