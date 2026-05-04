/**
 * ErrorState iOS Styles
 * Styled-components for iOS platform
 * File: ErrorState.ios.styles.jsx
 */
import styled from 'styled-components/native';
import { Button, Text } from '@platform/components';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
})`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledIcon = styled.Text.withConfig({
  displayName: 'StyledIcon',
})`
  font-size: 64px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledMessage = styled(Text).withConfig({
  displayName: 'StyledMessage',
})`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  max-width: 400px;
  text-align: center;
`;

const StyledRetryButton = styled(Button).withConfig({
  displayName: 'StyledRetryButton',
})`
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export {
  StyledContainer,
  StyledIcon,
  StyledMessage,
  StyledRetryButton,
};


