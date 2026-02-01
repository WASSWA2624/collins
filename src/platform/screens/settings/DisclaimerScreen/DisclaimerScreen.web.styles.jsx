/**
 * DisclaimerScreen Web Styles
 * File: DisclaimerScreen.web.styles.jsx
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
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
`;

const StyledSection = styled.section.withConfig({
  displayName: 'StyledSection',
  componentId: 'StyledSection',
})`
  padding: ${({ theme }) => theme.spacing.md}px 0;
`;

const StyledNotice = styled.div.withConfig({
  displayName: 'StyledNotice',
  componentId: 'StyledNotice',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.status?.warning?.background ?? theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radii?.md ?? 8}px;
`;

export { StyledContainer, StyledContent, StyledSection, StyledNotice };
