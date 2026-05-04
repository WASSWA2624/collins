/**
 * Tab Android Styles
 * Styled-components for Android platform
 * File: Tab.android.styles.jsx
 */
import styled from 'styled-components/native';

const StyledTab = styled.Pressable.withConfig({
  displayName: 'StyledTab',
})`
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
`;

const StyledTabText = styled.Text.withConfig({
  displayName: 'StyledTabText',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
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


