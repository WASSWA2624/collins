/**
 * ProgressBar iOS Styles
 * Styled-components for iOS platform
 * File: ProgressBar.ios.styles.jsx
 */

import styled from 'styled-components/native';

const StyledProgressBar = styled.View.withConfig({
  displayName: 'StyledProgressBar',
  componentId: 'StyledProgressBar',
})`
  width: 100%;
`;

const StyledProgressBarTrack = styled.View.withConfig({
  displayName: 'StyledProgressBarTrack',
  componentId: 'StyledProgressBarTrack',
})`
  width: 100%;
  height: ${({ theme }) => theme.spacing.xs * 2}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.background.tertiary};
  overflow: hidden;
`;

const StyledProgressBarFill = styled.View.withConfig({
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
`;

export { StyledProgressBar, StyledProgressBarTrack, StyledProgressBarFill };


