/**
 * Tab Web Styles
 * Styled-components for Web platform
 * File: Tab.web.styles.jsx
 */
import styled from 'styled-components';
import { Pressable, Text } from 'react-native';

const StyledTab = styled(Pressable).withConfig({
  displayName: 'StyledTab',
})`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  border-bottom-width: ${({ variant, active }) => (variant === 'underline' && active ? 2 : 0)}px;
  border-bottom-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ variant, theme }) => (variant === 'pills' ? theme.radius.full : 0)}px;
  background-color: ${({ variant, active, theme }) => {
    if (variant === 'pills' && active) {
      return theme.colors.primary;
    }
    if (variant === 'pills') {
      return 'transparent';
    }
    return 'transparent';
  }};
  cursor: pointer;

  &:hover {
    ${({ variant, active, theme }) => {
      if (variant === 'pills' && !active) {
        return `background-color: ${theme.colors.background.secondary};`;
      }
      if (variant === 'underline' && !active) {
        return `border-bottom-color: ${theme.colors.background.tertiary}; border-bottom-width: 1px;`;
      }
      return '';
    }}
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.radius.sm}px;
  }
`;

const StyledTabText = styled(Text).withConfig({
  displayName: 'StyledTabText',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ active }) => (active ? 600 : 500)};
  line-height: ${({ theme }) => theme.typography.fontSize.md * theme.typography.lineHeight.normal}px;
  color: ${({ active, variant, theme }) => {
    if (variant === 'pills' && active) {
      return theme.colors.text.inverse;
    }
    if (active) {
      return theme.colors.primary;
    }
    return theme.colors.text.secondary;
  }};
`;

export {
  StyledTab,
  StyledTabText,
};



