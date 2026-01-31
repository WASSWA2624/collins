/**
 * Theme Provider Wrapper - Web
 *
 * Reads theme mode from Redux store and provides it to ThemeProvider.
 * Must be inside Redux Provider to access store.
 *
 * Per bootstrap-config.mdc: ThemeProvider mounted only in root layout.
 * Per theme-design.mdc: Theme consumption via styled-components.
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider as BaseThemeProvider } from '@theme';
import { selectTheme } from '@store/selectors';
import { GlobalStyle } from './ThemeProviderWrapper.web.styles';

const ThemeProviderWrapperWeb = ({ children }) => {
  const themeMode = useSelector(selectTheme);
  return (
    <BaseThemeProvider theme={themeMode}>
      <GlobalStyle />
      {children}
    </BaseThemeProvider>
  );
};

export default ThemeProviderWrapperWeb;

