/**
 * Dropdown Android Styles
 * Styled-components for Android platform
 * File: Dropdown.android.styles.jsx
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
  elevation: 8;
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

const StyledDropdownItemText = styled.Text.withConfig({
  displayName: 'StyledDropdownItemText',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const StyledDropdownSearchInput = styled.TextInput.withConfig({
  displayName: 'StyledDropdownSearchInput',
})`
  min-height: 40px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledDropdownEmptyText = styled.Text.withConfig({
  displayName: 'StyledDropdownEmptyText',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
`;

export {
  StyledDropdown,
  StyledDropdownTrigger,
  StyledDropdownMenu,
  StyledDropdownItem,
  StyledDropdownItemText,
  StyledDropdownSearchInput,
  StyledDropdownEmptyText,
};
