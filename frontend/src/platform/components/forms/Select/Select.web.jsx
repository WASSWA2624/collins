/**
 * Select Component - Web
 * Picker/dropdown primitive for Web platform (keyboard accessible)
 * File: Select.web.jsx
 */
// 1. External dependencies
import React, { useEffect, useRef } from 'react';

// 2. Platform components (from barrel file) - N/A for Select

// 3. Hooks and utilities (absolute imports via aliases)
import { useI18n } from '@hooks';

// 4. Styles (relative import - platform-specific)
import {
  StyledContainer,
  StyledLabelRow,
  StyledLabel,
  StyledRequired,
  StyledTrigger,
  StyledTriggerText,
  StyledChevron,
  StyledMenu,
  StyledOption,
  StyledOptionText,
  StyledHelperText,
} from './Select.web.styles';

// 5. Component-specific hook (relative import)
import useSelect from './useSelect';

// 6. Types and constants (relative import)
import { VALIDATION_STATES } from './types';

/**
 * @typedef {Object} SelectOption
 * @property {string} label
 * @property {string|number} value
 * @property {boolean} [disabled]
 */

/**
 * @param {Object} props
 * @param {string} [props.label]
 * @param {string} [props.placeholder]
 * @param {SelectOption[]} props.options
 * @param {string|number|null|undefined} props.value
 * @param {(value: any) => void} props.onValueChange
 * @param {boolean} [props.required]
 * @param {boolean} [props.disabled]
 * @param {string} [props.validationState]
 * @param {string} [props.errorMessage]
 * @param {string} [props.helperText]
 * @param {(value: any) => boolean|{valid: boolean, error?: string}} [props.validate]
 * @param {string} [props.accessibilityLabel]
 * @param {string} [props.accessibilityHint]
 * @param {string} [props.testID]
 * @param {string} [props.className]
 * @param {Object} [props.style]
 * @param {boolean} [props.compact]
 */
const SelectWeb = ({
  label,
  placeholder,
  options = [],
  value,
  onValueChange,
  required = false,
  disabled = false,
  validationState,
  errorMessage,
  helperText,
  validate,
  accessibilityLabel,
  accessibilityHint,
  testID,
  className,
  style,
  compact = false,
}) => {
  const { t } = useI18n();
  const defaultPlaceholder = placeholder || t('common.selectPlaceholder');
  
  const {
    open,
    isFocused,
    validationState: internalValidationState,
    errorMessage: internalErrorMessage,
    selectedOption,
    openSelect,
    closeSelect,
    toggleSelect,
    handleFocus,
    handleBlur,
    handleSelect,
  } = useSelect({ value, options, onValueChange, required, validate });

  const finalValidationState = validationState || (disabled ? VALIDATION_STATES.DISABLED : internalValidationState);
  const finalErrorMessage = errorMessage || internalErrorMessage;
  const displayHelperText = finalErrorMessage || helperText;

  const rootRef = useRef(null);
  const menuRef = useRef(null);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);

  // Close on outside click
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        closeSelect();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeSelect, open]);

  // Reset focused index when menu opens/closes
  useEffect(() => {
    if (open) {
      setFocusedIndex(-1);
    }
  }, [open]);

  // Focus first option when menu opens
  useEffect(() => {
    if (open && menuRef.current) {
      const firstOption = menuRef.current.querySelector('[role="option"]:not([aria-disabled="true"])');
      if (firstOption) {
        firstOption.focus();
      }
    }
  }, [open]);

  const handleTriggerKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleSelect();
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      openSelect();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      closeSelect();
    }
  };

  const handleMenuKeyDown = (e) => {
    if (disabled) return;

    const enabledOptions = options.filter((opt) => !opt.disabled);
    const currentIndex = enabledOptions.findIndex((opt, idx) => {
      const optionIndex = options.indexOf(opt);
      return optionIndex === focusedIndex;
    });

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = currentIndex < enabledOptions.length - 1 ? currentIndex + 1 : 0;
      const nextOption = enabledOptions[nextIndex];
      const nextOptionIndex = options.indexOf(nextOption);
      setFocusedIndex(nextOptionIndex);
      if (menuRef.current) {
        const optionElement = testID
          ? menuRef.current.querySelector(`[data-testid="${testID}-option-${nextOptionIndex}"]`)
          : menuRef.current.querySelectorAll('[role="option"]')[nextOptionIndex];
        if (optionElement) {
          optionElement.focus();
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : enabledOptions.length - 1;
      const prevOption = enabledOptions[prevIndex];
      const prevOptionIndex = options.indexOf(prevOption);
      setFocusedIndex(prevOptionIndex);
      if (menuRef.current) {
        const optionElement = testID
          ? menuRef.current.querySelector(`[data-testid="${testID}-option-${prevOptionIndex}"]`)
          : menuRef.current.querySelectorAll('[role="option"]')[prevOptionIndex];
        if (optionElement) {
          optionElement.focus();
        }
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (currentIndex >= 0 && currentIndex < enabledOptions.length) {
        handleSelect(enabledOptions[currentIndex].value);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeSelect();
      if (rootRef.current) {
        const trigger = rootRef.current.querySelector('[role="combobox"]');
        if (trigger) {
          trigger.focus();
        }
      }
    }
  };

  return (
    <StyledContainer ref={rootRef} style={style} className={className} $compact={compact}>
      {label ? (
        <StyledLabelRow $compact={compact}>
          <StyledLabel>{label}</StyledLabel>
          {required ? <StyledRequired> *</StyledRequired> : null}
        </StyledLabelRow>
      ) : null}

      <StyledTrigger
        onClick={disabled ? undefined : toggleSelect}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleTriggerKeyDown}
        disabled={disabled}
        $validationState={finalValidationState}
        $isFocused={isFocused}
        $compact={compact}
        role="combobox"
        aria-label={accessibilityLabel || label || defaultPlaceholder}
        aria-describedby={displayHelperText ? `${testID || 'select'}-helper` : undefined}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-invalid={finalValidationState === 'error'}
        aria-required={required}
        data-testid={testID}
      >
        <StyledTriggerText disabled={disabled} $isPlaceholder={!selectedOption}>
          {selectedOption ? selectedOption.label : defaultPlaceholder}
        </StyledTriggerText>
        <StyledChevron aria-hidden="true">▾</StyledChevron>
      </StyledTrigger>

      {open ? (
        <StyledMenu
          ref={menuRef}
          role="listbox"
          onKeyDown={handleMenuKeyDown}
          data-testid={testID ? `${testID}-menu` : undefined}
        >
          {options.map((opt, index) => (
            <StyledOption
              key={`${String(opt.value)}-${index}`}
              disabled={!!opt.disabled}
              onClick={() => {
                if (opt.disabled) return;
                handleSelect(opt.value);
              }}
              onFocus={() => setFocusedIndex(index)}
              role="option"
              aria-selected={value === opt.value}
              aria-disabled={opt.disabled}
              aria-label={opt.label}
              tabIndex={opt.disabled ? -1 : index === 0 ? 0 : -1}
              data-testid={testID ? `${testID}-option-${index}` : undefined}
            >
              <StyledOptionText>{opt.label}</StyledOptionText>
            </StyledOption>
          ))}
        </StyledMenu>
      ) : null}

      {displayHelperText ? (
        <StyledHelperText
          $validationState={finalValidationState}
          id={testID ? `${testID}-helper` : undefined}
        >
          {displayHelperText}
        </StyledHelperText>
      ) : null}
    </StyledContainer>
  );
};

export default SelectWeb;


