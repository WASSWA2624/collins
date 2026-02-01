/**
 * RecommendationScreen Android Styles
 * File: RecommendationScreen.android.styles.jsx
 */
import styled from 'styled-components/native';
import { View } from 'react-native';

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
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledActionsRow = styled(View).withConfig({
  displayName: 'StyledActionsRow',
  componentId: 'StyledActionsRow',
})`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  flex-wrap: wrap;
`;

const StyledSummaryPane = styled(View).withConfig({
  displayName: 'StyledSummaryPane',
  componentId: 'StyledSummaryPane',
})`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radius.md}px;
`;

export {
  StyledActionsRow,
  StyledContainer,
  StyledSection,
  StyledSectionBody,
  StyledSectionHeader,
  StyledSummaryPane,
  StyledWarningBox,
};
