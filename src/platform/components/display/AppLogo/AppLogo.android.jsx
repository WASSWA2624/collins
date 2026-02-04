/**
 * AppLogo Component - Android
 * Theme-aware app logo (light/dark from theme.mode).
 * File: AppLogo.android.jsx
 */
import React from 'react';
import { useTheme } from 'styled-components/native';
import { StyledLogoWrapper, StyledLogoImage } from './AppLogo.android.styles';
import { SIZES } from './types';

const LOGO_LIGHT = require('../../../../../public/logos/logo-light.png');
const LOGO_DARK = require('../../../../../public/logos/logo-dark.png');

const getSource = (mode) => (mode === 'dark' || mode === 'high-contrast' ? LOGO_DARK : LOGO_LIGHT);

const AppLogoAndroid = ({ size = 'md', accessibilityLabel, testID, ...rest }) => {
  const theme = useTheme();
  const source = getSource(theme?.mode ?? 'light');

  return (
    <StyledLogoWrapper $size={size} accessibilityElementsHidden={!accessibilityLabel} testID={testID} {...rest}>
      <StyledLogoImage
        source={source}
        resizeMode="contain"
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={accessibilityLabel ? 'image' : undefined}
      />
    </StyledLogoWrapper>
  );
};

export default AppLogoAndroid;
