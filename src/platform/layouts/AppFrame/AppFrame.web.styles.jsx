/**
 * AppFrame Web Styles
 * Styled-components for Web platform
 * File: AppFrame.web.styles.jsx
 */

import styled from 'styled-components';

const StyledContainer = styled.div.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
}).attrs(({ testID }) => ({
  'data-testid': testID,
}))`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100vh;
  width: 100%;
  max-width: 100vw;
  position: relative;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  overflow: hidden;
  box-sizing: border-box;
`;

const StyledHeader = styled.header.withConfig({
  displayName: 'StyledHeader',
  componentId: 'StyledHeader',
})`
  /* Header surface is owned by the header component (e.g. GlobalHeader). */
  padding: 0;
  position: relative;
  z-index: 3;
`;

const StyledBanner = styled.section.withConfig({
  displayName: 'StyledBanner',
  componentId: 'StyledBanner',
})`
  width: 100%;
`;

const StyledBreadcrumbs = styled.nav.withConfig({
  displayName: 'StyledBreadcrumbs',
  componentId: 'StyledBreadcrumbs',
})`
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledBody = styled.div.withConfig({
  displayName: 'StyledBody',
  componentId: 'StyledBody',
})`
  display: flex;
  flex: 1;
  flex-direction: row;
  min-height: 0;
  min-width: 0;
  /* Own the vertical scroll to avoid nested gutters. */
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-gutter: stable;
`;

const StyledSidebar = styled.aside.withConfig({
  displayName: 'StyledSidebar',
  componentId: 'StyledSidebar',
  shouldForwardProp: (prop) => !['sidebarWidth', 'sidebarCollapsed', 'collapsedWidth'].includes(prop),
})`
  display: ${({ sidebarCollapsed }) => (sidebarCollapsed ? 'none' : 'block')};
  width: ${({ sidebarWidth, sidebarCollapsed, collapsedWidth }) =>
    sidebarCollapsed ? `${collapsedWidth}px` : `${sidebarWidth}px`};
  min-width: ${({ sidebarWidth, sidebarCollapsed, collapsedWidth }) =>
    sidebarCollapsed ? `${collapsedWidth}px` : `${sidebarWidth}px`};
  max-width: ${({ sidebarWidth, sidebarCollapsed, collapsedWidth }) =>
    sidebarCollapsed ? `${collapsedWidth}px` : `${sidebarWidth}px`};
  flex: 0 0 auto;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-right: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  overflow: hidden;
  transition: width 0.2s ease;
  position: relative;
  box-shadow: ${({ theme }) => {
    const shadow = theme.shadows?.sm;
    if (!shadow) return 'none';
    return `${shadow.shadowOffset?.width || 0}px ${shadow.shadowOffset?.height || 1}px ${shadow.shadowRadius || 2}px rgba(0, 0, 0, ${shadow.shadowOpacity || 0.1})`;
  }};

  /* Mobile: overlay when open */
  @media (max-width: 767px) {
    display: ${({ sidebarCollapsed }) => (sidebarCollapsed ? 'none' : 'block')};
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1001;
    width: 280px;
    min-width: 280px;
    max-width: 280px;
  }

  /* Tablet+: inline sidebar */
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}px) {
    display: block;
    position: relative;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const StyledContent = styled.main.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
  shouldForwardProp: (prop) => !['hasSidebar', 'hasFooter'].includes(prop),
})`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md}px ${({ theme }) => theme.spacing.md}px ${({ theme }) => theme.spacing.lg}px;
  margin: 0;
  min-width: 0;
  overflow-x: hidden;
  overflow-y: visible;
  background-color: ${({ theme }) => theme.colors.background.primary};
  display: flex;
  flex-direction: column;
  gap: 0;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    padding-left: ${({ theme }) => theme.spacing.xl}px;
    padding-right: ${({ theme }) => theme.spacing.xl}px;
  }
`;

const StyledContentBody = styled.div.withConfig({
  displayName: 'StyledContentBody',
  componentId: 'StyledContentBody',
})`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow-x: hidden;
  overflow-y: visible;
`;

const FOOTER_HEIGHT_PX = 48;

const StyledFooter = styled.footer.withConfig({
  displayName: 'StyledFooter',
  componentId: 'StyledFooter',
})`
  flex-shrink: 0;
  flex-grow: 0;
  height: ${FOOTER_HEIGHT_PX}px;
  min-height: ${FOOTER_HEIGHT_PX}px;
  max-height: ${FOOTER_HEIGHT_PX}px;
  overflow: hidden;
  /* Footer surface is owned by the footer component (e.g. GlobalFooter). */
  background-color: transparent;
  border-top: none;
  padding: 0;
  margin: 0;
`;

const StyledOverlay = styled.div.withConfig({
  displayName: 'StyledOverlay',
  componentId: 'StyledOverlay',
})`
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.overlay.backdrop};
  backdrop-filter: blur(${({ theme }) => theme.spacing.sm}px);
  -webkit-backdrop-filter: blur(${({ theme }) => theme.spacing.sm}px);
`;

const StyledSkipLink = styled.a.withConfig({
  displayName: 'StyledSkipLink',
  componentId: 'StyledSkipLink',
})`
  position: absolute;
  top: ${({ theme }) => -theme.spacing.xl - theme.spacing.sm}px;
  left: 0;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  padding: ${({ theme }) => theme.spacing.xs}px;
  text-decoration: none;
  z-index: 6;

  &:focus {
    top: 0;
  }
`;

export {
  StyledBody,
  StyledBanner,
  StyledBreadcrumbs,
  StyledContainer,
  StyledContent,
  StyledContentBody,
  StyledFooter,
  StyledHeader,
  StyledOverlay,
  StyledSidebar,
  StyledSkipLink,
};
