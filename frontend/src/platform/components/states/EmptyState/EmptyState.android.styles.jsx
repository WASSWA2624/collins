/**
 * EmptyState Android Styles
 * Styled-components for Android platform
 * File: EmptyState.android.styles.jsx
 */

import styled from 'styled-components/native';

const StyledEmptyState = styled.View.withConfig({
  displayName: 'StyledEmptyState',
  componentId: 'StyledEmptyState',
})`
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledIconContainer = styled.View.withConfig({
  displayName: 'StyledIconContainer',
  componentId: 'StyledIconContainer',
})`
  margin-bottom: ${({ size, theme }) => {
    const margins = {
      small: theme.spacing.md,
      medium: theme.spacing.lg,
      large: theme.spacing.xl,
    };
    return margins[size] || margins.medium;
  }}px;
  opacity: 0.5;
`;

const StyledTitle = styled.Text.withConfig({
  displayName: 'StyledTitle',
  componentId: 'StyledTitle',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ size, theme }) => {
    const sizes = {
      small: theme.typography.fontSize.md,
      medium: theme.typography.fontSize.lg,
      large: theme.typography.fontSize.xl,
    };
    return sizes[size] || sizes.medium;
  }}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: ${({ size, theme }) => {
    const sizes = {
      small: theme.typography.fontSize.md,
      medium: theme.typography.fontSize.lg,
      large: theme.typography.fontSize.xl,
    };
    return sizes[size] * theme.typography.lineHeight.normal || sizes.medium * theme.typography.lineHeight.normal;
  }}px;
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledDescription = styled.Text.withConfig({
  displayName: 'StyledDescription',
  componentId: 'StyledDescription',
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
  font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
  line-height: ${({ size, theme }) => {
    const sizes = {
      small: theme.typography.fontSize.sm,
      medium: theme.typography.fontSize.md,
      large: theme.typography.fontSize.lg,
    };
    return sizes[size] * theme.typography.lineHeight.normal || sizes.medium * theme.typography.lineHeight.normal;
  }}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledActionContainer = styled.View.withConfig({
  displayName: 'StyledActionContainer',
  componentId: 'StyledActionContainer',
})`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  align-items: center;
  justify-content: center;
`;

export { StyledEmptyState, StyledIconContainer, StyledTitle, StyledDescription, StyledActionContainer };

