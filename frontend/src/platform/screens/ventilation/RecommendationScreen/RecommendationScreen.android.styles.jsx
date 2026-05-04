/**
 * RecommendationScreen Android Styles
 * File: RecommendationScreen.android.styles.jsx
 */
import styled from 'styled-components/native';
import { View } from 'react-native';

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
  padding: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledSection = styled(View).withConfig({
  displayName: 'StyledSection',
  componentId: 'StyledSection',
})`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledFallbackBody = styled(View).withConfig({
  displayName: 'StyledFallbackBody',
  componentId: 'StyledFallbackBody',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSectionHeader = styled(View).withConfig({
  displayName: 'StyledSectionHeader',
  componentId: 'StyledSectionHeader',
})`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSectionBody = styled(View).withConfig({
  displayName: 'StyledSectionBody',
  componentId: 'StyledSectionBody',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledWarningBox = styled(View).withConfig({
  displayName: 'StyledWarningBox',
  componentId: 'StyledWarningBox',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.status?.warning?.background ?? '#FFF3CD'};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-left-width: 4px;
  border-left-color: ${({ theme }) => theme.colors.status?.warning?.text ?? theme.colors?.warning ?? '#856404'};
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledActionsRow = styled(View).withConfig({
  displayName: 'StyledActionsRow',
  componentId: 'StyledActionsRow',
})`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.xl}px;
  padding-top: ${({ theme }) => theme.spacing.lg}px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledEditStepRow = styled(View).withConfig({
  displayName: 'StyledEditStepRow',
  componentId: 'StyledEditStepRow',
})`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledExportRow = styled(View).withConfig({
  displayName: 'StyledExportRow',
  componentId: 'StyledExportRow',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSummaryPane = styled(View).withConfig({
  displayName: 'StyledSummaryPane',
  componentId: 'StyledSummaryPane',
})`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radius.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
`;

export {
  StyledActionsRow,
  StyledContainer,
  StyledContentWrap,
  StyledEditStepRow,
  StyledExportRow,
  StyledFallbackBody,
  StyledSection,
  StyledSectionBody,
  StyledSectionHeader,
  StyledSummaryPane,
  StyledWarningBox,
};
