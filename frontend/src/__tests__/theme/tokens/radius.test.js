/**
 * Border Radius Tokens Tests
 * File: radius.test.js
 * Step 3.4
 */

const getCjsOrEsmDefault = (mod) => mod?.default ?? mod;

describe('Border Radius Tokens (Step 3.4)', () => {
  it('should export all radius tokens', () => {
    const radius = getCjsOrEsmDefault(require('@theme/tokens/radius'));

    expect(radius).toEqual(expect.any(Object));
  });

  it('should have correct radius token values', () => {
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

    // Verify values are non-negative numbers
    expect(radius.sm).toBeGreaterThanOrEqual(0);
    expect(radius.md).toBeGreaterThanOrEqual(0);
    expect(radius.lg).toBeGreaterThanOrEqual(0);
    expect(radius.xl).toBeGreaterThanOrEqual(0);
    expect(radius.full).toBeGreaterThanOrEqual(0);
  });
});

