/**
 * SettingsScreen Web Styles
 * Word-like document layout. Per theme-design.mdc: responsive, theme tokens.
 * File: SettingsScreen.web.styles.jsx
 */
import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: min-content;
  padding: ${({ theme }) => theme.spacing.lg}px ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  display: flex;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    padding: ${({ theme }) => theme.spacing.xl}px ${({ theme }) => theme.spacing.lg}px;
  }
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  width: 100%;
  max-width: 920px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl}px;
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
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 0;
  padding: ${({ theme }) => theme.spacing.lg}px;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;

  &:focus-within {
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

