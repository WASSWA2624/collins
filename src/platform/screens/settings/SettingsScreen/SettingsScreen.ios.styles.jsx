/**
 * SettingsScreen iOS Styles
 * File: SettingsScreen.ios.styles.jsx
 * Per theme-design.mdc: iOS HIG, card patterns, theme tokens.
 */
import styled from 'styled-components/native';
import { View } from 'react-native';

const StyledContainer = styled(View).withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
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
  border-radius: ${({ theme }) => theme.radius?.lg ?? 12}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  overflow: hidden;
  shadow-color: ${({ theme }) => theme.shadows?.sm?.shadowColor ?? '#000'};
  shadow-offset: ${({ theme }) => `${theme.shadows?.sm?.shadowOffset?.width ?? 0}px ${theme.shadows?.sm?.shadowOffset?.height ?? 1}px`};
  shadow-opacity: ${({ theme }) => theme.shadows?.sm?.shadowOpacity ?? 0.1};
  shadow-radius: ${({ theme }) => (theme.shadows?.sm?.shadowRadius ?? 2) * 2}px;
  elevation: ${({ theme }) => theme.shadows?.sm?.elevation ?? 2};
`;

const StyledSectionTitle = styled(View).withConfig({
  displayName: 'StyledSectionTitle',
  componentId: 'StyledSectionTitle',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

export { StyledContainer, StyledContent, StyledHeader, StyledSection, StyledSectionTitle };
