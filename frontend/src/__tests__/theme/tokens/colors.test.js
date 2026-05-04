/**
 * Color Tokens Tests
 * File: colors.test.js
 * Step 3.1
 */

const getCjsOrEsmDefault = (mod) => mod?.default ?? mod;

describe('Color Tokens (Step 3.1)', () => {
  it('should export all color tokens', () => {
    const colors = getCjsOrEsmDefault(require('@theme/tokens/colors'));

    expect(colors).toEqual(expect.any(Object));
  });

  it('should have correct color token structure', () => {
    const colors = getCjsOrEsmDefault(require('@theme/tokens/colors'));

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

    // Convenience semantic aliases
    expect(colors.textPrimary).toBe(colors.text.primary);
    expect(colors.textSecondary).toBe(colors.text.secondary);
  });
});

