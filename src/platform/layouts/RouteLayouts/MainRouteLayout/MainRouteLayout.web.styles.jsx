/**
 * MainRouteLayout Styles - Web
 * File: MainRouteLayout.web.styles.jsx
 */
import styled from 'styled-components';
import { Button } from '@platform/components';

const StyledMobileSidebarOverlay = styled.div.withConfig({
  displayName: 'StyledMobileSidebarOverlay',
  componentId: 'StyledMobileSidebarOverlay',
})`
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: stretch;
  background-color: ${({ theme }) => theme.colors.overlay.backdrop};
  backdrop-filter: blur(${({ theme }) => theme.spacing.sm}px);
  -webkit-backdrop-filter: blur(${({ theme }) => theme.spacing.sm}px);
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  pointer-events: ${({ isOpen }) => (isOpen ? 'auto' : 'none')};
  transition: opacity 0.2s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet || 768}px) and (max-width: ${({ theme }) => theme.breakpoints?.desktop || 1024}px) {
    /* Tablet-specific adjustments */
  }
`;

const StyledMobileSidebarPanel = styled.div.withConfig({
  displayName: 'StyledMobileSidebarPanel',
  componentId: 'StyledMobileSidebarPanel',
})`
  width: 240px;
  max-width: 80vw;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
  box-shadow: ${({ theme }) => {
    const shadow = theme.shadows?.md;
    if (!shadow) return '2px 0 16px rgba(0, 0, 0, 0.2)';
    return `${shadow.shadowOffset?.width || 0}px ${shadow.shadowOffset?.height || 2}px ${shadow.shadowRadius || 4}px rgba(0, 0, 0, ${shadow.shadowOpacity || 0.15})`;
  }};
  transform: translateX(${({ isOpen }) => (isOpen ? '0' : '-100%')});
  transition: transform 0.2s ease;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const StyledMobileSidebarBackdrop = styled.button.withConfig({
  displayName: 'StyledMobileSidebarBackdrop',
  componentId: 'StyledMobileSidebarBackdrop',
})`
  flex: 1;
  border: none;
  padding: 0;
  background: transparent;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: -2px;
  }
`;

const StyledHamburgerIcon = styled.span.withConfig({
  displayName: 'StyledHamburgerIcon',
  componentId: 'StyledHamburgerIcon',
})`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  width: 18px;
  height: 16px;
`;

const StyledHamburgerLine = styled.span.withConfig({
  displayName: 'StyledHamburgerLine',
  componentId: 'StyledHamburgerLine',
})`
  height: 2px;
  width: 100%;
  background-color: currentColor;
  border-radius: ${({ theme }) => theme.radius.full}px;
`;

const StyledBrand = styled.div.withConfig({
  displayName: 'StyledBrand',
  componentId: 'StyledBrand',
})`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  min-width: 0;

  /* Tablet */
  @media (min-width: 768px) and (max-width: 1023px) {
    gap: ${({ theme }) => theme.spacing.xs}px;
  }

  /* Mobile */
  @media (max-width: 767px) {
    gap: 6px;
  }
`;

const StyledBrandLogo = styled.div.withConfig({
  displayName: 'StyledBrandLogo',
  componentId: 'StyledBrandLogo',
})`
  /* Desktop: 32px */
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: 12px;
  flex-shrink: 0;
  letter-spacing: -0.5px;
  text-transform: uppercase;

  /* Tablet: 28px */
  @media (min-width: 768px) and (max-width: 1023px) {
    width: 28px;
    height: 28px;
    font-size: 11px;
  }

  /* Mobile: 24px */
  @media (max-width: 767px) {
    width: 24px;
    height: 24px;
    font-size: 10px;
  }
`;

const StyledBrandName = styled.span.withConfig({
  displayName: 'StyledBrandName',
  componentId: 'StyledBrandName',
})`
  /* Desktop: Full name visible */
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: nowrap;

  /* Tablet */
  @media (min-width: 768px) and (max-width: 1023px) {
    font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  }

  /* Mobile: Hide full name */
  @media (max-width: 767px) {
    display: none;
  }
`;

const StyledBrandShortName = styled.span.withConfig({
  displayName: 'StyledBrandShortName',
  componentId: 'StyledBrandShortName',
})`
  /* Desktop/Tablet: Hidden */
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  display: none;
  white-space: nowrap;

  /* Mobile: Show short name */
  @media (max-width: 767px) {
    display: inline;
    font-size: 13px;
  }
