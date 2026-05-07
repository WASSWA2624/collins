/**
 * Select Component - Android
 * Picker/dropdown primitive for Android platform
 * File: Select.android.jsx
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
  StyledSearchInput,
  StyledOption,
  StyledOptionText,
  StyledNoResultsText,
  StyledHelperText,
} from './Select.android.styles';

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
 * @param {boolean} [props.searchable]
 * @param {string} [props.searchPlaceholder]
 * @param {boolean} [props.allowCustomValue]
 * @param {(value: any) => boolean|{valid: boolean, error?: string}} [props.validate]
 * @param {string} [props.accessibilityLabel]
 * @param {string} [props.accessibilityHint]
 * @param {string} [props.testID]
 * @param {Object} [props.style]
 */
const SelectAndroid = ({
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
  searchable = true,
  searchPlaceholder,
  allowCustomValue = false,
  validate,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
}) => {
  const { t } = useI18n();
  const defaultPlaceholder = placeholder || t('common.selectPlaceholder');
  const finalSearchPlaceholder = searchPlaceholder || t('common.searchPlaceholder');
  const [searchQuery, setSearchQuery] = React.useState('');

  const visibleOptions = React.useMemo(() => {
    const rows = options.map((option, index) => ({ option, index }));
    const query = String(searchQuery || '').trim().toLowerCase();
    if (!searchable || !query) return rows;
    return rows.filter(({ option }) =>
      [option.label, option.value]
        .some((entry) => String(entry || '').toLowerCase().includes(query))
    );
  }, [options, searchable, searchQuery]);
  const normalizedSearchQuery = String(searchQuery || '').trim();
  const exactSearchMatch = React.useMemo(() => {
    if (!normalizedSearchQuery) return false;
    const query = normalizedSearchQuery.toLowerCase();
    return options.some((option) =>
      [option.label, option.value].some((entry) => String(entry || '').trim().toLowerCase() === query)
    );
  }, [normalizedSearchQuery, options]);
  const canUseCustomValue = allowCustomValue && searchable && normalizedSearchQuery && !exactSearchMatch;
  const customValueLabel = canUseCustomValue
    ? String(t('common.useCustomValue', { value: normalizedSearchQuery })).replace('{{value}}', normalizedSearchQuery)
    : '';
  
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
  const hasValue = value !== null && value !== undefined && value !== '';
  const displayValue = selectedOption
    ? selectedOption.label
    : allowCustomValue && hasValue
    ? String(value)
    : defaultPlaceholder;
  const isPlaceholderValue = !selectedOption && !(allowCustomValue && hasValue);

  React.useEffect(() => {
    if (!open) setSearchQuery('');
  }, [open]);

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
        <StyledTriggerText disabled={disabled} isPlaceholder={isPlaceholderValue}>
          {displayValue}
        </StyledTriggerText>
        <StyledChevron aria-hidden>▾</StyledChevron>
      </StyledTrigger>

      {displayHelperText ? (
        <StyledHelperText validationState={finalValidationState}>{displayHelperText}</StyledHelperText>
      ) : null}

      <Modal transparent visible={open} animationType="fade" onRequestClose={closeSelect}>
        <StyledOverlay onPress={closeSelect} accessibilityRole="button" accessibilityLabel={t('common.closeSelect')}>
          <StyledSheet>
            {searchable ? (
              <StyledSearchInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={finalSearchPlaceholder}
                accessibilityLabel={finalSearchPlaceholder}
                testID={testID ? `${testID}-search` : undefined}
                autoFocus
              />
            ) : null}
            <StyledOptionList>
              {visibleOptions.length === 0 && !canUseCustomValue ? (
                <StyledNoResultsText>{t('common.noResults')}</StyledNoResultsText>
              ) : null}
              {visibleOptions.length > 0 ? (
                visibleOptions.map(({ option: opt, index }) => (
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
                ))
              ) : null}
              {canUseCustomValue ? (
                <StyledOption
                  key="custom-value"
                  onPress={() => handleSelect(normalizedSearchQuery)}
                  accessibilityRole="button"
                  accessibilityLabel={customValueLabel}
                  testID={testID ? `${testID}-custom-option` : undefined}
                >
                  <StyledOptionText>{customValueLabel}</StyledOptionText>
                </StyledOption>
              ) : null}
            </StyledOptionList>
          </StyledSheet>
        </StyledOverlay>
      </Modal>
    </StyledContainer>
  );
};

export default SelectAndroid;


