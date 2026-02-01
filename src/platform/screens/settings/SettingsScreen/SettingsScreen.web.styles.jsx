/**
 * SettingsScreen Web Styles
 * File: SettingsScreen.web.styles.jsx
 * Per theme-design.mdc: responsive, card patterns, theme tokens.
 */
import styled from 'styled-components';

const boxShadowFromToken = (token) => {
  if (!token || typeof token !== 'object') return '0 1px 3px rgba(0,0,0,0.06)';
  const { shadowOffset = {}, shadowRadius = 2, shadowOpacity = 0.1 } = token;
  const h = shadowOffset.height ?? 1;
  const w = shadowOffset.width ?? 0;
  return `${w}px ${h}px ${(shadowRadius || 2) * 2}px rgba(0,0,0,${shadowOpacity})`;
};

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  display: flex;
  justify-content: center;
  align-items: flex-start;

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    padding: ${({ theme }) => theme.spacing.xl}px;
  }
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledHeader = styled.header.withConfig({
  displayName: 'StyledHeader',
  componentId: 'StyledHeader',
})`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSection = styled.section.withConfig({
  displayName: 'StyledSection',
  componentId: 'StyledSection',
})`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary ?? theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radius?.lg ?? 12}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  box-shadow: ${({ theme }) => boxShadowFromToken(theme.shadows?.sm)};
  transition: box-shadow 0.2s ease, border-color 0.2s ease;

  &:focus-within {
    box-shadow: ${({ theme }) => boxShadowFromToken(theme.shadows?.md)};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    padding: ${({ theme }) => theme.spacing.xl}px;
  }
`;

const StyledSectionTitle = styled.div.withConfig({
  displayName: 'StyledSectionTitle',
  componentId: 'StyledSectionTitle',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  font-size: ${({ theme }) => theme.typography?.fontSize?.md ?? 16}px;
  font-weight: ${({ theme }) => theme.typography?.fontWeight?.semibold ?? 600};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export { StyledContainer, StyledContent, StyledHeader, StyledSection, StyledSectionTitle };
