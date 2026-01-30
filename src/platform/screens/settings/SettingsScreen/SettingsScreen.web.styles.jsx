/**
 * SettingsScreen Web Styles
 * Per theme-design.mdc: styled-components (web), semantic HTML, theme tokens only
 * Per component-structure.mdc: displayName + componentId in withConfig
 */
import styled from 'styled-components';

const sp = (theme, key) => theme?.spacing?.[key] ?? { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 }[key] ?? 8;
const cl = (theme, path) => {
  const v = theme?.colors;
  if (!v) return null;
  if (path === 'background.primary') return v.background?.primary ?? '#ffffff';
  if (path === 'background.secondary') return v.background?.secondary ?? '#f2f2f7';
  if (path === 'background.tertiary') return v.background?.tertiary ?? '#e5e5ea';
  if (path === 'border.light') return v.border?.light ?? '#e5e5ea';
  if (path === 'text.primary') return v.text?.primary ?? '#000000';
  if (path === 'text.secondary') return v.text?.secondary ?? '#3c3c43';
  if (path === 'text.tertiary') return v.text?.tertiary ?? '#8e8e93';
  if (path === 'primary') return v.primary ?? '#007AFF';
  return null;
};

const tablet = (theme) => theme?.breakpoints?.tablet ?? 768;

export const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'SettingsScreen_StyledContainer',
})`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  min-width: 0;
  background-color: ${({ theme }) => cl(theme, 'background.primary')};

  @media (min-width: ${({ theme }) => tablet(theme)}px) {
    flex-direction: row;
  }
`;

export const StyledMobileHeader = styled.header.withConfig({
  displayName: 'StyledMobileHeader',
  componentId: 'SettingsScreen_StyledMobileHeader',
})`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  min-height: 48px;
  padding: 0 ${({ theme }) => sp(theme, 'sm')}px;
  border-bottom: 1px solid ${({ theme }) => cl(theme, 'border.light')};
  background-color: ${({ theme }) => cl(theme, 'background.primary')};

  @media (min-width: ${({ theme }) => tablet(theme)}px) {
    display: none;
  }
`;

export const StyledMobileMenuButton = styled.button.withConfig({
  displayName: 'StyledMobileMenuButton',
  componentId: 'SettingsScreen_StyledMobileMenuButton',
})`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => sp(theme, 'sm')}px;
  min-height: 44px;
  min-width: 44px;
  padding: 0 ${({ theme }) => sp(theme, 'sm')}px;
  border: none;
  border-radius: ${({ theme }) => theme?.radius?.md ?? 8}px;
  background: transparent;
  color: ${({ theme }) => cl(theme, 'text.primary')};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => cl(theme, 'background.secondary')};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => cl(theme, 'primary')};
    outline-offset: 2px;
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const StyledDrawerOverlay = styled.div.withConfig({
  displayName: 'StyledDrawerOverlay',
  componentId: 'SettingsScreen_StyledDrawerOverlay',
})`
  display: none;

  @media (max-width: ${({ theme }) => tablet(theme) - 1}px) {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 1099;
    background-color: ${({ theme }) => theme?.colors?.overlay?.backdrop ?? 'rgba(0,0,0,0.5)'};
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
    transition: opacity 0.2s ease;

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }
`;

export const StyledSidebarWrapper = styled.div.withConfig({
  displayName: 'StyledSidebarWrapper',
  componentId: 'SettingsScreen_StyledSidebarWrapper',
})`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  min-height: 0;
  height: 100%;

  @media (max-width: ${({ theme }) => tablet(theme) - 1}px) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 1100;
    width: min(280px, 85vw);
    height: 100%;
    transform: translateX(${({ $drawerOpen }) => ($drawerOpen ? '0' : '-100%')});
    transition: transform 0.2s ease;
    box-shadow: ${({ theme }) => {
      const s = theme?.shadows?.md;
      return s ? `${s.shadowOffset?.width ?? 0}px ${s.shadowOffset?.height ?? 2}px ${s.shadowRadius ?? 8}px rgba(0,0,0,${s.shadowOpacity ?? 0.15})` : '4px 0 16px rgba(0,0,0,0.15)';
    }};

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }
`;

export const StyledSidebar = styled.nav.withConfig({
  displayName: 'StyledSidebar',
  componentId: 'SettingsScreen_StyledSidebar',
})`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  width: ${({ $width }) => $width ?? 220}px;
  min-width: ${({ $minWidth }) => $minWidth ?? 160}px;
  border-right: 1px solid ${({ theme }) => cl(theme, 'border.light')};
  background-color: ${({ theme }) => cl(theme, 'background.primary')};
  padding: ${({ theme }) => sp(theme, 'sm')}px 0 ${({ theme }) => sp(theme, 'md')}px;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
