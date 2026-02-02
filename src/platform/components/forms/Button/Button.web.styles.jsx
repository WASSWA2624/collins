/**
 * Button Web Styles
 * Styled-components for Web platform
 * File: Button.web.styles.jsx
 */
import styled from 'styled-components';

const StyledButton = styled.button.withConfig({
  displayName: 'StyledButton',
  componentId: 'StyledButton',
  shouldForwardProp: (prop) => !['$state', '$variant', '$size'].includes(prop),
})`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: ${({ $size, theme }) => {
    const heights = {
      small: 44,
      medium: 48,
      large: 56,
    };
    return heights[$size] || heights.medium;
  }}px;
  padding-left: ${({ $size, theme }) => {
    const padding = {
      small: theme.spacing.md,
      medium: theme.spacing.lg,
      large: theme.spacing.xl,
    };
    return padding[$size] || padding.medium;
  }}px;
  padding-right: ${({ $size, theme }) => {
    const padding = {
      small: theme.spacing.md,
      medium: theme.spacing.lg,
      large: theme.spacing.xl,
    };
    return padding[$size] || padding.medium;
  }}px;
  padding-top: ${({ $size, theme }) => {
    const padding = {
      small: theme.spacing.sm,
      medium: theme.spacing.md,
      large: theme.spacing.lg,
    };
    return padding[$size] || padding.medium;
  }}px;
  padding-bottom: ${({ $size, theme }) => {
    const padding = {
      small: theme.spacing.sm,
      medium: theme.spacing.md,
      large: theme.spacing.lg,
    };
    return padding[$size] || padding.medium;
  }}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  border-width: ${({ $variant }) => ($variant === 'outline' ? 1 : 0)}px;
  border-style: solid;
  background-color: ${({ $variant, $state, theme }) => {
    if ($state === 'disabled') {
      return $variant === 'text'
        ? 'transparent'
        : theme.colors.background.tertiary;
    }
    if ($state === 'loading') {
      return $variant === 'text' ? 'transparent' : theme.colors.primary;
    }
    if ($variant === 'primary') {
      return $state === 'active' || $state === 'hover'
        ? theme.colors.primary
        : theme.colors.primary;
    }
    if ($variant === 'secondary') {
      return $state === 'active' || $state === 'hover'
        ? theme.colors.secondary
        : theme.colors.secondary;
    }
    if ($variant === 'outline') {
      return 'transparent';
    }
    return 'transparent';
  }};
  border-color: ${({ $variant, $state, theme }) => {
    if ($variant !== 'outline') return 'transparent';
    if ($state === 'disabled') return theme.colors.background.tertiary;
    return theme.colors.primary;
  }};
  opacity: ${({ $state }) => ($state === 'disabled' ? 0.5 : 1)};
  cursor: ${({ $state }) => ($state === 'disabled' ? 'not-allowed' : 'pointer')};
  user-select: none;

  &:hover {
    ${({ $variant, $state, theme }) => {
      if ($state === 'disabled' || $state === 'loading') return '';
      if ($variant === 'primary') {
        return `background-color: ${theme.colors.primary}; opacity: 0.9;`;
      }
      if ($variant === 'secondary') {
        return `background-color: ${theme.colors.secondary}; opacity: 0.9;`;
      }
      if ($variant === 'outline') {
        return `border-color: ${theme.colors.primary}; background-color: ${theme.colors.background.secondary};`;
      }
      if ($variant === 'text') {
        return `background-color: ${theme.colors.background.secondary};`;
      }
      return '';
    }}
  }

  &:active {
    ${({ $variant, $state, theme }) => {
      if ($state === 'disabled' || $state === 'loading') return '';
      if ($variant === 'primary') {
        return `background-color: ${theme.colors.primary}; opacity: 0.8;`;
      }
      if ($variant === 'secondary') {
        return `background-color: ${theme.colors.secondary}; opacity: 0.8;`;
      }
      if ($variant === 'outline') {
        return `border-color: ${theme.colors.primary}; background-color: ${theme.colors.background.tertiary};`;
      }
      if ($variant === 'text') {
        return `background-color: ${theme.colors.background.tertiary};`;
      }
      return '';
    }}
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const StyledButtonText = styled.span.withConfig({
  displayName: 'StyledButtonText',
  componentId: 'StyledButtonText',
  shouldForwardProp: (prop) => !['$state', '$variant', '$size', '$hasIcon'].includes(prop),
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ $size, theme }) => {
    const sizes = {
      small: theme.typography.fontSize.sm,
      medium: theme.typography.fontSize.md,
      large: theme.typography.fontSize.lg,
    };
    return sizes[$size] || sizes.medium;
  }}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: ${({ $size, theme }) => {
    const lineHeights = {
      small: theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
      medium: theme.typography.fontSize.md * theme.typography.lineHeight.normal,
      large: theme.typography.fontSize.lg * theme.typography.lineHeight.normal,
    };
    return lineHeights[$size] || lineHeights.medium;
  }}px;
  color: ${({ $variant, $state, theme }) => {
    if ($state === 'disabled') {
      return theme.colors.text.tertiary;
    }
    if ($variant === 'primary' || $variant === 'secondary') {
      return theme.colors.text.inverse;
    }
    if ($variant === 'outline') {
      return $state === 'active' || $state === 'hover'
        ? theme.colors.primary
        : theme.colors.primary;
    }
    return theme.colors.primary;
  }};
  margin-left: ${({ $hasIcon, theme }) => ($hasIcon ? theme.spacing.xs : 0)}px;
`;

const StyledButtonContent = styled.span.withConfig({
  displayName: 'StyledButtonContent',
  componentId: 'StyledButtonContent',
})`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const StyledSpinner = styled.span.withConfig({
  displayName: 'StyledSpinner',
  componentId: 'StyledSpinner',
  shouldForwardProp: (prop) => !['$variant', '$size', '$hasText'].includes(prop),
})`
  display: inline-block;
  width: ${({ $size, theme }) => {
    const sizes = {
      small: theme.spacing.sm,
      medium: theme.spacing.md,
      large: theme.spacing.lg,
    };
    return `${sizes[$size] || sizes.medium}px`;
  }};
  height: ${({ $size, theme }) => {
    const sizes = {
      small: theme.spacing.sm,
      medium: theme.spacing.md,
      large: theme.spacing.lg,
    };
    return `${sizes[$size] || sizes.medium}px`;
  }};
  border: 2px solid ${({ theme }) => theme.colors.background.tertiary};
  border-top-color: ${({ $variant, theme }) => {
    if ($variant === 'primary' || $variant === 'secondary') {
      return theme.colors.text.inverse;
    }
    return theme.colors.primary;
  }};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: ${({ $hasText, theme }) => ($hasText ? theme.spacing.xs : 0)}px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export { StyledButton, StyledButtonText, StyledButtonContent, StyledSpinner };

