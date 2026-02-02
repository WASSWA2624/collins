/**
 * AuthLayout - iOS
 * File: AuthLayout.ios.jsx
 */

import React from 'react';

import {
  StyledBranding,
  StyledCard,
  StyledContainer,
  StyledContent,
  StyledContentWrapper,
  StyledHelpLinks,
  StyledKeyboardAvoidingView,
} from './AuthLayout.ios.styles';

const AuthLayoutIOS = ({
  children,
  branding,
  helpLinks,
  accessibilityLabel,
  testID,
}) => {
  return (
    <StyledContainer
      accessibilityRole="main"
      {...(accessibilityLabel && { accessibilityLabel })}
      {...(testID && { testID })}
    >
      <StyledKeyboardAvoidingView behavior="padding">
        <StyledContentWrapper>
          <StyledCard>
            {branding ? <StyledBranding>{branding}</StyledBranding> : null}
            <StyledContent>{children}</StyledContent>
            {helpLinks ? <StyledHelpLinks>{helpLinks}</StyledHelpLinks> : null}
          </StyledCard>
        </StyledContentWrapper>
      </StyledKeyboardAvoidingView>
    </StyledContainer>
  );
};

export default AuthLayoutIOS;

