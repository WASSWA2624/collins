/**
 * HistoryScreen Web Styles
 * File: HistoryScreen.web.styles.jsx
 */
import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  padding: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  display: flex;
  flex-direction: column;
`;

const StyledBanner = styled.div.withConfig({
  displayName: 'StyledBanner',
  componentId: 'StyledBanner',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.status?.warning?.background ?? '#FFF3CD'};
  color: ${({ theme }) => theme.colors.status?.warning?.text ?? '#856404'};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-left: 4px solid ${({ theme }) => theme.colors.status?.warning?.text ?? theme.colors?.warning ?? '#856404'};
`;

const StyledErrorBanner = styled.div.withConfig({
  displayName: 'StyledErrorBanner',
  componentId: 'StyledErrorBanner',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.status?.error?.background ?? '#FFEBEE'};
  color: ${({ theme }) => theme.colors.status?.error?.text ?? '#C62828'};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-left: 4px solid ${({ theme }) => theme.colors.status?.error?.text ?? theme.colors?.error ?? '#C62828'};
`;

const StyledEmpty = styled.div.withConfig({
  displayName: 'StyledEmpty',
  componentId: 'StyledEmpty',
})`
  padding: ${({ theme }) => theme.spacing.xl}px;
  text-align: center;
`;

const StyledList = styled.ul.withConfig({
  displayName: 'StyledList',
  componentId: 'StyledList',
})`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledItem = styled.li.withConfig({
  displayName: 'StyledItem',
  componentId: 'StyledItem',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledItemRow = styled.div.withConfig({
  displayName: 'StyledItemRow',
  componentId: 'StyledItemRow',
})`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledItemMeta = styled.div.withConfig({
  displayName: 'StyledItemMeta',
  componentId: 'StyledItemMeta',
})`
  flex: 1;
  min-width: 0;
`;

const StyledItemActions = styled.div.withConfig({
  displayName: 'StyledItemActions',
  componentId: 'StyledItemActions',
})`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledModalOverlay = styled.div.withConfig({
  displayName: 'StyledModalOverlay',
  componentId: 'StyledModalOverlay',
})`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.overlay?.backdrop ?? 'rgba(0,0,0,0.5)'};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg}px;
  z-index: 1000;
`;

const StyledConfirmBox = styled.div.withConfig({
  displayName: 'StyledConfirmBox',
  componentId: 'StyledConfirmBox',
})`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  min-width: 280px;
  max-width: 100%;
`;

const StyledConfirmActions = styled.div.withConfig({
  displayName: 'StyledConfirmActions',
  componentId: 'StyledConfirmActions',
})`
  display: flex;
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
  StyledList,
  StyledModalOverlay,
};
