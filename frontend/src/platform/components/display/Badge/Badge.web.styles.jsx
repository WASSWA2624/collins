/**
 * Badge Web Styles
 * Styled-components for Web platform
 * File: Badge.web.styles.jsx
 */

import styled from 'styled-components';

const StyledBadge = styled.span.withConfig({
  displayName: 'StyledBadge',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ size, theme }) => {
    const xPadding = {
      small: theme.spacing.xs,
      medium: theme.spacing.sm,
      large: theme.spacing.md,
    };
    const yPadding = {
      small: theme.spacing.xs,
      medium: theme.spacing.xs,
      large: theme.spacing.sm,
    };

    const x = xPadding[size] || xPadding.medium;
    const y = yPadding[size] || yPadding.medium;

    return `${y}px ${x}px`;
  }};
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

const StyledBadgeText = styled.span.withConfig({
  displayName: 'StyledBadgeText',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ size, theme }) => {
    const sizes = {
      small: theme.typography.fontSize.xs,
      medium: theme.typography.fontSize.sm,
      large: theme.typography.fontSize.md,
    };
    return sizes[size] || sizes.medium;
  }}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: ${({ size, theme }) => {
    const lineHeights = {
      small: theme.typography.fontSize.xs * theme.typography.lineHeight.tight,
      medium: theme.typography.fontSize.sm * theme.typography.lineHeight.tight,
      large: theme.typography.fontSize.md * theme.typography.lineHeight.tight,
    };
    return lineHeights[size] || lineHeights.medium;
  }}px;
  color: ${({ theme }) => theme.colors.onPrimary};
  text-align: center;
  white-space: nowrap;
`;

export { StyledBadge, StyledBadgeText };



