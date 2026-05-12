/**
 * ReviewQueueScreen Web Styles
 * File: ReviewQueueScreen.web.styles.jsx
 */

import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'ReviewQueueStyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  padding: ${({ theme }) => theme.spacing.xl}px ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  box-sizing: border-box;
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'ReviewQueueStyledContent',
})`
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledHeader = styled.header.withConfig({
  displayName: 'StyledHeader',
  componentId: 'ReviewQueueStyledHeader',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSummaryRow = styled.section.withConfig({
  displayName: 'StyledSummaryRow',
  componentId: 'ReviewQueueStyledSummaryRow',
})`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSummaryItem = styled.div.withConfig({
  displayName: 'StyledSummaryItem',
  componentId: 'ReviewQueueStyledSummaryItem',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const StyledFilterRow = styled.div.withConfig({
  displayName: 'StyledFilterRow',
  componentId: 'ReviewQueueStyledFilterRow',
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledList = styled.ul.withConfig({
  displayName: 'StyledList',
  componentId: 'ReviewQueueStyledList',
})`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledItem = styled.li.withConfig({
  displayName: 'StyledItem',
  componentId: 'ReviewQueueStyledItem',
})`
  padding: ${({ theme }) => theme.spacing.lg}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.primary};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledMetaRow = styled.div.withConfig({
  displayName: 'StyledMetaRow',
  componentId: 'ReviewQueueStyledMetaRow',
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
`;

const StyledActionRow = styled.div.withConfig({
  displayName: 'StyledActionRow',
  componentId: 'ReviewQueueStyledActionRow',
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledBanner = styled.div.withConfig({
  displayName: 'StyledBanner',
  componentId: 'ReviewQueueStyledBanner',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  border-left: 4px solid ${({ theme }) => theme.colors.status?.warning?.text ?? '#856404'};
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
