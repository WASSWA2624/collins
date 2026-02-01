/**
 * CaseDetailScreen iOS Styles
 * File: CaseDetailScreen.ios.styles.jsx
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

const StyledSection = styled(View).withConfig({
  displayName: 'StyledSection',
  componentId: 'StyledSection',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledBlock = styled(View).withConfig({
  displayName: 'StyledBlock',
  componentId: 'StyledBlock',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
`;

const StyledWarningBox = styled(View).withConfig({
  displayName: 'StyledWarningBox',
  componentId: 'StyledWarningBox',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.status?.warning?.background ?? '#FFF3CD'};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-left-width: 4px;
  border-left-color: ${({ theme }) => theme.colors.status?.warning?.text ?? '#856404'};
`;

const StyledNotFound = styled(View).withConfig({
  displayName: 'StyledNotFound',
  componentId: 'StyledNotFound',
})`
  padding: ${({ theme }) => theme.spacing.xl}px;
  align-items: center;
`;

export {
  StyledBlock,
  StyledContainer,
  StyledNotFound,
  StyledSection,
  StyledWarningBox,
};
