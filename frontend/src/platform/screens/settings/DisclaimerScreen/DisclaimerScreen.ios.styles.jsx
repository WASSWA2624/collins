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

const StyledContentWrap = styled(View).withConfig({
  displayName: 'StyledContentWrap',
  componentId: 'StyledContentWrap',
})`
  flex: 1;
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

const StyledButtonWrap = styled(View).withConfig({
  displayName: 'StyledButtonWrap',
  componentId: 'StyledButtonWrap',
})`
  padding-top: ${({ theme }) => theme.spacing.lg}px;
  align-self: stretch;
`;

export { StyledContainer, StyledContent, StyledContentWrap, StyledSection, StyledNotice, StyledButtonWrap };
