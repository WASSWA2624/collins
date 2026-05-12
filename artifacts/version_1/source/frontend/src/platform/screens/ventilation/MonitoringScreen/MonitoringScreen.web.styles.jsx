/**
 * MonitoringScreen Web Styles
 * File: MonitoringScreen.web.styles.jsx
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
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl}px;
  box-sizing: border-box;
`;

const StyledSection = styled.section.withConfig({
  displayName: 'StyledSection',
  componentId: 'StyledSection',
})`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledSectionHeader = styled.div.withConfig({
  displayName: 'StyledSectionHeader',
  componentId: 'StyledSectionHeader',
})`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledQuickEntryRow = styled.div.withConfig({
  displayName: 'StyledQuickEntryRow',
  componentId: 'StyledQuickEntryRow',
})`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
  align-items: flex-end;
`;

const StyledOfflineBanner = styled.div.withConfig({
  displayName: 'StyledOfflineBanner',
  componentId: 'StyledOfflineBanner',
})`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.status?.warning?.background ?? '#FFF3CD'};
  color: ${({ theme }) => theme.colors.status?.warning?.text ?? '#856404'};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-left: 4px solid ${({ theme }) => theme.colors.status?.warning?.text ?? theme.colors?.warning ?? '#856404'};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledDecisionSupportBanner = styled.div.withConfig({
  displayName: 'StyledDecisionSupportBanner',
  componentId: 'StyledDecisionSupportBanner',
})`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.status?.warning?.background ?? '#FFF3CD'};
  color: ${({ theme }) => theme.colors.status?.warning?.text ?? '#856404'};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-left: 4px solid ${({ theme }) => theme.colors.status?.warning?.text ?? theme.colors?.warning ?? '#856404'};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledAlertItem = styled.article.withConfig({
  displayName: 'StyledAlertItem',
  componentId: 'StyledAlertItem',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
`;

const StyledTrendItem = styled.div.withConfig({
  displayName: 'StyledTrendItem',
  componentId: 'StyledTrendItem',
})`
  padding: ${({ theme }) => theme.spacing.sm}px 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const StyledAlertsList = styled.ul.withConfig({
  displayName: 'StyledAlertsList',
  componentId: 'StyledAlertsList',
})`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const StyledHistoryList = styled.ul.withConfig({
  displayName: 'StyledHistoryList',
  componentId: 'StyledHistoryList',
})`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export {
  StyledAlertItem,
  StyledAlertsList,
  StyledContainer,
  StyledDecisionSupportBanner,
  StyledHistoryList,
  StyledOfflineBanner,
  StyledQuickEntryRow,
  StyledSection,
  StyledSectionHeader,
  StyledTrendItem,
};
