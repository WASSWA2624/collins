/**
 * AuthLayout - Web
 * File: AuthLayout.web.jsx
 */

import React from 'react';

import {
  StyledBranding,
  StyledCard,
  StyledContainer,
  StyledContent,
  StyledHelpLinks,
} from './AuthLayout.web.styles';

const AuthLayoutWeb = ({
  children,
  branding,
  helpLinks,
  accessibilityLabel,
  testID,
  className,
}) => {
  return (
    <StyledContainer
      role="main"
      className={className}
      {...(accessibilityLabel && { 'aria-label': accessibilityLabel })}
      {...(testID && { 'data-testid': testID })}
    >
      <StyledCard>
        {branding ? <StyledBranding>{branding}</StyledBranding> : null}
        <StyledContent>{children}</StyledContent>
        {helpLinks ? <StyledHelpLinks>{helpLinks}</StyledHelpLinks> : null}
      </StyledCard>
    </StyledContainer>
  );
};

export default AuthLayoutWeb;

