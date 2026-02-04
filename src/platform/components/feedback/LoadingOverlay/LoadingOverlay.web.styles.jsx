/**
 * LoadingOverlay Web Styles
 * Styled-components for Web platform
 * File: LoadingOverlay.web.styles.jsx
 */
import styled from 'styled-components';

const StyledContainer = styled.div.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const StyledCard = styled.div.withConfig({
  displayName: 'StyledCard',
  componentId: 'StyledCard',
})`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  min-width: ${({ theme }) => theme.spacing.xl * 6}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  box-shadow: ${({ theme }) => theme.shadows?.md || '0 6px 16px rgba(0, 0, 0, 0.16)'};
`;

const StyledTitle = styled.div.withConfig({
  displayName: 'StyledTitle',
  componentId: 'StyledTitle',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.mediumWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
`;

const StyledMessage = styled.div.withConfig({
  displayName: 'StyledMessage',
  componentId: 'StyledMessage',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
`;

export { StyledCard, StyledContainer, StyledMessage, StyledTitle };

