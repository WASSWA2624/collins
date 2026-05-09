/**
 * Select Android Styles
 * Styled-components for Android platform
 * File: Select.android.styles.jsx
 */

import styled from 'styled-components/native';

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

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
  shouldForwardProp: (prop) => !String(prop).startsWith('$'),
})`
  width: 100%;
  margin-bottom: ${({ $compact, theme }) =>
    $compact ? 0 : theme.spacing.md}px;
`;

const StyledLabelRow = styled.View.withConfig({
  displayName: 'StyledLabelRow',
  componentId: 'StyledLabelRow',
  shouldForwardProp: (prop) => !String(prop).startsWith('$'),
})`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledLabel = styled.Text.withConfig({
  displayName: 'StyledLabel',
  componentId: 'StyledLabel',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledRequired = styled.Text.withConfig({
  displayName: 'StyledRequired',
  componentId: 'StyledRequired',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.error};
`;

const StyledTrigger = styled.Pressable.withConfig({
  displayName: 'StyledTrigger',
  componentId: 'StyledTrigger',
  shouldForwardProp: (prop) => !String(prop).startsWith('$'),
})`
  width: 100%;
  min-height: ${({ $compact }) => ($compact ? 40 : 44)}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-width: 1px;
  border-color: ${({ validationState, isFocused, theme }) => {
    if (validationState === 'error') return theme.colors.error;
    if (validationState === 'success') return theme.colors.success;
    if (isFocused) return theme.colors.primary;
    return theme.colors.background.tertiary;
  }};
  border-radius: 0;
  background-color: ${({ disabled, theme }) =>
    disabled ? theme.colors.background.secondary : theme.colors.background.primary};
  padding: ${({ $compact, theme }) =>
    $compact ? theme.spacing.sm : theme.spacing.md}px;
`;

const StyledTriggerContent = styled.View.withConfig({
  displayName: 'StyledTriggerContent',
  componentId: 'StyledTriggerContent',
})`
  min-width: 0;
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledTriggerText = styled.Text.withConfig({
  displayName: 'StyledTriggerText',
  componentId: 'StyledTriggerText',
  shouldForwardProp: (prop) => !String(prop).startsWith('$'),
})`
  flex: 1;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ disabled, isPlaceholder, theme }) => {
    if (disabled) return theme.colors.text.tertiary;
    if (isPlaceholder) return theme.colors.text.tertiary;
    return theme.colors.text.primary;
  }};
`;

const StyledChevron = styled.Text.withConfig({
  displayName: 'StyledChevron',
  componentId: 'StyledChevron',
})`
  margin-left: ${({ theme }) => theme.spacing.sm}px;
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledOverlay = styled.Pressable.withConfig({
  displayName: 'StyledOverlay',
  componentId: 'StyledOverlay',
})`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.45);
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledSheet = styled.View.withConfig({
  displayName: 'StyledSheet',
  componentId: 'StyledSheet',
})`
  width: 100%;
  max-width: 520px;
  max-height: 80%;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: 0;
  overflow: hidden;
`;

const StyledOptionList = styled.ScrollView.withConfig({
  displayName: 'StyledOptionList',
  componentId: 'StyledOptionList',
})`
  width: 100%;
`;

const StyledSearchInput = styled.TextInput.withConfig({
  displayName: 'StyledSearchInput',
  componentId: 'StyledSearchInput',
})`
  min-height: 44px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledOption = styled.Pressable.withConfig({
  displayName: 'StyledOption',
  componentId: 'StyledOption',
  shouldForwardProp: (prop) => prop !== 'selected',
})`
  min-height: 42px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  background-color: ${({ selected, theme }) =>
    selected
      ? colorWithAlpha(theme.colors.primary, 0.1)
      : theme.colors.background.primary};
  border-left-width: 3px;
  border-left-color: ${({ selected, theme }) =>
    selected ? theme.colors.primary : 'transparent'};
`;

const StyledOptionContent = styled.View.withConfig({
  displayName: 'StyledOptionContent',
  componentId: 'StyledOptionContent',
})`
  min-width: 0;
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledOptionIcon = styled.View.withConfig({
  displayName: 'StyledOptionIcon',
  componentId: 'StyledOptionIcon',
})`
  width: 22px;
  height: 18px;
  align-items: center;
  justify-content: center;
`;

const StyledOptionIconText = styled.Text.withConfig({
  displayName: 'StyledOptionIconText',
  componentId: 'StyledOptionIconText',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  line-height: ${({ theme }) => theme.typography.fontSize.md}px;
  text-align: center;
`;

const StyledOptionText = styled.Text.withConfig({
  displayName: 'StyledOptionText',
  componentId: 'StyledOptionText',
  shouldForwardProp: (prop) => prop !== 'selected',
})`
  min-width: 0;
  flex: 1;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ selected, theme }) =>
    selected ? theme.colors.primary : theme.colors.text.primary};
  font-weight: ${({ selected, theme }) =>
    selected
      ? theme.typography.fontWeight.semibold
      : theme.typography.fontWeight.normal};
`;

const StyledSelectedMark = styled.Text.withConfig({
  displayName: 'StyledSelectedMark',
  componentId: 'StyledSelectedMark',
  shouldForwardProp: (prop) => prop !== 'selected',
})`
  width: 18px;
  text-align: right;
  color: ${({ selected, theme }) =>
    selected ? theme.colors.primary : 'transparent'};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledHelperText = styled.Text.withConfig({
  displayName: 'StyledHelperText',
  componentId: 'StyledHelperText',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ validationState, theme }) => {
    if (validationState === 'error') return theme.colors.error;
    if (validationState === 'success') return theme.colors.success;
    return theme.colors.text.secondary;
  }};
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledNoResultsText = styled.Text.withConfig({
  displayName: 'StyledNoResultsText',
  componentId: 'StyledNoResultsText',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
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
  StyledOverlay,
  StyledSheet,
  StyledOptionList,
  StyledSearchInput,
  StyledOption,
  StyledOptionContent,
  StyledOptionIcon,
  StyledOptionIconText,
  StyledOptionText,
  StyledSelectedMark,
  StyledNoResultsText,
  StyledHelperText,
};
