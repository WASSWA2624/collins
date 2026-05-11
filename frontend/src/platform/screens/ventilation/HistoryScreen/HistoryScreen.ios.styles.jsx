/**
 * Tracking screen iOS styles
 * File: HistoryScreen.ios.styles.jsx
 */
import styled from 'styled-components/native';
import { Pressable, ScrollView, Text as NativeText, View } from 'react-native';

const statusBackground = (theme, level) => {
  if (level === 'red')
    return theme.colors.status?.error?.background ?? '#FFEBEE';
  if (level === 'yellow')
    return theme.colors.status?.warning?.background ?? '#FFF3CD';
  if (level === 'green')
    return theme.colors.status?.success?.background ?? '#E8F5E9';
  return theme.colors.background.secondary;
};

const statusBorder = (theme, level) => {
  if (level === 'red') return theme.colors.status?.error?.text ?? '#C62828';
  if (level === 'yellow')
    return theme.colors.status?.warning?.text ?? '#856404';
  if (level === 'green') return theme.colors.status?.success?.text ?? '#1B5E20';
  return theme.colors.background.tertiary;
};

const bannerLevel = (tone) => (tone === 'success' ? 'green' : 'yellow');

const StyledContainer = styled(ScrollView).withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledScreenContent = styled(View).withConfig({
  displayName: 'StyledScreenContent',
  componentId: 'StyledScreenContent',
})`
  flex-grow: 1;
  padding: ${({ theme }) => theme.spacing.lg}px;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledHeader = styled(View).withConfig({
  displayName: 'StyledHeader',
  componentId: 'StyledHeader',
})`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.spacing.sm}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledHeaderCopy = styled(View).withConfig({
  displayName: 'StyledHeaderCopy',
  componentId: 'StyledHeaderCopy',
})`
  flex: 1;
  min-width: 220px;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledHeaderActions = styled(View).withConfig({
  displayName: 'StyledHeaderActions',
  componentId: 'StyledHeaderActions',
})`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledControlsRow = styled(View).withConfig({
  displayName: 'StyledControlsRow',
  componentId: 'StyledControlsRow',
})`
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledSearchWrap = styled(View).withConfig({
  displayName: 'StyledSearchWrap',
  componentId: 'StyledSearchWrap',
})`
  width: 100%;
`;

const StyledSummaryBar = styled(View).withConfig({
  displayName: 'StyledSummaryBar',
  componentId: 'StyledSummaryBar',
})`
  min-height: 44px;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => theme.spacing.sm}px
    ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledBanner = styled(View).withConfig({
  displayName: 'StyledBanner',
  componentId: 'StyledBanner',
})`
  padding: ${({ theme }) => theme.spacing.sm}px
    ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme, tone }) =>
    statusBackground(theme, bannerLevel(tone))};
  border-left-width: 4px;
  border-left-color: ${({ theme, tone }) =>
    statusBorder(theme, bannerLevel(tone))};
`;

const StyledErrorBanner = styled(View).withConfig({
  displayName: 'StyledErrorBanner',
  componentId: 'StyledErrorBanner',
})`
  padding: ${({ theme }) => theme.spacing.sm}px
    ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) =>
    theme.colors.status?.error?.background ?? '#FFEBEE'};
  border-left-width: 4px;
  border-left-color: ${({ theme }) =>
    theme.colors.status?.error?.text ?? '#C62828'};
`;

const StyledEmpty = styled(View).withConfig({
  displayName: 'StyledEmpty',
  componentId: 'StyledEmpty',
})`
  padding: ${({ theme }) => theme.spacing.lg}px;
  min-height: 180px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledEmptyActions = styled(View).withConfig({
  displayName: 'StyledEmptyActions',
  componentId: 'StyledEmptyActions',
})`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledList = styled(View).withConfig({
  displayName: 'StyledList',
  componentId: 'StyledList',
})`
  padding-bottom: 0px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledListHeader = styled(View).withConfig({
  displayName: 'StyledListHeader',
  componentId: 'StyledListHeader',
})`
  min-height: 34px;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.xs}px
    ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledListHeaderCell = styled(View).withConfig({
  displayName: 'StyledListHeaderCell',
  componentId: 'StyledListHeaderCell',
})`
  flex: 1;
  min-width: 0px;
`;

const StyledListNumberCell = styled(View).withConfig({
  displayName: 'StyledListNumberCell',
  componentId: 'StyledListNumberCell',
})`
  width: 32px;
  flex-shrink: 0;
  align-items: flex-end;
`;

