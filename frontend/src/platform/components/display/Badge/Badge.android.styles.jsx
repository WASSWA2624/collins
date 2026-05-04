/**
 * Badge Android Styles
 * Styled-components for Android platform
 * File: Badge.android.styles.jsx
 */

import styled from 'styled-components/native';

const StyledBadge = styled.View.withConfig({
  displayName: 'StyledBadge',
})`
  align-items: center;
  justify-content: center;
  padding-horizontal: ${({ size, theme }) => {
    const padding = {
      small: theme.spacing.xs,
      medium: theme.spacing.sm,
      large: theme.spacing.md,
    };
    return padding[size] || padding.medium;
  }}px;
  padding-vertical: ${({ size, theme }) => {
    const padding = {
      small: theme.spacing.xs,
      medium: theme.spacing.xs,
      large: theme.spacing.sm,
    };
    return padding[size] || padding.medium;
  }}px;
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

const StyledBadgeText = styled.Text.withConfig({
  displayName: 'StyledBadgeText',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
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
`;

export { StyledBadge, StyledBadgeText };


