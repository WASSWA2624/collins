/**
 * Dropdown Web Styles
 * Styled-components for Web platform
 * File: Dropdown.web.styles.jsx
 */
import styled from 'styled-components';
import { View, Pressable } from 'react-native';

const StyledDropdown = styled(View).withConfig({
  displayName: 'StyledDropdown',
})`
  position: relative;
  display: inline-block;
`;

const StyledDropdownTrigger = styled(Pressable).withConfig({
  displayName: 'StyledDropdownTrigger',
})`
  cursor: pointer;
`;

const StyledDropdownMenu = styled(View).withConfig({
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  animation: slideDown 0.2s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const StyledDropdownItem = styled(Pressable).withConfig({
  displayName: 'StyledDropdownItem',
})`
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  background-color: ${({ theme }) => theme.colors.background.primary};

  &:hover {
    ${({ disabled, theme }) => {
      if (disabled) return '';
      return `background-color: ${theme.colors.background.secondary};`;
    }}
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: -2px;
  }
`;

export {
  StyledDropdown,
  StyledDropdownTrigger,
  StyledDropdownMenu,
  StyledDropdownItem,
};



