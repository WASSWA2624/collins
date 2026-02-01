/**
 * PatientFrame Web Styles
 * File: PatientFrame.web.styles.jsx
 */

import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.primary};
  position: relative;
`;

const StyledHeader = styled.header.withConfig({
  displayName: 'StyledHeader',
  componentId: 'StyledHeader',
})``;

const StyledSidebar = styled.aside.withConfig({
  displayName: 'StyledSidebar',
  componentId: 'StyledSidebar',
})``;

const StyledBreadcrumbs = styled.nav.withConfig({
  displayName: 'StyledBreadcrumbs',
  componentId: 'StyledBreadcrumbs',
})``;

const StyledBanner = styled.section.withConfig({
  displayName: 'StyledBanner',
  componentId: 'StyledBanner',
})``;

const StyledNotices = styled.section.withConfig({
  displayName: 'StyledNotices',
  componentId: 'StyledNotices',
})``;

const StyledContent = styled.section.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})``;

const StyledFooter = styled.footer.withConfig({
  displayName: 'StyledFooter',
  componentId: 'StyledFooter',
})``;

const StyledOverlay = styled.div.withConfig({
  displayName: 'StyledOverlay',
  componentId: 'StyledOverlay',
})`
  position: absolute;
  inset: 0;
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

