/**
 * Dark Theme
 * File: dark.theme.js
 */
import colors from './tokens/colors';
import spacing from './tokens/spacing';
import typography from './tokens/typography';
import radius from './tokens/radius';
import shadows from './tokens/shadows';
import breakpoints from './breakpoints';
import animations from './animations';
import brand from './tokens/brand';

// Override colors for dark mode (WCAG AA contrast for callouts)
const darkColors = {
  ...colors,
  background: {
    primary: '#000000',
    secondary: '#1C1C1E',
    tertiary: '#2C2C2E',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#EBEBF5',
    tertiary: '#8E8E93',
    inverse: '#000000',
  },
  textPrimary: '#FFFFFF',
  textSecondary: '#EBEBF5',
  onPrimary: '#FFFFFF',
  status: {
    ...colors.status,
    warning: {
      background: '#5C4A00',
      text: '#FFF8E1',
    },
    error: {
      background: '#4A1515',
      text: '#FFEBEE',
    },
  },
};

export default {
  colors: darkColors,
  spacing,
  typography,
  radius,
  shadows,
  breakpoints,
  animations,
  brand: { logo: brand.logoDark },
  mode: 'dark',
};

