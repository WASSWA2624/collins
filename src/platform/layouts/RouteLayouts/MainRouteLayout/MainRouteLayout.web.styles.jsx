/**
 * MainRouteLayout Web Styles
 * File: MainRouteLayout.web.styles.jsx
 */
import styled from 'styled-components';

const StyledMain = styled.main.withConfig({
  displayName: 'StyledMain',
  componentId: 'StyledMain',
})`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  max-width: 100%;
  box-sizing: border-box;
  padding: ${({ theme }) => theme.spacing.lg}px;
  overflow-x: hidden;
`;

const StyledSidebarResizeHandle = styled.div.withConfig({
  displayName: 'StyledSidebarResizeHandle',
  componentId: 'StyledSidebarResizeHandle',
})`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: ${({ theme }) => theme.spacing.sm}px;
  cursor: col-resize;
  background-color: transparent;
  z-index: 2;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: -2px;
  }
`;

export { StyledMain, StyledSidebarResizeHandle };

