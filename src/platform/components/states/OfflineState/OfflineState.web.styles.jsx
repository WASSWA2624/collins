/**
 * OfflineState Web Styles
 * Styled-components for Web platform
 * File: OfflineState.web.styles.jsx
 */

import styled from 'styled-components';

const StyledOfflineState = styled.div.withConfig({
  displayName: 'StyledOfflineState',
  componentId: 'StyledOfflineState',
})`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledIconContainer = styled.div.withConfig({
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
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledTitle = styled.h2.withConfig({
  displayName: 'StyledTitle',
  componentId: 'StyledTitle',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
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
  margin: 0 0 ${({ theme }) => theme.spacing.sm}px 0;
`;

const StyledDescription = styled.p.withConfig({
  displayName: 'StyledDescription',
  componentId: 'StyledDescription',
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
  margin: 0 0 ${({ theme }) => theme.spacing.md}px 0;
`;

const StyledActionContainer = styled.div.withConfig({
  displayName: 'StyledActionContainer',
  componentId: 'StyledActionContainer',
})`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export { StyledOfflineState, StyledIconContainer, StyledTitle, StyledDescription, StyledActionContainer };


