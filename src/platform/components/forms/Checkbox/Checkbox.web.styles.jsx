/**
 * Checkbox Web Styles
 * Styled-components for Web platform
 * File: Checkbox.web.styles.jsx
 */

import styled from 'styled-components';

const StyledCheckbox = styled.label.withConfig({
  displayName: 'StyledCheckbox',
  componentId: 'StyledCheckbox',
})`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  min-height: 44px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  gap: ${({ theme }) => theme.spacing.sm}px;
  user-select: none;

  &:focus-within {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.radius.sm}px;
  }
`;

const StyledCheckboxInput = styled.input.withConfig({
  displayName: 'StyledCheckboxInput',
  componentId: 'StyledCheckboxInput',
})`
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  margin: 0;
  padding: 0;
  pointer-events: none;
`;

const StyledCheckboxBox = styled.span.withConfig({
  displayName: 'StyledCheckboxBox',
  componentId: 'StyledCheckboxBox',
})`
  width: ${({ theme }) => theme.spacing.md + theme.spacing.xs}px;
  height: ${({ theme }) => theme.spacing.md + theme.spacing.xs}px;
  border-width: 2px;
  border-style: solid;
  border-color: ${({ checked, disabled, theme }) => {
    if (disabled) return theme.colors.background.tertiary;
    if (checked) return theme.colors.primary;
    return theme.colors.background.tertiary;
  }};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ checked, theme }) =>
    checked ? theme.colors.primary : 'transparent'};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
`;

const StyledCheckboxCheck = styled.span.withConfig({
  displayName: 'StyledCheckboxCheck',
  componentId: 'StyledCheckboxCheck',
})`
  width: ${({ theme }) => theme.spacing.sm - 2}px;
  height: ${({ theme }) => theme.spacing.sm + 2}px;
  border-width: 2px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.onPrimary || theme.colors.text.inverse};
  border-top-width: 0;
  border-left-width: 0;
  transform: rotate(45deg);
  margin-top: -2px;
`;

const StyledCheckboxLabel = styled.span.withConfig({
  displayName: 'StyledCheckboxLabel',
  componentId: 'StyledCheckboxLabel',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: 400;
  line-height: ${({ theme }) =>
    theme.typography.fontSize.md * theme.typography.lineHeight.normal}px;
  color: ${({ disabled, theme }) =>
    disabled ? theme.colors.text.tertiary : theme.colors.text.primary};
`;

export { StyledCheckbox, StyledCheckboxInput, StyledCheckboxBox, StyledCheckboxCheck, StyledCheckboxLabel };



