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
  min-height: 100dvh;
  height: 100vh;
  height: 100dvh;
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
  padding: ${({ theme }) => theme.spacing.xs}px 0;
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
  box-sizing: border-box;
  /* Own the vertical scroll to avoid nested gutters. */
  overflow-x: hidden;
  overflow-y: auto;
  @supports (scrollbar-gutter: stable) {
    scrollbar-gutter: stable;
  }

  @supports not (scrollbar-gutter: stable) {
    /* Reserve a gutter when overlay scrollbars are used. */
    padding-right: calc(100vw - 100%);
  }

  scrollbar-width: auto;
  scrollbar-color: ${({ theme }) =>
    `${theme.colors.background.tertiary} ${theme.colors.background.secondary}`};

  &::-webkit-scrollbar {
    width: calc(${({ theme }) => theme.spacing.sm}px + ${({ theme }) => theme.spacing.xs}px);
  }

  &::-webkit-scrollbar-track {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
    border-radius: ${({ theme }) => theme.radius?.lg ?? 12}px;
    border: ${({ theme }) => theme.spacing.xs}px solid ${({ theme }) => theme.colors.background.secondary};
  }
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
  min-height: 0;
  padding: 0;
  margin: 0;
  min-width: 0;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors.background.primary};
  display: flex;
  flex-direction: column;
  gap: 0;
  max-width: 100%;
  box-sizing: border-box;
`;

const FOOTER_CONTENT_HEIGHT_PX = 56;

const StyledContentBody = styled.div.withConfig({
  displayName: 'StyledContentBody',
  componentId: 'StyledContentBody',
  shouldForwardProp: (prop) => prop !== 'hasFooter',
})`
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  min-height: min-content;
  min-width: 0;
  overflow-x: hidden;
  overflow-y: visible;
  padding-bottom: ${({ theme, hasFooter }) =>
    hasFooter
      ? `calc(${FOOTER_CONTENT_HEIGHT_PX}px + env(safe-area-inset-bottom, 0px))`
      : `calc(${theme.spacing.xl}px + env(safe-area-inset-bottom, 0px))`};
  box-sizing: border-box;
`;

const FOOTER_HEIGHT_PX = 56;

const StyledFooter = styled.footer.withConfig({
  displayName: 'StyledFooter',
  componentId: 'StyledFooter',
})`
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: ${FOOTER_HEIGHT_PX}px;
  display: flex;
  align-items: center;
  height: ${FOOTER_HEIGHT_PX}px;
  min-height: ${FOOTER_HEIGHT_PX}px;
  max-height: ${FOOTER_HEIGHT_PX}px;
  overflow: hidden;
  /* Footer surface is owned by the footer component (e.g. GlobalFooter). */
  background-color: transparent;
  border-top: none;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
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

