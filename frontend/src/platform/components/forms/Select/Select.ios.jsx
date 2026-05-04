/**
 * Select Component - iOS
 * Picker/dropdown primitive for iOS platform
 * File: Select.ios.jsx
 */

import React from 'react';
import { Modal } from 'react-native';
import useSelect from './useSelect';
import { useI18n } from '@hooks';
import { VALIDATION_STATES } from './types';
import {
  StyledContainer,
  StyledLabelRow,
  StyledLabel,
  StyledRequired,
  StyledTrigger,
  StyledTriggerText,
  StyledChevron,
  StyledOverlay,
  StyledSheet,
  StyledOptionList,
  StyledOption,
  StyledOptionText,
  StyledHelperText,
} from './Select.ios.styles';

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
 * @param {Object} [props.style]
 */
const SelectIOS = ({
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
  style,
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
    handleFocus,
    handleBlur,
    handleSelect,
  } = useSelect({ value, options, onValueChange, required, validate });

  const finalValidationState = validationState || (disabled ? VALIDATION_STATES.DISABLED : internalValidationState);
  const finalErrorMessage = errorMessage || internalErrorMessage;
  const displayHelperText = finalErrorMessage || helperText;

  return (
    <StyledContainer style={style}>
      {label ? (
        <StyledLabelRow>
          <StyledLabel>{label}</StyledLabel>
          {required ? <StyledRequired> *</StyledRequired> : null}
        </StyledLabelRow>
      ) : null}

      <StyledTrigger
        onPress={disabled ? undefined : openSelect}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        validationState={finalValidationState}
        isFocused={isFocused}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || label || defaultPlaceholder}
        accessibilityHint={accessibilityHint || displayHelperText}
        accessibilityState={{ disabled }}
        testID={testID}
      >
        <StyledTriggerText disabled={disabled} isPlaceholder={!selectedOption}>
          {selectedOption ? selectedOption.label : defaultPlaceholder}
        </StyledTriggerText>
        <StyledChevron aria-hidden>▾</StyledChevron>
      </StyledTrigger>

      {displayHelperText ? (
        <StyledHelperText validationState={finalValidationState}>{displayHelperText}</StyledHelperText>
      ) : null}

      <Modal transparent visible={open} animationType="fade" onRequestClose={closeSelect}>
        <StyledOverlay onPress={closeSelect} accessibilityRole="button" accessibilityLabel={t('common.closeSelect')}>
          <StyledSheet>
            <StyledOptionList>
              {options.map((opt, index) => (
                <StyledOption
                  key={`${String(opt.value)}-${index}`}
                  disabled={!!opt.disabled}
                  onPress={() => {
                    if (opt.disabled) return;
                    handleSelect(opt.value);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={opt.label}
                  testID={testID ? `${testID}-option-${index}` : undefined}
                >
                  <StyledOptionText>{opt.label}</StyledOptionText>
                </StyledOption>
              ))}
            </StyledOptionList>
          </StyledSheet>
        </StyledOverlay>
      </Modal>
    </StyledContainer>
  );
};

export default SelectIOS;


