/**
 * HomeScreen Android Styles
 * File: HomeScreen.android.styles.jsx
 */
import styled from 'styled-components/native';
import { View } from 'react-native';

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
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const StyledMessage = styled(View).withConfig({
  displayName: 'StyledMessage',
  componentId: 'StyledMessage',
})`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  align-items: center;
`;

export { StyledContainer, StyledContent, StyledMessage };
