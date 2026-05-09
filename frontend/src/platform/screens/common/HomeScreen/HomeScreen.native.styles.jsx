/**
 * HomeScreen Native Styles
 * File: HomeScreen.native.styles.jsx
 */
import styled from 'styled-components/native';
import { Pressable, ScrollView, Text, View } from 'react-native';

const toneColor = (theme, tone) => {
  if (tone === 'error') return theme.colors.error;
  if (tone === 'warning') return theme.colors.warning;
  if (tone === 'success') return theme.colors.success;
  return theme.colors.primary;
};

const pageBackground = (theme) => {
  if (theme.mode === 'dark' || theme.mode === 'high-contrast') return theme.colors.background.primary;
  return '#F8FAFC';
};

const surfaceColor = (theme) => {
  if (theme.mode === 'dark') return theme.colors.background.secondary;
  return theme.colors.background.primary;
};

const softSurfaceColor = (theme) => {
  if (theme.mode === 'dark') return theme.colors.background.tertiary;
  if (theme.mode === 'high-contrast') return theme.colors.background.primary;
  return '#F8FAFC';
};

const selectedSurfaceColor = (theme) => {
  if (theme.mode === 'dark') return 'rgba(0, 122, 255, 0.18)';
  if (theme.mode === 'high-contrast') return theme.colors.background.primary;
  return '#EAF3FF';
};

const toneSurfaceColor = (theme, tone) => {
  if (tone === 'error') return theme.colors.status.error.background;
  if (tone === 'warning') return theme.colors.status.warning.background;
  if (tone === 'success') return theme.colors.status.success.background;
  return selectedSurfaceColor(theme);
};

const nativeShadow = (theme) => {
  if (theme.mode === 'dark' || theme.mode === 'high-contrast') return '';
  return `
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.08;
    shadow-radius: 8px;
    elevation: 2;
  `;
};

const StyledContainer = styled(ScrollView).withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  width: 100%;
  background-color: ${({ theme }) => pageBackground(theme)};
`;

const StyledShell = styled(View).withConfig({
  displayName: 'StyledShell',
  componentId: 'StyledShell',
})`
  width: 100%;
  max-width: 1120px;
  align-self: center;
  padding: ${({ theme, $compact }) => ($compact ? theme.spacing.md : theme.spacing.lg)}px ${({ theme, $compact }) => ($compact ? theme.spacing.sm : theme.spacing.lg)}px ${({ theme }) => theme.spacing.xl}px;
  gap: ${({ theme, $compact }) => ($compact ? theme.spacing.md : theme.spacing.lg)}px;
`;

const StyledHeader = styled(View).withConfig({
  displayName: 'StyledHeader',
  componentId: 'StyledHeader',
})`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => surfaceColor(theme)};
  ${({ theme }) => nativeShadow(theme)}
`;

const StyledLogoArea = styled(View).withConfig({
  displayName: 'StyledLogoArea',
  componentId: 'StyledLogoArea',
})`
  align-items: center;
  justify-content: center;
`;

const StyledHeaderCopy = styled(View).withConfig({
  displayName: 'StyledHeaderCopy',
  componentId: 'StyledHeaderCopy',
})`
  flex: 1;
  min-width: 0;
`;

const StyledMessage = styled(Text).withConfig({
  displayName: 'StyledMessage',
  componentId: 'StyledMessage',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  line-height: ${({ theme }) => Math.round(theme.typography.fontSize.sm * theme.typography.lineHeight.normal)}px;
`;

const StyledNoticeList = styled(View).withConfig({
  displayName: 'StyledNoticeList',
  componentId: 'StyledNoticeList',
})`
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledNoticeItem = styled(View).withConfig({
  displayName: 'StyledNoticeItem',
  componentId: 'StyledNoticeItem',
})`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  border-left-width: 4px;
  border-left-color: ${({ theme, $severity }) => toneColor(theme, $severity)};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => surfaceColor(theme)};
