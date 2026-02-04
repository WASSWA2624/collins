/**
 * Divider Web Styles
 * Styled-components for Web platform
 * File: Divider.web.styles.jsx
 */

import styled from 'styled-components';

const StyledDivider = styled.hr.withConfig({
  displayName: 'StyledDivider',
  componentId: 'StyledDivider',
})`
  background-color: ${({ theme }) => theme.colors.background.tertiary};
  border: none;
  margin: 0;
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



