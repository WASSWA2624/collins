/**
 * Screen Web Styles
 * Styled-components for Web platform
 * File: Screen.web.styles.jsx
 */

import styled from 'styled-components';

const StyledRoot = styled.main.withConfig({
  displayName: 'StyledRoot',
  componentId: 'StyledRoot',
})`
  min-height: 100vh;
  width: 100%;
  background-color: ${({ background, theme }) => {
    if (background === 'surface') return theme.colors.background.secondary;
    return theme.colors.background.primary;
  }};

  padding: ${({ safeArea, padding, theme }) => {
    const map = {
      none: 0,
      sm: theme.spacing.sm,
      md: theme.spacing.md,
      lg: theme.spacing.lg,
    };
    const base = Object.prototype.hasOwnProperty.call(map, padding) ? map[padding] : map.md;

    if (!safeArea) return `${base}px`;

    // `env()` is supported on modern mobile browsers; fallback to 0px when not available.
    return `calc(${base}px + env(safe-area-inset-top, 0px)) calc(${base}px + env(safe-area-inset-right, 0px)) calc(${base}px + env(safe-area-inset-bottom, 0px)) calc(${base}px + env(safe-area-inset-left, 0px))`;
  }};
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  min-height: 100%;
  width: 100%;
`;

export { StyledRoot, StyledContent };


