/**
 * DashboardScreen Native Styles
 * File: DashboardScreen.native.styles.jsx
 */
import styled from 'styled-components/native';
import { Pressable, ScrollView, View } from 'react-native';

const StyledContainer = styled(ScrollView).withConfig({
  displayName: 'StyledContainer',
  componentId: 'DashboardStyledContainer',
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled(View).withConfig({
  displayName: 'StyledContent',
  componentId: 'DashboardStyledContent',
})`
  padding: ${({ theme }) => theme.spacing.lg}px;
  width: 100%;
`;

const StyledHeader = styled(View).withConfig({
  displayName: 'StyledHeader',
  componentId: 'DashboardStyledHeader',
})`
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledHeaderRow = styled(View).withConfig({
  displayName: 'StyledHeaderRow',
  componentId: 'DashboardStyledHeaderRow',
})`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledTabs = styled(View).withConfig({
  displayName: 'StyledTabs',
  componentId: 'DashboardStyledTabs',
})`
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledTab = styled(Pressable).withConfig({
  displayName: 'StyledTab',
  componentId: 'DashboardStyledTab',
})`
  flex-grow: 1;
  flex-basis: 0px;
  min-width: 108px;
  min-height: 44px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, $active }) => ($active ? theme.colors.primary : 'transparent')};
  border-right-width: 1px;
  border-right-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledRefreshButton = styled(Pressable).withConfig({
  displayName: 'StyledRefreshButton',
  componentId: 'DashboardStyledRefreshButton',
})`
  flex-shrink: 0;
  min-height: 40px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.primary};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

const StyledMetricGrid = styled(View).withConfig({
  displayName: 'StyledMetricGrid',
  componentId: 'DashboardStyledMetricGrid',
})`
  flex-direction: row;
  flex-wrap: wrap;
  margin: -${({ theme }) => theme.spacing.xs}px;
`;

const StyledMetricTile = styled(View).withConfig({
  displayName: 'StyledMetricTile',
  componentId: 'DashboardStyledMetricTile',
})`
  width: ${({ $columns }) => 100 / ($columns || 2)}%;
  padding: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledMetricInner = styled(View).withConfig({
  displayName: 'StyledMetricInner',
  componentId: 'DashboardStyledMetricInner',
})`
  min-height: 88px;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  gap: ${({ theme }) => theme.spacing.sm}px;
  justify-content: space-between;
`;

const StyledSections = styled(View).withConfig({
  displayName: 'StyledSections',
  componentId: 'DashboardStyledSections',
})`
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: -${({ theme }) => theme.spacing.xs}px;
  margin-right: -${({ theme }) => theme.spacing.xs}px;
`;

const StyledSection = styled(View).withConfig({
  displayName: 'StyledSection',
  componentId: 'DashboardStyledSection',
})`
  width: ${({ $columns }) => 100 / ($columns || 1)}%;
  margin-top: ${({ theme }) => theme.spacing.xl}px;
  padding: ${({ theme }) => theme.spacing.md}px ${({ theme }) => theme.spacing.xs}px 0;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledStatusPanel = styled(View).withConfig({
  displayName: 'StyledStatusPanel',
  componentId: 'DashboardStyledStatusPanel',
})`
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-color: ${({ theme, $tone }) => (
    $tone === 'error' ? theme.colors.error : theme.colors.background.tertiary
  )};
  background-color: ${({ theme, $tone }) => (
    $tone === 'error' ? theme.colors.status.error.background : theme.colors.background.secondary
  )};
`;

const StyledStatusActions = styled(View).withConfig({
  displayName: 'StyledStatusActions',
  componentId: 'DashboardStyledStatusActions',
})`
  align-items: flex-start;
`;

const StyledRow = styled(View).withConfig({
  displayName: 'StyledRow',
  componentId: 'DashboardStyledRow',
})`
  min-height: 40px;
  padding: ${({ theme }) => theme.spacing.sm}px 0;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary};
`;

export {
  StyledContainer,
  StyledContent,
  StyledHeader,
  StyledHeaderRow,
  StyledMetricGrid,
  StyledMetricInner,
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
