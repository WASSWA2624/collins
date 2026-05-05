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

const StyledContainer = styled(ScrollView).withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledShell = styled(View).withConfig({
  displayName: 'StyledShell',
  componentId: 'StyledShell',
})`
  width: 100%;
  max-width: 1120px;
  align-self: center;
  padding: ${({ theme }) => theme.spacing.xl}px ${({ theme }) => theme.spacing.lg}px;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledHeader = styled(View).withConfig({
  displayName: 'StyledHeader',
  componentId: 'StyledHeader',
})`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.spacing.lg}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary};
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
  padding: ${({ theme }) => theme.spacing.md}px;
  border-left-width: 4px;
  border-left-color: ${({ theme, $severity }) => toneColor(theme, $severity)};
  background-color: ${({ theme }) => theme.colors.background.secondary};
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
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
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
  padding: ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const StyledFacilityButtonText = styled(Text).withConfig({
  displayName: 'StyledFacilityButtonText',
  componentId: 'StyledFacilityButtonText',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledStatusGrid = styled(View).withConfig({
  displayName: 'StyledStatusGrid',
  componentId: 'StyledStatusGrid',
})`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledStatusItem = styled(View).withConfig({
  displayName: 'StyledStatusItem',
  componentId: 'StyledStatusItem',
})`
  flex-grow: 1;
  flex-basis: 180px;
  min-height: 104px;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  border-top-width: 4px;
  border-top-color: ${({ theme, $tone }) => toneColor(theme, $tone)};
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const StyledStatusLabel = styled(Text).withConfig({
  displayName: 'StyledStatusLabel',
  componentId: 'StyledStatusLabel',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  text-transform: uppercase;
`;

const StyledStatusValue = styled(Text).withConfig({
  displayName: 'StyledStatusValue',
  componentId: 'StyledStatusValue',
})`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const StyledStatusDetail = styled(Text).withConfig({
  displayName: 'StyledStatusDetail',
  componentId: 'StyledStatusDetail',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const StyledActionGrid = styled(View).withConfig({
  displayName: 'StyledActionGrid',
  componentId: 'StyledActionGrid',
})`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledActionItem = styled(Pressable).withConfig({
  displayName: 'StyledActionItem',
  componentId: 'StyledActionItem',
})`
  flex-grow: 1;
  flex-basis: 220px;
  min-height: 88px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-left-width: ${({ $emphasis }) => ($emphasis === 'primary' ? 4 : 1)}px;
  border-color: ${({ theme, $emphasis }) => ($emphasis === 'primary' ? theme.colors.primary : theme.colors.background.tertiary)};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  opacity: ${({ $enabled }) => ($enabled ? 1 : 0.58)};
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
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledActionMeta = styled(Text).withConfig({
  displayName: 'StyledActionMeta',
  componentId: 'StyledActionMeta',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

export {
  StyledActionBody,
  StyledActionGrid,
  StyledActionItem,
  StyledActionMeta,
  StyledActionTitle,
  StyledContainer,
  StyledFacilityButton,
  StyledFacilityButtonText,
  StyledFacilityList,
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
  StyledStatusItem,
  StyledStatusLabel,
  StyledStatusValue,
};
