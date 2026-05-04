/**
 * Text Android Styles
 * Styled-components for Android platform
 * File: Text.android.styles.jsx
 */
import styled from 'styled-components/native';

const resolveThemeColor = (theme, color) => {
  if (typeof color !== 'string') return theme.colors.text.primary;

  const token = color.trim();
  if (token.length === 0) return theme.colors.text.primary;

  // Support nested theme tokens like "text.primary" or "audit.action.CREATE"
  const fromPath = token.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), theme.colors);
  if (typeof fromPath === 'string') return fromPath;

  // Support top-level theme colors like "primary" / "error"
  const fromTopLevel = theme.colors[token];
  if (typeof fromTopLevel === 'string') return fromTopLevel;

  // Back-compat: allow passing a resolved color value (e.g. theme.colors.text.tertiary)
  return token;
};

const StyledText = styled.Text.withConfig({
  displayName: 'StyledText',
  componentId: 'StyledText',
})`
  font-family: ${({ variant, theme }) => {
    const isHeading = variant === 'h1' || variant === 'h2' || variant === 'h3';
    return isHeading ? theme.typography.fontFamily.bold : theme.typography.fontFamily.regular;
  }};
  font-size: ${({ variant, theme }) => {
    const sizes = {
      h1: theme.typography.fontSize.xxl,
      h2: theme.typography.fontSize.xl,
      h3: theme.typography.fontSize.lg,
      body: theme.typography.fontSize.md,
      caption: theme.typography.fontSize.sm,
      label: theme.typography.fontSize.sm,
    };
    return sizes[variant] || sizes.body;
  }}px;
  font-weight: ${({ variant, theme }) => {
    const isHeading = variant === 'h1' || variant === 'h2' || variant === 'h3';
    const isLabel = variant === 'label';
    if (isHeading) return theme.typography.fontWeight.bold;
    if (isLabel) return theme.typography.fontWeight.semibold;
    return theme.typography.fontWeight.normal;
  }};
  line-height: ${({ variant, theme }) => {
    const lineHeights = {
      h1: theme.typography.fontSize.xxl * theme.typography.lineHeight.tight,
      h2: theme.typography.fontSize.xl * theme.typography.lineHeight.tight,
      h3: theme.typography.fontSize.lg * theme.typography.lineHeight.normal,
      body: theme.typography.fontSize.md * theme.typography.lineHeight.normal,
      caption: theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
      label: theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
    };
    return lineHeights[variant] || lineHeights.body;
  }}px;
  color: ${({ color, theme }) => {
    return resolveThemeColor(theme, color);
  }};
  text-align: ${({ align }) => align || 'left'};
`;

export { StyledText };


