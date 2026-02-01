/**
 * AuthLayout - Android
 * File: AuthLayout.android.jsx
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
} from './AuthLayout.android.styles';

const AuthLayoutAndroid = ({
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

export default AuthLayoutAndroid;

