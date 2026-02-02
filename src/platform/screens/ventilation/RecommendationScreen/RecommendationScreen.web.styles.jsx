/**
 * RecommendationScreen Web Styles
 * Word-like document layout. File: RecommendationScreen.web.styles.jsx
 */
import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  padding: ${({ theme }) => theme.spacing.xl}px ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl}px;
  box-sizing: border-box;

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    flex-direction: row;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.xl}px;
  }
`;

const StyledContentPane = styled.section.withConfig({
  displayName: 'StyledContentPane',
  componentId: 'StyledContentPane',
})`
  flex: 1;
  min-width: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    max-width: 640px;
  }
`;

const StyledSummaryPane = styled.aside.withConfig({
  displayName: 'StyledSummaryPane',
  componentId: 'StyledSummaryPane',
})`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius?.md ?? 8}px;
  padding: ${({ theme }) => theme.spacing.xl}px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    width: 320px;
    flex-shrink: 0;
    position: sticky;
    top: ${({ theme }) => theme.spacing.xl}px;
  }
`;

const StyledSection = styled.section.withConfig({
  displayName: 'StyledSection',
  componentId: 'StyledSection',
})`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledSectionHeader = styled.header.withConfig({
  displayName: 'StyledSectionHeader',
  componentId: 'StyledSectionHeader',
})`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  cursor: ${({ $collapsible }) => ($collapsible ? 'pointer' : 'default')};
`;

const StyledSectionTitle = styled.h3.withConfig({
  displayName: 'StyledSectionTitle',
  componentId: 'StyledSectionTitle',
})`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledSectionBody = styled.div.withConfig({
  displayName: 'StyledSectionBody',
  componentId: 'StyledSectionBody',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledSettingsGrid = styled.dl.withConfig({
  displayName: 'StyledSettingsGrid',
  componentId: 'StyledSettingsGrid',
})`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.lg}px;
  margin: 0;
`;

const StyledSettingsRow = styled.div.withConfig({
  displayName: 'StyledSettingsRow',
  componentId: 'StyledSettingsRow',
})`
  display: contents;
`;

const StyledSettingsTerm = styled.dt.withConfig({
  displayName: 'StyledSettingsTerm',
  componentId: 'StyledSettingsTerm',
})`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const StyledSettingsValue = styled.dd.withConfig({
  displayName: 'StyledSettingsValue',
  componentId: 'StyledSettingsValue',
})`
  margin: 0;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const StyledList = styled.ul.withConfig({
  displayName: 'StyledList',
  componentId: 'StyledList',
})`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledListItem = styled.li.withConfig({
  displayName: 'StyledListItem',
  componentId: 'StyledListItem',
})`
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledEvidenceItem = styled.div.withConfig({
  displayName: 'StyledEvidenceItem',
  componentId: 'StyledEvidenceItem',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledCaseLink = styled.a.withConfig({
  displayName: 'StyledCaseLink',
  componentId: 'StyledCaseLink',
})`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const StyledWarningBox = styled.div.withConfig({
  displayName: 'StyledWarningBox',
  componentId: 'StyledWarningBox',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.status?.warning?.background ?? '#FFF3CD'};
  color: ${({ theme }) => theme.colors.status?.warning?.text ?? '#856404'};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-left: 4px solid ${({ theme }) => theme.colors.status?.warning?.text ?? theme.colors?.warning ?? '#856404'};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  line-height: 1.5;
`;

const StyledActionsRow = styled.div.withConfig({
  displayName: 'StyledActionsRow',
  componentId: 'StyledActionsRow',
})`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  flex-wrap: wrap;
`;

const StyledBadge = styled.span.withConfig({
  displayName: 'StyledBadge',
  componentId: 'StyledBadge',
})`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  background-color: ${({ theme, $tier }) => {
    if ($tier === 'high') return theme.colors.success + '20';
    if ($tier === 'medium') return theme.colors.warning + '20';
    return theme.colors.error + '20';
  }};
  color: ${({ theme, $tier }) => {
    if ($tier === 'high') return theme.colors.success;
    if ($tier === 'medium') return theme.colors.warning;
    return theme.colors.error;
  }};
`;

export {
  StyledActionsRow,
  StyledBadge,
  StyledCaseLink,
  StyledContainer,
  StyledContentPane,
  StyledEvidenceItem,
  StyledList,
  StyledListItem,
  StyledSection,
  StyledSectionBody,
  StyledSectionHeader,
  StyledSectionTitle,
  StyledSettingsGrid,
  StyledSettingsRow,
  StyledSettingsTerm,
  StyledSettingsValue,
  StyledSummaryPane,
  StyledWarningBox,
};
