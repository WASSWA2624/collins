/**
 * TextArea Component - Android
 * Multiline input field component for Android platform
 * File: TextArea.android.jsx
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
} from './TextArea.android.styles';
import useTextArea from './useTextArea';
import { VALIDATION_STATES } from './types';

/**
 * TextArea component for Android
 * @param {Object} props - TextArea props
 * @param {string} props.label - Field label
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Input value
 * @param {Function} props.onChangeText - Change handler
 * @param {string} props.validationState - Validation state (default, error, success, disabled)
 * @param {string} props.errorMessage - Error message
 * @param {string} props.helperText - Helper text
 * @param {boolean} props.required - Required field
 * @param {boolean} props.disabled - Disabled state
 * @param {number} props.maxLength - Maximum length
 * @param {boolean} props.showCharacterCounter - Show character counter
 * @param {number} props.minHeight - Minimum height for the text area
 * @param {Function} props.validate - Custom validation function
 * @param {number} props.debounceMs - Debounce delay
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.accessibilityHint - Accessibility hint
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const TextAreaAndroid = ({
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

export default TextAreaAndroid;


