/**
 * FacilityFormScreen iOS Styles
 * File: FacilityFormScreen.ios.styles.jsx
 */
import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'FacilityFormScreen_StyledContainer',
  componentId: 'FacilityFormScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledContent = styled.View.withConfig({
  displayName: 'FacilityFormScreen_StyledContent',
  componentId: 'FacilityFormScreen_StyledContent',
})`
  width: 100%;
  max-width: 600px;
  align-self: center;
`;

const StyledSection = styled.View.withConfig({
  displayName: 'FacilityFormScreen_StyledSection',
  componentId: 'FacilityFormScreen_StyledSection',
})`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'FacilityFormScreen_StyledActions',
  componentId: 'FacilityFormScreen_StyledActions',
})`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.xl}px;
`;

export { StyledContainer, StyledContent, StyledSection, StyledActions };
