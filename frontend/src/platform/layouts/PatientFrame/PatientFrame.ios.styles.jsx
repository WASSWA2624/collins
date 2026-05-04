/**
 * PatientFrame iOS Styles
 * File: PatientFrame.ios.styles.jsx
 */

import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledHeader = styled.View.withConfig({
  displayName: 'StyledHeader',
  componentId: 'StyledHeader',
})``;

const StyledSidebar = styled.View.withConfig({
  displayName: 'StyledSidebar',
  componentId: 'StyledSidebar',
})``;

const StyledBreadcrumbs = styled.View.withConfig({
  displayName: 'StyledBreadcrumbs',
  componentId: 'StyledBreadcrumbs',
})``;

const StyledBanner = styled.View.withConfig({
  displayName: 'StyledBanner',
  componentId: 'StyledBanner',
})``;

const StyledNotices = styled.View.withConfig({
  displayName: 'StyledNotices',
  componentId: 'StyledNotices',
})``;

const StyledContent = styled.View.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  flex: 1;
`;

const StyledFooter = styled.View.withConfig({
  displayName: 'StyledFooter',
  componentId: 'StyledFooter',
})``;

const StyledOverlay = styled.View.withConfig({
  displayName: 'StyledOverlay',
  componentId: 'StyledOverlay',
})`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export {
  StyledBanner,
  StyledBreadcrumbs,
  StyledContainer,
  StyledContent,
  StyledFooter,
  StyledHeader,
  StyledNotices,
  StyledOverlay,
  StyledSidebar,
};

