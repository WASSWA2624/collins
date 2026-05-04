/**
 * Spacing Tokens Tests
 * File: spacing.test.js
 * Step 3.2
 */

const getCjsOrEsmDefault = (mod) => mod?.default ?? mod;

describe('Spacing Tokens (Step 3.2)', () => {
  it('should export all spacing tokens', () => {
    const spacing = getCjsOrEsmDefault(require('@theme/tokens/spacing'));

    expect(spacing).toEqual(expect.any(Object));
  });

  it('should have correct spacing token values', () => {
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

    // Verify values are positive numbers
    expect(spacing.xs).toBeGreaterThan(0);
    expect(spacing.sm).toBeGreaterThan(0);
    expect(spacing.md).toBeGreaterThan(0);
    expect(spacing.lg).toBeGreaterThan(0);
    expect(spacing.xl).toBeGreaterThan(0);
    expect(spacing.xxl).toBeGreaterThan(0);
  });
});

