/**
 * TopicDetailScreen Android Styles
 * File: TopicDetailScreen.android.styles.jsx
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

const StyledScroll = styled.ScrollView.withConfig({
  displayName: 'StyledScroll',
  componentId: 'StyledScroll',
})`
  flex: 1;
`;

const StyledHeader = styled(View).withConfig({
  displayName: 'StyledHeader',
  componentId: 'StyledHeader',
})`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledSection = styled(View).withConfig({
  displayName: 'StyledSection',
  componentId: 'StyledSection',
})`
  padding: ${({ theme }) => theme.spacing.md}px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledSectionContent = styled(View).withConfig({
  displayName: 'StyledSectionContent',
  componentId: 'StyledSectionContent',
})`
  padding: ${({ theme }) => theme.spacing.sm}px 0;
`;

const StyledChecklistItem = styled(View).withConfig({
  displayName: 'StyledChecklistItem',
  componentId: 'StyledChecklistItem',
})`
  padding: ${({ theme }) => theme.spacing.xs}px 0;
  margin-left: ${({ theme }) => theme.spacing.md}px;
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
  StyledErrorBanner,
  StyledHeader,
  StyledScroll,
  StyledSection,
  StyledSectionContent,
  StyledChecklistItem,
};
