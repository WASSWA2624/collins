/**
 * ErrorState Web Styles
 * Styled-components for Web platform
 * File: ErrorState.web.styles.jsx
 */
import styled from 'styled-components';
import { View } from 'react-native';
import { Button, Text } from '@platform/components';

const StyledContainer = styled(View).withConfig({
  displayName: 'StyledContainer',
})`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
  text-align: center;
`;

const StyledIcon = styled(View).withConfig({
  displayName: 'StyledIcon',
})`
  font-size: 64px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  line-height: 1;
`;

const StyledMessage = styled(Text).withConfig({
  displayName: 'StyledMessage',
})`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  max-width: 400px;
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



