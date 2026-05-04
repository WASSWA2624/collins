/**
 * TabBar Component Styles - iOS
 * Styled-components for TabBar iOS implementation
 * File: TabBar.ios.styles.jsx
 */
import styled from 'styled-components/native';
import { View, Pressable, Text } from 'react-native';

const StyledTabBar = styled(View).withConfig({
  displayName: 'StyledTabBar',
  componentId: 'StyledTabBar',
  shouldForwardProp: (prop) => prop !== 'bottomInset',
})`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.background.tertiary};
  padding: ${({ theme }) => theme.spacing.xs}px 0;
  padding-bottom: ${({ theme, bottomInset }) =>
    (theme?.spacing?.xs ?? 4) + (theme?.spacing?.md ?? 16) + (typeof bottomInset === 'number' ? bottomInset : 0)}px;
  ${({ theme }) =>
    theme.shadows?.md
      ? `
    shadow-color: ${theme.shadows.md.shadowColor};
    shadow-offset: ${theme.shadows.md.shadowOffset.width}px ${theme.shadows.md.shadowOffset.height}px;
    shadow-opacity: ${theme.shadows.md.shadowOpacity};
    shadow-radius: ${theme.shadows.md.shadowRadius}px;
    elevation: ${theme.shadows.md.elevation || 4};
  `
      : ''}
`;

const StyledTabBarContent = styled(View).withConfig({
  displayName: 'StyledTabBarContent',
  componentId: 'StyledTabBarContent',
})`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 0 ${({ theme }) => theme.spacing.sm}px;
`;

const StyledTabItem = styled(Pressable).withConfig({
  displayName: 'StyledTabItem',
  componentId: 'StyledTabItem',
  shouldForwardProp: (prop) => prop !== 'active',
})`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xs}px;
  min-height: 44px;
  min-width: 44px;
  position: relative;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme, active }) =>
    active ? theme.colors.background.secondary : 'transparent'};
  border-top-width: 3px;
  border-top-color: ${({ theme, active }) =>
    active ? theme.colors.primary : 'transparent'};
`;

const StyledTabItemIcon = styled(Text).withConfig({
  displayName: 'StyledTabItemIcon',
  componentId: 'StyledTabItemIcon',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  color: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.text.tertiary};
  margin-bottom: 2px;
`;

const StyledTabItemLabel = styled(Text).withConfig({
  displayName: 'StyledTabItemLabel',
  componentId: 'StyledTabItemLabel',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme, active }) =>
    active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.normal};
  color: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.text.tertiary};
  text-align: center;
`;

const StyledTabItemBadge = styled(View).withConfig({
  displayName: 'StyledTabItemBadge',
  componentId: 'StyledTabItemBadge',
})`
  position: absolute;
  top: ${({ theme }) => theme.spacing.xs}px;
  right: ${({ theme }) => theme.spacing.sm}px;
`;

export {
  StyledTabBar,
  StyledTabBarContent,
  StyledTabItem,
  StyledTabItemIcon,
  StyledTabItemLabel,
  StyledTabItemBadge,
};

