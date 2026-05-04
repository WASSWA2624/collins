/**
 * Icon Android Styles
 * Styled-components for Android platform.
 * File: Icon.android.styles.jsx
 */

import styled from 'styled-components/native';

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

/** Android requires a single font name; never use CSS font stacks. */
const NATIVE_FONT = 'System';

const StyledIconText = styled.Text.withConfig({
  displayName: 'StyledIconText',
  componentId: 'StyledIconText',
})`
  font-family: ${NATIVE_FONT};
  font-size: ${(props) => resolveFontSize(props)}px;
  line-height: ${(props) => Math.round(resolveFontSize(props) * 1.2)}px;
  color: ${(props) => resolveColor(props)};
`;

export { StyledIconText };


