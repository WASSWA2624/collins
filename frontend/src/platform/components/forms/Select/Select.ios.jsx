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
  StyledTriggerContent,
  StyledTriggerText,
  StyledChevron,
  StyledOverlay,
  StyledSheet,
  StyledOptionList,
  StyledSearchInput,
  StyledOption,
  StyledOptionContent,
  StyledOptionIcon,
  StyledOptionIconText,
  StyledOptionText,
  StyledSelectedMark,
  StyledNoResultsText,
  StyledHelperText,
} from './Select.ios.styles';
import {
  getOptionIcon,
  optionExactlyMatchesQuery,
  optionMatchesQuery,
} from './selectOption.utils';

const renderOptionIcon = (icon) => {
  if (!icon) return null;

  return (
    <StyledOptionIcon>
      {React.isValidElement(icon) ? (
        icon
      ) : (
        <StyledOptionIconText>{String(icon)}</StyledOptionIconText>
      )}
    </StyledOptionIcon>
  );
};

/**
 * @typedef {Object} SelectOption
 * @property {string} label
 * @property {string|number} value
 * @property {boolean} [disabled]
 * @property {React.ReactNode} [icon]
 * @property {string|string[]} [searchText]
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
 * @param {boolean} [props.compact]
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
  searchable = true,
  searchPlaceholder,
  allowCustomValue = false,
  validate,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
  compact = false,
}) => {
  const { t } = useI18n();
  const defaultPlaceholder = placeholder || t('common.selectPlaceholder');
  const finalSearchPlaceholder =
    searchPlaceholder || t('common.searchPlaceholder');
  const [searchQuery, setSearchQuery] = React.useState('');

  const visibleOptions = React.useMemo(() => {
    const rows = options.map((option, index) => ({ option, index }));
    const query = String(searchQuery || '')
      .trim()
      .toLowerCase();
    if (!searchable || !query) return rows;
    return rows.filter(({ option }) => optionMatchesQuery(option, query));
  }, [options, searchable, searchQuery]);
  const normalizedSearchQuery = String(searchQuery || '').trim();
  const exactSearchMatch = React.useMemo(() => {
    if (!normalizedSearchQuery) return false;
    const query = normalizedSearchQuery.toLowerCase();
    return options.some((option) => optionExactlyMatchesQuery(option, query));
  }, [normalizedSearchQuery, options]);
  const canUseCustomValue =
    allowCustomValue &&
    searchable &&
    normalizedSearchQuery &&
    !exactSearchMatch;
  const customValueLabel = canUseCustomValue
    ? String(
        t('common.useCustomValue', { value: normalizedSearchQuery })
      ).replace('{{value}}', normalizedSearchQuery)
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

  const finalValidationState =
    validationState ||
    (disabled ? VALIDATION_STATES.DISABLED : internalValidationState);
  const finalErrorMessage = errorMessage || internalErrorMessage;
  const displayHelperText = finalErrorMessage || helperText;
  const hasValue = value !== null && value !== undefined && value !== '';
  const displayValue = selectedOption
    ? selectedOption.label
    : allowCustomValue && hasValue
      ? String(value)
      : defaultPlaceholder;
  const isPlaceholderValue = !selectedOption && !(allowCustomValue && hasValue);
  const selectedOptionIcon = getOptionIcon(selectedOption);

  React.useEffect(() => {
    if (!open) setSearchQuery('');
  }, [open]);

  return (
    <StyledContainer style={style} $compact={compact}>
      {label ? (
        <StyledLabelRow $compact={compact}>
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
        $compact={compact}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || label || defaultPlaceholder}
        accessibilityHint={accessibilityHint || displayHelperText}
        accessibilityState={{ disabled }}
        testID={testID}
      >
        <StyledTriggerContent>
          {renderOptionIcon(selectedOptionIcon)}
          <StyledTriggerText
            disabled={disabled}
            isPlaceholder={isPlaceholderValue}
            $compact={compact}
            numberOfLines={1}
          >
            {displayValue}
          </StyledTriggerText>
        </StyledTriggerContent>
        <StyledChevron aria-hidden>{'\u25BE'}</StyledChevron>
      </StyledTrigger>

      {displayHelperText ? (
        <StyledHelperText validationState={finalValidationState}>
          {displayHelperText}
        </StyledHelperText>
      ) : null}

      <Modal
        transparent
        visible={open}
        animationType="fade"
        onRequestClose={closeSelect}
      >
        <StyledOverlay
          onPress={closeSelect}
          accessibilityRole="button"
          accessibilityLabel={t('common.closeSelect')}
        >
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
                <StyledNoResultsText>
                  {t('common.noResults')}
                </StyledNoResultsText>
              ) : null}
              {visibleOptions.length > 0
                ? visibleOptions.map(({ option: opt, index }) => {
                    const selected = value === opt.value;
                    const optionIcon = getOptionIcon(opt);

                    return (
                      <StyledOption
                        key={`${String(opt.value)}-${index}`}
                        disabled={!!opt.disabled}
                        selected={selected}
                        onPress={() => {
                          if (opt.disabled) return;
                          handleSelect(opt.value);
                        }}
                        accessibilityRole="button"
                        accessibilityLabel={opt.label}
                        testID={testID ? `${testID}-option-${index}` : undefined}
                      >
                        <StyledOptionContent>
                          {renderOptionIcon(optionIcon)}
                          <StyledOptionText selected={selected} numberOfLines={1}>
                            {opt.label}
                          </StyledOptionText>
                        </StyledOptionContent>
                        <StyledSelectedMark selected={selected}>
                          {selected ? '\u2713' : ''}
                        </StyledSelectedMark>
                      </StyledOption>
                    );
                  })
                : null}
              {canUseCustomValue ? (
                <StyledOption
                  key="custom-value"
                  selected={value === normalizedSearchQuery}
                  onPress={() => handleSelect(normalizedSearchQuery)}
                  accessibilityRole="button"
                  accessibilityLabel={customValueLabel}
                  testID={testID ? `${testID}-custom-option` : undefined}
                >
                  <StyledOptionContent>
                    <StyledOptionText
                      selected={value === normalizedSearchQuery}
                      numberOfLines={1}
                    >
                      {customValueLabel}
                    </StyledOptionText>
                  </StyledOptionContent>
                  <StyledSelectedMark selected={value === normalizedSearchQuery}>
                    {value === normalizedSearchQuery ? '\u2713' : ''}
                  </StyledSelectedMark>
                </StyledOption>
              ) : null}
            </StyledOptionList>
          </StyledSheet>
        </StyledOverlay>
      </Modal>
    </StyledContainer>
  );
};

export default SelectIOS;
