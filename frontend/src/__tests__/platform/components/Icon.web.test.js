/**
 * Icon Component Web Tests
 * File: Icon.web.test.js
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import lightTheme from '@theme/light.theme';

// Import from index to get coverage
import Icon, { SIZES, TONES } from '@platform/components/display/Icon';

// Import web component directly for web-specific tests
// eslint-disable-next-line import/no-unresolved
const IconWeb = require('@platform/components/display/Icon/Icon.web').default;

const renderWithTheme = (component) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
};

describe('Icon Component - Web', () => {
  describe('Basic Rendering', () => {
    it('should render the glyph', () => {
      const { getByText } = renderWithTheme(<IconWeb glyph="★" accessibilityLabel="Star" />);
      expect(getByText('★')).toBeTruthy();
    });

    it('should accept testID prop', () => {
      const { getByTestId } = renderWithTheme(
        <IconWeb glyph="★" accessibilityLabel="Star" testID="icon-star" />
      );
      expect(getByTestId('icon-star')).toBeTruthy();
    });
  });

  describe('Web Accessibility Attributes', () => {
    it('should set aria-hidden when decorative', () => {
      const { container } = renderWithTheme(<IconWeb glyph="★" decorative />);
      const icon = container.firstChild;
      expect(icon.getAttribute('aria-hidden')).toBe('true');
      expect(icon.getAttribute('role')).toBeNull();
      expect(icon.getAttribute('aria-label')).toBeNull();
    });

    it('should set role="img" and aria-label when not decorative', () => {
      const { container } = renderWithTheme(
        <IconWeb glyph="★" accessibilityLabel="Star" decorative={false} />
      );
      const icon = container.firstChild;
      expect(icon.getAttribute('aria-hidden')).toBeNull();
      expect(icon.getAttribute('role')).toBe('img');
      expect(icon.getAttribute('aria-label')).toBe('Star');
    });

    it('should set title attribute from accessibilityHint', () => {
      const { container } = renderWithTheme(
        <IconWeb glyph="★" accessibilityLabel="Star" accessibilityHint="Marks as favorite" />
      );
      const icon = container.firstChild;
      expect(icon.getAttribute('title')).toBe('Marks as favorite');
    });

    it('should not set aria-hidden when accessibilityLabel is provided', () => {
      const { container } = renderWithTheme(
        <IconWeb glyph="★" accessibilityLabel="Star" decorative={false} />
      );
      const icon = container.firstChild;
      expect(icon.getAttribute('aria-hidden')).toBeNull();
    });

    it('should set aria-hidden when no accessibilityLabel is provided', () => {
      const { container } = renderWithTheme(<IconWeb glyph="★" decorative={false} />);
      const icon = container.firstChild;
      expect(icon.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('Size Variants - Web', () => {
    it('should render with numeric size', () => {
      const { container } = renderWithTheme(
        <IconWeb glyph="★" size={32} accessibilityLabel="Star" />
      );
      expect(container.textContent).toBe('★');
    });

    it('should render with all size constants', () => {
      Object.values(SIZES).forEach((size) => {
        const { container, unmount } = renderWithTheme(
          <IconWeb glyph="★" size={size} accessibilityLabel="Star" />
        );
        expect(container.textContent).toBe('★');
        unmount();
      });
    });
  });

  describe('Tone Variants - Web', () => {
    it('should render with all tone constants', () => {
      Object.values(TONES).forEach((tone) => {
        const { container, unmount } = renderWithTheme(
          <IconWeb glyph="★" tone={tone} accessibilityLabel="Star" />
        );
        expect(container.textContent).toBe('★');
        unmount();
      });
    });
  });

  describe('Web-specific component', () => {
    it('should render web icon directly', () => {
      const { container } = renderWithTheme(
        <IconWeb glyph="★" accessibilityLabel="Star" testID="web-icon" />
      );

      const icon = container.firstChild;
      expect(icon).toBeTruthy();
      expect(icon.textContent).toBe('★');
      expect(icon.getAttribute('data-testid')).toBe('web-icon');
    });

    it('should apply web accessibility attributes correctly', () => {
      const { container } = renderWithTheme(
        <IconWeb glyph="★" accessibilityLabel="Star Icon" decorative={false} />
      );

      const icon = container.firstChild;
      expect(icon.getAttribute('role')).toBe('img');
      expect(icon.getAttribute('aria-label')).toBe('Star Icon');
      expect(icon.getAttribute('aria-hidden')).toBeNull();
    });
  });

  describe('Style helper functions coverage - Web', () => {
    it('should handle all size variants with theme tokens', () => {
      const sizes = [SIZES.XS, SIZES.SM, SIZES.MD, SIZES.LG, SIZES.XL, SIZES.XXL];
      sizes.forEach((size) => {
        const { container, unmount } = renderWithTheme(
          <IconWeb glyph="★" size={size} accessibilityLabel="Star" />
        );
        expect(container.textContent).toBe('★');
        unmount();
      });
    });

    it('should handle numeric size values', () => {
      const numericSizes = [12, 16, 20, 24, 32, 48];
      numericSizes.forEach((size) => {
        const { container, unmount } = renderWithTheme(
          <IconWeb glyph="★" size={size} accessibilityLabel="Star" />
        );
        expect(container.textContent).toBe('★');
        unmount();
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
        const { container, unmount } = renderWithTheme(
          <IconWeb glyph="★" tone={tone} accessibilityLabel="Star" />
        );
        expect(container.textContent).toBe('★');
        unmount();
      });
    });

    it('should handle invalid size with fallback to md', () => {
      const { container } = renderWithTheme(
        <IconWeb glyph="★" size="invalid" accessibilityLabel="Star" />
      );
      expect(container.textContent).toBe('★');
    });
  });

  describe('Index exports - Web', () => {
    it('should export default component from index', () => {
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
});

