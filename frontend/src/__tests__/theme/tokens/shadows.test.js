/**
 * Shadow Tokens Tests
 * File: shadows.test.js
 * Step 3.5
 */

const getCjsOrEsmDefault = (mod) => mod?.default ?? mod;

describe('Shadow Tokens (Step 3.5)', () => {
  it('should export all shadow tokens', () => {
    const shadows = getCjsOrEsmDefault(require('@theme/tokens/shadows'));

    expect(shadows).toEqual(expect.any(Object));
  });

  it('should have correct shadow token structure', () => {
    const shadows = getCjsOrEsmDefault(require('@theme/tokens/shadows'));

    expect(shadows).toEqual(
      expect.objectContaining({
        sm: expect.any(Object),
        md: expect.any(Object),
      })
    );

    // Verify shadow structure
    expect(shadows.sm).toEqual(
      expect.objectContaining({
        shadowColor: expect.any(String),
        shadowOffset: expect.objectContaining({
          width: expect.any(Number),
          height: expect.any(Number),
        }),
        shadowOpacity: expect.any(Number),
        shadowRadius: expect.any(Number),
        elevation: expect.any(Number),
      })
    );

    expect(shadows.md).toEqual(
      expect.objectContaining({
        shadowColor: expect.any(String),
        shadowOffset: expect.objectContaining({
          width: expect.any(Number),
          height: expect.any(Number),
        }),
        shadowOpacity: expect.any(Number),
        shadowRadius: expect.any(Number),
        elevation: expect.any(Number),
      })
    );
  });
});

