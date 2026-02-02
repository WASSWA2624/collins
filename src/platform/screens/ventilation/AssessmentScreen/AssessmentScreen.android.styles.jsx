/**
 * AssessmentScreen Android Styles
 * File: AssessmentScreen.android.styles.jsx
 */
import styled from 'styled-components/native';
import { View, Text, Pressable } from 'react-native';

const StyledContentWrap = styled(View).withConfig({
  displayName: 'StyledContentWrap',
  componentId: 'StyledContentWrap',
})`
  flex: 1;
`;

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
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px ${({ theme }) => theme.spacing.xl}px;
  background-color: ${({ theme }) => theme.colors.status?.warning?.background ?? '#FFFBF0'};
  border-radius: ${({ theme }) => theme.radius?.md ?? 8}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.warning ?? 'rgba(255, 149, 0, 0.35)'};
  border-left-width: 4px;
  border-left-color: ${({ theme }) => theme.colors.warning ?? '#FF9500'};
`;

const StyledFieldGroup = styled(View).withConfig({
  displayName: 'StyledFieldGroup',
  componentId: 'StyledFieldGroup',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledStepDescription = styled(Text).withConfig({
  displayName: 'StyledStepDescription',
  componentId: 'StyledStepDescription',
})`
  font-size: ${({ theme }) => theme.typography?.fontSize?.sm ?? 14}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledRecommendationSource = styled(View).withConfig({
  displayName: 'StyledRecommendationSource',
  componentId: 'StyledRecommendationSource',
})`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  padding-top: ${({ theme }) => theme.spacing.md}px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledSourceOption = styled(Pressable).withConfig({
  displayName: 'StyledSourceOption',
  componentId: 'StyledSourceOption',
})`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSourceOptionLabel = styled(Text).withConfig({
  displayName: 'StyledSourceOptionLabel',
  componentId: 'StyledSourceOptionLabel',
})`
  font-weight: ${({ theme }) => theme.typography?.fontWeight?.semibold ?? 600};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledSourceOptionDesc = styled(Text).withConfig({
  displayName: 'StyledSourceOptionDesc',
  componentId: 'StyledSourceOptionDesc',
})`
  font-size: ${({ theme }) => theme.typography?.fontSize?.sm ?? 14}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledModelRow = styled(View).withConfig({
  displayName: 'StyledModelRow',
  componentId: 'StyledModelRow',
})`
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export {
  StyledActionsRow,
  StyledContainer,
  StyledContentWrap,
  StyledFieldGroup,
  StyledMissingTests,
  StyledModelRow,
  StyledRecommendationSource,
  StyledSourceOption,
  StyledSourceOptionDesc,
  StyledSourceOptionLabel,
  StyledStepContent,
  StyledStepDescription,
  StyledStepHeader,
  StyledSummaryBody,
  StyledSummaryHeader,
  StyledSummaryPane,
  StyledSummaryRow,
  StyledWizardPane,
};
