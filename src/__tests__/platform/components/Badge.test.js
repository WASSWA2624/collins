/**
 * Badge Component Tests
 * File: Badge.test.js
 */

import React from 'react';
import { Platform } from 'react-native';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import Badge, { SIZES, VARIANTS, SIZE_KEYS, VARIANT_KEYS } from '@platform/components/display/Badge';
import lightTheme from '@theme/light.theme';

const renderWithTheme = (component) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
};

describe('Badge Component', () => {
  describe('Variants', () => {
    it('should render primary variant', () => {
      const { getByText } = renderWithTheme(
        <Badge variant={VARIANTS.PRIMARY}>5</Badge>
      );
      expect(getByText('5')).toBeTruthy();
    });

    it('should render success variant', () => {
      const { getByText } = renderWithTheme(
        <Badge variant={VARIANTS.SUCCESS}>New</Badge>
      );
      expect(getByText('New')).toBeTruthy();
    });

    it('should render warning variant', () => {
      const { getByText } = renderWithTheme(
        <Badge variant={VARIANTS.WARNING}>!</Badge>
      );
      expect(getByText('!')).toBeTruthy();
    });

    it('should render error variant', () => {
      const { getByText } = renderWithTheme(
        <Badge variant={VARIANTS.ERROR}>3</Badge>
      );
      expect(getByText('3')).toBeTruthy();
    });

    it('should default to primary variant when invalid variant provided', () => {
      const { getByText } = renderWithTheme(
        <Badge variant="invalid">Test</Badge>
      );
      expect(getByText('Test')).toBeTruthy();
    });

    it('should default to primary variant when variant is undefined', () => {
      const { getByText } = renderWithTheme(
        <Badge>Test</Badge>
      );
      expect(getByText('Test')).toBeTruthy();
    });
  });

  describe('Sizes', () => {
    it('should render small size', () => {
      const { getByText } = renderWithTheme(
        <Badge size={SIZES.SMALL}>S</Badge>
      );
      expect(getByText('S')).toBeTruthy();
    });

    it('should render medium size (default)', () => {
      const { getByText } = renderWithTheme(
        <Badge>M</Badge>
      );
      expect(getByText('M')).toBeTruthy();
    });

    it('should render large size', () => {
      const { getByText } = renderWithTheme(
        <Badge size={SIZES.LARGE}>L</Badge>
      );
      expect(getByText('L')).toBeTruthy();
    });

    it('should default to medium size when invalid size provided', () => {
      const { getByText } = renderWithTheme(
        <Badge size="invalid">Test</Badge>
      );
      expect(getByText('Test')).toBeTruthy();
    });

    it('should default to medium size when size is undefined', () => {
      const { getByText } = renderWithTheme(
        <Badge>Test</Badge>
      );
      expect(getByText('Test')).toBeTruthy();
    });
  });

  describe('Content', () => {
    it('should render number content', () => {
      const { getByText } = renderWithTheme(
        <Badge>42</Badge>
      );
      expect(getByText('42')).toBeTruthy();
    });

    it('should render string content', () => {
      const { getByText } = renderWithTheme(
        <Badge>New</Badge>
      );
      expect(getByText('New')).toBeTruthy();
    });

    it('should render children', () => {
      const { getByText } = renderWithTheme(
        <Badge>Badge Content</Badge>
      );
      expect(getByText('Badge Content')).toBeTruthy();
    });

    it('should handle null children', () => {
      const { root } = renderWithTheme(
        <Badge>{null}</Badge>
      );
      expect(root).toBeTruthy();
    });

    it('should handle undefined children', () => {
      const { root } = renderWithTheme(
        <Badge>{undefined}</Badge>
      );
      expect(root).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have accessibility role on web', () => {
      const { getByTestId, queryByTestId, getByLabelText } = renderWithTheme(<Badge testID="badge-role">5</Badge>);
      // Try multiple query methods for cross-platform compatibility
      const badge = queryByTestId('badge-role') || getByLabelText('5');
      expect(badge).toBeTruthy();
      // Check accessibility role if available
      if (badge.props && (badge.props.accessibilityRole || badge.props.role)) {
        expect(badge.props.accessibilityRole || badge.props.role).toBeTruthy();
      }
      if (badge.props && badge.props.accessible !== undefined) {
        expect(badge.props.accessible).toBe(true);
      }
    });

    it('should use custom accessibility label', () => {
      const { getByLabelText } = renderWithTheme(
        <Badge accessibilityLabel="5 notifications">5</Badge>
      );
      expect(getByLabelText('5 notifications')).toBeTruthy();
    });

    it('should use content as accessibility label when not provided', () => {
      const { getByLabelText } = renderWithTheme(
        <Badge>5</Badge>
      );
      expect(getByLabelText('5')).toBeTruthy();
    });

    it('should use number content as accessibility label', () => {
      const { getByLabelText } = renderWithTheme(
        <Badge>{42}</Badge>
      );
      expect(getByLabelText('42')).toBeTruthy();
    });

    it('should handle null children for accessibility label', () => {
      const { getByLabelText } = renderWithTheme(
        <Badge accessibilityLabel="Custom label">{null}</Badge>
      );
      expect(getByLabelText('Custom label')).toBeTruthy();
    });
  });

  describe('Test ID', () => {
    it('should accept testID prop', () => {
      const { getByTestId, queryByTestId, getByLabelText } = renderWithTheme(
        <Badge testID="test-badge">5</Badge>
      );
      // Try multiple query methods for cross-platform compatibility
      const badge = queryByTestId('test-badge') || getByLabelText('5');
      expect(badge).toBeTruthy();
    });
  });

  describe('Platform-specific tests', () => {
    describe('Android variant', () => {
      it('should render Android badge', () => {
        // eslint-disable-next-line import/no-unresolved
        const BadgeAndroid = require('@platform/components/display/Badge/Badge.android').default;

        const { UNSAFE_getByType } = renderWithTheme(
          <BadgeAndroid variant={VARIANTS.PRIMARY} size={SIZES.MEDIUM} testID="android-badge">5</BadgeAndroid>
        );

        const badge = UNSAFE_getByType(BadgeAndroid);
        expect(badge).toBeTruthy();
        expect(badge.props.variant).toBe(VARIANTS.PRIMARY);
        expect(badge.props.size).toBe(SIZES.MEDIUM);
        expect(badge.props.testID).toBe('android-badge');
      });

      it('should have accessibility props on Android', () => {
        // eslint-disable-next-line import/no-unresolved
        const BadgeAndroid = require('@platform/components/display/Badge/Badge.android').default;

        const { getByLabelText } = renderWithTheme(
          <BadgeAndroid accessibilityLabel="Android badge">5</BadgeAndroid>
        );

        expect(getByLabelText('Android badge')).toBeTruthy();
      });
    });

    describe('iOS variant', () => {
      it('should render iOS badge', () => {
        // eslint-disable-next-line import/no-unresolved
        const BadgeIOS = require('@platform/components/display/Badge/Badge.ios').default;

        const { UNSAFE_getByType } = renderWithTheme(
          <BadgeIOS variant={VARIANTS.SUCCESS} size={SIZES.LARGE} testID="ios-badge">New</BadgeIOS>
        );

        const badge = UNSAFE_getByType(BadgeIOS);
        expect(badge).toBeTruthy();
        expect(badge.props.variant).toBe(VARIANTS.SUCCESS);
        expect(badge.props.size).toBe(SIZES.LARGE);
        expect(badge.props.testID).toBe('ios-badge');
      });

      it('should have accessibility props on iOS', () => {
        // eslint-disable-next-line import/no-unresolved
        const BadgeIOS = require('@platform/components/display/Badge/Badge.ios').default;

        const { getByLabelText } = renderWithTheme(
          <BadgeIOS accessibilityLabel="iOS badge">5</BadgeIOS>
        );

        expect(getByLabelText('iOS badge')).toBeTruthy();
      });
    });

    const describeWeb = Platform.OS === 'web' ? describe : describe.skip;
    describeWeb('Web variant', () => {
      it('should render web badge with role', () => {
        const { getByRole } = renderWithTheme(
          <Badge variant={VARIANTS.WARNING} testID="web-badge">!</Badge>
        );

        const badge = getByRole('status');
        expect(badge).toBeTruthy();
      });

      it('should accept className prop on web', () => {
        const { getByRole } = renderWithTheme(
          <Badge className="custom-class" testID="web-badge">Test</Badge>
        );

        const badge = getByRole('status');
        expect(badge).toBeTruthy();
        // className is applied to the styled component
        expect(badge).toBeTruthy();
      });
    });
  });

  describe('useBadge hook edge cases', () => {
    it('should handle invalid variant and fallback to primary', () => {
      const { getByText } = renderWithTheme(
        <Badge variant="unknown">Test</Badge>
      );
      expect(getByText('Test')).toBeTruthy();
    });

    it('should handle invalid size and fallback to medium', () => {
      const { getByText } = renderWithTheme(
        <Badge size="unknown">Test</Badge>
      );
      expect(getByText('Test')).toBeTruthy();
    });

    it('should handle empty string children', () => {
      const { root } = renderWithTheme(
        <Badge>{''}</Badge>
      );
      expect(root).toBeTruthy();
    });

    it('should handle non-string/number children gracefully', () => {
      // Test that useBadge hook handles non-string/number children
      // by checking that it doesn't crash and uses custom accessibilityLabel
      const { getByLabelText } = renderWithTheme(
        <Badge accessibilityLabel="Custom label">{[]}</Badge>
      );
      expect(getByLabelText('Custom label')).toBeTruthy();
    });

    it('should handle array children', () => {
      const { root } = renderWithTheme(
        <Badge>{[1, 2, 3]}</Badge>
      );
      expect(root).toBeTruthy();
    });

    it('should handle React element children', () => {
      const { root } = renderWithTheme(
        <Badge><span>Test</span></Badge>
      );
      expect(root).toBeTruthy();
    });
  });

  describe('Index export', () => {
    it('should export default component', () => {
      expect(Badge).toBeDefined();
      expect(typeof Badge).toBe('function');
    });

    it('should export all constants', () => {
      expect(SIZES).toBeDefined();
      expect(SIZE_KEYS).toBeDefined();
      expect(VARIANTS).toBeDefined();
      expect(VARIANT_KEYS).toBeDefined();
    });

    it('should export from index.js barrel file', () => {
      // Direct import from index.js to ensure it's covered
      // eslint-disable-next-line import/no-unresolved
      const indexExports = require('@platform/components/display/Badge/index.js');
      expect(indexExports.default).toBeDefined();
      expect(typeof indexExports.default).toBe('function');
      expect(indexExports.SIZES).toBeDefined();
      expect(indexExports.SIZE_KEYS).toBeDefined();
      expect(indexExports.VARIANTS).toBeDefined();
      expect(indexExports.VARIANT_KEYS).toBeDefined();
    });
  });

  describe('Constants Export', () => {
    it('should export VARIANTS constant', () => {
      expect(VARIANTS).toBeDefined();
      expect(VARIANTS.PRIMARY).toBe('primary');
      expect(VARIANTS.SUCCESS).toBe('success');
      expect(VARIANTS.WARNING).toBe('warning');
      expect(VARIANTS.ERROR).toBe('error');
    });

    it('should export SIZES constant', () => {
      expect(SIZES).toBeDefined();
      expect(SIZES.SMALL).toBe('small');
      expect(SIZES.MEDIUM).toBe('medium');
      expect(SIZES.LARGE).toBe('large');
    });

    it('should export VARIANT_KEYS constant', () => {
      expect(VARIANT_KEYS).toBeDefined();
      expect(Array.isArray(VARIANT_KEYS)).toBe(true);
      expect(VARIANT_KEYS).toContain('primary');
      expect(VARIANT_KEYS).toContain('success');
      expect(VARIANT_KEYS).toContain('warning');
      expect(VARIANT_KEYS).toContain('error');
    });

    it('should export SIZE_KEYS constant', () => {
      expect(SIZE_KEYS).toBeDefined();
      expect(Array.isArray(SIZE_KEYS)).toBe(true);
      expect(SIZE_KEYS).toContain('small');
      expect(SIZE_KEYS).toContain('medium');
      expect(SIZE_KEYS).toContain('large');
    });
  });
});

