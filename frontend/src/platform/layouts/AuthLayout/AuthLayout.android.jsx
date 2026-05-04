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
  StyledContentWrapper,
  StyledHelpLinks,
  StyledKeyboardAvoidingView,
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

export default AuthLayoutAndroid;

