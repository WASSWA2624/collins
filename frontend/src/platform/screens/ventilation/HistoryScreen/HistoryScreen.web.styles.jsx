/**
 * Tracking screen web styles
 * File: HistoryScreen.web.styles.jsx
 */
import styled, { createGlobalStyle } from 'styled-components';

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

  @media print {
    width: auto;
    max-width: none;
    min-height: 0;
    margin: 0;
    padding: 0;
    display: block;
    background: #ffffff;
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
  position: relative;
  z-index: 20;
  display: grid;
  grid-template-columns: minmax(260px, 520px) minmax(220px, 1fr);
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.md}px;

  @media (max-width: ${({ theme }) =>
      (theme.breakpoints?.desktop ?? 1024) - 1}px) {
    grid-template-columns: 1fr;
  }
`;

const StyledFacilityFilter = styled.section.withConfig({
  displayName: 'StyledFacilityFilter',
  componentId: 'StyledFacilityFilter',
})`
  position: relative;
  z-index: 30;
  min-width: 0;
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
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const listGridColumns =
  '44px minmax(76px, 0.75fr) minmax(160px, 1.6fr) minmax(128px, 1fr) minmax(118px, 0.9fr)';

const StyledListHeader = styled.li.withConfig({
  displayName: 'StyledListHeader',
  componentId: 'StyledListHeader',
})`
  min-height: 34px;
  min-width: 640px;
  display: grid;
  grid-template-columns: ${listGridColumns};
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.xs}px
    ${({ theme }) => theme.spacing.sm}px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.secondary};
  box-sizing: border-box;
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: 600;
`;

const StyledListHeaderCell = styled.span.withConfig({
  displayName: 'StyledListHeaderCell',
  componentId: 'StyledListHeaderCell',
})`
  min-width: 0;
  overflow-wrap: anywhere;
  white-space: normal;
`;

const StyledItem = styled.li.withConfig({
  displayName: 'StyledItem',
  componentId: 'StyledItem',
})`
  margin: 0;
  padding: 0;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};

  &:last-child {
    border-bottom: 0;
  }
`;

const StyledPatientRowButton = styled.button.withConfig({
  displayName: 'StyledPatientRowButton',
  componentId: 'StyledPatientRowButton',
})`
  width: 100%;
  min-height: 38px;
  min-width: 640px;
  display: grid;
  grid-template-columns: ${listGridColumns};
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.xs}px
    ${({ theme }) => theme.spacing.sm}px;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: left;
  cursor: pointer;
  box-sizing: border-box;

  &:hover,
  &:focus-visible {
    background: ${({ theme }) => theme.colors.background.secondary};
    outline: none;
  }
`;

const StyledPatientRowCell = styled.span.withConfig({
  displayName: 'StyledPatientRowCell',
  componentId: 'StyledPatientRowCell',
})`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledPatientRowNumber = styled(StyledPatientRowCell).withConfig({
  displayName: 'StyledPatientRowNumber',
  componentId: 'StyledPatientRowNumber',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-variant-numeric: tabular-nums;
  text-align: right;
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

  @media print {
    display: block;
    padding: 0;
    border: 0;
    background: #ffffff;
  }
`;

const StyledScreenOnlyDetail = styled.div.withConfig({
  displayName: 'StyledScreenOnlyDetail',
  componentId: 'StyledScreenOnlyDetail',
})`
  display: contents;

  @media print {
    display: none !important;
  }
`;

const StyledPatientDataSection = styled.section.withConfig({
  displayName: 'StyledPatientDataSection',
  componentId: 'StyledPatientDataSection',
})`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledPatientDataGrid = styled.div.withConfig({
  displayName: 'StyledPatientDataGrid',
  componentId: 'StyledPatientDataGrid',
})`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(180px, 100%), 1fr));
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledPatientDataItem = styled.div.withConfig({
  displayName: 'StyledPatientDataItem',
  componentId: 'StyledPatientDataItem',
})`
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.xs}px
    ${({ theme }) => theme.spacing.sm}px;
  border-left: 3px solid ${({ theme }) => theme.colors.primary ?? '#007AFF'};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  display: grid;
  gap: 2px;

  > * {
    min-width: 0;
    overflow-wrap: anywhere;
  }
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

const StyledPrintDocument = styled.div.withConfig({
  displayName: 'StyledPrintDocument',
  componentId: 'StyledPrintDocument',
})`
  display: none;

  @media print {
    display: block;
    width: auto;
    max-width: 100%;
    color: #0f172a;
    background: #ffffff;
    font-size: 12.5px;
    line-height: 1.32;
    box-sizing: border-box;
  }
