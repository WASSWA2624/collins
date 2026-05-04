/**
 * Theme Definitions Tests
 * File: themes.test.js
 */

const getCjsOrEsmDefault = (mod) => mod?.default ?? mod;

const themeKeys = (theme) => Object.keys(theme).sort();

describe('themes', () => {
  it('light/dark/high-contrast themes should have identical shape', () => {
    const lightTheme = getCjsOrEsmDefault(require('@theme/light.theme'));
    const darkTheme = getCjsOrEsmDefault(require('@theme/dark.theme'));
    const highContrastTheme = getCjsOrEsmDefault(require('@theme/high-contrast.theme'));

    expect(themeKeys(lightTheme)).toEqual(themeKeys(darkTheme));
    expect(themeKeys(lightTheme)).toEqual(themeKeys(highContrastTheme));
  });

  it('themes should expose breakpoints and animations (used by UI)', () => {
    const lightTheme = getCjsOrEsmDefault(require('@theme/light.theme'));

    expect(lightTheme.breakpoints).toEqual(
      expect.objectContaining({
        mobile: expect.any(Number),
        tablet: expect.any(Number),
        desktop: expect.any(Number),
        large: expect.any(Number),
      })
    );

    expect(lightTheme.animations).toEqual(
      expect.objectContaining({
        duration: expect.any(Object),
        easing: expect.any(Object),
      })
    );
  });

  it('theme index should expose both named exports and the dev-plan default export API', () => {
    const themeIndex = require('@theme');

    const api = getCjsOrEsmDefault(themeIndex);
    const lightTheme = getCjsOrEsmDefault(require('@theme/light.theme'));

    expect(api).toEqual(
      expect.objectContaining({
        ThemeProvider: expect.any(Function),
        lightTheme: expect.any(Object),
        darkTheme: expect.any(Object),
        highContrastTheme: expect.any(Object),
        getTheme: expect.any(Function),
      })
    );

    // Named exports should remain available for existing imports
    expect(themeIndex.ThemeProvider).toEqual(expect.any(Function));
    expect(themeIndex.getTheme).toEqual(expect.any(Function));

    // Default export API should be consistent
    expect(api.getTheme('light')).toEqual(lightTheme);
  });
});


