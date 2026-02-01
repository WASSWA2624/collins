/**
 * AssessmentScreen iOS Styles
 * File: AssessmentScreen.ios.styles.jsx
 */
import styled from 'styled-components/native';
import { View } from 'react-native';

const StyledContainer = styled(View).withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledWizardPane = styled(View).withConfig({
  displayName: 'StyledWizardPane',
  componentId: 'StyledWizardPane',
})`
  flex: 1;
`;

const StyledSummaryPane = styled(View).withConfig({
  displayName: 'StyledSummaryPane',
  componentId: 'StyledSummaryPane',
})`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radius?.md ?? 8}px;
`;

const StyledStepHeader = styled(View).withConfig({
  displayName: 'StyledStepHeader',
  componentId: 'StyledStepHeader',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledStepContent = styled(View).withConfig({
  displayName: 'StyledStepContent',
  componentId: 'StyledStepContent',
})`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledSummaryHeader = styled(View).withConfig({
  displayName: 'StyledSummaryHeader',
  componentId: 'StyledSummaryHeader',
})`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSummaryBody = styled(View).withConfig({
  displayName: 'StyledSummaryBody',
  componentId: 'StyledSummaryBody',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSummaryRow = styled(View).withConfig({
  displayName: 'StyledSummaryRow',
  componentId: 'StyledSummaryRow',
})`
  flex-direction: row;
  justify-content: space-between;
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledActionsRow = styled(View).withConfig({
  displayName: 'StyledActionsRow',
  componentId: 'StyledActionsRow',
})`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
  flex-wrap: wrap;
`;

const StyledMissingTests = styled(View).withConfig({
  displayName: 'StyledMissingTests',
  componentId: 'StyledMissingTests',
})`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  padding: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.status?.warning?.background ?? '#FFF3CD'};
  border-radius: ${({ theme }) => theme.radius?.sm ?? 4}px;
  border-left-width: 4px;
  border-left-color: ${({ theme }) => theme.colors.status?.warning?.text ?? theme.colors?.warning ?? '#856404'};
`;

const StyledFieldGroup = styled(View).withConfig({
  displayName: 'StyledFieldGroup',
  componentId: 'StyledFieldGroup',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

export {
  StyledActionsRow,
  StyledContainer,
  StyledFieldGroup,
  StyledMissingTests,
  StyledStepContent,
  StyledStepHeader,
  StyledSummaryBody,
  StyledSummaryHeader,
  StyledSummaryPane,
  StyledSummaryRow,
  StyledWizardPane,
};