`;

const StyledSidebarWrapper = styled.div.withConfig({
  displayName: 'StyledSidebarWrapper',
  componentId: 'StyledSidebarWrapper',
})`
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const StyledSidebarResizeHandle = styled.div.withConfig({
  displayName: 'StyledSidebarResizeHandle',
  componentId: 'StyledSidebarResizeHandle',
})`
  position: absolute;
  top: 0;
  right: 0;
  width: ${({ theme }) => theme.spacing.sm}px;
  height: 100%;
  cursor: col-resize;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: '';
    width: 2px;
    height: ${({ theme }) => theme.spacing.xxl}px;
    border-radius: ${({ theme }) => theme.radius.full}px;
    background-color: ${({ theme }) => theme.colors.background.tertiary};
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
  }

  &:hover::after,
  &:active::after,
  &:focus-visible::after {
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: -2px;
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      transition: none;
    }
  }
`;

const StyledSidebarControls = styled.div.withConfig({
  displayName: 'StyledSidebarControls',
  componentId: 'StyledSidebarControls',
})`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
  align-items: stretch;
  width: 100%;

  & > * {
    flex: 1 1 ${({ theme }) => theme.spacing.xxl * 3}px;
  }
`;

const StyledFullscreenButton = styled(Button).withConfig({
  displayName: 'StyledFullscreenButton',
  componentId: 'StyledFullscreenButton',
})`
  && {
    min-height: ${({ theme }) => theme.spacing.xxl}px;
    padding: 0;
    border-radius: ${({ theme }) => theme.radius.full}px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}px) {
    && {
      min-height: ${({ theme }) => theme.spacing.xxl}px;
      padding: 0;
      border-radius: ${({ theme }) => theme.radius.full}px;
    }
  }
`;

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

  /* Mobile: Compact pill-shaped button */
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
  transition: color 0.15s ease, transform 0.1s ease, background-color 0.15s ease;

  & > span {
    color: ${({ theme }) => theme.colors.text.tertiary};
    line-height: 1;
  }

  &:hover {
    & > span {
      color: ${({ theme }) => theme.colors.text.primary};
    }
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }

  &:active {
    transform: scale(0.96);
    & > span {
      color: ${({ theme }) => theme.colors.text.primary};
    }
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  /* Tablet */
  @media (min-width: 768px) and (max-width: 1023px) {
    min-height: 28px;
    min-width: 28px;
  }

  /* Mobile: Compact, pill-shaped button */
  @media (max-width: 767px) {
    min-height: 28px;
    min-width: 28px;
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
  min-height: ${({ theme }) => theme.spacing.xxl}px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
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
    min-height: ${({ theme }) => theme.spacing.xxl}px;
    padding: 0;
    border-color: ${({ theme }) => theme.colors.background.tertiary};
    border-radius: ${({ theme }) => theme.radius.sm}px;
    background-color: transparent;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}px) {
    && {
      min-height: ${({ theme }) => theme.spacing.xxl}px;
      padding: 0;
      border-color: ${({ theme }) => theme.colors.background.tertiary};
      border-radius: ${({ theme }) => theme.radius.full}px;
      background-color: transparent;
    }
  }
`;

const StyledHeaderRevealButton = styled(Button).withConfig({
  displayName: 'StyledHeaderRevealButton',
  componentId: 'StyledHeaderRevealButton',
})`
  && {
    position: fixed;
    top: ${({ theme }) => theme.spacing.sm}px;
    right: ${({ theme }) => theme.spacing.sm}px;
    z-index: 1400;
    min-height: ${({ theme }) => theme.spacing.xxl}px;
    min-width: ${({ theme }) => theme.spacing.xxl}px;
    padding: 0;
    border-color: ${({ theme }) => theme.colors.background.tertiary};
    background-color: transparent;
    border-radius: ${({ theme }) => theme.radius.full}px;
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
  top: -${({ theme }) => theme.spacing.xs}px;
  right: -${({ theme }) => theme.spacing.xs}px;
  min-width: ${({ theme }) => theme.spacing.md}px;
  height: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  background-color: ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 ${({ theme }) => theme.spacing.xs}px;
`;

const StyledNotificationsMenu = styled.div.withConfig({
  displayName: 'StyledNotificationsMenu',
  componentId: 'StyledNotificationsMenu',
})`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing.xs}px);
  right: 0;
  min-width: ${({ theme }) => theme.spacing.xxl * 5}px;
  max-width: ${({ theme }) => theme.spacing.xxl * 7}px;
  max-height: ${({ theme }) => theme.spacing.xxl * 5}px;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.md}px;
  box-shadow: ${({ theme }) => {
    const shadow = theme.shadows?.md;
    if (!shadow) return '0 4px 12px rgba(0, 0, 0, 0.12)';
    return `${shadow.shadowOffset?.width || 0}px ${shadow.shadowOffset?.height || 2}px ${shadow.shadowRadius || 4}px rgba(0, 0, 0, ${shadow.shadowOpacity || 0.15})`;
  }};
  z-index: 1200;
  display: flex;
  flex-direction: column;
