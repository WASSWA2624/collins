/**
 * DisclaimerLayout iOS Styles
 * File: DisclaimerLayout.ios.styles.jsx
 */
import styled from 'styled-components/native';
import { View } from 'react-native';

const StyledContainer = styled(View).withConfig({
  displayName: 'StyledContainer',
  componentId: 'DisclaimerLayout_StyledContainer',
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledHeader = styled(View).withConfig({
  displayName: 'StyledHeader',
  componentId: 'DisclaimerLayout_StyledHeader',
  shouldForwardProp: (prop) => prop !== 'topInset',
})`
  padding-top: ${({ theme, topInset }) => (topInset || 0) + theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.spacing.md}px;
  padding-left: ${({ theme }) => theme.spacing.lg}px;
  padding-right: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledHeaderTitle = styled(View).withConfig({
  displayName: 'StyledHeaderTitle',
  componentId: 'DisclaimerLayout_StyledHeaderTitle',
})`
  align-items: center;
`;

const StyledContent = styled(View).withConfig({
  displayName: 'StyledContent',
  componentId: 'DisclaimerLayout_StyledContent',
})`
  flex: 1;
`;

export { StyledContainer, StyledHeader, StyledHeaderTitle, StyledContent };
