/**
 * Light Theme
 * File: light.theme.js
 */
import colors from './tokens/colors';
import spacing from './tokens/spacing';
import typography from './tokens/typography';
import radius from './tokens/radius';
import shadows from './tokens/shadows';
import breakpoints from './breakpoints';
import animations from './animations';
import brand from './tokens/brand';

export default {
  colors,
  spacing,
  typography,
  radius,
  shadows,
  breakpoints,
  animations,
  brand: { logo: brand.logoLight },
  mode: 'light',
};

