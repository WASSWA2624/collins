/**
 * EmptyState Web Styles
 * Styled-components for Web platform
 * File: EmptyState.web.styles.jsx
 */
import styled from 'styled-components';
import { Button, Text } from '@platform/components';

const StyledContainer = styled.div.withConfig({
  displayName: 'StyledContainer',
})`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
  text-align: center;
`;

const StyledIcon = styled.div.withConfig({
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

const StyledAction = styled(Button).withConfig({
  displayName: 'StyledAction',
})`
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export {
  StyledContainer,
  StyledIcon,
  StyledMessage,
  StyledAction,
};


