/**
 * AuthLayout iOS Styles
 * Styled-components for iOS platform
 * File: AuthLayout.ios.styles.jsx
 */

import styled from 'styled-components/native';
import { KeyboardAvoidingView } from 'react-native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView).withConfig({
  displayName: 'StyledKeyboardAvoidingView',
  componentId: 'StyledKeyboardAvoidingView',
})`
  flex: 1;
`;

const StyledContentWrapper = styled.View.withConfig({
  displayName: 'StyledContentWrapper',
  componentId: 'StyledContentWrapper',
})`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const StyledCard = styled.View.withConfig({
  displayName: 'StyledCard',
  componentId: 'StyledCard',
})`
  width: 100%;
  max-width: 520px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledBranding = styled.View.withConfig({
  displayName: 'StyledBranding',
  componentId: 'StyledBranding',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledContent = styled.View.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})``;

const StyledHelpLinks = styled.View.withConfig({
  displayName: 'StyledHelpLinks',
  componentId: 'StyledHelpLinks',
})`
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export {
  StyledContainer,
  StyledKeyboardAvoidingView,
  StyledContentWrapper,
  StyledCard,
  StyledBranding,
  StyledContent,
  StyledHelpLinks,
};

