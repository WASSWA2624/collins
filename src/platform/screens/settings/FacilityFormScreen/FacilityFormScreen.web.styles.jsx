/**
 * FacilityFormScreen Web Styles
 * File: FacilityFormScreen.web.styles.jsx
 */
import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'FacilityFormScreen_StyledContainer',
  componentId: 'FacilityFormScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledContent = styled.div.withConfig({
  displayName: 'FacilityFormScreen_StyledContent',
  componentId: 'FacilityFormScreen_StyledContent',
})`
  width: 100%;
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
`;

const StyledSection = styled.section.withConfig({
  displayName: 'FacilityFormScreen_StyledSection',
  componentId: 'FacilityFormScreen_StyledSection',
})`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledActions = styled.div.withConfig({
  displayName: 'FacilityFormScreen_StyledActions',
  componentId: 'FacilityFormScreen_StyledActions',
})`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.xl}px;
`;

export { StyledContainer, StyledContent, StyledSection, StyledActions };
