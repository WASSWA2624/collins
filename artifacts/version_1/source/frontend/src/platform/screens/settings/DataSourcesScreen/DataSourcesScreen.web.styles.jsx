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
  padding: ${({ theme }) => theme.spacing.lg}px 0;
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
  padding: ${({ theme }) => theme.spacing.lg}px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};

  &:last-child {
    border-bottom: none;
  }
`;

const StyledCaptureGrid = styled.div.withConfig({
  displayName: 'StyledCaptureGrid',
  componentId: 'StyledCaptureGrid',
})`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledFieldShell = styled.div.withConfig({
  displayName: 'StyledFieldShell',
  componentId: 'StyledFieldShell',
})`
  padding-left: ${({ theme }) => theme.spacing.sm}px;
  border-left: 3px solid ${({ $state, theme }) => (
    $state === 'missing'
      ? theme.colors.error
      : $state === 'uncertain'
        ? theme.colors.warning
        : theme.colors.background.tertiary
  )};
`;

const StyledInlineNotice = styled.div.withConfig({
  displayName: 'StyledInlineNotice',
  componentId: 'StyledInlineNotice',
})`
  padding: ${({ theme }) => theme.spacing.md}px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledList = styled.ul.withConfig({
  displayName: 'StyledList',
  componentId: 'StyledList',
})`
  margin: ${({ theme }) => theme.spacing.xs}px 0 0;
  padding-left: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledActionRow = styled.div.withConfig({
  displayName: 'StyledActionRow',
  componentId: 'StyledActionRow',
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md}px;
  align-items: center;
`;

export {
  StyledActionRow,
  StyledCaptureGrid,
  StyledContainer,
  StyledContent,
  StyledFieldShell,
  StyledInlineNotice,
  StyledList,
  StyledMetaRow,
  StyledSection,
  StyledSourceItem,
};
