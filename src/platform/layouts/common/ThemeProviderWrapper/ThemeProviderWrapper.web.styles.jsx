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
  }

  #root, [data-reactroot] {
    margin: 0;
    padding: 0;
    width: 100%;
    max-width: 100%;
  }
`;

export { GlobalStyle };

