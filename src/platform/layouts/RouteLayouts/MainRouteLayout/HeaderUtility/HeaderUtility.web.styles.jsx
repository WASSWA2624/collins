/**
 * HeaderUtility Styles - Web
 * File: HeaderUtility/HeaderUtility.web.styles.jsx
 * Responsive header utility styling with proper mobile alignment
 */
import styled from 'styled-components';
import { Button } from '@platform/components';

const StyledHeaderUtilityRow = styled.div.withConfig({
  displayName: 'StyledHeaderUtilityRow',
  componentId: 'StyledHeaderUtilityRow',
})`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  flex-wrap: nowrap;
  height: 100%;

  & > * {
    min-height: 28px;
  }

  /* Tablet */
  @media (min-width: 768px) and (max-width: 1023px) {
    gap: 6px;
    & > * {
      min-height: 28px;
    }
  }

  /* Mobile: Compact layout */
  @media (max-width: 767px) {
    gap: 4px;
    & > * {
      min-height: 28px;
    }
  }
`;

const StyledHeaderMenuWrapper = styled.div.withConfig({
  displayName: 'StyledHeaderMenuWrapper',
  componentId: 'StyledHeaderMenuWrapper',
})`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const StyledHeaderMenuButton = styled.button.withConfig({
  displayName: 'StyledHeaderMenuButton',
  componentId: 'StyledHeaderMenuButton',
})`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  min-height: 28px;
  min-width: 28px;
  padding: 0;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  white-space: nowrap;
  line-height: 1;
  font-size: 14px;
  transition: color 0.15s ease, transform 0.1s ease, background-color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }

  &:active {
    color: ${({ theme }) => theme.colors.text.primary};
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  /* Tablet */
  @media (min-width: 768px) and (max-width: 1023px) {
    min-height: 28px;
    min-width: 28px;
    font-size: 13px;
  }

  /* Mobile: Smaller, cleaner buttons */
  @media (max-width: 767px) {
    min-height: 28px;
    min-width: 28px;
    font-size: 13px;
    border: none;
    border-radius: ${({ theme }) => theme.radius.full}px;
    background-color: ${({ theme }) => theme.colors.background.secondary};

    &:hover {
      background-color: ${({ theme }) => theme.colors.background.tertiary};
    }

    &:active {
      background-color: ${({ theme }) => theme.colors.background.tertiary};
      transform: scale(0.94);
    }
  }
`;

const StyledOverflowMenuButton = styled.button.withConfig({
  displayName: 'StyledOverflowMenuButton',
  componentId: 'StyledOverflowMenuButton',
})`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  min-width: 28px;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: transparent;
  cursor: pointer;
  line-height: 1;
  font-size: 14px;
  transition: color 0.15s ease, transform 0.1s ease, background-color 0.15s ease;

  & > span {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }

  &:hover {
    & > span {
      color: ${({ theme }) => theme.colors.text.primary};
    }
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }

  &:active {
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  /* Tablet */
  @media (min-width: 768px) and (max-width: 1023px) {
    min-height: 28px;
    min-width: 28px;
    font-size: 13px;
  }

  /* Mobile: Compact overflow button */
  @media (max-width: 767px) {
    min-height: 28px;
    min-width: 28px;
    font-size: 13px;
    border: none;
    border-radius: ${({ theme }) => theme.radius.full}px;
    background-color: ${({ theme }) => theme.colors.background.secondary};

    &:hover {
      background-color: ${({ theme }) => theme.colors.background.tertiary};
    }

    &:active {
      background-color: ${({ theme }) => theme.colors.background.tertiary};
      transform: scale(0.94);
    }
  }
`;

const StyledHeaderMenu = styled.div.withConfig({
  displayName: 'StyledHeaderMenu',
  componentId: 'StyledHeaderMenu',
})`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing.xs}px);
  right: 0;
  min-width: ${({ theme }) => theme.spacing.xxl * 5}px;
  max-width: ${({ theme }) => theme.spacing.xxl * 7}px;
  max-height: ${({ theme }) => theme.spacing.xxl * 6}px;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.md}px;
  box-shadow: ${({ theme }) => {
    const shadow = theme.shadows?.md;
    if (!shadow) return '0 4px 12px rgba(0, 0, 0, 0.12)';
    return `${shadow.shadowOffset?.width || 0}px ${shadow.shadowOffset?.height || 2}px ${shadow.shadowRadius || 4}px rgba(0, 0, 0, ${shadow.shadowOpacity || 0.15})`;
  }};
  z-index: 1300;
  display: flex;
  flex-direction: column;
`;

const StyledHeaderMenuItem = styled.button.withConfig({
  displayName: 'StyledHeaderMenuItem',
  componentId: 'StyledHeaderMenuItem',
})`
  width: 100%;
  text-align: left;
  min-height: 32px;
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme, $isChecked }) =>
    $isChecked ? theme.colors.background.secondary : theme.colors.background.primary};
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-left: 3px solid ${({ theme, $isChecked }) =>
    $isChecked ? theme.colors.primary : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: -2px;
  }
`;

const StyledHeaderMenuItemContent = styled.div.withConfig({
  displayName: 'StyledHeaderMenuItemContent',
  componentId: 'StyledHeaderMenuItemContent',
})`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  min-width: 0;
  flex: 1;
