/**
 * Spacer Android Styles
 * File: Spacer.android.styles.jsx
 */

import styled from 'styled-components/native';

const StyledSpacer = styled.View.withConfig({
  displayName: 'StyledSpacer',
  componentId: 'StyledSpacer',
})`
  width: ${({ theme, axis, size }) => {
    if (axis !== 'horizontal') return '1px';
    const px = theme.spacing?.[size] || theme.spacing?.md || 0;
    return `${px}px`;
  }};
  height: ${({ theme, axis, size }) => {
    if (axis !== 'vertical') return '1px';
    const px = theme.spacing?.[size] || theme.spacing?.md || 0;
    return `${px}px`;
  }};
`;

export { StyledSpacer };


