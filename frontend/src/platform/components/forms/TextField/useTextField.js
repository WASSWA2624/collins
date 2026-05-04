/**
 * TextField Hook
 * Shared logic for TextField component (validation, formatting, debounce)
 * File: useTextField.js
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { tSync } from '@i18n';
import { isValidEmail, isValidUrl } from '@utils/validator';
import { VALIDATION_STATES } from './types';

/**
 * Format phone number (basic formatting)
 * @param {string} value - Phone number string
 * @returns {string} Formatted phone number
 */
const formatPhoneNumber = (value) => {
  if (!value) return '';
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  // Format as (XXX) XXX-XXXX for US numbers
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

/**
 * Custom hook for TextField component logic
 * @param {Object} props - TextField props
 * @param {string} props.value - Input value
 * @param {Function} props.onChangeText - Change handler
 * @param {Function} props.onChange - Change handler (web)
 * @param {string} props.type - Input type
 * @param {Function} props.validate - Custom validation function
 * @param {boolean} props.required - Required field
 * @param {number} props.maxLength - Maximum length
 * @param {number} props.debounceMs - Debounce delay in milliseconds
 * @param {boolean} props.autoFormat - Enable auto-formatting
 * @returns {Object} TextField state and handlers
 */
const useTextField = ({
  value = '',
  onChangeText,
  onChange,
  type = 'text',
  validate,
  required = false,
  maxLength,
  debounceMs = 300,
  autoFormat = false,
}) => {
  const normalizedValue = value == null ? '' : value;
  const [internalValue, setInternalValue] = useState(normalizedValue);
  const [validationState, setValidationState] = useState(VALIDATION_STATES.DEFAULT);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const debounceTimerRef = useRef(null);

  // Sync internal value with external value
  useEffect(() => {
    setInternalValue(value == null ? '' : value);
  }, [value]);

  // Validate value
  const validateValue = useCallback(
    (val) => {
      if (!val && !required) {
        setValidationState(VALIDATION_STATES.DEFAULT);
        setErrorMessage('');
        return true;
      }

      if (required && !val) {
        setValidationState(VALIDATION_STATES.ERROR);
        setErrorMessage(tSync('forms.validation.required'));
        return false;
      }

      if (maxLength && val.length > maxLength) {
        setValidationState(VALIDATION_STATES.ERROR);
        setErrorMessage(tSync('forms.validation.maxLength', { max: maxLength }));
        return false;
      }

      // Type-specific validation
      if (type === 'email' && val && !isValidEmail(val)) {
        setValidationState(VALIDATION_STATES.ERROR);
        setErrorMessage(tSync('forms.validation.invalidEmail'));
        return false;
      }

      if (type === 'url' && val && !isValidUrl(val)) {
        setValidationState(VALIDATION_STATES.ERROR);
        setErrorMessage(tSync('forms.validation.invalidUrl'));
        return false;
      }

      // Custom validation
      if (validate) {
        const result = validate(val);
        if (typeof result === 'boolean') {
          if (!result) {
            setValidationState(VALIDATION_STATES.ERROR);
            setErrorMessage(tSync('forms.validation.invalidValue'));
            return false;
          }
        } else if (result && !result.valid) {
          setValidationState(VALIDATION_STATES.ERROR);
          setErrorMessage(result.error || tSync('forms.validation.invalidValue'));
          return false;
        }
      }

      // Success state if value is valid and not empty
      if (val) {
        setValidationState(VALIDATION_STATES.SUCCESS);
      } else {
        setValidationState(VALIDATION_STATES.DEFAULT);
      }
      setErrorMessage('');
      return true;
    },
    [type, required, maxLength, validate]
  );

  // Handle value change with debounce
  const handleChange = useCallback(
    (newValue) => {
      // Auto-format if enabled
      let formattedValue = newValue;
      if (autoFormat && type === 'tel') {
        formattedValue = formatPhoneNumber(newValue);
      }

      setInternalValue(formattedValue);

      // Clear existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Immediate validation for required fields
      if (required && !formattedValue) {
        setValidationState(VALIDATION_STATES.ERROR);
        setErrorMessage(tSync('forms.validation.required'));
      } else {
        setValidationState(VALIDATION_STATES.DEFAULT);
        setErrorMessage('');
      }

      // Debounced validation and onChange
      debounceTimerRef.current = setTimeout(() => {
        validateValue(formattedValue);
        if (onChangeText) {
          onChangeText(formattedValue);
        }
        if (onChange) {
          onChange({ target: { value: formattedValue } });
        }
      }, debounceMs);
    },
    [onChangeText, onChange, type, required, debounceMs, autoFormat, validateValue]
  );

  // Handle focus
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  // Handle blur
  const handleBlur = useCallback(() => {
    setIsFocused(false);
    validateValue(internalValue);
  }, [internalValue, validateValue]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    value: internalValue,
    validationState,
    errorMessage,
    isFocused,
    handleChange,
    handleFocus,
    handleBlur,
    characterCount: internalValue ? internalValue.length : 0,
  };
};

export default useTextField;

