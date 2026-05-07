/**
 * High Contrast Theme
 * WCAG AAA compliance
 * File: high-contrast.theme.js
 */
import colors from './tokens/colors';
import spacing from './tokens/spacing';
import typography from './tokens/typography';
import radius from './tokens/radius';
import shadows from './tokens/shadows';
import breakpoints from './breakpoints';
import animations from './animations';
import brand from './tokens/brand';

const highContrastColors = {
  ...colors,
  primary: '#0000FF',
  onPrimary: '#FFFFFF',
  secondary: '#000080',
  success: '#008000',
  warning: '#FF8C00',
  error: '#FF0000',
  background: {
    primary: '#FFFFFF',
    secondary: '#FFFFFF',
    tertiary: '#F0F0F0',
  },
  text: {
    primary: '#000000',
    secondary: '#000000',
    tertiary: '#000000',
    inverse: '#FFFFFF',
  },
  textPrimary: '#000000',
  textSecondary: '#000000',
  status: {
    ...colors.status,
    success: {
      background: '#FFFFFF',
      text: '#006400',
    },
    warning: {
      background: '#FFFFFF',
      text: '#8B4500',
    },
    error: {
      background: '#FFFFFF',
      text: '#B00000',
    },
  },
};

export default {
  colors: highContrastColors,
  spacing,
  typography,
  radius,
  shadows,
  breakpoints,
  animations,
  brand: { logo: brand.logoDark },
  mode: 'high-contrast',
};

