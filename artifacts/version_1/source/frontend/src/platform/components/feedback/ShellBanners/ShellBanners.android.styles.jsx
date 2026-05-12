/**
 * ShellBanners Android Styles
 * Styled-components for Android platform
 * File: ShellBanners.android.styles.jsx
 */
import styled from 'styled-components/native';

const spacingMap = (spacing, theme) => theme.spacing?.[spacing] || theme.spacing.xs;

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  width: 100%;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledStack = styled.View.withConfig({
  displayName: 'StyledStack',
  componentId: 'StyledStack',
})`
  flex-direction: column;
`;

const StyledStackItem = styled.View.withConfig({
  displayName: 'StyledStackItem',
  componentId: 'StyledStackItem',
})`
  margin-bottom: ${({ isLast, spacing, theme }) => (isLast ? 0 : `${spacingMap(spacing, theme)}px`)};
`;

export { StyledContainer, StyledStack, StyledStackItem };
