/**
 * ReviewQueueScreen Android Styles
 * File: ReviewQueueScreen.android.styles.jsx
 */

import styled from 'styled-components/native';
import { ScrollView, View } from 'react-native';

const StyledContainer = styled(ScrollView).withConfig({
  displayName: 'StyledContainer',
  componentId: 'ReviewQueueStyledContainer',
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled(View).withConfig({
  displayName: 'StyledContent',
  componentId: 'ReviewQueueStyledContent',
})`
  padding: ${({ theme }) => theme.spacing.lg}px;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledHeader = styled(View).withConfig({
  displayName: 'StyledHeader',
  componentId: 'ReviewQueueStyledHeader',
})`
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSummaryRow = styled(View).withConfig({
  displayName: 'StyledSummaryRow',
  componentId: 'ReviewQueueStyledSummaryRow',
})`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSummaryItem = styled(View).withConfig({
  displayName: 'StyledSummaryItem',
  componentId: 'ReviewQueueStyledSummaryItem',
})`
  min-width: 132px;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const StyledFilterRow = styled(View).withConfig({
  displayName: 'StyledFilterRow',
  componentId: 'ReviewQueueStyledFilterRow',
})`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledList = styled(View).withConfig({
  displayName: 'StyledList',
  componentId: 'ReviewQueueStyledList',
})`
  gap: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledItem = styled(View).withConfig({
  displayName: 'StyledItem',
  componentId: 'ReviewQueueStyledItem',
})`
  padding: ${({ theme }) => theme.spacing.lg}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.primary};
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledMetaRow = styled(View).withConfig({
  displayName: 'StyledMetaRow',
  componentId: 'ReviewQueueStyledMetaRow',
})`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledActionRow = styled(View).withConfig({
  displayName: 'StyledActionRow',
  componentId: 'ReviewQueueStyledActionRow',
})`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledBanner = styled(View).withConfig({
  displayName: 'StyledBanner',
  componentId: 'ReviewQueueStyledBanner',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  border-left-width: 4px;
  border-left-color: ${({ theme }) => theme.colors.status?.warning?.text ?? '#856404'};
  background-color: ${({ theme }) => theme.colors.status?.warning?.background ?? '#FFF3CD'};
`;

export {
  StyledActionRow,
  StyledBanner,
  StyledContainer,
  StyledContent,
  StyledFilterRow,
  StyledHeader,
  StyledItem,
  StyledList,
  StyledMetaRow,
  StyledSummaryItem,
  StyledSummaryRow,
};
