/**
 * DataSourcesScreen Web Styles
 * File: DataSourcesScreen.web.styles.jsx
 */
import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
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
  padding: ${({ theme }) => theme.spacing.md}px 0;
`;

const StyledMetaRow = styled.div.withConfig({
  displayName: 'StyledMetaRow',
  componentId: 'StyledMetaRow',
})`
  padding: ${({ theme }) => theme.spacing.sm}px 0;
`;

const StyledSourceItem = styled.article.withConfig({
  displayName: 'StyledSourceItem',
  componentId: 'StyledSourceItem',
})`
  padding: ${({ theme }) => theme.spacing.md}px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary ?? theme.colors.background.secondary};
`;

export { StyledContainer, StyledContent, StyledSection, StyledMetaRow, StyledSourceItem };
