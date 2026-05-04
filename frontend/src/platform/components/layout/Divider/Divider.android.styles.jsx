/**
 * Divider Android Styles
 * Styled-components for Android platform
 * File: Divider.android.styles.jsx
 */

import styled from 'styled-components/native';

const StyledDivider = styled.View.withConfig({
  displayName: 'StyledDivider',
  componentId: 'StyledDivider',
})`
  background-color: ${({ theme }) => theme.colors.background.tertiary};
  ${({ orientation }) => {
    if (orientation === 'vertical') {
      return `
        width: 1px;
        height: 100%;
      `;
    }
    return `
      width: 100%;
      height: 1px;
    `;
  }}
`;

export { StyledDivider };


