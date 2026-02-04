/**
 * Theme Provider & Resolver
 * File: index.js
 */
import React from 'react';
import { ThemeProvider as NativeThemeProvider } from 'styled-components/native';
import { Appearance } from 'react-native';
import lightTheme from './light.theme';
import darkTheme from './dark.theme';
import highContrastTheme from './high-contrast.theme';

const resolveSystemTheme = () => {
  const systemScheme = Appearance.getColorScheme();
  return systemScheme === 'dark' ? 'dark' : 'light';
};

/** Returns a single font name safe for React Native; never a CSS font stack. */
const safeNativeFont = (v) =>
  typeof v === 'string' && !v.includes(',') ? v : 'System';

export function getTheme(mode = 'light') {
  const resolvedMode = mode === 'system' ? resolveSystemTheme() : mode;
  switch (resolvedMode) {
    case 'dark':
      return darkTheme;
    case 'high-contrast':
      return highContrastTheme;
    default:
      return lightTheme;
  }
}

export function ThemeProviderWrapper({ children, theme = 'light' }) {
  const themeObj = getTheme(theme);
  const ff = themeObj?.typography?.fontFamily;
  // Native must only receive single font names; strip web-only keys to prevent CSS stack leakage.
  const themeForNative = ff
    ? {
        ...themeObj,
        typography: {
          ...themeObj.typography,
          fontFamily: {
            regular: safeNativeFont(ff.regular),
            medium: safeNativeFont(ff.medium),
            bold: safeNativeFont(ff.bold),
          },
        },
      }
    : themeObj;
  return (
    <NativeThemeProvider theme={themeForNative}>
      {children}
    </NativeThemeProvider>
  );
}

export { ThemeProviderWrapper as ThemeProvider };
export { lightTheme, darkTheme, highContrastTheme };

export default {
  ThemeProvider: ThemeProviderWrapper,
  lightTheme,
  darkTheme,
  highContrastTheme,
  getTheme,
};

