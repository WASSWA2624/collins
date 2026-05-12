/**
 * OnboardingScreen Web Styles (P013)
 */
import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl}px ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  box-sizing: border-box;
  overflow-y: auto;

  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing.lg}px ${({ theme }) => theme.spacing.md}px;
  }
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  min-height: calc(100vh - ${({ theme }) => theme.spacing.xl * 2}px);
  display: flex;
  flex-direction: column;
`;

const StyledSection = styled.section.withConfig({
  displayName: 'StyledSection',
  componentId: 'StyledSection',
})`
  padding: ${({ theme }) => theme.spacing.md}px 0;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledAcknowledgement = styled.div.withConfig({
  displayName: 'StyledAcknowledgement',
  componentId: 'StyledAcknowledgement',
})`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-top: ${({ theme }) => -theme.spacing.xs}px;
`;

const StyledActions = styled.div.withConfig({
  displayName: 'StyledActions',
  componentId: 'StyledActions',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: auto;
  padding-top: ${({ theme }) => theme.spacing.lg}px;
`;

export { StyledContainer, StyledContent, StyledSection, StyledAcknowledgement, StyledActions };
