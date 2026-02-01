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
  StyledHelpLinks,
  StyledKeyboardAvoidingView,
  StyledScrollView,
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
        <StyledScrollView keyboardShouldPersistTaps="handled">
          <StyledCard>
            {branding ? <StyledBranding>{branding}</StyledBranding> : null}
            <StyledContent>{children}</StyledContent>
            {helpLinks ? <StyledHelpLinks>{helpLinks}</StyledHelpLinks> : null}
          </StyledCard>
        </StyledScrollView>
      </StyledKeyboardAvoidingView>
    </StyledContainer>
  );
};

export default AuthLayoutIOS;

