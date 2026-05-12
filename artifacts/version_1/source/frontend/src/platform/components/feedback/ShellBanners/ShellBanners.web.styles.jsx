/**
 * ShellBanners Web Styles
 * Styled-components for Web platform
 * File: ShellBanners.web.styles.jsx
 */
import styled from 'styled-components';

const spacingMap = (spacing, theme) => theme.spacing?.[spacing] || theme.spacing.xs;

const StyledContainer = styled.div.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledStack = styled.div.withConfig({
  displayName: 'StyledStack',
  componentId: 'StyledStack',
})`
  display: flex;
  flex-direction: column;
`;

const StyledStackItem = styled.div.withConfig({
  displayName: 'StyledStackItem',
  componentId: 'StyledStackItem',
})`
  margin-bottom: ${({ isLast, spacing, theme }) => (isLast ? 0 : `${spacingMap(spacing, theme)}px`)};
`;

export { StyledContainer, StyledStack, StyledStackItem };
