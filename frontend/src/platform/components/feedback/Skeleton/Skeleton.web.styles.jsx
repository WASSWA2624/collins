/**
 * Skeleton Web Styles
 * Styled-components for Web platform
 * File: Skeleton.web.styles.jsx
 */

import styled from 'styled-components';

const StyledSkeleton = styled.div.withConfig({
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
  animation: shimmer 1.5s infinite;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.background.secondary} 0%,
    ${({ theme }) => theme.colors.background.tertiary} 50%,
    ${({ theme }) => theme.colors.background.secondary} 100%
  );
  background-size: 200% 100%;

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export { StyledSkeleton };



