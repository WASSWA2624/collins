/**
 * DisclaimerScreen iOS Styles
 * File: DisclaimerScreen.ios.styles.jsx
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
`;

const StyledSection = styled(View).withConfig({
  displayName: 'StyledSection',
  componentId: 'StyledSection',
})`
  padding-top: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledNotice = styled(View).withConfig({
  displayName: 'StyledNotice',
  componentId: 'StyledNotice',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.status?.warning?.background ?? theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radii?.md ?? 8}px;
`;

export { StyledContainer, StyledContent, StyledSection, StyledNotice };
