/**
 * AppFrame iOS Styles
 * Styled-components for iOS platform
 * File: AppFrame.ios.styles.jsx
 */

import styled from 'styled-components/native';
import { ScrollView } from 'react-native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
  shouldForwardProp: (prop) => prop !== 'safeAreaTop',
})`
  flex: 1;
  position: relative;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding-top: ${({ safeAreaTop = 0 }) => safeAreaTop}px;
`;

const StyledHeader = styled.View.withConfig({
  displayName: 'StyledHeader',
  componentId: 'StyledHeader',
})`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary};
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  min-height: ${({ theme }) => theme.spacing.sm * 7}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StyledBanner = styled.View.withConfig({
  displayName: 'StyledBanner',
  componentId: 'StyledBanner',
})`
  width: 100%;
`;

const StyledBreadcrumbs = styled.View.withConfig({
  displayName: 'StyledBreadcrumbs',
  componentId: 'StyledBreadcrumbs',
})`
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledScrollView = styled(ScrollView).withConfig({
  displayName: 'StyledScrollView',
  componentId: 'StyledScrollView',
}).attrs({
  contentContainerStyle: {
    flexGrow: 1,
  },
})`
  flex: 1;
`;

const StyledSidebar = styled.View.withConfig({
  displayName: 'StyledSidebar',
  componentId: 'StyledSidebar',
})`
  padding: 0;
`;

const StyledContent = styled.View.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  flex: 1;
  padding: 0;
`;

const FOOTER_HEIGHT = 48;

const StyledFooter = styled.View.withConfig({
  displayName: 'StyledFooter',
  componentId: 'StyledFooter',
  shouldForwardProp: (prop) => prop !== 'role' && prop !== 'accessibilityRole',
})`
  min-height: ${FOOTER_HEIGHT}px;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.background.tertiary};
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  padding-bottom: ${({ bottomInset, theme }) => (theme?.spacing?.sm ?? 8) + (typeof bottomInset === 'number' ? bottomInset : 0)}px;
  justify-content: center;
`;

const StyledOverlay = styled.View.withConfig({
  displayName: 'StyledOverlay',
  componentId: 'StyledOverlay',
})`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 5;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.overlay.backdrop};
`;

export {
  StyledBanner,
  StyledBreadcrumbs,
  StyledContainer,
  StyledContent,
  StyledFooter,
  StyledHeader,
  StyledOverlay,
  StyledScrollView,
  StyledSidebar,
};
