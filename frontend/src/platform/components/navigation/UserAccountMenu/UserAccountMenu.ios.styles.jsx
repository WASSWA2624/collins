/**
 * UserAccountMenu iOS Styles
 * File: UserAccountMenu.ios.styles.jsx
 */
import styled from 'styled-components/native';
import { Pressable, View } from 'react-native';

const getStatusColor = ({ theme, $status }) => {
  if ($status === 'offline') return theme.colors.error;
  if ($status === 'syncing' || $status === 'unstable') return theme.colors.warning;
  return theme.colors.success;
};

const StyledAccountMenu = styled(View).withConfig({
  displayName: 'StyledAccountMenu',
  componentId: 'StyledAccountMenu',
})`
  position: relative;
  align-items: center;
  justify-content: center;
`;

const StyledAvatarButton = styled(Pressable).withConfig({
  displayName: 'StyledAvatarButton',
  componentId: 'StyledAvatarButton',
})`
  position: relative;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const StyledStatusDot = styled(View).withConfig({
  displayName: 'StyledStatusDot',
  componentId: 'StyledStatusDot',
})`
  position: absolute;
  right: 3px;
  bottom: 3px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.background.primary};
  background-color: ${getStatusColor};
`;

const StyledMenuRoot = styled(View).withConfig({
  displayName: 'StyledMenuRoot',
  componentId: 'StyledMenuRoot',
})`
  flex: 1;
`;

const StyledMenuBackdrop = styled(Pressable).withConfig({
  displayName: 'StyledMenuBackdrop',
  componentId: 'StyledMenuBackdrop',
})`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.08);
`;

const StyledMenuSurface = styled(View).withConfig({
  displayName: 'StyledMenuSurface',
  componentId: 'StyledMenuSurface',
  shouldForwardProp: (prop) => prop !== '$topOffset',
})`
  position: absolute;
  top: ${({ $topOffset }) => $topOffset}px;
  right: ${({ theme }) => theme.spacing.md}px;
  width: 288px;
  max-width: 288px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 0;
  shadow-color: #000;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.16;
  shadow-radius: 18px;
  overflow: hidden;
`;

const StyledMenuHeader = styled(View).withConfig({
  displayName: 'StyledMenuHeader',
  componentId: 'StyledMenuHeader',
})`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const StyledIdentityText = styled(View).withConfig({
  displayName: 'StyledIdentityText',
  componentId: 'StyledIdentityText',
})`
  flex: 1;
  min-width: 0;
`;

const StyledMenuBody = styled(View).withConfig({
  displayName: 'StyledMenuBody',
  componentId: 'StyledMenuBody',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledMenuField = styled(View).withConfig({
  displayName: 'StyledMenuField',
  componentId: 'StyledMenuField',
})`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledFieldLabel = styled(View).withConfig({
  displayName: 'StyledFieldLabel',
  componentId: 'StyledFieldLabel',
})`
  width: 96px;
`;

const StyledFieldValue = styled(View).withConfig({
  displayName: 'StyledFieldValue',
  componentId: 'StyledFieldValue',
})`
  flex: 1;
  min-width: 0;
`;

const StyledStatusValue = styled(View).withConfig({
  displayName: 'StyledStatusValue',
  componentId: 'StyledStatusValue',
})`
  flex: 1;
  min-width: 0;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledInlineStatusDot = styled(View).withConfig({
  displayName: 'StyledInlineStatusDot',
  componentId: 'StyledInlineStatusDot',
})`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${getStatusColor};
`;

const StyledFacilityOption = styled(Pressable).withConfig({
  displayName: 'StyledFacilityOption',
  componentId: 'StyledFacilityOption',
})`
  min-height: 36px;
  justify-content: center;
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  border-width: 1px;
  border-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.primary : theme.colors.background.tertiary};
  border-radius: 0;
  background-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.background.secondary : theme.colors.background.primary};
`;

const StyledFacilityOptions = styled(View).withConfig({
  displayName: 'StyledFacilityOptions',
  componentId: 'StyledFacilityOptions',
})`
  flex: 1;
  min-width: 0;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledMenuDivider = styled(View).withConfig({
  displayName: 'StyledMenuDivider',
  componentId: 'StyledMenuDivider',
})`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledLogoutButton = styled(Pressable).withConfig({
  displayName: 'StyledLogoutButton',
  componentId: 'StyledLogoutButton',
})`
  min-height: 44px;
  justify-content: center;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

export {
  StyledAccountMenu,
  StyledAvatarButton,
  StyledFacilityOption,
  StyledFacilityOptions,
  StyledFieldLabel,
  StyledFieldValue,
  StyledIdentityText,
  StyledInlineStatusDot,
  StyledLogoutButton,
  StyledMenuBackdrop,
  StyledMenuBody,
  StyledMenuDivider,
  StyledMenuField,
  StyledMenuHeader,
  StyledMenuRoot,
  StyledMenuSurface,
  StyledStatusDot,
  StyledStatusValue,
};
