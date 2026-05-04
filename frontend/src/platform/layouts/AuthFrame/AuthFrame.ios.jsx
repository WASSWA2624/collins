/**
 * AuthFrame - iOS
 * File: AuthFrame.ios.jsx
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
} from './AuthFrame.ios.styles';

const AuthFrameIOS = ({ header, banner, notices, footer, overlay, children }) => {
  return (
    <StyledContainer>
      {header ? <StyledHeader>{header}</StyledHeader> : null}
      {banner ? <StyledBanner>{banner}</StyledBanner> : null}
      {notices ? <StyledNotices>{notices}</StyledNotices> : null}
      <StyledContent>{children}</StyledContent>
      {footer ? <StyledFooter>{footer}</StyledFooter> : null}
      {overlay ? <StyledOverlay>{overlay}</StyledOverlay> : null}
    </StyledContainer>
  );
};

export default AuthFrameIOS;

