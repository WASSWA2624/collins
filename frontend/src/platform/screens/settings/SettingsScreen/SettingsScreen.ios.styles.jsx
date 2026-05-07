/**
 * SettingsScreen iOS Styles
 * File: SettingsScreen.ios.styles.jsx
 * Per theme-design.mdc: iOS HIG, card patterns, theme tokens.
 */
import styled from 'styled-components/native';
import { ScrollView, View } from 'react-native';

const StyledContainer = styled(ScrollView).withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
}).attrs({
  contentInsetAdjustmentBehavior: 'automatic',
  keyboardShouldPersistTaps: 'handled',
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled(View).withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  padding: ${({ theme }) => theme.spacing.lg}px;
  padding-bottom: ${({ theme }) => theme.spacing.xxl}px;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledHeader = styled(View).withConfig({
  displayName: 'StyledHeader',
  componentId: 'StyledHeader',
})`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSection = styled(View).withConfig({
  displayName: 'StyledSection',
  componentId: 'StyledSection',
})`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 0;
  padding: ${({ theme }) => theme.spacing.lg}px;
  overflow: hidden;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledSectionTitle = styled(View).withConfig({
  displayName: 'StyledSectionTitle',
  componentId: 'StyledSectionTitle',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

export { StyledContainer, StyledContent, StyledHeader, StyledSection, StyledSectionTitle };
