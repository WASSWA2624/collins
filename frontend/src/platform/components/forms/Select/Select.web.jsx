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
  StyledSearchInput,
  StyledOption,
  StyledOptionText,
  StyledNoResultsText,
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
 * @param {boolean} [props.searchable]
 * @param {string} [props.searchPlaceholder]
 * @param {boolean} [props.allowCustomValue]
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
  searchable = true,
  searchPlaceholder,
  allowCustomValue = false,
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
  const finalSearchPlaceholder = searchPlaceholder || t('common.searchPlaceholder');
  
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
  const searchRef = useRef(null);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
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
  const hasValue = value !== null && value !== undefined && value !== '';
  const displayValue = selectedOption
    ? selectedOption.label
    : allowCustomValue && hasValue
    ? String(value)
    : defaultPlaceholder;
  const isPlaceholderValue = !selectedOption && !(allowCustomValue && hasValue);

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
    } else {
      setSearchQuery('');
    }
  }, [open, searchable]);

  // Focus search or first option when menu opens
  useEffect(() => {
    if (open && searchable && searchRef.current) {
      searchRef.current.focus();
      return;
    }
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

    const enabledOptions = visibleOptions.filter(({ option }) => !option.disabled);
    const currentIndex = enabledOptions.findIndex(({ index }) => index === focusedIndex);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (enabledOptions.length === 0) return;
      const nextIndex = currentIndex < enabledOptions.length - 1 ? currentIndex + 1 : 0;
      const nextOption = enabledOptions[nextIndex];
      const nextOptionIndex = nextOption.index;
      setFocusedIndex(nextOptionIndex);
      if (menuRef.current) {
        const optionElement = testID
          ? menuRef.current.querySelector(`[data-testid="${testID}-option-${nextOptionIndex}"]`)
          : menuRef.current.querySelector(`[data-option-index="${nextOptionIndex}"]`);
        if (optionElement) {
          optionElement.focus();
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (enabledOptions.length === 0) return;
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : enabledOptions.length - 1;
      const prevOption = enabledOptions[prevIndex];
      const prevOptionIndex = prevOption.index;
      setFocusedIndex(prevOptionIndex);
      if (menuRef.current) {
        const optionElement = testID
          ? menuRef.current.querySelector(`[data-testid="${testID}-option-${prevOptionIndex}"]`)
          : menuRef.current.querySelector(`[data-option-index="${prevOptionIndex}"]`);
        if (optionElement) {
          optionElement.focus();
        }
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const selected = currentIndex >= 0 && currentIndex < enabledOptions.length
        ? enabledOptions[currentIndex]
        : enabledOptions[0];
      if (selected) handleSelect(selected.option.value);
      if (!selected && canUseCustomValue) handleSelect(normalizedSearchQuery);
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

  const focusFirstVisibleOption = () => {
    const firstEnabled = visibleOptions.find(({ option }) => !option.disabled);
    if (!firstEnabled) return;
    setFocusedIndex(firstEnabled.index);
    if (menuRef.current) {
      const optionElement = testID
        ? menuRef.current.querySelector(`[data-testid="${testID}-option-${firstEnabled.index}"]`)
        : menuRef.current.querySelector('[role="option"]:not([aria-disabled="true"])');
      if (optionElement) optionElement.focus();
    }
  };

  const handleSearchKeyDown = (event) => {
    event.stopPropagation();
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusFirstVisibleOption();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (canUseCustomValue) {
        handleSelect(normalizedSearchQuery);
        return;
      }
      const firstEnabled = visibleOptions.find(({ option }) => !option.disabled);
      if (firstEnabled) handleSelect(firstEnabled.option.value);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      closeSelect();
    }
  };

  return (
    <StyledContainer ref={rootRef} style={style} className={className} $compact={compact} $isOpen={open}>
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
        <StyledTriggerText disabled={disabled} $isPlaceholder={isPlaceholderValue}>
          {displayValue}
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
          {searchable ? (
            <StyledSearchInput
              ref={searchRef}
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setFocusedIndex(-1);
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder={finalSearchPlaceholder}
              aria-label={finalSearchPlaceholder}
              data-testid={testID ? `${testID}-search` : undefined}
            />
          ) : null}
          {visibleOptions.length === 0 && !canUseCustomValue ? (
            <StyledNoResultsText>{t('common.noResults')}</StyledNoResultsText>
          ) : null}
          {visibleOptions.length > 0 ? (
            visibleOptions.map(({ option: opt, index }, visibleIndex) => (
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
                tabIndex={opt.disabled ? -1 : visibleIndex === 0 ? 0 : -1}
                data-option-index={index}
                data-testid={testID ? `${testID}-option-${index}` : undefined}
              >
                <StyledOptionText>{opt.label}</StyledOptionText>
              </StyledOption>
            ))
          ) : null}
          {canUseCustomValue ? (
            <StyledOption
              key="custom-value"
              onClick={() => handleSelect(normalizedSearchQuery)}
              role="option"
              aria-selected={value === normalizedSearchQuery}
              tabIndex={visibleOptions.length === 0 ? 0 : -1}
              data-testid={testID ? `${testID}-custom-option` : undefined}
            >
              <StyledOptionText>{customValueLabel}</StyledOptionText>
            </StyledOption>
          ) : null}
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


