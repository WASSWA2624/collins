/**
 * AuthFrame - Web
 * File: AuthFrame.web.jsx
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
} from './AuthFrame.web.styles';

const AuthFrameWeb = ({ header, banner, notices, footer, overlay, children }) => {
  return (
    <StyledContainer role="main">
      {header ? <StyledHeader>{header}</StyledHeader> : null}
      {banner ? <StyledBanner>{banner}</StyledBanner> : null}
      {notices ? <StyledNotices>{notices}</StyledNotices> : null}
      <StyledContent>{children}</StyledContent>
      {footer ? <StyledFooter>{footer}</StyledFooter> : null}
      {overlay ? <StyledOverlay>{overlay}</StyledOverlay> : null}
    </StyledContainer>
  );
};

export default AuthFrameWeb;

