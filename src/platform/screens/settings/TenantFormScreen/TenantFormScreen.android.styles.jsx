/**
 * TenantFormScreen Android Styles
 */
import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'TenantFormScreen_StyledContainer',
  componentId: 'TenantFormScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledContent = styled.View.withConfig({
  displayName: 'TenantFormScreen_StyledContent',
  componentId: 'TenantFormScreen_StyledContent',
})`
  width: 100%;
  max-width: 600px;
  align-self: center;
`;

const StyledSection = styled.View.withConfig({
  displayName: 'TenantFormScreen_StyledSection',
  componentId: 'TenantFormScreen_StyledSection',
})`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'TenantFormScreen_StyledActions',
  componentId: 'TenantFormScreen_StyledActions',
})`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.xl}px;
`;

export { StyledContainer, StyledContent, StyledSection, StyledActions };