`;

export const StyledSidebarTitle = styled.h1.withConfig({
  displayName: 'StyledSidebarTitle',
  componentId: 'SettingsScreen_StyledSidebarTitle',
})`
  margin: 0 ${({ theme }) => sp(theme, 'sm')}px ${({ theme }) => sp(theme, 'xs')}px;
  padding: ${({ theme }) => sp(theme, 'xs')}px ${({ theme }) => sp(theme, 'sm')}px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => cl(theme, 'text.tertiary')};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const StyledGroup = styled.section.withConfig({
  displayName: 'StyledGroup',
  componentId: 'SettingsScreen_StyledGroup',
})`
  margin-bottom: ${({ theme }) => sp(theme, 'xs')}px;
`;

export const StyledGroupToggle = styled.button.withConfig({
  displayName: 'StyledGroupToggle',
  componentId: 'SettingsScreen_StyledGroupToggle',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 0 ${({ theme }) => sp(theme, 'sm')}px ${({ theme }) => sp(theme, 'xs')}px;
  padding: ${({ theme }) => sp(theme, 'xs')}px ${({ theme }) => sp(theme, 'sm')}px;
  border: none;
  background: transparent;
  color: ${({ theme }) => cl(theme, 'text.tertiary')};
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.2;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => cl(theme, 'background.secondary')};
    color: ${({ theme }) => cl(theme, 'text.secondary')};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => cl(theme, 'primary')};
    outline-offset: -2px;
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const StyledGroupChevron = styled.span.withConfig({
  displayName: 'StyledGroupChevron',
  componentId: 'SettingsScreen_StyledGroupChevron',
})`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  font-size: 0.625rem;
  line-height: 1;
  transition: transform 0.2s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  ${({ $expanded }) => ($expanded ? 'transform: rotate(0deg);' : 'transform: rotate(-90deg);')}
`;

export const StyledGroupContent = styled.div.withConfig({
  displayName: 'StyledGroupContent',
  componentId: 'SettingsScreen_StyledGroupContent',
})`
  overflow: hidden;
  max-height: ${({ $expanded }) => ($expanded ? '800px' : '0')};
  transition: max-height 0.25s ease-out;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const StyledNavList = styled.ul.withConfig({
  displayName: 'StyledNavList',
  componentId: 'SettingsScreen_StyledNavList',
})`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const StyledNavItem = styled.li.withConfig({
  displayName: 'StyledNavItem',
  componentId: 'SettingsScreen_StyledNavItem',
})`
  margin: 0;
`;

export const StyledNavLink = styled.button.withConfig({
  displayName: 'StyledNavLink',
  componentId: 'SettingsScreen_StyledNavLink',
})`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => sp(theme, 'sm')}px;
  width: 100%;
  min-height: 32px;
  padding: ${({ theme }) => sp(theme, 'xs')}px ${({ theme }) => sp(theme, 'sm')}px;
  border: none;
  border-left: 3px solid transparent;
  background: transparent;
  color: ${({ theme, $active }) => ($active ? cl(theme, 'primary') : cl(theme, 'text.secondary'))};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  font-size: 0.8125rem;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  white-space: nowrap;
  text-align: left;

  &:hover {
    background-color: ${({ theme }) => cl(theme, 'background.secondary')};
    color: ${({ theme, $active }) => ($active ? cl(theme, 'primary') : cl(theme, 'text.primary'))};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => cl(theme, 'primary')};
    outline-offset: -2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  ${({ $active, theme }) =>
    $active &&
    `border-left-color: ${cl(theme, 'primary')}; background-color: ${cl(theme, 'background.secondary')};`}
`;

export const StyledNavLinkIcon = styled.span.withConfig({
  displayName: 'StyledNavLinkIcon',
  componentId: 'SettingsScreen_StyledNavLinkIcon',
})`
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  line-height: 1;
  opacity: ${({ $active }) => ($active ? 1 : 0.75)};
`;

export const StyledNavLinkLabel = styled.span.withConfig({
  displayName: 'StyledNavLinkLabel',
  componentId: 'SettingsScreen_StyledNavLinkLabel',
})`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StyledResizeHandle = styled.div.withConfig({
  displayName: 'StyledResizeHandle',
  componentId: 'SettingsScreen_StyledResizeHandle',
})`
  display: none;

  @media (min-width: ${({ theme }) => tablet(theme)}px) {
    display: flex;
    position: absolute;
    top: 0;
    right: 0;
    width: ${({ theme }) => sp(theme, 'sm')}px;
    height: 100%;
    cursor: col-resize;
    background: transparent;
    align-items: center;
    justify-content: center;

    &::after {
      content: '';
      width: 2px;
      height: ${({ theme }) => sp(theme, 'xl') ?? 32}px;
      border-radius: 1px;
      background-color: ${({ theme }) => cl(theme, 'background.tertiary')};
      opacity: 0;
      transition: opacity 0.15s ease;
    }

    &:hover::after,
    &:active::after {
      opacity: 1;
    }

    &:hover {
      background-color: ${({ theme }) => cl(theme, 'background.secondary')};
    }
  }
`;

export const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'SettingsScreen_StyledContent',
})`
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  @media (min-width: ${({ theme }) => tablet(theme)}px) {
    min-height: 0;
  }
`;
