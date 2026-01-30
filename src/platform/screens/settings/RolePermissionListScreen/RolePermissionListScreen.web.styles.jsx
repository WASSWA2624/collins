/**
 * RolePermissionListScreen Web Styles
 * File: RolePermissionListScreen.web.styles.jsx
 */
import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  width: 100%;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const StyledListBody = styled.div.withConfig({
  displayName: 'StyledListBody',
  componentId: 'RolePermissionListScreen_StyledListBody',
})`
  margin-top: ${({ theme }) => theme?.spacing?.md ?? 16}px;
`;

const StyledList = styled.ul.withConfig({
  displayName: 'StyledList',
  componentId: 'StyledList',
})`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme?.spacing?.sm ?? 8}px;
`;

export { StyledContainer, StyledContent, StyledListBody, StyledList };
