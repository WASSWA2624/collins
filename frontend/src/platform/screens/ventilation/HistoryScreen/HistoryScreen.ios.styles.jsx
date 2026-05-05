/**
 * Tracking screen iOS styles
 * File: HistoryScreen.ios.styles.jsx
 */
import styled from 'styled-components/native';
import { Text as NativeText, View } from 'react-native';

const statusBackground = (theme, level) => {
  if (level === 'red') return theme.colors.status?.error?.background ?? '#FFEBEE';
  if (level === 'yellow') return theme.colors.status?.warning?.background ?? '#FFF3CD';
  if (level === 'green') return theme.colors.status?.success?.background ?? '#E8F5E9';
  return theme.colors.background.secondary;
};

const statusBorder = (theme, level) => {
  if (level === 'red') return theme.colors.status?.error?.text ?? '#C62828';
  if (level === 'yellow') return theme.colors.status?.warning?.text ?? '#856404';
  if (level === 'green') return theme.colors.status?.success?.text ?? '#1B5E20';
  return theme.colors.background.tertiary;
};

const StyledContainer = styled(View).withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledHeader = styled(View).withConfig({
  displayName: 'StyledHeader',
  componentId: 'StyledHeader',
})`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledHeaderActions = styled(View).withConfig({
  displayName: 'StyledHeaderActions',
  componentId: 'StyledHeaderActions',
})`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSummaryBar = styled(View).withConfig({
  displayName: 'StyledSummaryBar',
  componentId: 'StyledSummaryBar',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledBanner = styled(View).withConfig({
  displayName: 'StyledBanner',
  componentId: 'StyledBanner',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.status?.warning?.background ?? '#FFF3CD'};
  border-left-width: 4px;
  border-left-color: ${({ theme }) => theme.colors.status?.warning?.text ?? '#856404'};
`;

const StyledErrorBanner = styled(View).withConfig({
  displayName: 'StyledErrorBanner',
  componentId: 'StyledErrorBanner',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.status?.error?.background ?? '#FFEBEE'};
  border-left-width: 4px;
  border-left-color: ${({ theme }) => theme.colors.status?.error?.text ?? '#C62828'};
`;

const StyledEmpty = styled(View).withConfig({
  displayName: 'StyledEmpty',
  componentId: 'StyledEmpty',
})`
  padding: ${({ theme }) => theme.spacing.xl}px;
  align-items: center;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledList = styled(View).withConfig({
  displayName: 'StyledList',
  componentId: 'StyledList',
})`
  padding-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledItem = styled(View).withConfig({
  displayName: 'StyledItem',
  componentId: 'StyledItem',
})`
  padding: ${({ theme }) => theme.spacing.md}px ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledItemRow = styled(View).withConfig({
  displayName: 'StyledItemRow',
  componentId: 'StyledItemRow',
})`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledItemMain = styled(View).withConfig({
  displayName: 'StyledItemMain',
  componentId: 'StyledItemMain',
})`
  flex: 1;
  min-width: 180px;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledItemTitle = styled(NativeText).withConfig({
  displayName: 'StyledItemTitle',
  componentId: 'StyledItemTitle',
})`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledItemMeta = styled(View).withConfig({
  displayName: 'StyledItemMeta',
  componentId: 'StyledItemMeta',
})`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledStatusGroup = styled(View).withConfig({
  displayName: 'StyledStatusGroup',
  componentId: 'StyledStatusGroup',
})`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledStatusPill = styled(View).withConfig({
  displayName: 'StyledStatusPill',
  componentId: 'StyledStatusPill',
})`
  min-height: 28px;
  justify-content: center;
  padding: 2px ${({ theme }) => theme.spacing.sm}px;
  border-width: 1px;
  border-color: ${({ theme, level }) => statusBorder(theme, level)};
  background-color: ${({ theme, level }) => statusBackground(theme, level)};
`;

const StyledItemActions = styled(View).withConfig({
  displayName: 'StyledItemActions',
  componentId: 'StyledItemActions',
})`
  flex-direction: row;
  flex-wrap: wrap;
  flex-shrink: 0;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledDetailPanel = styled(View).withConfig({
  displayName: 'StyledDetailPanel',
  componentId: 'StyledDetailPanel',
})`
  padding: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledTimeline = styled(View).withConfig({
  displayName: 'StyledTimeline',
  componentId: 'StyledTimeline',
})`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledTimelineItem = styled(View).withConfig({
  displayName: 'StyledTimelineItem',
  componentId: 'StyledTimelineItem',
})`
  padding-left: ${({ theme }) => theme.spacing.sm}px;
  border-left-width: 2px;
  border-left-color: ${({ theme }) => theme.colors.background.tertiary};
`;

export {
  StyledBanner,
  StyledContainer,
  StyledDetailPanel,
  StyledEmpty,
  StyledErrorBanner,
  StyledHeader,
  StyledHeaderActions,
  StyledItem,
  StyledItemActions,
  StyledItemMain,
  StyledItemMeta,
  StyledItemRow,
  StyledItemTitle,
  StyledList,
  StyledStatusGroup,
  StyledStatusPill,
  StyledSummaryBar,
  StyledTimeline,
  StyledTimelineItem,
};
