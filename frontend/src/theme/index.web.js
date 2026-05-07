/**
 * Theme Provider & Resolver (Web)
 * File: index.web.js
 */
import React from 'react';
import { Appearance } from 'react-native';
import { ThemeProvider as WebThemeProvider } from 'styled-components';
import lightTheme from './light.theme';
import darkTheme from './dark.theme';
import highContrastTheme from './high-contrast.theme';

const THEME_MODE_VALUES = new Set(['system', 'light', 'dark', 'high-contrast']);

const resolveSystemTheme = () => {
  const systemScheme = Appearance.getColorScheme();
  return systemScheme === 'dark' ? 'dark' : 'light';
};

export const normalizeThemeMode = (mode = 'light') =>
  THEME_MODE_VALUES.has(mode) ? mode : 'light';

export const resolveThemeMode = (mode = 'light') => {
  const normalizedMode = normalizeThemeMode(mode);
  return normalizedMode === 'system' ? resolveSystemTheme() : normalizedMode;
};

export function getTheme(mode = 'light') {
  const resolvedMode = resolveThemeMode(mode);
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
  return <WebThemeProvider theme={themeObj}>{children}</WebThemeProvider>;
}

export { ThemeProviderWrapper as ThemeProvider };
export { lightTheme, darkTheme, highContrastTheme };

export default {
  ThemeProvider: ThemeProviderWrapper,
  lightTheme,
  darkTheme,
  highContrastTheme,
  getTheme,
  normalizeThemeMode,
  resolveThemeMode,
};

