/**
 * Chip Android Styles
 * Styled-components for Android platform
 * File: Chip.android.styles.jsx
 */

import styled from 'styled-components/native';

const StyledChip = styled.Pressable.withConfig({
  displayName: 'StyledChip',
  componentId: 'StyledChip',
})`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${({ size, theme }) => {
    const padding = {
      small: theme.spacing.sm,
      medium: theme.spacing.md,
      large: theme.spacing.lg,
    };
    return padding[size] || padding.medium;
  }}px;
  padding-vertical: ${({ size, theme }) => {
    const padding = {
      small: theme.spacing.xs,
      medium: theme.spacing.sm,
      large: theme.spacing.md,
    };
    return padding[size] || padding.medium;
  }}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  border-width: ${({ variant }) => (variant === 'outline' ? 1 : 0)}px;
  background-color: ${({ variant, theme }) => {
    if (variant === 'primary') {
      return theme.colors.primary;
    }
    if (variant === 'outline') {
      return 'transparent';
    }
    return theme.colors.background.secondary;
  }};
  border-color: ${({ variant, theme }) => {
    if (variant === 'outline') {
      return theme.colors.primary;
    }
    return 'transparent';
  }};
`;

const StyledChipText = styled.Text.withConfig({
  displayName: 'StyledChipText',
  componentId: 'StyledChipText',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ size, theme }) => {
    const sizes = {
      small: theme.typography.fontSize.sm,
      medium: theme.typography.fontSize.md,
      large: theme.typography.fontSize.lg,
    };
    return sizes[size] || sizes.medium;
  }}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  line-height: ${({ size, theme }) => {
    const lineHeights = {
      small: theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
      medium: theme.typography.fontSize.md * theme.typography.lineHeight.normal,
      large: theme.typography.fontSize.lg * theme.typography.lineHeight.normal,
    };
    return lineHeights[size] || lineHeights.medium;
  }}px;
  color: ${({ variant, theme }) => {
    if (variant === 'primary') {
      return theme.colors.onPrimary || theme.colors.text.inverse;
    }
    if (variant === 'outline') {
      return theme.colors.primary;
    }
    return theme.colors.text.primary;
  }};
`;

const StyledRemoveButton = styled.Pressable.withConfig({
  displayName: 'StyledRemoveButton',
  componentId: 'StyledRemoveButton',
})`
  margin-left: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => theme.spacing.xs}px;
  align-items: center;
  justify-content: center;
  min-width: ${({ theme }) => theme.spacing.md + theme.spacing.xs}px;
  min-height: ${({ theme }) => theme.spacing.md + theme.spacing.xs}px;
`;

export { StyledChip, StyledChipText, StyledRemoveButton };


