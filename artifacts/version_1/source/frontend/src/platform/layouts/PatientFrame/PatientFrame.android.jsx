/**
 * PatientFrame - Android
 * File: PatientFrame.android.jsx
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
} from './PatientFrame.android.styles';

const PatientFrameAndroid = ({
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
  style,
  ...rest
}) => (
  <StyledContainer
    accessibilityLabel={accessibilityLabel}
    testID={testID}
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
    {overlay ? <StyledOverlay pointerEvents="box-none">{overlay}</StyledOverlay> : null}
  </StyledContainer>
);

export default PatientFrameAndroid;