`;

const StyledHeaderMenuItemIcon = styled.span.withConfig({
  displayName: 'StyledHeaderMenuItemIcon',
  componentId: 'StyledHeaderMenuItemIcon',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const StyledHeaderMenuItemLabel = styled.span.withConfig({
  displayName: 'StyledHeaderMenuItemLabel',
  componentId: 'StyledHeaderMenuItemLabel',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledHeaderMenuItemMeta = styled.span.withConfig({
  displayName: 'StyledHeaderMenuItemMeta',
  componentId: 'StyledHeaderMenuItemMeta',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme, $isChecked }) =>
    $isChecked ? theme.colors.text.inverse : theme.colors.text.primary};
  background-color: ${({ theme, $isChecked }) =>
    $isChecked ? theme.colors.success : theme.colors.background.tertiary};
`;

const StyledHeaderMenuSectionTitle = styled.div.withConfig({
  displayName: 'StyledHeaderMenuSectionTitle',
  componentId: 'StyledHeaderMenuSectionTitle',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const StyledHeaderMenuDivider = styled.div.withConfig({
  displayName: 'StyledHeaderMenuDivider',
  componentId: 'StyledHeaderMenuDivider',
})`
  height: 1px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledHeaderToggleButton = styled(Button).withConfig({
  displayName: 'StyledHeaderToggleButton',
  componentId: 'StyledHeaderToggleButton',
})`
  && {
    min-height: 28px;
    min-width: 28px;
    padding: 0;
    border-color: ${({ theme }) => theme.colors.background.tertiary};
    border-radius: ${({ theme }) => theme.radius.sm}px;
    background-color: transparent;
  }

  /* Tablet */
  @media (min-width: 768px) and (max-width: 1023px) {
    && {
      min-height: 28px;
      min-width: 28px;
    }
  }

  /* Mobile: Hidden - available in overflow menu */
  @media (max-width: 767px) {
    && {
      display: none;
    }
  }
`;

const StyledNotificationsWrapper = styled.div.withConfig({
  displayName: 'StyledNotificationsWrapper',
  componentId: 'StyledNotificationsWrapper',
})`
  position: relative;
  display: inline-flex;
`;

const StyledNotificationsButton = styled.button.withConfig({
  displayName: 'StyledNotificationsButton',
  componentId: 'StyledNotificationsButton',
})`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  min-width: 28px;
  padding: 0;
  border-radius: ${({ theme }) => theme.radius.full}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.15s ease, transform 0.1s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  /* Tablet */
  @media (min-width: 768px) and (max-width: 1023px) {
    min-height: 28px;
    min-width: 28px;
    font-size: 13px;
  }

  /* Mobile: Compact notification button */
  @media (max-width: 767px) {
    min-height: 28px;
    min-width: 28px;
    font-size: 13px;
    border: none;
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border-radius: ${({ theme }) => theme.radius.full}px;

    &:active {
      transform: scale(0.94);
    }
  }
`;

const StyledNotificationsBadge = styled.span.withConfig({
  displayName: 'StyledNotificationsBadge',
  componentId: 'StyledNotificationsBadge',
})`
  position: absolute;
  top: -2px;
  right: -2px;
  min-width: 14px;
  height: 14px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  background-color: ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: 9px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  line-height: 1;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);

  /* Mobile: Slightly smaller badge */
  @media (max-width: 767px) {
    min-width: 12px;
    height: 12px;
    font-size: 8px;
    top: -1px;
    right: -1px;
    padding: 0 2px;
  }
`;

const StyledFullscreenButton = styled(Button).withConfig({
  displayName: 'StyledFullscreenButton',
  componentId: 'StyledFullscreenButton',
})`
  && {
    min-height: 28px;
    min-width: 28px;
    padding: 0;
    border-radius: ${({ theme }) => theme.radius.sm}px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    && {
      min-height: 32px;
      min-width: 32px;
    }
  }
`;

/** Windows-style maximize/restore icon button (icon-only) */
const StyledMaximizeRestoreButton = styled.button.withConfig({
  displayName: 'StyledMaximizeRestoreButton',
  componentId: 'StyledMaximizeRestoreButton',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  min-width: 28px;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: color 0.15s ease, background-color 0.15s ease, transform 0.1s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }

  &:active {
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  & svg {
    width: 12px;
    height: 12px;
  }

  /* Tablet */
  @media (min-width: 768px) and (max-width: 1023px) {
    min-height: 28px;
    min-width: 28px;
    & svg {
      width: 11px;
      height: 11px;
    }
  }

  /* Mobile: Hidden by default, shown in overflow menu */
  @media (max-width: 767px) {
    display: none;
  }
`;

/** Win11-style network tray button wrapper */
const StyledNetworkButton = styled.div.withConfig({
  displayName: 'StyledNetworkButton',
  componentId: 'StyledNetworkButton',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  min-width: 28px;
  padding: 0 6px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: transparent;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }

  /* Tablet */
  @media (min-width: 768px) and (max-width: 1023px) {
    min-height: 28px;
    min-width: 28px;
    padding: 0 4px;
  }

  /* Mobile: Hidden - moved to overflow menu */
  @media (max-width: 767px) {
    display: none;
  }
`;

export {
  StyledHeaderUtilityRow,
  StyledHeaderMenuWrapper,
  StyledHeaderMenuButton,
  StyledOverflowMenuButton,
  StyledHeaderMenu,
  StyledHeaderMenuItem,
  StyledHeaderMenuItemContent,
  StyledHeaderMenuItemIcon,
  StyledHeaderMenuItemLabel,
  StyledHeaderMenuItemMeta,
  StyledHeaderMenuSectionTitle,
  StyledHeaderMenuDivider,
  StyledHeaderToggleButton,
  StyledNotificationsWrapper,
  StyledNotificationsButton,
  StyledNotificationsBadge,
  StyledFullscreenButton,
  StyledMaximizeRestoreButton,
  StyledNetworkButton,
};
