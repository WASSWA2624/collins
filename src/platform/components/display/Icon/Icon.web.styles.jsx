/**
 * Icon Web Styles
 * Styled-components for Web platform (HTML primitives).
 * File: Icon.web.styles.jsx
 */

import styled from 'styled-components';

const resolveFontSize = ({ theme, size }) => {
  if (typeof size === 'number') return size;
  return theme.typography.fontSize[size] || theme.typography.fontSize.md;
};

const resolveColor = ({ theme, tone }) => {
  if (tone === 'primary') return theme.colors.primary;
  if (tone === 'secondary') return theme.colors.secondary;
  if (tone === 'muted') return theme.colors.text.tertiary;
  if (tone === 'success') return theme.colors.success;
  if (tone === 'warning') return theme.colors.warning;
  if (tone === 'error') return theme.colors.error;
  if (tone === 'inverse') return theme.colors.text.inverse;
  return theme.colors.text.primary;
};

const StyledIcon = styled.span.withConfig({
  displayName: 'StyledIcon',
  componentId: 'StyledIcon',
})`
  font-family: "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "Android Emoji", ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${(props) => resolveFontSize(props)}px;
  line-height: ${(props) => Math.round(resolveFontSize(props) * 1.2)}px;
  color: ${(props) => resolveColor(props)};
  display: inline-block;
  vertical-align: middle;
`;

export { StyledIcon };



