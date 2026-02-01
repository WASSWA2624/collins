/**
 * ThemeProviderWrapper Styles - Web
 * Global styles live in .styles.jsx per component-structure.mdc.
 * File: ThemeProviderWrapper.web.styles.jsx
 */
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    /* Prevent nested document scrolling; AppFrame owns vertical scroll. */
    height: 100%;
    overflow-y: hidden;
    background-color: ${({ theme }) => theme.colors.background.primary};
  }

  #root, [data-reactroot] {
    margin: 0;
    padding: 0;
    width: 100%;
    max-width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: ${({ theme }) => theme.colors.background.primary};
  }
`;

export { GlobalStyle };

