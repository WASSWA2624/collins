/**
 * Sidebar Component Styles - Web
 * Styled-components for Sidebar web implementation
 * File: Sidebar.web.styles.jsx
 */
import styled from 'styled-components';

const StyledSidebar = styled.nav.withConfig({
  displayName: 'StyledSidebar',
  componentId: 'StyledSidebar',
  shouldForwardProp: (prop) => prop !== '$collapsed',
})`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

const StyledSidebarContent = styled.div.withConfig({
  displayName: 'StyledSidebarContent',
  componentId: 'StyledSidebarContent',
  shouldForwardProp: (prop) => prop !== '$collapsed',
})`
  flex: 1;
  min-height: 0;
  padding: ${({ theme, $collapsed }) =>
    $collapsed ? '0' : `${theme.spacing.md}px`};
  gap: ${({ theme }) => theme.spacing.sm}px;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
`;

export {
  StyledSidebar,
  StyledSidebarContent,
};

