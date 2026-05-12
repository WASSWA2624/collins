/**
 * PatientFrame - Web
 * File: PatientFrame.web.jsx
 */
import React from 'react';

import {
  StyledBanner,
  StyledBreadcrumbs,
  StyledContainer,
  StyledContent,
  StyledFooter,
  StyledHeader,
  StyledNotices,
  StyledOverlay,
  StyledSidebar,
} from './PatientFrame.web.styles';

const PatientFrameWeb = ({
  children,
  header,
  sidebar,
  breadcrumbs,
  banner,
  notices,
  footer,
  overlay,
  accessibilityLabel,
  testID,
  className,
  style,
  ...rest
}) => (
  <StyledContainer
    aria-label={accessibilityLabel}
    data-testid={testID}
    className={className}
    style={style}
    {...rest}
  >
    {header ? <StyledHeader>{header}</StyledHeader> : null}
    {breadcrumbs ? <StyledBreadcrumbs>{breadcrumbs}</StyledBreadcrumbs> : null}
    {banner ? <StyledBanner>{banner}</StyledBanner> : null}
    {notices ? <StyledNotices>{notices}</StyledNotices> : null}
    {sidebar ? <StyledSidebar>{sidebar}</StyledSidebar> : null}
    <StyledContent>{children}</StyledContent>
    {footer ? <StyledFooter>{footer}</StyledFooter> : null}
    {overlay ? <StyledOverlay>{overlay}</StyledOverlay> : null}
  </StyledContainer>
);

export default PatientFrameWeb;
