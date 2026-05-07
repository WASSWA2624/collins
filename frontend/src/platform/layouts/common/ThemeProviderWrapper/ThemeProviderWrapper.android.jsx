/**
 * Theme Provider Wrapper - Android
 *
 * Reads theme mode from Redux store and provides it to ThemeProvider.
 * Must be inside Redux Provider to access store.
 *
 * Per bootstrap-config.mdc: ThemeProvider mounted only in root layout.
 * Per theme-design.mdc: Theme consumption via styled-components.
 */
import React from 'react';
import { Appearance } from 'react-native';
import { useSelector } from 'react-redux';
import { ThemeProvider as BaseThemeProvider } from '@theme';
import { selectTheme } from '@store/selectors';

const useSystemThemeUpdates = (themeMode) => {
  const [, forceRender] = React.useReducer((value) => value + 1, 0);

  React.useEffect(() => {
    if (themeMode !== 'system') return undefined;
    const subscription = Appearance.addChangeListener(() => forceRender());
    return () => subscription?.remove?.();
  }, [themeMode]);
};

const ThemeProviderWrapperAndroid = ({ children }) => {
  const themeMode = useSelector(selectTheme);
  useSystemThemeUpdates(themeMode);
  return <BaseThemeProvider theme={themeMode}>{children}</BaseThemeProvider>;
};

export default ThemeProviderWrapperAndroid;

