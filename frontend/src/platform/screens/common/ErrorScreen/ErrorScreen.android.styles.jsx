/**
 * ErrorScreen Android Styles
 * Styled-components for Android platform
 * File: ErrorScreen.android.styles.jsx
 */
import styled from 'styled-components/native';
import { View } from 'react-native';

const StyledErrorContainer = styled(View).withConfig({
  displayName: 'StyledErrorContainer',
  componentId: 'StyledErrorContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme }) => theme.spacing.xl}px ${({ theme }) => theme.spacing.lg}px;
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

const StyledMessageSection = styled(View).withConfig({
  displayName: 'StyledMessageSection',
  componentId: 'StyledMessageSection',
})`
  width: 100%;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledButtonGroup = styled(View).withConfig({
  displayName: 'StyledButtonGroup',
  componentId: 'StyledButtonGroup',
})`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.md}px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  max-width: 400px;
`;

const StyledContentWrapper = styled(View).withConfig({
  displayName: 'StyledContentWrapper',
  componentId: 'StyledContentWrapper',
})`
  flex: 1;
`;

const StyledScrollViewContent = styled(View).withConfig({
  displayName: 'StyledScrollViewContent',
  componentId: 'StyledScrollViewContent',
})`
  flex-grow: 1;
`;

const StyledMessageWrapper = styled(View).withConfig({
  displayName: 'StyledMessageWrapper',
  componentId: 'StyledMessageWrapper',
})`
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export {
  StyledErrorContainer,
  StyledContent,
  StyledContentWrapper,
  StyledMessageSection,
  StyledButtonGroup,
  StyledScrollViewContent,
  StyledMessageWrapper,
};

