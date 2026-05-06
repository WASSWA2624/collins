/**
 * Dropdown Web Styles
 * Styled-components for Web platform
 * File: Dropdown.web.styles.jsx
 */
import styled from 'styled-components';

const StyledDropdown = styled.div.withConfig({
  displayName: 'StyledDropdown',
})`
  position: relative;
  display: inline-block;
`;

const StyledDropdownTrigger = styled.button.withConfig({
  displayName: 'StyledDropdownTrigger',
})`
  appearance: none;
  border: 0;
  background: transparent;
  padding: 0;
  color: inherit;
  font: inherit;
  cursor: pointer;
`;

const StyledDropdownMenu = styled.div.withConfig({
  displayName: 'StyledDropdownMenu',
})`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  min-width: 200px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
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

const StyledDropdownItem = styled.button.withConfig({
  displayName: 'StyledDropdownItem',
})`
  appearance: none;
  width: 100%;
  border: 0;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  text-align: left;
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

const StyledDropdownItemText = styled.span.withConfig({
  displayName: 'StyledDropdownItemText',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb || theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const StyledDropdownSearchInput = styled.input.withConfig({
  displayName: 'StyledDropdownSearchInput',
})`
  width: 100%;
  min-height: 40px;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb || theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: -2px;
  }
`;

const StyledDropdownEmptyText = styled.div.withConfig({
  displayName: 'StyledDropdownEmptyText',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
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



