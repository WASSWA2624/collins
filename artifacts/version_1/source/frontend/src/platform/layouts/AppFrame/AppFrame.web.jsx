/**
 * AppFrame Component - Web
 * Base application frame with slots for header, footer, and overlays
 * File: AppFrame.web.jsx
 */

import React from 'react';
import { useI18n } from '@hooks';
import {
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
} from './AppFrame.web.styles';
import useAppFrame from './useAppFrame';

/**
 * AppFrame component for Web
 * @param {Object} props - AppFrame props
 * @param {React.ReactNode} props.children - Main content
 * @param {React.ReactNode} props.header - Header slot
 * @param {React.ReactNode} props.footer - Footer slot
 * @param {React.ReactNode} props.sidebar - Sidebar slot
 * @param {React.ReactNode} props.breadcrumbs - Breadcrumbs slot
 * @param {React.ReactNode} props.overlay - Overlay slot
 * @param {React.ReactNode} props.banner - Banner slot
 * @param {React.ReactNode} props.notices - Notices slot
 * @param {boolean} props.sidebarCollapsed - Sidebar collapsed state
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 */
const AppFrameWeb = ({
  children,
  header,
  footer,
  sidebar,
  sidebarBackdrop,
  breadcrumbs,
  overlay,
  banner,
  notices,
  sidebarWidth = 260,
  sidebarCollapsed = false,
  collapsedWidth = 64,
  accessibilityLabel,
  testID,
  className,
}) => {
  const { t } = useI18n();
  const { hasBanner, hasBreadcrumbs, hasFooter, hasHeader, hasOverlay, hasSidebar } = useAppFrame({
    header,
    footer,
    sidebar,
    breadcrumbs,
    overlay,
    banner,
  });
  const hasSidebarBackdrop = Boolean(sidebarBackdrop);

  return (
    <StyledContainer
      className={className}
      testID={testID}
      role="main"
      aria-label={accessibilityLabel || t('navigation.mainNavigation')}
    >
      <StyledSkipLink href="#main-content">
        {t('navigation.skipToMainContent')}
      </StyledSkipLink>
      {hasHeader && (
        <StyledHeader role="banner">
          {header}
        </StyledHeader>
      )}
      {hasBanner && (
        <StyledBanner role="region">
          {banner}
        </StyledBanner>
      )}
      {hasBreadcrumbs && (
        <StyledBreadcrumbs aria-label={t('navigation.breadcrumbs.label')}>
          {breadcrumbs}
        </StyledBreadcrumbs>
      )}
      <StyledBody>
        {hasSidebar && hasSidebarBackdrop && sidebarBackdrop}
        {hasSidebar && (
          <StyledSidebar
            role="complementary"
            aria-label={t('navigation.sidebar.label')}
            sidebarWidth={sidebarWidth}
            sidebarCollapsed={sidebarCollapsed}
            collapsedWidth={collapsedWidth}
          >
            {sidebar}
          </StyledSidebar>
        )}
        <StyledContent id="main-content" hasSidebar={hasSidebar} hasFooter={hasFooter}>
          <StyledContentBody hasFooter={hasFooter}>{children}</StyledContentBody>
        </StyledContent>
      </StyledBody>
      {hasFooter && (
        <StyledFooter role="contentinfo">
          {footer}
        </StyledFooter>
      )}
      {notices}
      {hasOverlay && <StyledOverlay>{overlay}</StyledOverlay>}
    </StyledContainer>
  );
};

export default AppFrameWeb;
