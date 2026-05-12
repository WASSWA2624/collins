/**
 * OnboardingScreen Android Styles (P013)
 */
import styled from 'styled-components/native';
import { ScrollView, View } from 'react-native';

const StyledContainer = styled(ScrollView).withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled(View).withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  flex: 1;
  width: 100%;
  max-width: 640px;
  align-self: center;
`;

const StyledSection = styled(View).withConfig({
  displayName: 'StyledSection',
  componentId: 'StyledSection',
})`
  padding: ${({ theme }) => theme.spacing.md}px 0;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledAcknowledgement = styled(View).withConfig({
  displayName: 'StyledAcknowledgement',
  componentId: 'StyledAcknowledgement',
})`
  align-self: flex-start;
  max-width: 100%;
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-top: ${({ theme }) => -theme.spacing.xs}px;
`;

const StyledActions = styled(View).withConfig({
  displayName: 'StyledActions',
  componentId: 'StyledActions',
})`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: auto;
  padding-top: ${({ theme }) => theme.spacing.lg}px;
`;

export { StyledContainer, StyledContent, StyledSection, StyledAcknowledgement, StyledActions };
