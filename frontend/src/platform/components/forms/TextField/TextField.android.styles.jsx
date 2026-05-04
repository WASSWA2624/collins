/**
 * TextField Android Styles
 * Styled-components for Android platform
 * File: TextField.android.styles.jsx
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

const StyledRequiredIndicator = styled.Text.withConfig({
  displayName: 'StyledRequiredIndicator',
  componentId: 'StyledRequiredIndicator',
})`
  color: ${({ theme }) => theme.colors.error};
`;

const StyledInputContainer = styled.View.withConfig({
  displayName: 'StyledInputContainer',
  componentId: 'StyledInputContainer',
})`
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-color: ${({ validationState, isFocused, theme }) => {
    if (validationState === 'error') return theme.colors.error;
    if (validationState === 'success') return theme.colors.success;
    if (isFocused) return theme.colors.primary;
    return theme.colors.background.tertiary;
  }};
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  min-height: 48px;
`;

const StyledPrefix = styled.View.withConfig({
  displayName: 'StyledPrefix',
  componentId: 'StyledPrefix',
})`
  margin-right: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledInput = styled.TextInput.withConfig({
  displayName: 'StyledInput',
  componentId: 'StyledInput',
})`
  flex: 1;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme, disabled }) => (disabled ? theme.colors.text.tertiary : theme.colors.text.primary)};
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSuffix = styled.View.withConfig({
  displayName: 'StyledSuffix',
  componentId: 'StyledSuffix',
})`
  margin-left: ${({ theme }) => theme.spacing.xs}px;
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

export {
  StyledContainer,
  StyledLabel,
  StyledRequiredIndicator,
  StyledInputContainer,
  StyledPrefix,
  StyledInput,
  StyledSuffix,
  StyledHelperText,
  StyledCharacterCounter,
};


