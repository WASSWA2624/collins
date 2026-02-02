/**
 * TopicListScreen Android Styles
 * File: TopicListScreen.android.styles.jsx
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

const StyledPageHeader = styled(View).withConfig({
  displayName: 'StyledPageHeader',
  componentId: 'StyledPageHeader',
})`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledSearchWrap = styled(View).withConfig({
  displayName: 'StyledSearchWrap',
  componentId: 'StyledSearchWrap',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledItem = styled(View).withConfig({
  displayName: 'StyledItem',
  componentId: 'StyledItem',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
`;

const StyledEmpty = styled(View).withConfig({
  displayName: 'StyledEmpty',
  componentId: 'StyledEmpty',
})`
  padding: ${({ theme }) => theme.spacing.xl}px;
  align-items: center;
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
  StyledEmpty,
  StyledErrorBanner,
  StyledItem,
  StyledPageHeader,
  StyledSearchWrap,
};
