/**
 * MobileSidebar Styles - Web
 * File: MobileSidebar/MobileSidebar.web.styles.jsx
 */
import styled from 'styled-components';

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
  StyledMobileSidebarOverlay,
  StyledMobileSidebarPanel,
  StyledMobileSidebarBackdrop,
  StyledMobileSidebarHeader,
  StyledMobileSidebarContent,
  StyledMobileCloseButton,
};
