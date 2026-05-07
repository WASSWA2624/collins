/**
 * Tracking screen web styles
 * File: HistoryScreen.web.styles.jsx
 */
import styled from 'styled-components';

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

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  padding: ${({ theme }) => theme.spacing.xl}px
    ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;
  box-sizing: border-box;
`;

const StyledHeader = styled.header.withConfig({
  displayName: 'StyledHeader',
  componentId: 'StyledHeader',
})`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md}px;

  @media (max-width: ${({ theme }) =>
      (theme.breakpoints?.tablet ?? 768) - 1}px) {
    flex-direction: column;
  }
`;

const StyledHeaderActions = styled.div.withConfig({
  displayName: 'StyledHeaderActions',
  componentId: 'StyledHeaderActions',
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSummaryBar = styled.section.withConfig({
  displayName: 'StyledSummaryBar',
  componentId: 'StyledSummaryBar',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 0;
`;

const StyledBanner = styled.div.withConfig({
  displayName: 'StyledBanner',
  componentId: 'StyledBanner',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) =>
    theme.colors.status?.warning?.background ?? '#FFF3CD'};
  color: ${({ theme }) => theme.colors.status?.warning?.text ?? '#856404'};
  border-radius: 0;
  border-left: 4px solid
    ${({ theme }) => theme.colors.status?.warning?.text ?? '#856404'};
`;

const StyledErrorBanner = styled.div.withConfig({
  displayName: 'StyledErrorBanner',
  componentId: 'StyledErrorBanner',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) =>
    theme.colors.status?.error?.background ?? '#FFEBEE'};
  color: ${({ theme }) => theme.colors.status?.error?.text ?? '#C62828'};
  border-radius: 0;
  border-left: 4px solid
    ${({ theme }) => theme.colors.status?.error?.text ?? '#C62828'};
`;

const StyledEmpty = styled.div.withConfig({
  displayName: 'StyledEmpty',
  componentId: 'StyledEmpty',
})`
  padding: ${({ theme }) => theme.spacing.xl}px;
  min-height: 220px;
  text-align: center;
  border: 1px dashed ${({ theme }) => theme.colors.background.tertiary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledEmptyActions = styled.div.withConfig({
  displayName: 'StyledEmptyActions',
  componentId: 'StyledEmptyActions',
})`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
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
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledItem = styled.li.withConfig({
  displayName: 'StyledItem',
  componentId: 'StyledItem',
})`
  padding: ${({ theme }) => theme.spacing.md}px
    ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: 0;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;

  &:hover {
    border-color: ${({ theme }) => theme.colors.text.tertiary};
  }

  @media (max-width: ${({ theme }) =>
      (theme.breakpoints?.tablet ?? 768) - 1}px) {
    padding: ${({ theme }) => theme.spacing.sm}px
      ${({ theme }) => theme.spacing.md}px;
  }
`;

const StyledItemRow = styled.div.withConfig({
  displayName: 'StyledItemRow',
  componentId: 'StyledItemRow',
})`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledItemMain = styled.div.withConfig({
  displayName: 'StyledItemMain',
  componentId: 'StyledItemMain',
})`
  flex: 1;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledItemTitle = styled.div.withConfig({
  displayName: 'StyledItemTitle',
  componentId: 'StyledItemTitle',
})`
  font-weight: ${({ theme }) => theme.typography?.fontWeight?.semibold ?? 600};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledItemMeta = styled.div.withConfig({
  displayName: 'StyledItemMeta',
  componentId: 'StyledItemMeta',
})`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledItemMetaLine = styled.span.withConfig({
  displayName: 'StyledItemMetaLine',
  componentId: 'StyledItemMetaLine',
})`
  display: inline;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledStatusGroup = styled.div.withConfig({
  displayName: 'StyledStatusGroup',
  componentId: 'StyledStatusGroup',
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledStatusPill = styled.span.withConfig({
  displayName: 'StyledStatusPill',
  componentId: 'StyledStatusPill',
})`
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 2px ${({ theme }) => theme.spacing.sm}px;
  border-radius: 0;
  border: 1px solid ${({ theme, $level }) => statusBorder(theme, $level)};
  background-color: ${({ theme, $level }) => statusBackground(theme, $level)};
`;

const StyledItemActions = styled.div.withConfig({
  displayName: 'StyledItemActions',
  componentId: 'StyledItemActions',
})`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex-shrink: 0;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledDetailPanel = styled.section.withConfig({
  displayName: 'StyledDetailPanel',
  componentId: 'StyledDetailPanel',
})`
  padding: ${({ theme }) => theme.spacing.lg}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledTimeline = styled.ul.withConfig({
  displayName: 'StyledTimeline',
  componentId: 'StyledTimeline',
})`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledTimelineItem = styled.li.withConfig({
  displayName: 'StyledTimelineItem',
  componentId: 'StyledTimelineItem',
})`
  padding-left: ${({ theme }) => theme.spacing.sm}px;
  border-left: 2px solid ${({ theme }) => theme.colors.background.tertiary};
`;

export {
  StyledBanner,
  StyledContainer,
  StyledDetailPanel,
  StyledEmpty,
  StyledEmptyActions,
  StyledErrorBanner,
  StyledHeader,
  StyledHeaderActions,
  StyledItem,
  StyledItemActions,
  StyledItemMain,
  StyledItemMeta,
  StyledItemMetaLine,
  StyledItemRow,
  StyledItemTitle,
  StyledList,
  StyledStatusGroup,
  StyledStatusPill,
  StyledSummaryBar,
  StyledTimeline,
  StyledTimelineItem,
};
