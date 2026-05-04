/**
 * AppLogo Component - Web
 * Theme-aware app logo (light/dark from theme.brand.logo).
 * File: AppLogo.web.jsx
 */
import React from 'react';
import { useTheme } from 'styled-components';
import { StyledLogoWrapper, StyledLogoImg } from './AppLogo.web.styles';
import { SIZES } from './types';

const AppLogoWeb = ({ size = 'md', accessibilityLabel, testID, ...rest }) => {
  const theme = useTheme();
  const logo = theme?.brand?.logo ?? '/logos/logo-light.png';

  return (
    <StyledLogoWrapper $size={size} aria-hidden={!accessibilityLabel} data-testid={testID} {...rest}>
      <StyledLogoImg
        src={logo}
        alt={accessibilityLabel || ''}
        role={accessibilityLabel ? 'img' : 'presentation'}
      />
    </StyledLogoWrapper>
  );
};

export default AppLogoWeb;
