/**
 * FilterBar Web Styles
 * Styled-components for Web platform
 * File: FilterBar.web.styles.jsx
 */

import styled from 'styled-components';

const StyledContainer = styled.div.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
  align-items: center;
  width: 100%;
`;

export {
  StyledContainer,
};



