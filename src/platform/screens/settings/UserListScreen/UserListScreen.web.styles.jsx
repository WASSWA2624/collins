/**
 * UserListScreen Web Styles
 */
import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'UserListScreen_StyledContainer',
})`
  flex: 1;
  min-width: 0;
  padding: ${({ theme }) => theme?.spacing?.xl ?? 24}px;
  background-color: ${({ theme }) => theme?.colors?.background?.primary ?? theme?.colors?.background ?? '#ffffff'};
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'UserListScreen_StyledContent',
})`
  width: 100%;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const StyledListBody = styled.div.withConfig({
  displayName: 'StyledListBody',
  componentId: 'UserListScreen_StyledListBody',
})`
  margin-top: ${({ theme }) => theme?.spacing?.md ?? 16}px;
`;

const StyledList = styled.ul.withConfig({
  displayName: 'StyledList',
  componentId: 'UserListScreen_StyledList',
})`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme?.spacing?.sm ?? 8}px;
`;

export { StyledContainer, StyledContent, StyledListBody, StyledList };
