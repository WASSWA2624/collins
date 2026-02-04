/**
 * HomeScreen Android Styles
 * File: HomeScreen.android.styles.jsx
 */
import styled from 'styled-components/native';
import { View, Pressable, Text } from 'react-native';

const StyledContainer = styled(View).withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  padding: ${({ theme }) => theme.spacing.xl}px ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled(View).withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  width: 100%;
  align-items: center;
`;

const StyledLogoArea = styled(View).withConfig({
  displayName: 'StyledLogoArea',
  componentId: 'StyledLogoArea',
})`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  align-items: center;
  justify-content: center;
`;

const StyledMessage = styled(View).withConfig({
  displayName: 'StyledMessage',
  componentId: 'StyledMessage',
})`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  align-items: center;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
`;

const StyledOverview = styled(View).withConfig({
  displayName: 'StyledOverview',
  componentId: 'StyledOverview',
})`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledOverviewTitle = styled(Text).withConfig({
  displayName: 'StyledOverviewTitle',
  componentId: 'StyledOverviewTitle',
})`
  font-size: ${({ theme }) => theme.typography?.fontSize?.lg ?? 18}px;
  font-weight: ${({ theme }) => theme.typography?.fontWeight?.semibold ?? 600};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledSectionList = styled(View).withConfig({
  displayName: 'StyledSectionList',
  componentId: 'StyledSectionList',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSectionItem = styled(Pressable).withConfig({
  displayName: 'StyledSectionItem',
  componentId: 'StyledSectionItem',
})`
  padding: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radius.lg ?? 12}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  elevation: 2;
`;

const StyledSectionTitle = styled(Text).withConfig({
  displayName: 'StyledSectionTitle',
  componentId: 'StyledSectionTitle',
})`
  font-size: ${({ theme }) => theme.typography?.fontSize?.md ?? 16}px;
  font-weight: ${({ theme }) => theme.typography?.fontWeight?.semibold ?? 600};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledSectionDesc = styled(Text).withConfig({
  displayName: 'StyledSectionDesc',
  componentId: 'StyledSectionDesc',
})`
  font-size: ${({ theme }) => theme.typography?.fontSize?.sm ?? 14}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

export {
  StyledContainer,
  StyledContent,
  StyledLogoArea,
  StyledMessage,
  StyledOverview,
  StyledOverviewTitle,
  StyledSectionList,
  StyledSectionItem,
  StyledSectionTitle,
  StyledSectionDesc,
};
