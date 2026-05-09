/**
 * Select Web Styles
 * Styled-components for Web platform
 * File: Select.web.styles.jsx
 */

import styled from 'styled-components';

const colorWithAlpha = (color, alpha) => {
  if (typeof color !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(color)) {
    return color;
  }

  const value = color.slice(1);
  const red = parseInt(value.slice(0, 2), 16);
  const green = parseInt(value.slice(2, 4), 16);
  const blue = parseInt(value.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

const StyledContainer = styled.div.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
  shouldForwardProp: (prop) => !['$compact', '$isOpen'].includes(prop),
})`
  position: relative;
  width: ${({ $compact }) => ($compact ? 'auto' : '100%')};
  margin-bottom: ${({ $compact, theme }) =>
    $compact ? 0 : theme.spacing.md}px;
  z-index: ${({ $isOpen }) => ($isOpen ? 10000 : 'auto')};
  box-sizing: border-box;
`;

const StyledLabelRow = styled.div.withConfig({
  displayName: 'StyledLabelRow',
  componentId: 'StyledLabelRow',
  shouldForwardProp: (prop) => prop !== '$compact',
})`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ $compact, theme }) =>
    $compact ? theme.spacing.xs : theme.spacing.xs}px;
`;

const StyledLabel = styled.label.withConfig({
  displayName: 'StyledLabel',
  componentId: 'StyledLabel',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  display: block;
`;

const StyledRequired = styled.span.withConfig({
  displayName: 'StyledRequired',
  componentId: 'StyledRequired',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.error};
  display: inline;
`;

const StyledTrigger = styled.button.withConfig({
  displayName: 'StyledTrigger',
  componentId: 'StyledTrigger',
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})`
  width: 100%;
  min-height: ${({ $compact }) => ($compact ? 40 : 44)}px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: 1px solid
    ${({ $validationState, $isFocused, theme }) => {
      if ($validationState === 'error') return theme.colors.error;
      if ($validationState === 'success') return theme.colors.success;
      if ($isFocused) return theme.colors.primary;
      return theme.colors.background.tertiary;
    }};
  border-radius: 0;
  background-color: ${({ disabled, theme }) =>
    disabled ? theme.colors.background.secondary : theme.colors.background.primary};
  padding: ${({ $compact, theme }) =>
    $compact ? theme.spacing.sm : theme.spacing.md}px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  text-align: left;
  box-sizing: border-box;
  gap: ${({ theme }) => theme.spacing.sm}px;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.72;
  }
`;

const StyledTriggerContent = styled.span.withConfig({
  displayName: 'StyledTriggerContent',
  componentId: 'StyledTriggerContent',
})`
  min-width: 0;
  flex: 1;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledTriggerText = styled.span.withConfig({
  displayName: 'StyledTriggerText',
  componentId: 'StyledTriggerText',
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})`
  flex: 1;
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ disabled, $isPlaceholder, theme }) => {
    if (disabled) return theme.colors.text.tertiary;
    if ($isPlaceholder) return theme.colors.text.tertiary;
    return theme.colors.text.primary;
  }};
  display: block;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledChevron = styled.span.withConfig({
  displayName: 'StyledChevron',
  componentId: 'StyledChevron',
})`
  margin-left: ${({ theme }) => theme.spacing.sm}px;
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  display: inline-block;
`;

const StyledMenu = styled.div.withConfig({
  displayName: 'StyledMenu',
  componentId: 'StyledMenu',
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})`
  position: ${({ $portal }) => ($portal ? 'fixed' : 'absolute')};
  top: ${({ $portal, $position }) =>
    $portal ? `${$position?.top || 0}px` : '100%'};
  left: ${({ $portal, $position }) =>
    $portal ? `${$position?.left || 0}px` : '0'};
  right: ${({ $portal }) => ($portal ? 'auto' : '0')};
  width: ${({ $portal, $position }) =>
    $portal ? `${$position?.width || 0}px` : 'auto'};
  margin-top: ${({ $portal, theme }) =>
    $portal ? 0 : theme.spacing.xs}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-width: 1px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 0;
  z-index: 2147483000;
  overflow: hidden;
  max-height: ${({ $portal, $position }) =>
    $portal ? `${$position?.maxHeight || 280}px` : 'min(50vh, 240px)'};
  overflow-y: auto;
  overscroll-behavior: contain;
  box-shadow: 0 18px 44px rgba(15, 23, 42, 0.22);
  box-sizing: border-box;
`;

const StyledSearchInput = styled.input.withConfig({
  displayName: 'StyledSearchInput',
  componentId: 'StyledSearchInput',
})`
  width: 100%;
  min-height: 40px;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 0;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  padding: ${({ theme }) => theme.spacing.sm}px
    ${({ theme }) => theme.spacing.md}px;
  box-sizing: border-box;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: -2px;
  }
`;

const StyledOption = styled.button.withConfig({
  displayName: 'StyledOption',
  componentId: 'StyledOption',
})`
  width: 100%;
  min-height: 40px;
  padding: ${({ theme }) => theme.spacing.sm}px
    ${({ theme }) => theme.spacing.md}px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: none;
  border-left: 3px solid transparent;
  box-sizing: border-box;
  text-align: left;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;

  &:hover {
    ${({ disabled, theme }) =>
      disabled ? '' : `background-color: ${theme.colors.background.secondary};`}
  }

  &[aria-selected='true'] {
    background-color: ${({ theme }) =>
      colorWithAlpha(theme.colors.primary, 0.1)};
    border-left-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: -2px;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const StyledOptionContent = styled.span.withConfig({
  displayName: 'StyledOptionContent',
  componentId: 'StyledOptionContent',
})`
  min-width: 0;
  flex: 1;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledOptionIcon = styled.span.withConfig({
  displayName: 'StyledOptionIcon',
  componentId: 'StyledOptionIcon',
})`
  width: 22px;
  flex: 0 0 22px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  line-height: 1;
`;

const StyledOptionText = styled.span.withConfig({
  displayName: 'StyledOptionText',
  componentId: 'StyledOptionText',
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})`
  min-width: 0;
  flex: 1;
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.primary : theme.colors.text.primary};
  font-weight: ${({ $selected, theme }) =>
    $selected
      ? theme.typography.fontWeight.semibold
      : theme.typography.fontWeight.normal};
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledSelectedMark = styled.span.withConfig({
  displayName: 'StyledSelectedMark',
  componentId: 'StyledSelectedMark',
})`
  width: 18px;
  flex: 0 0 18px;
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-align: right;
`;

const StyledHelperText = styled.span.withConfig({
  displayName: 'StyledHelperText',
  componentId: 'StyledHelperText',
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ $validationState, theme }) => {
    if ($validationState === 'error') return theme.colors.error;
    if ($validationState === 'success') return theme.colors.success;
    return theme.colors.text.secondary;
  }};
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  display: block;
`;

const StyledNoResultsText = styled.span.withConfig({
  displayName: 'StyledNoResultsText',
  componentId: 'StyledNoResultsText',
})`
  display: block;
  padding: ${({ theme }) => theme.spacing.md}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

export {
  StyledContainer,
  StyledLabelRow,
  StyledLabel,
  StyledRequired,
  StyledTrigger,
  StyledTriggerContent,
  StyledTriggerText,
  StyledChevron,
  StyledMenu,
  StyledSearchInput,
  StyledOption,
  StyledOptionContent,
  StyledOptionIcon,
  StyledOptionText,
  StyledSelectedMark,
  StyledNoResultsText,
  StyledHelperText,
};
