/**
 * TextField Component - Web
 * Input field component for Web platform
 * File: TextField.web.jsx
 */
// 1. External dependencies
import React from 'react';

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
} from './TextField.web.styles';

// 5. Component-specific hook (relative import)
import useTextField from './useTextField';

// 6. Types and constants (relative import)
import { INPUT_TYPES, VALIDATION_STATES } from './types';

/**
 * TextField component for Web
 * @param {Object} props - TextField props
 * @param {string} props.label - Field label
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler (web)
 * @param {Function} props.onChangeText - Change handler (alias for onChange)
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
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const TextFieldWeb = ({
  label,
  placeholder,
  value = '',
  onChange,
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
  className,
  style,
  id,
  ...rest
}) => {
  const reactId = typeof React.useId === 'function' ? React.useId() : undefined;
  const inputId =
    id ||
    (typeof testID === 'string' && testID.length > 0 ? `textfield-${testID}` : undefined) ||
    (reactId ? `textfield-${reactId}` : undefined);

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
    onChangeText: onChangeText || (onChange ? (val) => onChange({ target: { value: val } }) : undefined),
    onChange,
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
  const helperId = inputId && displayHelperText ? `${inputId}-helper` : undefined;
  const computedA11yLabel =
    accessibilityLabel ||
    label ||
    (typeof placeholder === 'string' && placeholder.length > 0 ? placeholder : undefined) ||
    (typeof testID === 'string' ? testID : undefined);

  return (
    <StyledContainer style={style} className={className}>
      {label && (
        <StyledLabel htmlFor={inputId}>
          {label}
          {required && <StyledRequiredIndicator aria-hidden="true"> *</StyledRequiredIndicator>}
        </StyledLabel>
      )}
      <StyledInputContainer $validationState={finalValidationState} $isFocused={isFocused}>
        {prefix && <StyledPrefix>{prefix}</StyledPrefix>}
        <StyledInput
          id={inputId}
          value={internalValue}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          type={type}
          maxLength={maxLength}
          autoComplete={type === INPUT_TYPES.EMAIL ? 'email' : type === INPUT_TYPES.PASSWORD ? 'current-password' : 'off'}
          aria-label={computedA11yLabel}
          aria-describedby={helperId}
          aria-description={accessibilityHint}
          aria-invalid={finalValidationState === 'error'}
          aria-required={required}
          data-testid={testID}
          {...rest}
        />
        {suffix && <StyledSuffix>{suffix}</StyledSuffix>}
      </StyledInputContainer>
      {displayHelperText && (
        <StyledHelperText
          $validationState={finalValidationState}
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

export default TextFieldWeb;

