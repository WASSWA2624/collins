/**
 * UnitListScreen Android Styles
 * File: UnitListScreen.android.styles.jsx
 */
import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledContent = styled.View.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  width: 100%;
  max-width: 800px;
  align-self: center;
`;

const StyledList = styled.View.withConfig({
  displayName: 'StyledList',
  componentId: 'StyledList',
})`
  width: 100%;
`;

export { StyledContainer, StyledContent, StyledList };
