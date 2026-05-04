/**
 * Dropdown iOS Styles
 * Styled-components for iOS platform
 * File: Dropdown.ios.styles.jsx
 */
import styled from 'styled-components/native';

const StyledDropdown = styled.View.withConfig({
  displayName: 'StyledDropdown',
})`
  position: relative;
`;

const StyledDropdownTrigger = styled.Pressable.withConfig({
  displayName: 'StyledDropdownTrigger',
})`
  /* Trigger styles */
`;

const StyledDropdownMenu = styled.View.withConfig({
  displayName: 'StyledDropdownMenu',
})`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  min-width: 200px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.md}px;
  shadow-color: ${({ theme }) => theme.colors.text.primary};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.15;
  shadow-radius: 4px;
  z-index: 1000;
  overflow: hidden;
`;

const StyledDropdownItem = styled.Pressable.withConfig({
  displayName: 'StyledDropdownItem',
})`
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

export {
  StyledDropdown,
  StyledDropdownTrigger,
  StyledDropdownMenu,
  StyledDropdownItem,
};


