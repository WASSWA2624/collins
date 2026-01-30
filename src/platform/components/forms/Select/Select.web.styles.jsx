/**
 * Select Web Styles
 * Styled-components for Web platform
 * File: Select.web.styles.jsx
 */

import styled from 'styled-components';

const StyledContainer = styled.div.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
  shouldForwardProp: (prop) => prop !== '$compact',
})`
  position: relative;
  width: ${({ $compact }) => ($compact ? 'auto' : '100%')};
  margin-bottom: ${({ $compact, theme }) => ($compact ? 0 : theme.spacing.md)}px;
`;

const StyledLabelRow = styled.div.withConfig({
  displayName: 'StyledLabelRow',
  componentId: 'StyledLabelRow',
  shouldForwardProp: (prop) => prop !== '$compact',
})`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ $compact, theme }) => ($compact ? theme.spacing.xs : theme.spacing.xs)}px;
`;

const StyledLabel = styled.label.withConfig({
  displayName: 'StyledLabel',
  componentId: 'StyledLabel',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  display: block;
`;

const StyledRequired = styled.span.withConfig({
  displayName: 'StyledRequired',
  componentId: 'StyledRequired',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
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
  min-height: 44px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: 1px solid ${({ $validationState, $isFocused, theme }) => {
    if ($validationState === 'error') return theme.colors.error;
    if ($validationState === 'success') return theme.colors.success;
    if ($isFocused) return theme.colors.primary;
    return theme.colors.background.tertiary;
  }};
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ $compact, theme }) => ($compact ? theme.spacing.sm : theme.spacing.md)}px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  text-align: left;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
  }
`;

const StyledTriggerText = styled.span.withConfig({
  displayName: 'StyledTriggerText',
  componentId: 'StyledTriggerText',
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})`
  flex: 1;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ disabled, $isPlaceholder, theme }) => {
    if (disabled) return theme.colors.text.tertiary;
    if ($isPlaceholder) return theme.colors.text.tertiary;
    return theme.colors.text.primary;
  }};
  display: block;
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
})`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-width: 1px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.md}px;
  z-index: 1000;
  overflow: hidden;
  max-height: min(50vh, 240px);
  overflow-y: auto;
  overscroll-behavior: contain;
`;

const StyledOption = styled.button.withConfig({
  displayName: 'StyledOption',
  componentId: 'StyledOption',
})`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md}px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: none;
  text-align: left;

  &:hover {
    ${({ disabled, theme }) => (disabled ? '' : `background-color: ${theme.colors.background.secondary};`)}
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: -2px;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const StyledOptionText = styled.span.withConfig({
  displayName: 'StyledOptionText',
  componentId: 'StyledOptionText',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.text.primary};
  display: block;
`;

const StyledHelperText = styled.span.withConfig({
  displayName: 'StyledHelperText',
  componentId: 'StyledHelperText',
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ $validationState, theme }) => {
    if ($validationState === 'error') return theme.colors.error;
    if ($validationState === 'success') return theme.colors.success;
    return theme.colors.text.secondary;
  }};
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  display: block;
`;

export {
  StyledContainer,
  StyledLabelRow,
  StyledLabel,
  StyledRequired,
  StyledTrigger,
  StyledTriggerText,
  StyledChevron,
  StyledMenu,
  StyledOption,
  StyledOptionText,
  StyledHelperText,
};


