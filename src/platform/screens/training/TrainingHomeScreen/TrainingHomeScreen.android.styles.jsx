/**
 * TrainingHomeScreen Android Styles
 * File: TrainingHomeScreen.android.styles.jsx
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

const StyledContentWrap = styled(View).withConfig({
  displayName: 'StyledContentWrap',
  componentId: 'StyledContentWrap',
})`
  flex: 1;
`;

const StyledPageHeader = styled(View).withConfig({
  displayName: 'StyledPageHeader',
  componentId: 'StyledPageHeader',
})`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledPageTitle = styled(View).withConfig({
  displayName: 'StyledPageTitle',
  componentId: 'StyledPageTitle',
})`
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSearchWrap = styled(View).withConfig({
  displayName: 'StyledSearchWrap',
  componentId: 'StyledSearchWrap',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledSection = styled(View).withConfig({
  displayName: 'StyledSection',
  componentId: 'StyledSection',
})`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledSectionTitle = styled(View).withConfig({
  displayName: 'StyledSectionTitle',
  componentId: 'StyledSectionTitle',
})`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledTopicRow = styled(View).withConfig({
  displayName: 'StyledTopicRow',
  componentId: 'StyledTopicRow',
})`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
`;

const StyledErrorBanner = styled(View).withConfig({
  displayName: 'StyledErrorBanner',
  componentId: 'StyledErrorBanner',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.status?.error?.background ?? '#FFEBEE'};
  border-radius: ${({ theme }) => theme.radius.sm}px;
`;

export {
  StyledContainer,
  StyledContentWrap,
  StyledErrorBanner,
  StyledPageHeader,
  StyledPageTitle,
  StyledSearchWrap,
  StyledSection,
  StyledSectionTitle,
  StyledTopicRow,
};
