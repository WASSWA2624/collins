/**
 * TextArea Android Styles
 * Styled-components for Android platform
 * File: TextArea.android.styles.jsx
 */

import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledLabel = styled.Text.withConfig({
  displayName: 'StyledLabel',
  componentId: 'StyledLabel',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledInputContainer = styled.View.withConfig({
  displayName: 'StyledInputContainer',
  componentId: 'StyledInputContainer',
})`
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-color: ${({ validationState, isFocused, theme }) => {
    if (validationState === 'error') return theme.colors.error;
    if (validationState === 'success') return theme.colors.success;
    if (isFocused) return theme.colors.primary;
    return theme.colors.background.tertiary;
  }};
  padding: ${({ theme }) => theme.spacing.md}px;
`;

const StyledInput = styled.TextInput.withConfig({
  displayName: 'StyledInput',
  componentId: 'StyledInput',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme, disabled }) =>
    disabled ? theme.colors.text.tertiary : theme.colors.text.primary};
  width: 100%;
  min-height: ${({ minHeight }) => minHeight}px;
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

const StyledCharacterCounter = styled.Text.withConfig({
  displayName: 'StyledCharacterCounter',
  componentId: 'StyledCharacterCounter',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  text-align: right;
`;

const StyledRequiredIndicator = styled.Text.withConfig({
  displayName: 'StyledRequiredIndicator',
  componentId: 'StyledRequiredIndicator',
})`
  color: ${({ theme }) => theme.colors.error};
`;

export {
  StyledContainer,
  StyledLabel,
  StyledInputContainer,
  StyledInput,
  StyledHelperText,
  StyledCharacterCounter,
  StyledRequiredIndicator,
};


