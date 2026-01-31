/**
 * HomeScreen Web Styles
 * File: HomeScreen.web.styles.jsx
 */
import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  justify-content: center;
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
`;

const StyledMessage = styled.div.withConfig({
  displayName: 'StyledMessage',
  componentId: 'StyledMessage',
})`
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export { StyledContainer, StyledContent, StyledMessage };
