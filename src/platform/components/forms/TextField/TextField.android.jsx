/**
 * TextField Component - Android
 * Input field component for Android platform
 * File: TextField.android.jsx
 */
// 1. External dependencies
import React from 'react';
import { useTheme } from 'styled-components/native';

// 2. Platform components (from barrel file) - N/A for TextField

// 3. Hooks and utilities (absolute imports via aliases) - N/A for TextField

// 4. Styles (relative import - platform-specific)
import {
  StyledCharacterCounter,
  StyledContainer,
  StyledHelperText,
  StyledInput,
  StyledInputContainer,
  StyledLabel,
  StyledPrefix,
  StyledRequiredIndicator,
  StyledSuffix,
} from './TextField.android.styles';

// 5. Component-specific hook (relative import)
import useTextField from './useTextField';

// 6. Types and constants (relative import)
import { INPUT_TYPES, VALIDATION_STATES } from './types';

/**
 * TextField component for Android
 * @param {Object} props - TextField props
 * @param {string} props.label - Field label
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Input value
 * @param {Function} props.onChangeText - Change handler
 * @param {string} props.type - Input type (text, email, password, number, tel, etc.)
 * @param {string} props.validationState - Validation state (default, error, success, disabled)
 * @param {string} props.errorMessage - Error message
 * @param {string} props.helperText - Helper text
 * @param {boolean} props.required - Required field
 * @param {boolean} props.disabled - Disabled state
 * @param {number} props.maxLength - Maximum length
 * @param {boolean} props.showCharacterCounter - Show character counter
 * @param {React.ReactNode} props.prefix - Prefix element (icon, symbol)
 * @param {React.ReactNode} props.suffix - Suffix element (icon, symbol)
 * @param {Function} props.validate - Custom validation function
 * @param {boolean} props.autoFormat - Enable auto-formatting
 * @param {number} props.debounceMs - Debounce delay
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.accessibilityHint - Accessibility hint
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const TextFieldAndroid = ({
  label,
  placeholder,
  value = '',
  onChangeText,
  type = INPUT_TYPES.TEXT,
  validationState,
  errorMessage,
  helperText,
  required = false,
  disabled = false,
  maxLength,
  showCharacterCounter = false,
  prefix,
  suffix,
  validate,
  autoFormat = false,
  debounceMs = 300,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
  secureTextEntry,
  ...rest
}) => {
  const theme = useTheme();
  const {
    value: internalValue,
    validationState: internalValidationState,
    errorMessage: internalErrorMessage,
    isFocused,
    handleChange,
    handleFocus,
    handleBlur,
    characterCount,
  } = useTextField({
    value,
    onChangeText,
    type,
    validate,
    required,
    maxLength,
    debounceMs,
    autoFormat,
  });

  const finalValidationState = validationState || (disabled ? VALIDATION_STATES.DISABLED : internalValidationState);
  const finalErrorMessage = errorMessage || internalErrorMessage;
  const displayHelperText = finalErrorMessage || helperText;
  const computedA11yLabel =
    accessibilityLabel ||
    label ||
    (typeof placeholder === 'string' && placeholder.length > 0 ? placeholder : undefined) ||
    (typeof testID === 'string' ? testID : undefined);

  return (
    <StyledContainer style={style}>
      {label && (
        <StyledLabel>
          {label}
          {required && <StyledRequiredIndicator> *</StyledRequiredIndicator>}
        </StyledLabel>
      )}
      <StyledInputContainer validationState={finalValidationState} isFocused={isFocused}>
        {prefix && <StyledPrefix>{prefix}</StyledPrefix>}
        <StyledInput
          value={internalValue}
          onChangeText={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.tertiary}
          editable={!disabled}
          secureTextEntry={secureTextEntry !== undefined ? secureTextEntry : type === INPUT_TYPES.PASSWORD}
          keyboardType={
            type === INPUT_TYPES.EMAIL
              ? 'email-address'
              : type === INPUT_TYPES.NUMBER || type === INPUT_TYPES.TEL
              ? 'numeric'
              : 'default'
          }
          autoCapitalize={type === INPUT_TYPES.EMAIL ? 'none' : 'sentences'}
          autoCorrect={type === INPUT_TYPES.EMAIL || type === INPUT_TYPES.PASSWORD ? false : true}
          maxLength={maxLength}
          accessibilityLabel={computedA11yLabel}
          accessibilityHint={accessibilityHint || displayHelperText}
          accessibilityState={{ disabled, invalid: finalValidationState === VALIDATION_STATES.ERROR }}
          testID={testID}
          {...rest}
        />
        {suffix && <StyledSuffix>{suffix}</StyledSuffix>}
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

export default TextFieldAndroid;

