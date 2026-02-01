/**
 * AppFrame Android Styles
 * Styled-components for Android platform
 * File: AppFrame.android.styles.jsx
 */

import styled from 'styled-components/native';
import { ScrollView } from 'react-native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  position: relative;
  background-color: ${({ theme }) => theme.colors.background.primary};
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
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-top: ${({ theme }) => theme.spacing.md}px;
`;

const StyledContent = styled.View.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md}px;
`;

const FOOTER_HEIGHT = 48;

const StyledFooter = styled.View.withConfig({
  displayName: 'StyledFooter',
  componentId: 'StyledFooter',
})`
  height: ${FOOTER_HEIGHT}px;
  min-height: ${FOOTER_HEIGHT}px;
  max-height: ${FOOTER_HEIGHT}px;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.background.tertiary};
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
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
