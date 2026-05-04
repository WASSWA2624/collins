/**
 * Light Theme Tests
 * File: light.theme.test.js
 * Step 3.6
 */

const getCjsOrEsmDefault = (mod) => mod?.default ?? mod;

describe('Light Theme (Step 3.6)', () => {
  it('should have correct light theme structure', () => {
    const lightTheme = getCjsOrEsmDefault(require('@theme/light.theme'));

    expect(lightTheme).toEqual(
      expect.objectContaining({
        colors: expect.any(Object),
        spacing: expect.any(Object),
        typography: expect.any(Object),
        radius: expect.any(Object),
        shadows: expect.any(Object),
        mode: 'light',
      })
    );
  });

  it('should import all token types', () => {
    const lightTheme = getCjsOrEsmDefault(require('@theme/light.theme'));

    // Verify all token imports are present
    expect(lightTheme.colors).toBeDefined();
    expect(lightTheme.spacing).toBeDefined();
    expect(lightTheme.typography).toBeDefined();
    expect(lightTheme.radius).toBeDefined();
    expect(lightTheme.shadows).toBeDefined();
    expect(lightTheme.breakpoints).toBeDefined();
    expect(lightTheme.animations).toBeDefined();
  });
});

