/**
 * NotFoundScreen Android Styles
 * Styled-components for Android platform
 * File: NotFoundScreen.android.styles.jsx
 */
import styled from 'styled-components/native';
import { View } from 'react-native';

const StyledContentWrap = styled(View).withConfig({
  displayName: 'StyledContentWrap',
  componentId: 'StyledContentWrap',
})`
  flex: 1;
`;

const StyledNotFoundContainer = styled(View).withConfig({
  displayName: 'StyledNotFoundContainer',
  componentId: 'StyledNotFoundContainer',
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

const StyledMessageWrapper = styled(View).withConfig({
  displayName: 'StyledMessageWrapper',
  componentId: 'StyledMessageWrapper',
})`
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export {
  StyledContentWrap,
  StyledNotFoundContainer,
  StyledContent,
  StyledMessageSection,
  StyledMessageWrapper,
};

