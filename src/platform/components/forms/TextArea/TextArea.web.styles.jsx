/**
 * TextArea Web Styles
 * Styled-components for Web platform
 * File: TextArea.web.styles.jsx
 */

import styled from 'styled-components';

const StyledContainer = styled.div.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledLabel = styled.label.withConfig({
  displayName: 'StyledLabel',
  componentId: 'StyledLabel',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
  display: block;
`;

const StyledInputContainer = styled.div.withConfig({
  displayName: 'StyledInputContainer',
  componentId: 'StyledInputContainer',
})`
  position: relative;
  display: flex;
  flex-direction: column;
  border-width: 1px;
  border-style: solid;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-color: ${({ validationState, isFocused, theme }) => {
    if (validationState === 'error') return theme.colors.error;
    if (validationState === 'success') return theme.colors.success;
    if (isFocused) return theme.colors.primary;
    return theme.colors.background.tertiary;
  }};
  padding: ${({ theme }) => theme.spacing.md}px;
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: ${({ validationState, theme }) => {
      if (validationState === 'error') return theme.colors.error;
      if (validationState === 'success') return theme.colors.success;
      return theme.colors.primary;
    }};
    outline: none;
  }
`;

const StyledInput = styled.textarea.withConfig({
  displayName: 'StyledInput',
  componentId: 'StyledInput',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme, disabled }) => (disabled ? theme.colors.text.tertiary : theme.colors.text.primary)};
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  min-height: ${({ minHeight }) => minHeight}px;
  resize: vertical;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const StyledHelperText = styled.span.withConfig({
  displayName: 'StyledHelperText',
  componentId: 'StyledHelperText',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ validationState, theme }) => {
    if (validationState === 'error') return theme.colors.error;
    if (validationState === 'success') return theme.colors.success;
    return theme.colors.text.secondary;
  }};
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  display: block;
`;

const StyledCharacterCounter = styled.span.withConfig({
  displayName: 'StyledCharacterCounter',
  componentId: 'StyledCharacterCounter',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  text-align: right;
  display: block;
`;

const StyledRequiredIndicator = styled.span.withConfig({
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



