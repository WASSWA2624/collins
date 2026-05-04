/**
 * TextField Web Styles
 * Styled-components for Web platform
 * File: TextField.web.styles.jsx
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
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledRequiredIndicator = styled.span.withConfig({
  displayName: 'StyledRequiredIndicator',
  componentId: 'StyledRequiredIndicator',
})`
  color: ${({ theme }) => theme.colors.error};
`;

const StyledInputContainer = styled.div.withConfig({
  displayName: 'StyledInputContainer',
  componentId: 'StyledInputContainer',
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-width: 1px;
  border-style: solid;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-color: ${({ $validationState, $isFocused, theme }) => {
    if ($validationState === 'error') return theme.colors.error;
    if ($validationState === 'success') return theme.colors.success;
    if ($isFocused) return theme.colors.primary;
    return theme.colors.background.tertiary;
  }};
  padding: 0 ${({ theme }) => theme.spacing.md}px;
  min-height: 48px;
  gap: ${({ theme }) => theme.spacing.xs}px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus-within {
    border-color: ${({ $validationState, theme }) => {
      if ($validationState === 'error') return theme.colors.error;
      if ($validationState === 'success') return theme.colors.success;
      return theme.colors.primary;
    }};
    box-shadow: 0 0 0 3px ${({ $validationState, theme }) => {
      if ($validationState === 'error') return `${theme.colors.error}15`;
      if ($validationState === 'success') return `${theme.colors.success}15`;
      return `${theme.colors.primary}15`;
    }};
    outline: none;
  }
`;

const StyledPrefix = styled.span.withConfig({
  displayName: 'StyledPrefix',
  componentId: 'StyledPrefix',
})`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const StyledInput = styled.input.withConfig({
  displayName: 'StyledInput',
  componentId: 'StyledInput',
})`
  flex: 1;
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme, disabled }) => (disabled ? theme.colors.text.tertiary : theme.colors.text.primary)};
  padding: ${({ theme }) => theme.spacing.sm}px 0;
  border: 0;
  outline: 0;
  background: transparent;
  width: 100%;
  min-width: 0;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const StyledSuffix = styled.span.withConfig({
  displayName: 'StyledSuffix',
  componentId: 'StyledSuffix',
})`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const StyledHelperText = styled.div.withConfig({
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
`;

const StyledCharacterCounter = styled.div.withConfig({
  displayName: 'StyledCharacterCounter',
  componentId: 'StyledCharacterCounter',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
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



