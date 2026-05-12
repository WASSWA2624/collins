/**
 * MainRouteLayout Web Styles
 * File: MainRouteLayout.web.styles.jsx
 */
import styled, { css } from 'styled-components';

const StyledMain = styled.main.withConfig({
  displayName: 'StyledMain',
  componentId: 'StyledMain',
})`
  flex: 0 0 auto;
  min-height: min-content;
  display: flex;
  flex-direction: column;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  padding: 0;
  overflow-x: hidden;
  overflow-y: visible;
`;

const StyledHeaderLeading = styled.div.withConfig({
  displayName: 'StyledHeaderLeading',
  componentId: 'StyledHeaderLeading',
})`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  min-width: 0;
`;

const StyledMenuToggleButton = styled.button.withConfig({
  displayName: 'StyledMenuToggleButton',
  componentId: 'StyledMenuToggleButton',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 0;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  transition: background-color 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease, transform 0.12s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.primary};
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}1A`};
  }

  &:active {
    transform: scale(0.96);
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
  min-width: 0;
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

const appNameTypography = css`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: 0;
`;

const StyledHeaderAppName = styled.span.withConfig({
  displayName: 'StyledHeaderAppName',
  componentId: 'StyledHeaderAppName',
})`
  ${appNameTypography}
  display: inline-block;
  min-width: 0;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 767px) {
    max-width: 112px;
    font-size: ${({ theme }) => theme.typography.fontSize.md}px;
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
