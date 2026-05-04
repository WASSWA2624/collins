/**
 * Chip Web Styles
 * Styled-components for Web platform
 * File: Chip.web.styles.jsx
 */

import styled from 'styled-components';

const StyledChip = styled.button.withConfig({
  displayName: 'StyledChip',
  componentId: 'StyledChip',
})`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  padding-left: ${({ size, theme }) => {
    const padding = {
      small: theme.spacing.sm,
      medium: theme.spacing.md,
      large: theme.spacing.lg,
    };
    return padding[size] || padding.medium;
  }}px;
  padding-right: ${({ size, theme }) => {
    const padding = {
      small: theme.spacing.sm,
      medium: theme.spacing.md,
      large: theme.spacing.lg,
    };
    return padding[size] || padding.medium;
  }}px;
  padding-top: ${({ size, theme }) => {
    const padding = {
      small: theme.spacing.xs,
      medium: theme.spacing.sm,
      large: theme.spacing.md,
    };
    return padding[size] || padding.medium;
  }}px;
  padding-bottom: ${({ size, theme }) => {
    const padding = {
      small: theme.spacing.xs,
      medium: theme.spacing.sm,
      large: theme.spacing.md,
    };
    return padding[size] || padding.medium;
  }}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  border-width: ${({ variant }) => (variant === 'outline' ? 1 : 0)}px;
  border-style: solid;
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

  &:hover {
    ${({ variant, theme, disabled }) => {
      if (disabled) return '';
      if (variant === 'primary') {
        return `background-color: ${theme.colors.primary}; opacity: 0.9;`;
      }
      if (variant === 'outline') {
        return `background-color: ${theme.colors.background.secondary};`;
      }
      return `background-color: ${theme.colors.background.tertiary};`;
    }}
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const StyledChipText = styled.span.withConfig({
  displayName: 'StyledChipText',
  componentId: 'StyledChipText',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
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

const StyledRemoveButton = styled.button.withConfig({
  displayName: 'StyledRemoveButton',
  componentId: 'StyledRemoveButton',
})`
  margin-left: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => theme.spacing.xs}px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: ${({ theme }) => theme.spacing.md + theme.spacing.xs}px;
  min-height: ${({ theme }) => theme.spacing.md + theme.spacing.xs}px;
  border: none;
  background: transparent;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.radius.sm}px;
  }
`;

export { StyledChip, StyledChipText, StyledRemoveButton };