const StyledListCodeCell = styled(View).withConfig({
  displayName: 'StyledListCodeCell',
  componentId: 'StyledListCodeCell',
})`
  width: 64px;
  flex-shrink: 0;
`;

const StyledListDateCell = styled(View).withConfig({
  displayName: 'StyledListDateCell',
  componentId: 'StyledListDateCell',
})`
  width: 84px;
  flex-shrink: 0;
`;

const StyledListTimeCell = styled(View).withConfig({
  displayName: 'StyledListTimeCell',
  componentId: 'StyledListTimeCell',
})`
  width: 68px;
  flex-shrink: 0;
`;

const StyledItem = styled(View).withConfig({
  displayName: 'StyledItem',
  componentId: 'StyledItem',
})`
  padding: 0px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledPatientRowButton = styled(Pressable).withConfig({
  displayName: 'StyledPatientRowButton',
  componentId: 'StyledPatientRowButton',
})`
  min-height: 40px;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.xs}px
    ${({ theme }) => theme.spacing.sm}px;
`;

const StyledPatientRowNumber = styled(View).withConfig({
  displayName: 'StyledPatientRowNumber',
  componentId: 'StyledPatientRowNumber',
})`
  width: 32px;
  flex-shrink: 0;
  align-items: flex-end;
`;

const StyledPatientRowCell = styled(View).withConfig({
  displayName: 'StyledPatientRowCell',
  componentId: 'StyledPatientRowCell',
})`
  flex: 1;
  min-width: 0px;
`;

const StyledItemRow = styled(View).withConfig({
  displayName: 'StyledItemRow',
  componentId: 'StyledItemRow',
})`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
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
  gap: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
`;

const StyledStatusGroup = styled(View).withConfig({
  displayName: 'StyledStatusGroup',
  componentId: 'StyledStatusGroup',
})`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledStatusPill = styled(View).withConfig({
  displayName: 'StyledStatusPill',
  componentId: 'StyledStatusPill',
})`
  min-height: 24px;
  justify-content: center;
  padding: 1px ${({ theme }) => theme.spacing.sm}px;
  border-width: 1px;
  border-radius: 2px;
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
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledRiskNote = styled(View).withConfig({
  displayName: 'StyledRiskNote',
  componentId: 'StyledRiskNote',
})`
  padding-left: ${({ theme }) => theme.spacing.sm}px;
  border-left-width: 3px;
  border-left-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledDetailPanel = styled(View).withConfig({
  displayName: 'StyledDetailPanel',
  componentId: 'StyledDetailPanel',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledPatientDataSection = styled(View).withConfig({
  displayName: 'StyledPatientDataSection',
  componentId: 'StyledPatientDataSection',
})`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledPatientDataGrid = styled(View).withConfig({
  displayName: 'StyledPatientDataGrid',
  componentId: 'StyledPatientDataGrid',
})`
  flex-direction: row;
  flex-wrap: wrap;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledPatientDataItem = styled(View).withConfig({
  displayName: 'StyledPatientDataItem',
  componentId: 'StyledPatientDataItem',
})`
  flex-grow: 1;
  flex-basis: 48%;
  min-width: 150px;
  padding: ${({ theme }) => theme.spacing.xs}px
    ${({ theme }) => theme.spacing.sm}px;
  border-left-width: 3px;
  border-left-color: ${({ theme }) => theme.colors.primary ?? '#007AFF'};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary};
  gap: 2px;
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
  StyledControlsRow,
  StyledDetailPanel,
  StyledEmpty,
  StyledEmptyActions,
  StyledErrorBanner,
  StyledHeader,
  StyledHeaderActions,
  StyledHeaderCopy,
  StyledItem,
  StyledItemActions,
  StyledItemMain,
  StyledItemMeta,
  StyledItemRow,
  StyledItemTitle,
  StyledList,
  StyledListCodeCell,
  StyledListDateCell,
  StyledListHeader,
  StyledListHeaderCell,
  StyledListNumberCell,
  StyledListTimeCell,
  StyledPatientRowButton,
  StyledPatientRowCell,
  StyledPatientRowNumber,
  StyledPatientDataGrid,
  StyledPatientDataItem,
  StyledPatientDataSection,
  StyledRiskNote,
  StyledSearchWrap,
  StyledStatusGroup,
  StyledStatusPill,
  StyledScreenContent,
  StyledSummaryBar,
  StyledTimeline,
  StyledTimelineItem,
};