`;

const StyledPrintDocumentHeader = styled.div.withConfig({
  displayName: 'StyledPrintDocumentHeader',
  componentId: 'StyledPrintDocumentHeader',
})`
  display: grid;
  gap: 7px;
  padding: 0 0 10px;
  margin: 0 0 12px;
  border-bottom: 2px solid #0f172a;
  break-after: avoid;
  page-break-after: avoid;
`;

const StyledPrintTitle = styled.span.withConfig({
  displayName: 'StyledPrintTitle',
  componentId: 'StyledPrintTitle',
})`
  margin: 0;
  font-size: 23px;
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: 0;
`;

const StyledPrintSubtitle = styled.div.withConfig({
  displayName: 'StyledPrintSubtitle',
  componentId: 'StyledPrintSubtitle',
})`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  gap: 6px 14px;
  color: #334155;
  font-size: 12px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const StyledPrintMeta = styled.div.withConfig({
  displayName: 'StyledPrintMeta',
  componentId: 'StyledPrintMeta',
})`
  display: flex;
  flex-wrap: wrap;
  gap: 3px 10px;

  span {
    min-width: 0;
    overflow-wrap: anywhere;
  }
`;

const StyledPrintMetaItem = styled.span.withConfig({
  displayName: 'StyledPrintMetaItem',
  componentId: 'StyledPrintMetaItem',
})`
  min-width: 0;
  overflow-wrap: anywhere;
`;

const StyledPrintSection = styled.div.withConfig({
  displayName: 'StyledPrintSection',
  componentId: 'StyledPrintSection',
})`
  margin: 0 0 12px;
  break-inside: auto;
  page-break-inside: auto;
`;

const StyledPrintSectionTitle = styled.span.withConfig({
  displayName: 'StyledPrintSectionTitle',
  componentId: 'StyledPrintSectionTitle',
})`
  display: block;
  margin: 0;
  padding: 5px 8px;
  border-top: 2px solid #0f172a;
  border-right: 1px solid #cbd5e1;
  border-bottom: 1px solid #cbd5e1;
  border-left: 1px solid #cbd5e1;
  background: #f1f5f9;
  color: #0f172a;
  font-size: 13px;
  line-height: 1.18;
  font-weight: 700;
  letter-spacing: 0;
  break-after: avoid;
  page-break-after: avoid;
`;

const StyledPrintSubsection = styled.div.withConfig({
  displayName: 'StyledPrintSubsection',
  componentId: 'StyledPrintSubsection',
})`
  margin: 0 0 9px;
  break-inside: auto;
  page-break-inside: auto;
`;

const StyledPrintSubsectionTitle = styled.span.withConfig({
  displayName: 'StyledPrintSubsectionTitle',
  componentId: 'StyledPrintSubsectionTitle',
})`
  display: block;
  margin: 0;
  padding: 5px 8px;
  border: 1px solid #cbd5e1;
  border-bottom: 0;
  background: #f8fafc;
  color: #1e293b;
  font-size: 12px;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: 0;
  break-after: avoid;
  page-break-after: avoid;
`;

const StyledPrintGrid = styled.div.withConfig({
  displayName: 'StyledPrintGrid',
  componentId: 'StyledPrintGrid',
})`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 0;
  border-top: 1px solid #cbd5e1;
  border-left: 1px solid #cbd5e1;
  background: #ffffff;

  @media print and (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const StyledPrintField = styled.div.withConfig({
  displayName: 'StyledPrintField',
  componentId: 'StyledPrintField',
})`
  display: grid;
  grid-template-columns: minmax(92px, 34%) minmax(0, 1fr);
  align-items: stretch;
  min-width: 0;
  min-height: 26px;
  padding: 0;
  border-right: 1px solid #cbd5e1;
  border-bottom: 1px solid #cbd5e1;
  background: #ffffff;
  break-inside: avoid;
  page-break-inside: avoid;

  &:last-child:nth-child(odd) {
    grid-column: 1 / -1;
  }
`;

const StyledPrintFieldLabel = styled.span.withConfig({
  displayName: 'StyledPrintFieldLabel',
  componentId: 'StyledPrintFieldLabel',
})`
  display: flex;
  align-items: center;
  min-width: 0;
  margin: 0;
  padding: 4px 6px;
  border-right: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #475569;
  font-size: 10.5px;
  font-weight: 700;
  overflow-wrap: anywhere;
