/**
 * AuthLayout Web Styles
 * Styled-components for Web platform
 * File: AuthLayout.web.styles.jsx
 */

import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledCard = styled.div.withConfig({
  displayName: 'StyledCard',
  componentId: 'StyledCard',
})`
  width: 100%;
  max-width: 520px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledBranding = styled.div.withConfig({
  displayName: 'StyledBranding',
  componentId: 'StyledBranding',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})``;

const StyledHelpLinks = styled.div.withConfig({
  displayName: 'StyledHelpLinks',
  componentId: 'StyledHelpLinks',
})`
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export { StyledContainer, StyledCard, StyledBranding, StyledContent, StyledHelpLinks };


