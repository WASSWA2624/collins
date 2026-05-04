/**
 * TextArea Component - iOS
 * Multiline input field component for iOS platform
 * File: TextArea.ios.jsx
 */

import React from 'react';
import {
  StyledContainer,
  StyledLabel,
  StyledInputContainer,
  StyledInput,
  StyledHelperText,
  StyledCharacterCounter,
  StyledRequiredIndicator,
} from './TextArea.ios.styles';
import useTextArea from './useTextArea';
import { VALIDATION_STATES } from './types';

const TextAreaIOS = ({
  label,
  placeholder,
  value = '',
  onChangeText,
  validationState,
  errorMessage,
  helperText,
  required = false,
  disabled = false,
  maxLength,
  showCharacterCounter = false,
  minHeight = 96,
  validate,
  debounceMs = 300,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
  ...rest
}) => {
  const {
    value: internalValue,
    validationState: internalValidationState,
    errorMessage: internalErrorMessage,
    isFocused,
    handleChange,
    handleFocus,
    handleBlur,
    characterCount,
  } = useTextArea({
    value,
    onChangeText,
    validate,
    required,
    maxLength,
    debounceMs,
  });

  const finalValidationState =
    validationState || (disabled ? VALIDATION_STATES.DISABLED : internalValidationState);
  const finalErrorMessage = errorMessage || internalErrorMessage;
  const displayHelperText = finalErrorMessage || helperText;

  const computedA11yLabel =
    accessibilityLabel ||
    label ||
    (typeof placeholder === 'string' && placeholder.length > 0 ? placeholder : undefined);

  return (
    <StyledContainer style={style}>
      {label && (
        <StyledLabel>
          {label}
          {required && <StyledRequiredIndicator> *</StyledRequiredIndicator>}
        </StyledLabel>
      )}
      <StyledInputContainer validationState={finalValidationState} isFocused={isFocused}>
        <StyledInput
          value={internalValue}
          onChangeText={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={undefined}
          editable={!disabled}
          maxLength={maxLength}
          multiline
          textAlignVertical="top"
          minHeight={minHeight}
          accessibilityLabel={computedA11yLabel}
          accessibilityHint={accessibilityHint || displayHelperText}
          accessibilityState={{ disabled }}
          testID={testID}
          {...rest}
        />
      </StyledInputContainer>
      {displayHelperText && (
        <StyledHelperText validationState={finalValidationState}>
          {displayHelperText}
        </StyledHelperText>
      )}
      {showCharacterCounter && maxLength && (
        <StyledCharacterCounter>
          {characterCount}/{maxLength}
        </StyledCharacterCounter>
      )}
    </StyledContainer>
  );
};

export default TextAreaIOS;