`;

const StyledPrintFieldValue = styled.span.withConfig({
  displayName: 'StyledPrintFieldValue',
  componentId: 'StyledPrintFieldValue',
})`
  display: flex;
  align-items: center;
  margin: 0;
  min-width: 0;
  padding: 4px 7px;
  color: #0f172a;
  font-size: 11.5px;
  overflow-wrap: anywhere;
`;

const StyledPrintTimeline = styled.div.withConfig({
  displayName: 'StyledPrintTimeline',
  componentId: 'StyledPrintTimeline',
})`
  margin: 0;
  padding: 0;
  display: grid;
  gap: 7px;
`;

const StyledPrintTimelineItem = styled.div.withConfig({
  displayName: 'StyledPrintTimelineItem',
  componentId: 'StyledPrintTimelineItem',
})`
  padding: 0;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  break-inside: auto;
  page-break-inside: auto;
`;

const StyledPrintTimelineTitle = styled.div.withConfig({
  displayName: 'StyledPrintTimelineTitle',
  componentId: 'StyledPrintTimelineTitle',
})`
  display: flex;
  flex-wrap: wrap;
  gap: 3px 10px;
  margin: 0;
  padding: 5px 8px;
  border-bottom: 1px solid #cbd5e1;
  background: #f8fafc;
  font-weight: 700;
  break-after: avoid;
  page-break-after: avoid;

  span:last-child {
    color: #4b5563;
    font-weight: 400;
  }
`;

const StyledPrintTimelineText = styled.span.withConfig({
  displayName: 'StyledPrintTimelineText',
  componentId: 'StyledPrintTimelineText',
})`
  min-width: 0;
  overflow-wrap: anywhere;
`;

const TrackingPrintStyles = createGlobalStyle`
  @media print {
    @page {
      size: auto;
      margin: 14mm 16mm;
    }

    html,
    body,
    #root,
    [data-reactroot] {
      width: auto !important;
      min-width: 0 !important;
      max-width: none !important;
      height: auto !important;
      min-height: 0 !important;
      max-height: none !important;
      overflow: visible !important;
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body > *:not([data-print-document='true']) {
      display: none !important;
    }

    [data-print-document='true'],
    [data-print-document='true'] * {
      visibility: visible !important;
      box-sizing: border-box !important;
    }

    [data-print-document='true'] {
      display: block !important;
      position: static !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      max-width: none !important;
      min-width: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: visible !important;
      border: 0 !important;
      background: #ffffff !important;
      color: #0f172a !important;
      box-shadow: none !important;
      box-sizing: border-box !important;
    }

    [data-print-section='true'] {
      break-inside: auto;
      page-break-inside: auto;
    }

    [data-print-section='true'] > span:first-child {
      break-after: avoid;
      page-break-after: avoid;
    }

    [data-print-hidden='true'] {
      display: none !important;
    }
  }
`;

export {
  StyledBanner,
  StyledContainer,
  StyledControlsRow,
  StyledDetailPanel,
  StyledEmpty,
  StyledEmptyActions,
  StyledErrorBanner,
  StyledFacilityFilter,
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
  StyledListHeader,
  StyledListHeaderCell,
  StyledPatientRowButton,
  StyledPatientRowCell,
  StyledPatientRowNumber,
  StyledPatientDataGrid,
  StyledPatientDataItem,
  StyledPatientDataSection,
  StyledPrintDocument,
  StyledPrintDocumentHeader,
  StyledPrintField,
  StyledPrintFieldLabel,
  StyledPrintFieldValue,
  StyledPrintGrid,
  StyledPrintMetaItem,
  StyledPrintMeta,
  StyledPrintSection,
  StyledPrintSectionTitle,
  StyledPrintSubsection,
  StyledPrintSubsectionTitle,
  StyledPrintSubtitle,
  StyledPrintTimeline,
  StyledPrintTimelineItem,
  StyledPrintTimelineText,
  StyledPrintTimelineTitle,
  StyledPrintTitle,
  StyledRiskNote,
  StyledScreenOnlyDetail,
  StyledSearchWrap,
  StyledStatusGroup,
  StyledStatusPill,
  StyledSummaryBar,
  StyledTimeline,
  StyledTimelineItem,
  TrackingPrintStyles,
};
