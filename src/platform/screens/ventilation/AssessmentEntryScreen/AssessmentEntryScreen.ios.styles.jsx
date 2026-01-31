/**
 * AssessmentEntryScreen iOS Styles
 * File: AssessmentEntryScreen.ios.styles.jsx
 */
import styled from 'styled-components/native';
import { View } from 'react-native';

const StyledContainer = styled(View).withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const StyledContent = styled(View).withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  flex: 1;
  width: 100%;
  justify-content: center;
`;

const StyledActions = styled(View).withConfig({
  displayName: 'StyledActions',
  componentId: 'StyledActions',
})`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

export { StyledContainer, StyledContent, StyledActions };

