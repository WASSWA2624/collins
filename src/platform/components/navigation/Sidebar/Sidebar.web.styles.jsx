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

const StyledSidebarHeader = styled.div.withConfig({
  displayName: 'StyledSidebarHeader',
  componentId: 'StyledSidebarHeader',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  min-height: 44px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSidebarHeaderBrand = styled.div.withConfig({
  displayName: 'StyledSidebarHeaderBrand',
  componentId: 'StyledSidebarHeaderBrand',
})`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  min-width: 0;
`;

const StyledSidebarHeaderLogo = styled.span.withConfig({
  displayName: 'StyledSidebarHeaderLogo',
  componentId: 'StyledSidebarHeaderLogo',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const StyledSidebarHeaderAppName = styled.span.withConfig({
  displayName: 'StyledSidebarHeaderAppName',
  componentId: 'StyledSidebarHeaderAppName',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledCloseButton = styled.button.withConfig({
  displayName: 'StyledCloseButton',
  componentId: 'StyledCloseButton',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  padding: ${({ theme }) => theme.spacing.xs}px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
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
  StyledSidebarHeader,
  StyledSidebarHeaderBrand,
  StyledSidebarHeaderLogo,
  StyledSidebarHeaderAppName,
  StyledCloseButton,
  StyledSidebarContent,
};

