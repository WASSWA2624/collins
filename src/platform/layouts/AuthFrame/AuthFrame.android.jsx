/**
 * AuthFrame - Android
 * File: AuthFrame.android.jsx
 */

import React from 'react';

import {
  StyledBanner,
  StyledContainer,
  StyledContent,
  StyledFooter,
  StyledHeader,
  StyledNotices,
  StyledOverlay,
} from './AuthFrame.android.styles';

const AuthFrameAndroid = ({
  header,
  banner,
  notices,
  footer,
  overlay,
  children,
}) => {
  return (
    <StyledContainer accessibilityRole="main">
      {header ? <StyledHeader>{header}</StyledHeader> : null}
      {banner ? <StyledBanner>{banner}</StyledBanner> : null}
      {notices ? <StyledNotices>{notices}</StyledNotices> : null}
      <StyledContent>{children}</StyledContent>
      {footer ? <StyledFooter>{footer}</StyledFooter> : null}
      {overlay ? <StyledOverlay>{overlay}</StyledOverlay> : null}
    </StyledContainer>
  );
};

export default AuthFrameAndroid;

