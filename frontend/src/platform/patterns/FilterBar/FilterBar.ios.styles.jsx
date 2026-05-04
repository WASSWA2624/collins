/**
 * FilterBar iOS Styles
 * Styled-components for iOS platform
 * File: FilterBar.ios.styles.jsx
 */

import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
  align-items: center;
  width: 100%;
`;

export {
  StyledContainer,
};


