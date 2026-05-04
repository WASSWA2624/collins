/**
 * LoadingSpinner Android Styles
 * Indefinite horizontal thin bar: width by size, height theme.spacing.xs.
 * File: LoadingSpinner.android.styles.jsx
 */

import styled from 'styled-components/native';
import { Animated } from 'react-native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  align-items: center;
  justify-content: center;
`;

const getTrackHeight = (size, theme) => {
  const heights = {
    small: theme.spacing.xs,
    medium: theme.spacing.xs,
    large: theme.spacing.xs,
  };
  return heights[size] || heights.medium;
};

const getTrackWidth = (size, theme) => {
  const widths = {
    small: theme.spacing.xl,
    medium: theme.spacing.xxl,
    large: theme.spacing.xxl + theme.spacing.md,
  };
  return widths[size] || widths.medium;
};

const StyledSpinner = styled.View.withConfig({
  displayName: 'StyledSpinner',
  componentId: 'StyledSpinner',
})`
  position: relative;
  width: ${({ size, theme }) => getTrackWidth(size, theme)}px;
  height: ${({ size, theme }) => getTrackHeight(size, theme)}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.background.tertiary};
  overflow: hidden;
`;

const StyledIndicator = styled(Animated.View).withConfig({
  displayName: 'StyledIndicator',
  componentId: 'StyledIndicator',
}).attrs(({ translateX }) => ({
  style: {
    transform: [{ translateX }],
  },
}))`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${({ indicatorWidth }) => indicatorWidth}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ color }) => color};
`;

export { StyledContainer, StyledSpinner, StyledIndicator, getTrackWidth, getTrackHeight };


