/**
 * Skeleton iOS Styles
 * Styled-components for iOS platform
 * File: Skeleton.ios.styles.jsx
 */

import styled from 'styled-components/native';

const StyledSkeleton = styled.View.withConfig({
  displayName: 'StyledSkeleton',
  componentId: 'StyledSkeleton',
})`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ variant, theme }) => {
    if (variant === 'circular') {
      return theme.radius.full;
    }
    return theme.radius.sm;
  }}px;
  width: ${({ width, variant, theme }) => {
    if (width) {
      return typeof width === 'number' ? `${width}px` : width;
    }
    if (variant === 'circular') {
      return `${theme.spacing.xl}px`;
    }
    return '100%';
  }};
  height: ${({ height, variant, theme }) => {
    if (height) {
      return typeof height === 'number' ? `${height}px` : height;
    }
    if (variant === 'text') {
      return `${theme.typography.fontSize.md}px`;
    }
    if (variant === 'circular') {
      return `${theme.spacing.xl}px`;
    }
    return `${theme.spacing.xxl * 2}px`;
  }};
  opacity: 0.6;
  margin-bottom: ${({ isLastLine, theme }) => (isLastLine ? 0 : `${theme.spacing.sm}px`)};
`;

export { StyledSkeleton };


