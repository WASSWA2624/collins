/**
 * HomeScreen Web Styles
 * Word-like document layout: full-bleed container, elegant content area.
 * File: HomeScreen.web.styles.jsx
 */
import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme }) => theme.spacing.xl}px ${({ theme }) => theme.spacing.lg}px;
  box-sizing: border-box;
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  padding-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledMessage = styled.div.withConfig({
  displayName: 'StyledMessage',
  componentId: 'StyledMessage',
})`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export { StyledContainer, StyledContent, StyledMessage };
