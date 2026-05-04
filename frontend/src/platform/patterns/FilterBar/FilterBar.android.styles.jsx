/**
 * FilterBar Android Styles
 * Styled-components for Android platform
 * File: FilterBar.android.styles.jsx
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


