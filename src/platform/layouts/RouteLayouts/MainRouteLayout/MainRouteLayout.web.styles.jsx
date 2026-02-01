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

const StyledHeaderLeading = styled.div.withConfig({
  displayName: 'StyledHeaderLeading',
  componentId: 'StyledHeaderLeading',
})`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledMenuToggleButton = styled.button.withConfig({
  displayName: 'StyledMenuToggleButton',
  componentId: 'StyledMenuToggleButton',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  min-height: 36px;
  padding: 0;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const StyledHeaderBrand = styled.a.withConfig({
  displayName: 'StyledHeaderBrand',
  componentId: 'StyledHeaderBrand',
})`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  text-decoration: none;
  color: inherit;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const StyledHeaderLogo = styled.span.withConfig({
  displayName: 'StyledHeaderLogo',
  componentId: 'StyledHeaderLogo',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const StyledHeaderAppName = styled.span.withConfig({
  displayName: 'StyledHeaderAppName',
  componentId: 'StyledHeaderAppName',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};

  @media (max-width: 767px) {
    display: none;
  }
`;

const StyledSidebarBackdrop = styled.div.withConfig({
  displayName: 'StyledSidebarBackdrop',
  componentId: 'StyledSidebarBackdrop',
})`
  display: none;

  @media (max-width: 767px) {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.4);
    cursor: pointer;
  }
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

export {
  StyledHeaderAppName,
  StyledHeaderBrand,
  StyledHeaderLeading,
  StyledHeaderLogo,
  StyledMain,
  StyledMenuToggleButton,
  StyledSidebarBackdrop,
  StyledSidebarResizeHandle,
};

