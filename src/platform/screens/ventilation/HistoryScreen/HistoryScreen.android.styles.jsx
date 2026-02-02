/**
 * HistoryScreen Android Styles
 * File: HistoryScreen.android.styles.jsx
 */
import styled from 'styled-components/native';
import { View } from 'react-native';

const StyledContainer = styled(View).withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledBanner = styled(View).withConfig({
  displayName: 'StyledBanner',
  componentId: 'StyledBanner',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.status?.warning?.background ?? '#FFF3CD'};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-left-width: 4px;
  border-left-color: ${({ theme }) => theme.colors.status?.warning?.text ?? theme.colors?.warning ?? '#856404'};
`;

const StyledErrorBanner = styled(View).withConfig({
  displayName: 'StyledErrorBanner',
  componentId: 'StyledErrorBanner',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.status?.error?.background ?? '#FFEBEE'};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-left-width: 4px;
  border-left-color: ${({ theme }) => theme.colors.status?.error?.text ?? theme.colors?.error ?? '#C62828'};
`;

const StyledEmpty = styled(View).withConfig({
  displayName: 'StyledEmpty',
  componentId: 'StyledEmpty',
})`
  padding: ${({ theme }) => theme.spacing.xl}px;
  align-items: center;
`;

const StyledItem = styled(View).withConfig({
  displayName: 'StyledItem',
  componentId: 'StyledItem',
})`
  padding: ${({ theme }) => theme.spacing.md}px ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radius.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  elevation: 2;
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

const StyledItemMeta = styled(View).withConfig({
  displayName: 'StyledItemMeta',
  componentId: 'StyledItemMeta',
})`
  flex: 1;
  min-width: 0;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
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

const StyledModalOverlay = styled(View).withConfig({
  displayName: 'StyledModalOverlay',
  componentId: 'StyledModalOverlay',
})`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledConfirmBox = styled(View).withConfig({
  displayName: 'StyledConfirmBox',
  componentId: 'StyledConfirmBox',
})`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  min-width: 280px;
`;

const StyledConfirmActions = styled(View).withConfig({
  displayName: 'StyledConfirmActions',
  componentId: 'StyledConfirmActions',
})`
  flex-direction: row;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export {
  StyledBanner,
  StyledConfirmActions,
  StyledConfirmBox,
  StyledContainer,
  StyledEmpty,
  StyledErrorBanner,
  StyledItem,
  StyledItemActions,
  StyledItemMeta,
  StyledItemRow,
  StyledModalOverlay,
};
