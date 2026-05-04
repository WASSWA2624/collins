/**
 * Spacer Web Styles
 * File: Spacer.web.styles.jsx
 */

import styled from 'styled-components';

const StyledSpacer = styled.div.withConfig({
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
  flex: 0 0 auto;
`;

export { StyledSpacer };



