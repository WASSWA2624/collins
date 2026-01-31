/**
 * TabBar Component Styles - Web
 * Styled-components for TabBar web implementation
 * File: TabBar.web.styles.jsx
 */
import styled from 'styled-components';
import { View, Pressable, Text } from 'react-native';

const StyledTabBar = styled(View).withConfig({
  displayName: 'StyledTabBar',
  componentId: 'StyledTabBar',
})`
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.background.tertiary};
  padding: ${({ theme }) => theme.spacing.sm}px 0;
  z-index: 1000;
  box-shadow: ${({ theme }) =>
    theme.shadows?.md
      ? `0 ${theme.shadows.md.shadowOffset.height * -1}px ${theme.shadows.md.shadowRadius * 2}px rgba(0, 0, 0, ${theme.shadows.md.shadowOpacity})`
      : '0 -2px 8px rgba(0, 0, 0, 0.1)'};

  @media (max-width: 768px) {
    display: flex;
  }
`;

const StyledTabBarContent = styled(View).withConfig({
  displayName: 'StyledTabBarContent',
  componentId: 'StyledTabBarContent',
})`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md}px;
`;

const StyledTabItem = styled(Pressable).withConfig({
  displayName: 'StyledTabItem',
  componentId: 'StyledTabItem',
})`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.sm}px;
  min-height: ${({ theme }) => theme.spacing.xxl + theme.spacing.sm}px;
  min-width: ${({ theme }) => theme.spacing.xxl + theme.spacing.sm}px;
  position: relative;
  border-radius: ${({ theme }) => theme.radius.md}px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
  }
`;

const StyledTabItemIcon = styled(Text).withConfig({
  displayName: 'StyledTabItemIcon',
  componentId: 'StyledTabItemIcon',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl}px;
  color: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.text.tertiary};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
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

