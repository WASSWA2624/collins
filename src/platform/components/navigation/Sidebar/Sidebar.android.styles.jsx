/**
 * Sidebar Component Styles - Android
 * Styled-components for Sidebar Android implementation
 * File: Sidebar.android.styles.jsx
 */
import styled from 'styled-components/native';
import { View, Pressable, Text, ScrollView } from 'react-native';

const StyledSidebar = styled(View).withConfig({
  displayName: 'StyledSidebar',
  componentId: 'StyledSidebar',
})`
  width: 280px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-right-width: 1px;
  border-right-color: ${({ theme }) => theme.colors.background.tertiary};
  height: 100%;
  elevation: 8;
`;

const StyledSidebarHeader = styled(View).withConfig({
  displayName: 'StyledSidebarHeader',
  componentId: 'StyledSidebarHeader',
})`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md}px;
  min-height: 56px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.primary};
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSidebarHeaderBrand = styled(View).withConfig({
  displayName: 'StyledSidebarHeaderBrand',
  componentId: 'StyledSidebarHeaderBrand',
})`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  flex: 1;
  min-width: 0;
  flex-shrink: 1;
`;

const StyledSidebarHeaderLogo = styled(View).withConfig({
  displayName: 'StyledSidebarHeaderLogo',
  componentId: 'StyledSidebarHeaderLogo',
})`
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const StyledSidebarHeaderAppName = styled(Text).withConfig({
  displayName: 'StyledSidebarHeaderAppName',
  componentId: 'StyledSidebarHeaderAppName',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: ${-0.5};
  flex: 1;
  min-width: 0;
  flex-shrink: 1;
`;

const StyledCloseButton = styled(Pressable).withConfig({
  displayName: 'StyledCloseButton',
  componentId: 'StyledCloseButton',
})`
  min-width: 48px;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  background-color: ${({ theme }) => theme.colors.background.tertiary};
  flex-shrink: 0;
`;

const StyledContentWrap = styled(View).withConfig({
  displayName: 'StyledContentWrap',
  componentId: 'StyledContentWrap',
})`
  flex: 1;
`;

const StyledScrollView = styled(ScrollView).withConfig({
  displayName: 'StyledScrollView',
  componentId: 'StyledScrollView',
})`
  flex: 1;
`;

const StyledSidebarContent = styled(View).withConfig({
  displayName: 'StyledSidebarContent',
  componentId: 'StyledSidebarContent',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledNavSection = styled(View).withConfig({
  displayName: 'StyledNavSection',
  componentId: 'StyledNavSection',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledNavSectionHeader = styled(View).withConfig({
  displayName: 'StyledNavSectionHeader',
  componentId: 'StyledNavSectionHeader',
})`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledNavSectionTitle = styled(Text).withConfig({
  displayName: 'StyledNavSectionTitle',
  componentId: 'StyledNavSectionTitle',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.tertiary};
  text-transform: uppercase;
  letter-spacing: ${0.5};
`;

const StyledNavItem = styled(Pressable).withConfig({
  displayName: 'StyledNavItem',
  componentId: 'StyledNavItem',
})`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme, active }) =>
    active ? theme.colors.background.secondary : 'transparent'};
  flex-direction: row;
  align-items: center;
  min-height: 48px;
  padding-left: ${({ theme, level }) => theme.spacing.md + level * theme.spacing.md}px;
`;

const StyledNavItemContent = styled(View).withConfig({
  displayName: 'StyledNavItemContent',
  componentId: 'StyledNavItemContent',
})`
  flex-direction: row;
  align-items: center;
  flex: 1;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledNavItemLabel = styled(Text).withConfig({
  displayName: 'StyledNavItemLabel',
  componentId: 'StyledNavItemLabel',
})`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme, active }) => (active ? '600' : theme.typography.fontWeight.normal)};
  color: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.text.primary};
`;

const StyledNavItemBadge = styled(View).withConfig({
  displayName: 'StyledNavItemBadge',
  componentId: 'StyledNavItemBadge',
})`
  margin-left: auto;
`;

const StyledNavItemChildren = styled(View).withConfig({
  displayName: 'StyledNavItemChildren',
  componentId: 'StyledNavItemChildren',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  margin-left: ${({ theme }) => theme.spacing.md}px;
`;

const StyledExpandIcon = styled(Text).withConfig({
  displayName: 'StyledExpandIcon',
  componentId: 'StyledExpandIcon',
})`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

export {
  StyledSidebar,
  StyledSidebarHeader,
  StyledSidebarHeaderBrand,
  StyledSidebarHeaderLogo,
  StyledSidebarHeaderAppName,
  StyledCloseButton,
  StyledContentWrap,
  StyledScrollView,
  StyledSidebarContent,
  StyledNavSection,
  StyledNavSectionHeader,
  StyledNavSectionTitle,
  StyledNavItem,
  StyledNavItemContent,
  StyledNavItemLabel,
  StyledNavItemBadge,
  StyledNavItemChildren,
  StyledExpandIcon,
};

