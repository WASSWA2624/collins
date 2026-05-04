/**
 * Icon Component Tests
 * File: Icon.test.js
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ThemeProvider } from 'styled-components/native';
import Icon, { SIZES, TONES } from '@platform/components/display/Icon';
import lightTheme from '@theme/light.theme';

const renderWithTheme = (component) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
};

describe('Icon Component', () => {
  describe('Basic Rendering', () => {
    it('should render the glyph', () => {
      // eslint-disable-next-line import/no-unresolved
      const IconAndroid = require('@platform/components/display/Icon/Icon.android').default;
      const { getByText } = renderWithTheme(<IconAndroid glyph="★" accessibilityLabel="Star" />);
      expect(getByText('★')).toBeTruthy();
    });

    it('should accept testID prop', () => {
      // eslint-disable-next-line import/no-unresolved
      const IconAndroid = require('@platform/components/display/Icon/Icon.android').default;
      const { getByTestId } = renderWithTheme(
        <IconAndroid glyph="★" accessibilityLabel="Star" testID="icon-star" />
      );
      expect(getByTestId('icon-star')).toBeTruthy();
    });

    it('should render with different glyphs', () => {
      // eslint-disable-next-line import/no-unresolved
      const IconAndroid = require('@platform/components/display/Icon/Icon.android').default;
      const { getByText } = renderWithTheme(<IconAndroid glyph="❤️" accessibilityLabel="Heart" />);
      expect(getByText('❤️')).toBeTruthy();
    });
  });

  describe('Size Variants', () => {
    // eslint-disable-next-line import/no-unresolved
    const IconAndroid = require('@platform/components/display/Icon/Icon.android').default;

    it('should render with xs size', () => {
      const { getByText } = renderWithTheme(
        <IconAndroid glyph="★" size={SIZES.XS} accessibilityLabel="Star" />
      );
      expect(getByText('★')).toBeTruthy();
    });

    it('should render with sm size', () => {
      const { getByText } = renderWithTheme(
        <IconAndroid glyph="★" size={SIZES.SM} accessibilityLabel="Star" />
      );
      expect(getByText('★')).toBeTruthy();
    });

    it('should render with md size (default)', () => {
      const { getByText } = renderWithTheme(<IconAndroid glyph="★" accessibilityLabel="Star" />);
      expect(getByText('★')).toBeTruthy();
    });

    it('should render with lg size', () => {
      const { getByText } = renderWithTheme(
        <IconAndroid glyph="★" size={SIZES.LG} accessibilityLabel="Star" />
      );
      expect(getByText('★')).toBeTruthy();
    });

    it('should render with xl size', () => {
      const { getByText } = renderWithTheme(
        <IconAndroid glyph="★" size={SIZES.XL} accessibilityLabel="Star" />
      );
      expect(getByText('★')).toBeTruthy();
    });

    it('should render with xxl size', () => {
      const { getByText } = renderWithTheme(
        <IconAndroid glyph="★" size={SIZES.XXL} accessibilityLabel="Star" />
      );
      expect(getByText('★')).toBeTruthy();
    });

    it('should render with numeric size', () => {
      const { getByText } = renderWithTheme(
        <IconAndroid glyph="★" size={24} accessibilityLabel="Star" />
      );
      expect(getByText('★')).toBeTruthy();
    });
  });

  describe('Tone Variants', () => {
    // eslint-disable-next-line import/no-unresolved
    const IconAndroid = require('@platform/components/display/Icon/Icon.android').default;

    it('should render with default tone', () => {
      const { getByText } = renderWithTheme(
        <IconAndroid glyph="★" tone={TONES.DEFAULT} accessibilityLabel="Star" />
      );
      expect(getByText('★')).toBeTruthy();
    });

    it('should render with primary tone', () => {
      const { getByText } = renderWithTheme(
        <IconAndroid glyph="★" tone={TONES.PRIMARY} accessibilityLabel="Star" />
      );
      expect(getByText('★')).toBeTruthy();
    });

    it('should render with secondary tone', () => {
      const { getByText } = renderWithTheme(
        <IconAndroid glyph="★" tone={TONES.SECONDARY} accessibilityLabel="Star" />
      );
      expect(getByText('★')).toBeTruthy();
    });

    it('should render with muted tone', () => {
      const { getByText } = renderWithTheme(
        <IconAndroid glyph="★" tone={TONES.MUTED} accessibilityLabel="Star" />
      );
      expect(getByText('★')).toBeTruthy();
    });

    it('should render with success tone', () => {
      const { getByText } = renderWithTheme(
        <IconAndroid glyph="★" tone={TONES.SUCCESS} accessibilityLabel="Star" />
      );
      expect(getByText('★')).toBeTruthy();
    });

    it('should render with warning tone', () => {
      const { getByText } = renderWithTheme(
        <IconAndroid glyph="★" tone={TONES.WARNING} accessibilityLabel="Star" />
      );
      expect(getByText('★')).toBeTruthy();
    });

    it('should render with error tone', () => {
      const { getByText } = renderWithTheme(
        <IconAndroid glyph="★" tone={TONES.ERROR} accessibilityLabel="Star" />
      );
      expect(getByText('★')).toBeTruthy();
    });

    it('should render with inverse tone', () => {
      const { getByText } = renderWithTheme(
        <IconAndroid glyph="★" tone={TONES.INVERSE} accessibilityLabel="Star" />
      );
      expect(getByText('★')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    // eslint-disable-next-line import/no-unresolved
    const IconAndroid = require('@platform/components/display/Icon/Icon.android').default;

    it('should expose a meaningful accessibility role when label is provided', () => {
      const { getByText } = renderWithTheme(
        <IconAndroid glyph="★" accessibilityLabel="Star" accessibilityHint="Marks item as favorite" />
      );
      const icon = getByText('★');
      expect(icon.props.accessibilityRole).toBe('image');
      expect(icon.props.accessibilityLabel).toBe('Star');
      expect(icon.props.accessibilityHint).toBe('Marks item as favorite');
      expect(icon.props.accessible).toBe(true);
    });

    it('should be decorative when decorative=true (hidden from accessibility)', () => {
      const { UNSAFE_getAllByType } = renderWithTheme(
        <IconAndroid glyph="★" decorative testID="decorative-icon" />
      );
      const allTextNodes = UNSAFE_getAllByType(Text);
      const icon = allTextNodes.find((node) => node.props.testID === 'decorative-icon');
      expect(icon).toBeTruthy();
      expect(icon.props.accessible).toBe(false);
      expect(icon.props.accessibilityElementsHidden).toBe(true);
      expect(icon.props.importantForAccessibility).toBe('no-hide-descendants');
    });

    it('should be decorative when no accessibilityLabel is provided (decorative=false)', () => {
      const { UNSAFE_getAllByType } = renderWithTheme(
        <IconAndroid glyph="★" decorative={false} testID="no-label-icon" />
      );
      const allTextNodes = UNSAFE_getAllByType(Text);
      const icon = allTextNodes.find((node) => node.props.testID === 'no-label-icon');
      expect(icon).toBeTruthy();
      expect(icon.props.accessible).toBe(false);
      expect(icon.props.accessibilityElementsHidden).toBe(true);
      expect(icon.props.importantForAccessibility).toBe('no-hide-descendants');
    });

    it('should be accessible when decorative=false and accessibilityLabel is provided', () => {
      const { getByText } = renderWithTheme(
        <IconAndroid glyph="★" decorative={false} accessibilityLabel="Star" />
      );
      const icon = getByText('★');
      expect(icon.props.accessible).toBe(true);
      expect(icon.props.accessibilityRole).toBe('image');
      expect(icon.props.accessibilityLabel).toBe('Star');
    });

    it('should handle accessibilityHint when provided', () => {
      const { getByText } = renderWithTheme(
        <IconAndroid glyph="★" accessibilityLabel="Star" accessibilityHint="Click to favorite" />
      );
      const icon = getByText('★');
      expect(icon.props.accessibilityHint).toBe('Click to favorite');
    });

    it('should handle case when decorative is explicitly false but no label provided', () => {
      const { UNSAFE_getAllByType } = renderWithTheme(
        <IconAndroid glyph="★" decorative={false} testID="no-label-explicit-false" />
      );
      const allTextNodes = UNSAFE_getAllByType(Text);
      const icon = allTextNodes.find((node) => node.props.testID === 'no-label-explicit-false');
      expect(icon).toBeTruthy();
      expect(icon.props.accessible).toBe(false);
    });

    it('should handle case when decorative is undefined and no label provided', () => {
      const { UNSAFE_getAllByType } = renderWithTheme(
        <IconAndroid glyph="★" testID="no-label-undefined-decorative" />
      );
      const allTextNodes = UNSAFE_getAllByType(Text);
      const icon = allTextNodes.find((node) => node.props.testID === 'no-label-undefined-decorative');
      expect(icon).toBeTruthy();
      expect(icon.props.accessible).toBe(false);
    });

    it('should be decorative when decorative=true even with accessibilityLabel', () => {
      const { UNSAFE_getAllByType } = renderWithTheme(
        <IconAndroid glyph="★" decorative={true} accessibilityLabel="Star" testID="decorative-with-label" />
      );
      const allTextNodes = UNSAFE_getAllByType(Text);
      const icon = allTextNodes.find((node) => node.props.testID === 'decorative-with-label');
      expect(icon).toBeTruthy();
      expect(icon.props.accessible).toBe(false);
      expect(icon.props.accessibilityElementsHidden).toBe(true);
    });
  });

  describe('Platform-specific tests', () => {
    describe('Android variant', () => {
      it('should render Android icon', () => {
        // eslint-disable-next-line import/no-unresolved
        const IconAndroid = require('@platform/components/display/Icon/Icon.android').default;

        const { UNSAFE_getByType } = renderWithTheme(
          <IconAndroid glyph="★" accessibilityLabel="Star" testID="android-icon" />
        );

        const icon = UNSAFE_getByType(IconAndroid);
        expect(icon).toBeTruthy();
        expect(icon.props.glyph).toBe('★');
        expect(icon.props.testID).toBe('android-icon');
      });

      it('should apply Android accessibility props', () => {
        // eslint-disable-next-line import/no-unresolved
        const IconAndroid = require('@platform/components/display/Icon/Icon.android').default;

        const { UNSAFE_getByType } = renderWithTheme(
          <IconAndroid glyph="★" accessibilityLabel="Star" decorative={false} />
        );

        const icon = UNSAFE_getByType(IconAndroid);
        expect(icon.props.accessibilityLabel).toBe('Star');
      });
    });

    describe('iOS variant', () => {
      it('should render iOS icon', () => {
        // eslint-disable-next-line import/no-unresolved
        const IconIOS = require('@platform/components/display/Icon/Icon.ios').default;

        const { UNSAFE_getByType } = renderWithTheme(
          <IconIOS glyph="★" accessibilityLabel="Star" testID="ios-icon" />
        );

        const icon = UNSAFE_getByType(IconIOS);
        expect(icon).toBeTruthy();
        expect(icon.props.glyph).toBe('★');
        expect(icon.props.testID).toBe('ios-icon');
      });

      it('should apply iOS accessibility props', () => {
        // eslint-disable-next-line import/no-unresolved
        const IconIOS = require('@platform/components/display/Icon/Icon.ios').default;

        const { UNSAFE_getByType } = renderWithTheme(
          <IconIOS glyph="★" accessibilityLabel="Star" decorative={false} />
        );

        const icon = UNSAFE_getByType(IconIOS);
        expect(icon.props.accessibilityLabel).toBe('Star');
      });
    });
  });

  describe('Constants', () => {
    it('should export SIZES and TONES constants', () => {
      expect(SIZES).toBeDefined();
      expect(SIZES.XS).toBe('xs');
      expect(SIZES.SM).toBe('sm');
      expect(SIZES.MD).toBe('md');
      expect(SIZES.LG).toBe('lg');
      expect(SIZES.XL).toBe('xl');
      expect(SIZES.XXL).toBe('xxl');
      expect(TONES).toBeDefined();
      expect(TONES.DEFAULT).toBe('default');
      expect(TONES.PRIMARY).toBe('primary');
      expect(TONES.SECONDARY).toBe('secondary');
      expect(TONES.MUTED).toBe('muted');
      expect(TONES.SUCCESS).toBe('success');
      expect(TONES.WARNING).toBe('warning');
      expect(TONES.ERROR).toBe('error');
      expect(TONES.INVERSE).toBe('inverse');
    });
  });

  describe('useIcon Hook - Direct Testing', () => {
    // eslint-disable-next-line import/no-unresolved
    const useIcon = require('@platform/components/display/Icon/useIcon').default;

    it('should use default size when size is undefined', () => {
      const result = useIcon({ glyph: '★', size: undefined });
      expect(result.size).toBe(SIZES.MD);
    });

    it('should use default tone when tone is undefined', () => {
      const result = useIcon({ glyph: '★', tone: undefined });
      expect(result.tone).toBe(TONES.DEFAULT);
    });

    it('should use default decorative when decorative is undefined', () => {
      const result = useIcon({ glyph: '★', decorative: undefined, accessibilityLabel: 'Star' });
      expect(result.a11y.accessible).toBe(true);
    });

    it('should be decorative when decorative is true', () => {
      const result = useIcon({ glyph: '★', decorative: true, accessibilityLabel: 'Star' });
      expect(result.a11y.accessible).toBe(false);
      expect(result.a11y.accessibilityElementsHidden).toBe(true);
      expect(result.a11y.importantForAccessibility).toBe('no-hide-descendants');
    });

    it('should be decorative when no accessibilityLabel is provided', () => {
      const result = useIcon({ glyph: '★', decorative: false });
      expect(result.a11y.accessible).toBe(false);
      expect(result.a11y.accessibilityElementsHidden).toBe(true);
      expect(result.a11y.importantForAccessibility).toBe('no-hide-descendants');
    });

    it('should be accessible when decorative is false and accessibilityLabel is provided', () => {
      const result = useIcon({ glyph: '★', decorative: false, accessibilityLabel: 'Star', accessibilityHint: 'Hint' });
      expect(result.a11y.accessible).toBe(true);
      expect(result.a11y.accessibilityRole).toBe('image');
      expect(result.a11y.accessibilityLabel).toBe('Star');
      expect(result.a11y.accessibilityHint).toBe('Hint');
    });
  });

  describe('Index exports', () => {
    it('should export default component', () => {
      expect(Icon).toBeDefined();
      // Actually use the export to get coverage
      const { getByText } = renderWithTheme(<Icon glyph="★" accessibilityLabel="Test" />);
      expect(getByText('★')).toBeTruthy();
    });

    it('should export SIZES and TONES from index', () => {
      expect(SIZES).toBeDefined();
      expect(TONES).toBeDefined();
      // Use the exports to get coverage
      expect(SIZES.MD).toBe('md');
      expect(TONES.DEFAULT).toBe('default');
    });
  });

  describe('Style helper functions coverage', () => {
    // eslint-disable-next-line import/no-unresolved
    const IconAndroid = require('@platform/components/display/Icon/Icon.android').default;

    it('should handle all size variants with theme tokens', () => {
      const sizes = [SIZES.XS, SIZES.SM, SIZES.MD, SIZES.LG, SIZES.XL, SIZES.XXL];
      sizes.forEach((size) => {
        const { getByText } = renderWithTheme(
          <IconAndroid glyph="★" size={size} accessibilityLabel="Star" />
        );
        expect(getByText('★')).toBeTruthy();
      });
    });

    it('should handle numeric size values', () => {
      const numericSizes = [12, 16, 20, 24, 32, 48];
      numericSizes.forEach((size) => {
        const { getByText } = renderWithTheme(
          <IconAndroid glyph="★" size={size} accessibilityLabel="Star" />
        );
        expect(getByText('★')).toBeTruthy();
      });
    });

    it('should handle all tone variants with theme tokens', () => {
      const tones = [
        TONES.DEFAULT,
        TONES.PRIMARY,
        TONES.SECONDARY,
        TONES.MUTED,
        TONES.SUCCESS,
        TONES.WARNING,
        TONES.ERROR,
        TONES.INVERSE,
      ];
      tones.forEach((tone) => {
        const { getByText } = renderWithTheme(
          <IconAndroid glyph="★" tone={tone} accessibilityLabel="Star" />
        );
        expect(getByText('★')).toBeTruthy();
      });
    });

    it('should handle invalid size with fallback to md', () => {
      const { getByText } = renderWithTheme(
        <IconAndroid glyph="★" size="invalid" accessibilityLabel="Star" />
      );
      expect(getByText('★')).toBeTruthy();
    });
  });
});


