/**
 * Select Hook
 * Shared logic for Select component (validation + open state)
 * File: useSelect.js
 */

import { useState, useMemo, useCallback } from 'react';
import { tSync } from '@i18n';
import { VALIDATION_STATES } from './types';

/**
 * @typedef {Object} SelectOption
 * @property {string} label
 * @property {string|number} value
 * @property {boolean} [disabled]
 */

/**
 * @param {Object} params
 * @param {string|number|null|undefined} params.value
 * @param {SelectOption[]} params.options
 * @param {Function} params.onValueChange
 * @param {boolean} params.required
 * @param {Function} params.validate
 */
const useSelect = ({
  value,
  options = [],
  onValueChange,
  required = false,
  validate,
} = {}) => {
  const [open, setOpen] = useState(false);
  const [validationState, setValidationState] = useState(VALIDATION_STATES.DEFAULT);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const selectedOption = useMemo(() => {
    if (value === null || value === undefined) return undefined;
    return options.find((o) => o.value === value);
  }, [options, value]);

  const validateValue = useCallback(
    (val) => {
      if (!required && (val === null || val === undefined || val === '')) {
        setValidationState(VALIDATION_STATES.DEFAULT);
        setErrorMessage('');
        return true;
      }

      if (required && (val === null || val === undefined || val === '')) {
        setValidationState(VALIDATION_STATES.ERROR);
        setErrorMessage(tSync('forms.validation.required'));
        return false;
      }

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

      setValidationState(VALIDATION_STATES.SUCCESS);
      setErrorMessage('');
      return true;
    },
    [required, validate]
  );

  const openSelect = useCallback(() => setOpen(true), []);
  const closeSelect = useCallback(() => setOpen(false), []);
  const toggleSelect = useCallback(() => setOpen((prev) => !prev), []);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => {
    setIsFocused(false);
    validateValue(value);
  }, [validateValue, value]);

  const handleSelect = useCallback(
    (nextValue) => {
      if (onValueChange) onValueChange(nextValue);
      validateValue(nextValue);
      closeSelect();
    },
    [closeSelect, onValueChange, validateValue]
  );

  return {
    open,
    isFocused,
    validationState,
    errorMessage,
    selectedOption,
    openSelect,
    closeSelect,
    toggleSelect,
    handleFocus,
    handleBlur,
    handleSelect,
  };
};

export default useSelect;


