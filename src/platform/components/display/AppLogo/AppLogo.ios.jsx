/**
 * AppLogo Component - iOS
 * Theme-aware app logo (light/dark from theme.mode).
 * File: AppLogo.ios.jsx
 */
import React from 'react';
import { useTheme } from 'styled-components/native';
import { StyledLogoWrapper, StyledLogoImage } from './AppLogo.ios.styles';
import { SIZES } from './types';

const LOGO_LIGHT = require('../../../../../assets/logos/logo-light.png');
const LOGO_DARK = require('../../../../../assets/logos/logo-dark.png');

const getSource = (mode) => (mode === 'dark' || mode === 'high-contrast' ? LOGO_DARK : LOGO_LIGHT);

const AppLogoIOS = ({ size = 'md', accessibilityLabel, testID, ...rest }) => {
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

export default AppLogoIOS;
