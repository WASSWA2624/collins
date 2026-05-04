/**
 * Select iOS Styles
 * Styled-components for iOS platform
 * File: Select.ios.styles.jsx
 */

import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledLabelRow = styled.View.withConfig({
  displayName: 'StyledLabelRow',
  componentId: 'StyledLabelRow',
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
})`
  width: 100%;
  min-height: 44px;
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
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme }) => theme.spacing.md}px;
`;

const StyledTriggerText = styled.Text.withConfig({
  displayName: 'StyledTriggerText',
  componentId: 'StyledTriggerText',
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
  border-radius: ${({ theme }) => theme.radius.lg}px;
  overflow: hidden;
`;

const StyledOptionList = styled.ScrollView.withConfig({
  displayName: 'StyledOptionList',
  componentId: 'StyledOptionList',
})`
  width: 100%;
`;

const StyledOption = styled.Pressable.withConfig({
  displayName: 'StyledOption',
  componentId: 'StyledOption',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const StyledOptionText = styled.Text.withConfig({
  displayName: 'StyledOptionText',
  componentId: 'StyledOptionText',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.text.primary};
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

export {
  StyledContainer,
  StyledLabelRow,
  StyledLabel,
  StyledRequired,
  StyledTrigger,
  StyledTriggerText,
  StyledChevron,
  StyledOverlay,
  StyledSheet,
  StyledOptionList,
  StyledOption,
  StyledOptionText,
  StyledHelperText,
};


