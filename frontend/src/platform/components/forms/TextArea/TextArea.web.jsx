/**
 * TextArea Component - Web
 * Multiline input field component for Web platform
 * File: TextArea.web.jsx
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
} from './TextArea.web.styles';
import useTextArea from './useTextArea';
import { VALIDATION_STATES } from './types';

const TextAreaWeb = ({
  label,
  placeholder,
  value = '',
  onChange,
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
  className,
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
    onChangeText: onChangeText || (onChange ? (val) => onChange({ target: { value: val } }) : undefined),
    onChange,
    validate,
    required,
    maxLength,
    debounceMs,
  });

  const finalValidationState =
    validationState || (disabled ? VALIDATION_STATES.DISABLED : internalValidationState);
  const finalErrorMessage = errorMessage || internalErrorMessage;
  const displayHelperText = finalErrorMessage || helperText;

  const inputId = testID ? `textarea-${testID}` : undefined;
  const helperId = inputId && displayHelperText ? `${inputId}-helper` : undefined;
  const computedA11yLabel =
    accessibilityLabel ||
    label ||
    (typeof placeholder === 'string' && placeholder.length > 0 ? placeholder : undefined);

  return (
    <StyledContainer style={style} className={className}>
      {label && (
        <StyledLabel htmlFor={inputId}>
          {label}
          {required && <StyledRequiredIndicator aria-hidden="true"> *</StyledRequiredIndicator>}
        </StyledLabel>
      )}
      <StyledInputContainer validationState={finalValidationState} isFocused={isFocused}>
        <StyledInput
          id={inputId}
          value={internalValue}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          multiline
          minHeight={minHeight}
          aria-label={computedA11yLabel}
          aria-describedby={helperId}
          aria-description={accessibilityHint}
          aria-invalid={finalValidationState === 'error'}
          aria-required={required}
          data-testid={testID}
          {...rest}
        />
      </StyledInputContainer>
      {displayHelperText && (
        <StyledHelperText
          validationState={finalValidationState}
          id={helperId}
        >
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

export default TextAreaWeb;


