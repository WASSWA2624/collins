/**
 * MainRouteLayout Android Styles
 * File: MainRouteLayout.android.styles.jsx
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
  width: 280px;
  background-color: transparent;
`;

const StyledHeaderLeading = styled(View).withConfig({
  displayName: 'StyledHeaderLeading',
  componentId: 'StyledHeaderLeading',
})`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  min-width: 0;
`;

const StyledMenuToggleButton = styled(Pressable).withConfig({
  displayName: 'StyledMenuToggleButton',
  componentId: 'StyledMenuToggleButton',
})`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 0;
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const StyledHeaderBrand = styled(View).withConfig({
  displayName: 'StyledHeaderBrand',
  componentId: 'StyledHeaderBrand',
})`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  min-width: 0;
  flex-shrink: 1;
`;

const StyledHeaderLogo = styled(View).withConfig({
  displayName: 'StyledHeaderLogo',
  componentId: 'StyledHeaderLogo',
})`
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const StyledHeaderAppName = styled.Text.withConfig({
  displayName: 'StyledHeaderAppName',
  componentId: 'StyledHeaderAppName',
})`
  flex-shrink: 1;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  letter-spacing: 0;
`;

export {
  StyledContent,
  StyledDrawerBackdrop,
  StyledDrawerContainer,
  StyledDrawerRoot,
  StyledHeaderAppName,
  StyledHeaderBrand,
  StyledHeaderLeading,
  StyledHeaderLogo,
  StyledMenuToggleButton,
};