`;

const StyledNoticeMessage = styled(Text).withConfig({
  displayName: 'StyledNoticeMessage',
  componentId: 'StyledNoticeMessage',
})`
  flex: 1;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const StyledSection = styled(View).withConfig({
  displayName: 'StyledSection',
  componentId: 'StyledSection',
})`
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledSectionTitle = styled(Text).withConfig({
  displayName: 'StyledSectionTitle',
  componentId: 'StyledSectionTitle',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: ${({ theme }) => Math.round(theme.typography.fontSize.md * 1.3)}px;
`;

const StyledFacilityPanel = styled(View).withConfig({
  displayName: 'StyledFacilityPanel',
  componentId: 'StyledFacilityPanel',
})`
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => surfaceColor(theme)};
  ${({ theme }) => nativeShadow(theme)}
`;

const StyledFacilityHeader = styled(View).withConfig({
  displayName: 'StyledFacilityHeader',
  componentId: 'StyledFacilityHeader',
})`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledFacilityList = styled(View).withConfig({
  displayName: 'StyledFacilityList',
  componentId: 'StyledFacilityList',
})`
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledFacilityButton = styled(Pressable).withConfig({
  displayName: 'StyledFacilityButton',
  componentId: 'StyledFacilityButton',
})`
  min-height: 56px;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-color: ${({ theme, $selected }) => ($selected ? theme.colors.primary : theme.colors.background.tertiary)};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme, $selected }) => ($selected ? selectedSurfaceColor(theme) : softSurfaceColor(theme))};
`;

const StyledFacilityIcon = styled(View).withConfig({
  displayName: 'StyledFacilityIcon',
  componentId: 'StyledFacilityIcon',
})`
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ theme, $selected }) => ($selected ? theme.colors.primary : theme.colors.background.tertiary)};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme, $selected }) => ($selected ? theme.colors.primary : surfaceColor(theme))};
`;

const StyledFacilityBody = styled(View).withConfig({
  displayName: 'StyledFacilityBody',
  componentId: 'StyledFacilityBody',
})`
  flex: 1;
  min-width: 0;
`;

