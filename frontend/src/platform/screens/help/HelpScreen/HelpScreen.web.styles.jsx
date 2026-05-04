/**
 * HelpScreen Web Styles (P013)
 */
import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  padding: ${({ theme }) => theme.spacing.xl}px ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  box-sizing: border-box;
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
`;

const StyledSection = styled.section.withConfig({
  displayName: 'StyledSection',
  componentId: 'StyledSection',
})`
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledSectionTitle = styled.h2.withConfig({
  displayName: 'StyledSectionTitle',
  componentId: 'StyledSectionTitle',
})`
  font-size: 1.25rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledItem = styled.article.withConfig({
  displayName: 'StyledItem',
  componentId: 'StyledItem',
})`
  padding: ${({ theme }) => theme.spacing.md}px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  &:last-child { border-bottom: none; }
`;

export { StyledContainer, StyledContent, StyledSection, StyledSectionTitle, StyledItem };

