/**
 * Typography Tokens Tests
 * File: typography.test.js
 * Step 3.3
 */

const getCjsOrEsmDefault = (mod) => mod?.default ?? mod;

describe('Typography Tokens (Step 3.3)', () => {
  it('should export all typography tokens', () => {
    const typography = getCjsOrEsmDefault(require('@theme/tokens/typography'));

    expect(typography).toEqual(expect.any(Object));
  });

  it('should have correct typography token structure', () => {
    const typography = getCjsOrEsmDefault(require('@theme/tokens/typography'));

    expect(typography.fontFamily).toEqual(
      expect.objectContaining({
        regular: expect.any(String),
        bold: expect.any(String),
        regularWeb: expect.any(String),
        boldWeb: expect.any(String),
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
  });
});

