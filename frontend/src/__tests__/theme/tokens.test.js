/**
 * Theme Tokens Tests
 * File: tokens.test.js
 */

const getCjsOrEsmDefault = (mod) => mod?.default ?? mod;

describe('theme tokens', () => {
  it('colors token should expose required semantic keys (Step 3.1)', () => {
    const colors = getCjsOrEsmDefault(require('@theme/tokens/colors'));

    expect(colors).toEqual(expect.any(Object));

    // Required by dev-plan Step 3.1
    expect(colors.primary).toEqual(expect.any(String));
    expect(colors.onPrimary).toEqual(expect.any(String));
    expect(colors.secondary).toEqual(expect.any(String));
    expect(colors.success).toEqual(expect.any(String));
    expect(colors.warning).toEqual(expect.any(String));
    expect(colors.error).toEqual(expect.any(String));

    expect(colors.background).toEqual(expect.any(Object));
    expect(colors.background.primary).toEqual(expect.any(String));
    expect(colors.background.secondary).toEqual(expect.any(String));
    expect(colors.background.tertiary).toEqual(expect.any(String));

    expect(colors.text).toEqual(expect.any(Object));
    expect(colors.text.primary).toEqual(expect.any(String));
    expect(colors.text.secondary).toEqual(expect.any(String));
    expect(colors.text.tertiary).toEqual(expect.any(String));

    // Convenience aliases
    expect(colors.textPrimary).toBe(colors.text.primary);
    expect(colors.textSecondary).toBe(colors.text.secondary);
  });

  it('spacing token should use numeric scale', () => {
    const spacing = getCjsOrEsmDefault(require('@theme/tokens/spacing'));

    expect(spacing).toEqual(
      expect.objectContaining({
        xs: expect.any(Number),
        sm: expect.any(Number),
        md: expect.any(Number),
        lg: expect.any(Number),
        xl: expect.any(Number),
        xxl: expect.any(Number),
      })
    );
  });

  it('typography token should define font families, sizes, line heights, and weights', () => {
    const typography = getCjsOrEsmDefault(require('@theme/tokens/typography'));

    expect(typography.fontFamily).toEqual(
      expect.objectContaining({
        regular: expect.any(String),
        bold: expect.any(String),
      })
    );
    expect(typography.fontSize).toEqual(
      expect.objectContaining({
        xs: expect.any(Number),
        sm: expect.any(Number),
        md: expect.any(Number),
        lg: expect.any(Number),
        xl: expect.any(Number),
        xxl: expect.any(Number),
      })
    );
    expect(typography.lineHeight).toEqual(
      expect.objectContaining({
        tight: expect.any(Number),
        normal: expect.any(Number),
        relaxed: expect.any(Number),
      })
    );
    expect(typography.fontWeight).toEqual(
      expect.objectContaining({
        normal: expect.any(Number),
        medium: expect.any(Number),
        semibold: expect.any(Number),
        bold: expect.any(Number),
      })
    );
  });

  it('radius token should use numeric values', () => {
    const radius = getCjsOrEsmDefault(require('@theme/tokens/radius'));

    expect(radius).toEqual(
      expect.objectContaining({
        sm: expect.any(Number),
        md: expect.any(Number),
        lg: expect.any(Number),
        xl: expect.any(Number),
        full: expect.any(Number),
      })
    );
  });

  it('shadows token should provide at least sm and md', () => {
    const shadows = getCjsOrEsmDefault(require('@theme/tokens/shadows'));

    expect(shadows).toEqual(
      expect.objectContaining({
        sm: expect.any(Object),
        md: expect.any(Object),
      })
    );
  });
});


