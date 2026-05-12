/**
 * LoadingOverlay iOS Styles
 * Styled-components for iOS platform
 * File: LoadingOverlay.ios.styles.jsx
 */
import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const StyledCard = styled.View.withConfig({
  displayName: 'StyledCard',
  componentId: 'StyledCard',
})`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  min-width: ${({ theme }) => theme.spacing.xl * 6}px;
  align-items: center;
  justify-content: center;
`;

const StyledTitle = styled.Text.withConfig({
  displayName: 'StyledTitle',
  componentId: 'StyledTitle',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledMessage = styled.Text.withConfig({
  displayName: 'StyledMessage',
  componentId: 'StyledMessage',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

export { StyledCard, StyledContainer, StyledMessage, StyledTitle };
