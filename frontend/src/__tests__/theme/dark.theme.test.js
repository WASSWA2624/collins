/**
 * Dark Theme Tests
 * File: dark.theme.test.js
 * Step 3.7
 */

const getCjsOrEsmDefault = (mod) => mod?.default ?? mod;

describe('Dark Theme (Step 3.7)', () => {
  it('should have correct dark theme structure', () => {
    const darkTheme = getCjsOrEsmDefault(require('@theme/dark.theme'));

    expect(darkTheme).toEqual(
      expect.objectContaining({
        colors: expect.any(Object),
        spacing: expect.any(Object),
        typography: expect.any(Object),
        radius: expect.any(Object),
        shadows: expect.any(Object),
        mode: 'dark',
      })
    );
  });

  it('should override colors for dark mode', () => {
    const darkTheme = getCjsOrEsmDefault(require('@theme/dark.theme'));
    const lightTheme = getCjsOrEsmDefault(require('@theme/light.theme'));

    // Dark theme should have different background colors
    expect(darkTheme.colors.background.primary).not.toBe(
      lightTheme.colors.background.primary
    );
    expect(darkTheme.colors.text.primary).not.toBe(lightTheme.colors.text.primary);
  });

  it('should import all token types', () => {
    const darkTheme = getCjsOrEsmDefault(require('@theme/dark.theme'));

    // Verify all token imports are present
    expect(darkTheme.colors).toBeDefined();
    expect(darkTheme.spacing).toBeDefined();
    expect(darkTheme.typography).toBeDefined();
    expect(darkTheme.radius).toBeDefined();
    expect(darkTheme.shadows).toBeDefined();
    expect(darkTheme.breakpoints).toBeDefined();
    expect(darkTheme.animations).toBeDefined();
  });
});

