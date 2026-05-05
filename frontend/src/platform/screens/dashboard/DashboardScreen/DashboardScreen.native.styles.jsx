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
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledTabs = styled(View).withConfig({
  displayName: 'StyledTabs',
  componentId: 'DashboardStyledTabs',
})`
  flex-direction: row;
  flex-wrap: wrap;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledTab = styled(Pressable).withConfig({
  displayName: 'StyledTab',
  componentId: 'DashboardStyledTab',
})`
  min-height: 44px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  justify-content: center;
  background-color: ${({ theme, $active }) => ($active ? theme.colors.primary : 'transparent')};
  border-right-width: 1px;
  border-right-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledRefreshButton = styled(Pressable).withConfig({
  displayName: 'StyledRefreshButton',
  componentId: 'DashboardStyledRefreshButton',
})`
  min-height: 40px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.primary};
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
  width: 50%;
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
  justify-content: space-between;
`;

const StyledSection = styled(View).withConfig({
  displayName: 'StyledSection',
  componentId: 'DashboardStyledSection',
})`
  margin-top: ${({ theme }) => theme.spacing.xl}px;
  padding-top: ${({ theme }) => theme.spacing.md}px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledRow = styled(View).withConfig({
  displayName: 'StyledRow',
  componentId: 'DashboardStyledRow',
})`
  min-height: 40px;
  padding: ${({ theme }) => theme.spacing.sm}px 0;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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
  StyledTab,
  StyledTabs,
};
