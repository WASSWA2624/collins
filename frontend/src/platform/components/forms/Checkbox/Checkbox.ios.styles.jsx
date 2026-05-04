/**
 * Checkbox iOS Styles
 * Styled-components for iOS platform
 * File: Checkbox.ios.styles.jsx
 */

import styled from 'styled-components/native';

const StyledCheckbox = styled.Pressable.withConfig({
  displayName: 'StyledCheckbox',
  componentId: 'StyledCheckbox',
})`
  flex-direction: row;
  align-items: center;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const StyledCheckboxBox = styled.View.withConfig({
  displayName: 'StyledCheckboxBox',
  componentId: 'StyledCheckboxBox',
})`
  width: ${({ theme }) => theme.spacing.md + theme.spacing.xs}px;
  height: ${({ theme }) => theme.spacing.md + theme.spacing.xs}px;
  border-width: 2px;
  border-color: ${({ checked, disabled, theme }) => {
    if (disabled) return theme.colors.background.tertiary;
    if (checked) return theme.colors.primary;
    return theme.colors.background.tertiary;
  }};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ checked, theme }) => (checked ? theme.colors.primary : 'transparent')};
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledCheckboxCheck = styled.View.withConfig({
  displayName: 'StyledCheckboxCheck',
  componentId: 'StyledCheckboxCheck',
})`
  width: ${({ theme }) => theme.spacing.sm - 2}px;
  height: ${({ theme }) => theme.spacing.sm + 2}px;
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.onPrimary || theme.colors.text.inverse};
  border-top-width: 0;
  border-left-width: 0;
  transform: rotate(45deg);
  margin-top: -2px;
`;

const StyledCheckboxLabel = styled.Text.withConfig({
  displayName: 'StyledCheckboxLabel',
  componentId: 'StyledCheckboxLabel',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: 400;
  line-height: ${({ theme }) => theme.typography.fontSize.md * theme.typography.lineHeight.normal}px;
  color: ${({ disabled, theme }) => (disabled ? theme.colors.text.tertiary : theme.colors.text.primary)};
`;

export { StyledCheckbox, StyledCheckboxBox, StyledCheckboxCheck, StyledCheckboxLabel };


