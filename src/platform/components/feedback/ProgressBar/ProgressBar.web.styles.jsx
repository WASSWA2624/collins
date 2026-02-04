/**
 * ProgressBar Web Styles
 * Styled-components for Web platform
 * File: ProgressBar.web.styles.jsx
 */

import styled from 'styled-components';

const StyledProgressBar = styled.div.withConfig({
  displayName: 'StyledProgressBar',
  componentId: 'StyledProgressBar',
})`
  width: 100%;
`;

const StyledProgressBarTrack = styled.div.withConfig({
  displayName: 'StyledProgressBarTrack',
  componentId: 'StyledProgressBarTrack',
})`
  width: 100%;
  height: ${({ theme }) => theme.spacing.xs * 2}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.background.tertiary};
  overflow: hidden;
`;

const StyledProgressBarFill = styled.div.withConfig({
  displayName: 'StyledProgressBarFill',
  componentId: 'StyledProgressBarFill',
})`
  height: 100%;
  width: ${({ value }) => value}%;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ variant, theme }) => {
    const colors = {
      primary: theme.colors.primary,
      success: theme.colors.success,
      warning: theme.colors.warning,
      error: theme.colors.error,
    };
    return colors[variant] || colors.primary;
  }};
  transition: width 0.3s ease-out;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export { StyledProgressBar, StyledProgressBarTrack, StyledProgressBarFill };