const StyledFacilityButtonText = styled(Text).withConfig({
  displayName: 'StyledFacilityButtonText',
  componentId: 'StyledFacilityButtonText',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: ${({ theme }) => Math.round(theme.typography.fontSize.sm * 1.35)}px;
`;

const StyledFacilityMeta = styled(Text).withConfig({
  displayName: 'StyledFacilityMeta',
  componentId: 'StyledFacilityMeta',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  line-height: ${({ theme }) => Math.round(theme.typography.fontSize.xs * 1.35)}px;
`;

const StyledFacilityChevron = styled(Text).withConfig({
  displayName: 'StyledFacilityChevron',
  componentId: 'StyledFacilityChevron',
})`
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const StyledDashboardGrid = styled(View).withConfig({
  displayName: 'StyledDashboardGrid',
  componentId: 'StyledDashboardGrid',
})`
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledStatusGrid = styled(View).withConfig({
  displayName: 'StyledStatusGrid',
  componentId: 'StyledStatusGrid',
})`
  flex-direction: ${({ $compact }) => ($compact ? 'column' : 'row')};
  flex-wrap: ${({ $compact }) => ($compact ? 'nowrap' : 'wrap')};
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledStatusItem = styled(View).withConfig({
  displayName: 'StyledStatusItem',
  componentId: 'StyledStatusItem',
})`
  flex-grow: 1;
  flex-basis: ${({ $compact }) => ($compact ? 'auto' : '150px')};
  min-height: 88px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  border-left-width: 3px;
  border-left-color: ${({ theme, $tone }) => toneColor(theme, $tone)};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => surfaceColor(theme)};
`;

const StyledStatusHeader = styled(View).withConfig({
  displayName: 'StyledStatusHeader',
  componentId: 'StyledStatusHeader',
})`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledStatusIcon = styled(View).withConfig({
  displayName: 'StyledStatusIcon',
  componentId: 'StyledStatusIcon',
})`
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ theme, $tone }) => toneColor(theme, $tone)};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme, $tone }) => toneSurfaceColor(theme, $tone)};
`;

const StyledStatusLabel = styled(Text).withConfig({
  displayName: 'StyledStatusLabel',
  componentId: 'StyledStatusLabel',
})`
  flex-shrink: 1;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: ${({ theme }) => Math.round(theme.typography.fontSize.xs * 1.25)}px;
  text-transform: uppercase;
`;

const StyledStatusValue = styled(Text).withConfig({
  displayName: 'StyledStatusValue',
  componentId: 'StyledStatusValue',
})`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  line-height: ${({ theme }) => Math.round(theme.typography.fontSize.lg * 1.25)}px;
`;

const StyledStatusDetail = styled(Text).withConfig({
  displayName: 'StyledStatusDetail',
  componentId: 'StyledStatusDetail',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  line-height: ${({ theme }) => Math.round(theme.typography.fontSize.xs * 1.35)}px;
`;

const StyledActionGrid = styled(View).withConfig({
  displayName: 'StyledActionGrid',
  componentId: 'StyledActionGrid',
})`
  flex-direction: ${({ $compact }) => ($compact ? 'column' : 'row')};
  flex-wrap: ${({ $compact }) => ($compact ? 'nowrap' : 'wrap')};
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledActionItem = styled(Pressable).withConfig({
  displayName: 'StyledActionItem',
  componentId: 'StyledActionItem',
})`
  flex-grow: 1;
  flex-basis: ${({ $compact }) => ($compact ? 'auto' : '220px')};
  min-height: 58px;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-color: ${({ theme, $emphasis }) => ($emphasis === 'primary' ? theme.colors.primary : theme.colors.background.tertiary)};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme, $emphasis }) => ($emphasis === 'primary' ? selectedSurfaceColor(theme) : surfaceColor(theme))};
  opacity: ${({ $enabled }) => ($enabled ? 1 : 0.58)};
`;

const StyledActionIcon = styled(View).withConfig({
  displayName: 'StyledActionIcon',
  componentId: 'StyledActionIcon',
})`
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ theme, $emphasis }) => ($emphasis === 'primary' ? theme.colors.primary : theme.colors.background.tertiary)};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme, $emphasis }) => ($emphasis === 'primary' ? theme.colors.primary : softSurfaceColor(theme))};
  opacity: ${({ $enabled }) => ($enabled ? 1 : 0.72)};
`;

const StyledActionBody = styled(View).withConfig({
  displayName: 'StyledActionBody',
  componentId: 'StyledActionBody',
})`
  flex: 1;
  min-width: 0;
`;

const StyledActionTitle = styled(Text).withConfig({
  displayName: 'StyledActionTitle',
  componentId: 'StyledActionTitle',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: ${({ theme }) => Math.round(theme.typography.fontSize.sm * 1.35)}px;
`;

const StyledActionMeta = styled(Text).withConfig({
  displayName: 'StyledActionMeta',
  componentId: 'StyledActionMeta',
})`
  margin-top: 2px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  line-height: ${({ theme }) => Math.round(theme.typography.fontSize.xs * 1.35)}px;
`;

export {
  StyledActionBody,
  StyledActionGrid,
  StyledActionIcon,
  StyledActionItem,
  StyledActionMeta,
  StyledActionTitle,
  StyledContainer,
  StyledDashboardGrid,
  StyledFacilityBody,
  StyledFacilityButton,
  StyledFacilityButtonText,
  StyledFacilityChevron,
  StyledFacilityHeader,
  StyledFacilityIcon,
  StyledFacilityList,
  StyledFacilityMeta,
  StyledFacilityPanel,
  StyledHeader,
  StyledHeaderCopy,
  StyledLogoArea,
  StyledMessage,
  StyledNoticeItem,
  StyledNoticeList,
  StyledNoticeMessage,
  StyledSection,
  StyledSectionTitle,
  StyledShell,
  StyledStatusDetail,
  StyledStatusGrid,
  StyledStatusHeader,
  StyledStatusIcon,
  StyledStatusItem,
  StyledStatusLabel,
  StyledStatusValue,
};
