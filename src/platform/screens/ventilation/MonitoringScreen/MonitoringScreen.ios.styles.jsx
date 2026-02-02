/**
 * MonitoringScreen iOS Styles
 * File: MonitoringScreen.ios.styles.jsx
 */
import styled from 'styled-components/native';
import { View } from 'react-native';

const StyledContentWrap = styled(View).withConfig({
  displayName: 'StyledContentWrap',
  componentId: 'StyledContentWrap',
})`
  flex: 1;
`;

const StyledContainer = styled(View).withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledSection = styled(View).withConfig({
  displayName: 'StyledSection',
  componentId: 'StyledSection',
})`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledSectionHeader = styled(View).withConfig({
  displayName: 'StyledSectionHeader',
  componentId: 'StyledSectionHeader',
})`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledQuickEntryRow = styled(View).withConfig({
  displayName: 'StyledQuickEntryRow',
  componentId: 'StyledQuickEntryRow',
})`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
  align-items: flex-end;
`;

const StyledOfflineBanner = styled(View).withConfig({
  displayName: 'StyledOfflineBanner',
  componentId: 'StyledOfflineBanner',
})`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.status?.warning?.background ?? '#FFF3CD'};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-left-width: 4px;
  border-left-color: ${({ theme }) => theme.colors.status?.warning?.text ?? theme.colors?.warning ?? '#856404'};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledDecisionSupportBanner = styled(View).withConfig({
  displayName: 'StyledDecisionSupportBanner',
  componentId: 'StyledDecisionSupportBanner',
})`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.status?.warning?.background ?? '#FFF3CD'};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-left-width: 4px;
  border-left-color: ${({ theme }) => theme.colors.status?.warning?.text ?? theme.colors?.warning ?? '#856404'};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledAlertItem = styled(View).withConfig({
  displayName: 'StyledAlertItem',
  componentId: 'StyledAlertItem',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
`;

const StyledTrendItem = styled(View).withConfig({
  displayName: 'StyledTrendItem',
  componentId: 'StyledTrendItem',
})`
  padding: ${({ theme }) => theme.spacing.sm}px 0;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export {
  StyledAlertItem,
  StyledContainer,
  StyledContentWrap,
  StyledDecisionSupportBanner,
  StyledOfflineBanner,
  StyledQuickEntryRow,
  StyledSection,
  StyledSectionHeader,
  StyledTrendItem,
};
