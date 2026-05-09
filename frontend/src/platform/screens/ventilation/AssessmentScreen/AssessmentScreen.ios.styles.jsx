/**
 * AssessmentScreen iOS Styles
 * File: AssessmentScreen.ios.styles.jsx
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
  padding: ${({ theme }) => theme.spacing.md}px;
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
  border-radius: 0;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledStepHeader = styled(View).withConfig({
  displayName: 'StyledStepHeader',
  componentId: 'StyledStepHeader',
})`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledStepContent = styled(View).withConfig({
  displayName: 'StyledStepContent',
  componentId: 'StyledStepContent',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledStepper = styled(View).withConfig({
  displayName: 'StyledStepper',
  componentId: 'StyledStepper',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledStepperItem = styled(View).withConfig({
  displayName: 'StyledStepperItem',
  componentId: 'StyledStepperItem',
})`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-width: 1px;
  border-color: ${({ status, theme }) =>
    status === 'current' ? theme.colors.primary : theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledStepperMarker = styled(View).withConfig({
  displayName: 'StyledStepperMarker',
  componentId: 'StyledStepperMarker',
})`
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ status, theme }) => {
    if (status === 'current') return theme.colors.primary;
    if (status === 'complete') return theme.colors.success;
    return theme.colors.background.tertiary;
  }};
  background-color: ${({ status, theme }) => {
    if (status === 'current') return theme.colors.primary;
    if (status === 'complete') return theme.colors.status?.success?.background ?? '#E8F5E9';
    return theme.colors.background.secondary;
  }};
`;

const StyledStepperMeta = styled(View).withConfig({
  displayName: 'StyledStepperMeta',
  componentId: 'StyledStepperMeta',
})`
  flex: 1;
  min-width: 0;
`;

const StyledSummaryHeader = styled(View).withConfig({
  displayName: 'StyledSummaryHeader',
  componentId: 'StyledSummaryHeader',
})`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: ${({ theme }) => theme.spacing.sm}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledExpandButton = styled(Pressable).withConfig({
  displayName: 'StyledExpandButton',
  componentId: 'StyledExpandButton',
})`
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 0;
  background-color: ${({ theme }) => theme.colors.background.primary};
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
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing.xs}px;
  padding-bottom: ${({ theme }) => theme.spacing.xs}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledSummaryLabelWrap = styled(View).withConfig({
  displayName: 'StyledSummaryLabelWrap',
  componentId: 'StyledSummaryLabelWrap',
})`
  flex: 1;
  padding-right: ${({ theme }) => theme.spacing.md}px;
`;

const StyledSummaryValueWrap = styled(View).withConfig({
  displayName: 'StyledSummaryValueWrap',
  componentId: 'StyledSummaryValueWrap',
})`
  align-items: flex-end;
`;

const StyledActionsRow = styled(View).withConfig({
  displayName: 'StyledActionsRow',
  componentId: 'StyledActionsRow',
})`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  width: 100%;
`;

const StyledLoadingPane = styled(View).withConfig({
  displayName: 'StyledLoadingPane',
  componentId: 'StyledLoadingPane',
})`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledLoadingText = styled(Text).withConfig({
  displayName: 'StyledLoadingText',
  componentId: 'StyledLoadingText',
})`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography?.fontSize?.md ?? 16}px;
  text-align: center;
`;

const StyledMissingTests = styled(View).withConfig({
  displayName: 'StyledMissingTests',
  componentId: 'StyledMissingTests',
})`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.status?.warning?.background ?? '#FFFBF0'};
  border-radius: 0;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.warning ?? 'rgba(255, 149, 0, 0.35)'};
  border-left-width: 4px;
  border-left-color: ${({ theme }) => theme.colors.warning ?? '#FF9500'};
`;

const StyledFieldGroup = styled(View).withConfig({
  displayName: 'StyledFieldGroup',
  componentId: 'StyledFieldGroup',
})`
  gap: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledStepDescription = styled(Text).withConfig({
  displayName: 'StyledStepDescription',
  componentId: 'StyledStepDescription',
})`
  font-size: ${({ theme }) => theme.typography?.fontSize?.sm ?? 14}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledChoiceSection = styled(View).withConfig({
  displayName: 'StyledChoiceSection',
  componentId: 'StyledChoiceSection',
})`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledChoiceHeader = styled(View).withConfig({
  displayName: 'StyledChoiceHeader',
  componentId: 'StyledChoiceHeader',
})`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledChoiceHint = styled(Text).withConfig({
  displayName: 'StyledChoiceHint',
  componentId: 'StyledChoiceHint',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography?.fontSize?.xs ?? 12}px;
`;

const StyledChoiceGrid = styled(View).withConfig({
  displayName: 'StyledChoiceGrid',
  componentId: 'StyledChoiceGrid',
})`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledChoiceOption = styled(Pressable).withConfig({
  displayName: 'StyledChoiceOption',
  componentId: 'StyledChoiceOption',
})`
  flex-basis: ${({ compact }) => (compact ? '31%' : '48%')};
  min-height: ${({ compact }) => (compact ? 48 : 68)}px;
  flex-grow: 1;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-width: 1px;
  border-left-width: 3px;
  border-color: ${({ selected, theme }) =>
    selected ? theme.colors.primary : theme.colors.background.tertiary};
  border-left-color: ${({ selected, theme }) =>
    selected ? theme.colors.primary : 'transparent'};
  background-color: ${({ selected, theme }) =>
    selected ? theme.colors.background.secondary : theme.colors.background.primary};
`;

const StyledChoiceIcon = styled(View).withConfig({
  displayName: 'StyledChoiceIcon',
  componentId: 'StyledChoiceIcon',
})`
  width: 38px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ selected, theme }) =>
    selected ? theme.colors.primary : theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const StyledChoiceText = styled(View).withConfig({
  displayName: 'StyledChoiceText',
  componentId: 'StyledChoiceText',
})`
  flex: 1;
  min-width: 0;
`;

const StyledChoiceMeta = styled(Text).withConfig({
  displayName: 'StyledChoiceMeta',
  componentId: 'StyledChoiceMeta',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography?.fontSize?.xs ?? 12}px;
`;

const StyledInlineError = styled(Text).withConfig({
  displayName: 'StyledInlineError',
  componentId: 'StyledInlineError',
})`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography?.fontSize?.xs ?? 12}px;
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
  StyledChoiceGrid,
  StyledChoiceHeader,
  StyledChoiceHint,
  StyledChoiceIcon,
  StyledChoiceMeta,
  StyledChoiceOption,
  StyledChoiceSection,
  StyledChoiceText,
  StyledContainer,
  StyledContentWrap,
  StyledFieldGroup,
  StyledInlineError,
  StyledLoadingPane,
  StyledLoadingText,
  StyledMissingTests,
  StyledModelRow,
  StyledRecommendationSource,
  StyledExpandButton,
  StyledSourceOption,
  StyledSourceOptionDesc,
  StyledSourceOptionLabel,
  StyledStepper,
  StyledStepperItem,
  StyledStepperMarker,
  StyledStepperMeta,
  StyledStepContent,
  StyledStepDescription,
  StyledStepHeader,
  StyledSummaryBody,
  StyledSummaryHeader,
  StyledSummaryLabelWrap,
  StyledSummaryPane,
  StyledSummaryRow,
  StyledSummaryValueWrap,
  StyledWizardPane,
};
