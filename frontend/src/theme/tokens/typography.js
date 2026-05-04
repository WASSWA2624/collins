/**
 * Typography Tokens
 * File: typography.js
 */

export default {
  fontFamily: {
    /** Single font for native (Android/iOS); React Native cannot parse CSS font stacks. */
    regular: 'System',
    medium: 'System',
    bold: 'System',
    /** Web-only: CSS font stack for cross-browser system fonts. */
    regularWeb: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mediumWeb: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    boldWeb: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
  fontWeight: {
    normal: 400,
    regular: 400,
    medium: 500,
    semibold: 600,
    semiBold: 600,
    bold: 700,
  },
};

