/**
 * DashboardScreen Web Styles
 * File: DashboardScreen.web.styles.jsx
 */
import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'DashboardWebStyledContainer',
})`
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'DashboardWebStyledContent',
})`
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl}px ${({ theme }) => theme.spacing.lg}px;
  box-sizing: border-box;
`;

const StyledHeader = styled.header.withConfig({
  displayName: 'StyledHeader',
  componentId: 'DashboardWebStyledHeader',
})`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledHeaderRow = styled.div.withConfig({
  displayName: 'StyledHeaderRow',
  componentId: 'DashboardWebStyledHeaderRow',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledTabs = styled.div.withConfig({
  displayName: 'StyledTabs',
  componentId: 'DashboardWebStyledTabs',
})`
  display: inline-flex;
  flex-wrap: wrap;
  width: fit-content;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledTab = styled.button.withConfig({
  displayName: 'StyledTab',
  componentId: 'DashboardWebStyledTab',
})`
  min-height: 40px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.lg}px;
  border: 0;
  border-right: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme, $active }) => ($active ? theme.colors.primary : 'transparent')};
  color: ${({ theme, $active }) => ($active ? theme.colors.text.inverse : theme.colors.text.primary)};
  cursor: pointer;

  &:last-child {
    border-right: 0;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const StyledRefreshButton = styled.button.withConfig({
  displayName: 'StyledRefreshButton',
  componentId: 'DashboardWebStyledRefreshButton',
})`
  min-height: 40px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.lg}px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const StyledMetricGrid = styled.div.withConfig({
  displayName: 'StyledMetricGrid',
  componentId: 'DashboardWebStyledMetricGrid',
})`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledMetricTile = styled.div.withConfig({
  displayName: 'StyledMetricTile',
  componentId: 'DashboardWebStyledMetricTile',
})`
  min-height: 96px;
  padding: ${({ theme }) => theme.spacing.md}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledSections = styled.div.withConfig({
  displayName: 'StyledSections',
  componentId: 'DashboardWebStyledSections',
})`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl}px;
  margin-top: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledStatusPanel = styled.div.withConfig({
  displayName: 'StyledStatusPanel',
  componentId: 'DashboardWebStyledStatusPanel',
})`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  border: 1px solid ${({ theme, $tone }) => (
    $tone === 'error' ? theme.colors.error : theme.colors.background.tertiary
  )};
  background-color: ${({ theme, $tone }) => (
    $tone === 'error' ? theme.colors.status.error.background : theme.colors.background.secondary
  )};
`;

const StyledStatusActions = styled.div.withConfig({
  displayName: 'StyledStatusActions',
  componentId: 'DashboardWebStyledStatusActions',
})`
  display: flex;
  justify-content: flex-start;
`;

const StyledSection = styled.section.withConfig({
  displayName: 'StyledSection',
  componentId: 'DashboardWebStyledSection',
})`
  padding-top: ${({ theme }) => theme.spacing.md}px;
  border-top: 1px solid ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledRow = styled.div.withConfig({
  displayName: 'StyledRow',
  componentId: 'DashboardWebStyledRow',
})`
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md}px;
  padding: ${({ theme }) => theme.spacing.sm}px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
`;

export {
  StyledContainer,
  StyledContent,
  StyledHeader,
  StyledHeaderRow,
  StyledMetricGrid,
  StyledMetricTile,
  StyledRefreshButton,
  StyledRow,
  StyledSection,
  StyledSections,
  StyledStatusActions,
  StyledStatusPanel,
  StyledTab,
  StyledTabs,
};
