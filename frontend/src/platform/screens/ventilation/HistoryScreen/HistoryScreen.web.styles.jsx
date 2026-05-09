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

const bannerLevel = (tone) => (tone === 'success' ? 'green' : 'yellow');

const compactButtonStyles = ({ theme }) => `
  min-height: 36px;
  padding: ${theme.spacing.xs}px ${theme.spacing.md}px;
  border-radius: 2px;
`;

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  width: 100%;
  max-width: 1240px;
  min-height: 100%;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl}px
    ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
  box-sizing: border-box;

  @media (max-width: ${({ theme }) =>
      (theme.breakpoints?.tablet ?? 768) - 1}px) {
    padding: ${({ theme }) => theme.spacing.lg}px
      ${({ theme }) => theme.spacing.md}px;
  }
`;

const StyledHeader = styled.header.withConfig({
  displayName: 'StyledHeader',
  componentId: 'StyledHeader',
})`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.spacing.sm}px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};

  @media (max-width: ${({ theme }) =>
      (theme.breakpoints?.tablet ?? 768) - 1}px) {
    flex-direction: column;
  }
`;

const StyledHeaderCopy = styled.div.withConfig({
  displayName: 'StyledHeaderCopy',
  componentId: 'StyledHeaderCopy',
})`
  min-width: 0;
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs}px;

  > h1,
  > span {
    display: block;
    min-width: 0;
    overflow-wrap: anywhere;
  }

  > span {
    max-width: 720px;
  }
`;

const StyledHeaderActions = styled.div.withConfig({
  displayName: 'StyledHeaderActions',
  componentId: 'StyledHeaderActions',
})`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm}px;

  button {
    ${compactButtonStyles}
    flex-shrink: 0;
  }

  @media (max-width: ${({ theme }) =>
      (theme.breakpoints?.tablet ?? 768) - 1}px) {
    justify-content: flex-start;
  }
`;

const StyledControlsRow = styled.section.withConfig({
  displayName: 'StyledControlsRow',
  componentId: 'StyledControlsRow',
})`
  display: grid;
  grid-template-columns: minmax(260px, 520px) minmax(220px, 1fr);
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.md}px;

  @media (max-width: ${({ theme }) =>
      (theme.breakpoints?.desktop ?? 1024) - 1}px) {
    grid-template-columns: 1fr;
  }
`;

const StyledSearchWrap = styled.div.withConfig({
  displayName: 'StyledSearchWrap',
  componentId: 'StyledSearchWrap',
})`
  width: 100%;
  min-width: 0;

  button {
    ${compactButtonStyles}
    min-width: 36px;
  }

  input[type='search'] {
    min-height: 20px;
  }
`;

const StyledSummaryBar = styled.section.withConfig({
  displayName: 'StyledSummaryBar',
  componentId: 'StyledSummaryBar',
})`
  min-width: 0;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md}px;
  padding: ${({ theme }) => theme.spacing.sm}px
    ${({ theme }) => theme.spacing.md}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 0;
  box-sizing: border-box;

  > * {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  > *:last-child {
    flex-shrink: 0;
    text-align: right;
  }

  @media (max-width: ${({ theme }) =>
      (theme.breakpoints?.tablet ?? 768) - 1}px) {
    align-items: flex-start;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs}px;

    > *:last-child {
      text-align: left;
    }
  }
`;

const StyledBanner = styled.div.withConfig({
  displayName: 'StyledBanner',
  componentId: 'StyledBanner',
})`
  padding: ${({ theme }) => theme.spacing.sm}px
    ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme, $tone }) =>
    statusBackground(theme, bannerLevel($tone))};
  color: ${({ theme, $tone }) => statusBorder(theme, bannerLevel($tone))};
  border-radius: 0;
  border-left: 4px solid
    ${({ theme, $tone }) => statusBorder(theme, bannerLevel($tone))};
`;

const StyledErrorBanner = styled.div.withConfig({
  displayName: 'StyledErrorBanner',
  componentId: 'StyledErrorBanner',
})`
  padding: ${({ theme }) => theme.spacing.sm}px
    ${({ theme }) => theme.spacing.md}px;
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
  padding: ${({ theme }) => theme.spacing.lg}px;
  min-height: 180px;
  text-align: center;
  border: 1px dashed ${({ theme }) => theme.colors.background.tertiary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledEmptyActions = styled.div.withConfig({
  displayName: 'StyledEmptyActions',
  componentId: 'StyledEmptyActions',
})`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;

  button {
    ${compactButtonStyles}
  }
`;

const StyledList = styled.ul.withConfig({
  displayName: 'StyledList',
  componentId: 'StyledList',
})`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md}px;

  @media (min-width: ${({ theme }) => theme.breakpoints?.desktop ?? 1024}px) {
    grid-template-columns: repeat(auto-fit, minmax(min(420px, 100%), 1fr));
  }
`;

const StyledItem = styled.li.withConfig({
  displayName: 'StyledItem',
  componentId: 'StyledItem',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: 0;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
  transition:
    border-color 0.16s ease,
    background-color 0.16s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.text.tertiary};
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }
`;

const StyledItemRow = styled.div.withConfig({
  displayName: 'StyledItemRow',
  componentId: 'StyledItemRow',
})`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
`;

const StyledItemMain = styled.div.withConfig({
  displayName: 'StyledItemMain',
  componentId: 'StyledItemMain',
})`
  flex: 1 1 220px;
  min-width: 0;
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
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;

  > * {
    min-width: 0;
    overflow-wrap: anywhere;
  }
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
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledStatusPill = styled.span.withConfig({
  displayName: 'StyledStatusPill',
  componentId: 'StyledStatusPill',
})`
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 1px ${({ theme }) => theme.spacing.sm}px;
  border-radius: 2px;
  border: 1px solid ${({ theme, $level }) => statusBorder(theme, $level)};
  background-color: ${({ theme, $level }) => statusBackground(theme, $level)};
  box-sizing: border-box;
`;

const StyledItemActions = styled.div.withConfig({
  displayName: 'StyledItemActions',
  componentId: 'StyledItemActions',
})`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex-shrink: 0;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-left: auto;

  button {
    ${compactButtonStyles}
    min-width: 0;
  }

  @media (max-width: ${({ theme }) =>
      (theme.breakpoints?.tablet ?? 768) - 1}px) {
    width: 100%;
    justify-content: stretch;
    margin-left: 0;

    button {
      flex: 1 1 140px;
    }
  }
`;

const StyledRiskNote = styled.div.withConfig({
  displayName: 'StyledRiskNote',
  componentId: 'StyledRiskNote',
})`
  padding-left: ${({ theme }) => theme.spacing.sm}px;
  border-left: 3px solid ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledDetailPanel = styled.section.withConfig({
  displayName: 'StyledDetailPanel',
  componentId: 'StyledDetailPanel',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
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
  padding: ${({ theme }) => theme.spacing.xs}px 0
    ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-left: 2px solid ${({ theme }) => theme.colors.background.tertiary};
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
  StyledItemMetaLine,
  StyledItemRow,
  StyledItemTitle,
  StyledList,
  StyledRiskNote,
  StyledSearchWrap,
  StyledStatusGroup,
  StyledStatusPill,
  StyledSummaryBar,
  StyledTimeline,
  StyledTimelineItem,
};
