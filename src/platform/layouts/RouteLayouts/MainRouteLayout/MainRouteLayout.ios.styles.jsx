/**
 * MainRouteLayout iOS Styles
 * File: MainRouteLayout.ios.styles.jsx
 */
import styled from 'styled-components/native';
import { Pressable, View } from 'react-native';

const StyledContent = styled(View).withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  flex: 1;
  width: 100%;
`;

const StyledDrawerRoot = styled(View).withConfig({
  displayName: 'StyledDrawerRoot',
  componentId: 'StyledDrawerRoot',
})`
  flex: 1;
  flex-direction: row;
`;

const StyledDrawerBackdrop = styled(Pressable).withConfig({
  displayName: 'StyledDrawerBackdrop',
  componentId: 'StyledDrawerBackdrop',
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.overlay?.backdrop ?? 'rgba(0,0,0,0.4)'};
`;

const StyledDrawerContainer = styled(View).withConfig({
  displayName: 'StyledDrawerContainer',
  componentId: 'StyledDrawerContainer',
})`
  width: 260px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme }) => theme.spacing.md}px;
`;

export {
  StyledContent,
  StyledDrawerBackdrop,
  StyledDrawerContainer,
  StyledDrawerRoot,
  StyledHeaderLeading,
};