`;

const StyledNotificationsItem = styled.button.withConfig({
  displayName: 'StyledNotificationsItem',
  componentId: 'StyledNotificationsItem',
})`
  width: 100%;
  text-align: left;
  min-height: ${({ theme }) => theme.spacing.xxl}px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
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

const StyledNotificationsItemTitle = styled.span.withConfig({
  displayName: 'StyledNotificationsItemTitle',
  componentId: 'StyledNotificationsItemTitle',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledNotificationsItemMeta = styled.span.withConfig({
  displayName: 'StyledNotificationsItemMeta',
  componentId: 'StyledNotificationsItemMeta',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledNotificationsItemContent = styled.div.withConfig({
  displayName: 'StyledNotificationsItemContent',
  componentId: 'StyledNotificationsItemContent',
})`
  display: inline-flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm}px;
  min-width: 0;
`;

const StyledNotificationsItemIcon = styled.span.withConfig({
  displayName: 'StyledNotificationsItemIcon',
  componentId: 'StyledNotificationsItemIcon',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const StyledNotificationsEmpty = styled.div.withConfig({
  displayName: 'StyledNotificationsEmpty',
  componentId: 'StyledNotificationsEmpty',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledMobileSidebarHeader = styled.div.withConfig({
  displayName: 'StyledMobileSidebarHeader',
  componentId: 'StyledMobileSidebarHeader',
})`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledMobileSidebarContent = styled.div.withConfig({
  displayName: 'StyledMobileSidebarContent',
  componentId: 'StyledMobileSidebarContent',
})`
  flex: 1;
  min-height: 0;
`;

const StyledMobileCloseButton = styled.button.withConfig({
  displayName: 'StyledMobileCloseButton',
  componentId: 'StyledMobileCloseButton',
})`
  min-width: 44px;
  min-height: 44px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export {
  StyledBrand,
  StyledBrandLogo,
  StyledBrandName,
  StyledBrandShortName,
  StyledHamburgerIcon,
  StyledHamburgerLine,
  StyledHeaderMenu,
  StyledHeaderMenuButton,
  StyledOverflowMenuButton,
  StyledHeaderMenuItem,
  StyledHeaderMenuItemContent,
  StyledHeaderMenuItemIcon,
  StyledHeaderMenuItemLabel,
  StyledHeaderMenuItemMeta,
  StyledHeaderMenuSectionTitle,
  StyledHeaderMenuDivider,
  StyledHeaderMenuWrapper,
  StyledHeaderRevealButton,
  StyledHeaderToggleButton,
  StyledHeaderUtilityRow,
  StyledMobileCloseButton,
  StyledMobileSidebarBackdrop,
  StyledMobileSidebarContent,
  StyledMobileSidebarHeader,
  StyledMobileSidebarOverlay,
  StyledMobileSidebarPanel,
  StyledNotificationsBadge,
  StyledNotificationsButton,
  StyledNotificationsEmpty,
  StyledNotificationsItem,
  StyledNotificationsItemContent,
  StyledNotificationsItemIcon,
  StyledNotificationsItemMeta,
  StyledNotificationsItemTitle,
  StyledNotificationsMenu,
  StyledNotificationsWrapper,
  StyledSidebarControls,
  StyledSidebarResizeHandle,
  StyledSidebarWrapper,
  StyledFullscreenButton,
};
