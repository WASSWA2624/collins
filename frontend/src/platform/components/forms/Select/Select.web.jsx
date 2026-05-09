/**
 * Select Component - Web
 * Picker/dropdown primitive for Web platform (keyboard accessible)
 * File: Select.web.jsx
 */
// 1. External dependencies
import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

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
  StyledTriggerContent,
  StyledTriggerText,
  StyledChevron,
  StyledMenu,
  StyledSearchInput,
  StyledOption,
  StyledOptionContent,
  StyledOptionIcon,
  StyledOptionText,
  StyledSelectedMark,
  StyledNoResultsText,
  StyledHelperText,
} from './Select.web.styles';

// 5. Component-specific hook (relative import)
import useSelect from './useSelect';
import {
  getOptionIcon,
  optionExactlyMatchesQuery,
  optionMatchesQuery,
} from './selectOption.utils';

// 6. Types and constants (relative import)
import { VALIDATION_STATES } from './types';

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
  const finalSearchPlaceholder =
    searchPlaceholder || t('common.searchPlaceholder');

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

  const finalValidationState =
    validationState ||
    (disabled ? VALIDATION_STATES.DISABLED : internalValidationState);
  const finalErrorMessage = errorMessage || internalErrorMessage;
  const displayHelperText = finalErrorMessage || helperText;

  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [menuPosition, setMenuPosition] = React.useState(null);

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
  const hasValue = value !== null && value !== undefined && value !== '';
  const displayValue = selectedOption
    ? selectedOption.label
    : allowCustomValue && hasValue
      ? String(value)
      : defaultPlaceholder;
  const isPlaceholderValue = !selectedOption && !(allowCustomValue && hasValue);
  const selectedOptionIcon = getOptionIcon(selectedOption);
  const canPortalMenu =
    typeof document !== 'undefined' &&
    Boolean(document.body) &&
    typeof window !== 'undefined';

  const updateMenuPosition = useCallback(() => {
    if (!canPortalMenu || !triggerRef.current) return;

    const gap = 4;
    const minHeight = 120;
    const maxPreferredHeight = 280;
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth || 0;
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight || 0;
    const rect = triggerRef.current.getBoundingClientRect();
    const availableBelow = viewportHeight - rect.bottom - gap;
    const availableAbove = rect.top - gap;
    const placeAbove =
      availableBelow < minHeight && availableAbove > availableBelow;
    const availableHeight = Math.max(
      minHeight,
      placeAbove ? availableAbove : availableBelow
    );
    const maxHeight = Math.min(maxPreferredHeight, availableHeight);
    const left = Math.max(
      gap,
      Math.min(rect.left, viewportWidth - rect.width - gap)
    );
    const width = Math.max(
      160,
      Math.min(rect.width, viewportWidth - left - gap)
    );
    const top = placeAbove
      ? Math.max(gap, rect.top - maxHeight - gap)
      : Math.min(rect.bottom + gap, viewportHeight - maxHeight - gap);

    setMenuPosition({
      left,
      maxHeight,
      top: Math.max(gap, top),
      width,
    });
  }, [canPortalMenu]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      const insideTrigger = rootRef.current?.contains(event.target);
      const insideMenu = menuRef.current?.contains(event.target);
      if (!insideTrigger && !insideMenu) {
        closeSelect();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeSelect, open]);

  useLayoutEffect(() => {
    if (!open || !canPortalMenu) return;

    updateMenuPosition();
    window.addEventListener('resize', updateMenuPosition);
    window.addEventListener('scroll', updateMenuPosition, true);

    return () => {
      window.removeEventListener('resize', updateMenuPosition);
      window.removeEventListener('scroll', updateMenuPosition, true);
    };
  }, [canPortalMenu, open, updateMenuPosition]);

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
      const firstOption = menuRef.current.querySelector(
        '[role="option"]:not([aria-disabled="true"])'
      );
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

    const enabledOptions = visibleOptions.filter(
      ({ option }) => !option.disabled
    );
    const currentIndex = enabledOptions.findIndex(
      ({ index }) => index === focusedIndex
    );

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (enabledOptions.length === 0) return;
      const nextIndex =
        currentIndex < enabledOptions.length - 1 ? currentIndex + 1 : 0;
      const nextOption = enabledOptions[nextIndex];
      const nextOptionIndex = nextOption.index;
      setFocusedIndex(nextOptionIndex);
      if (menuRef.current) {
        const optionElement = testID
          ? menuRef.current.querySelector(
              `[data-testid="${testID}-option-${nextOptionIndex}"]`
            )
          : menuRef.current.querySelector(
              `[data-option-index="${nextOptionIndex}"]`
            );
        if (optionElement) {
          optionElement.focus();
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (enabledOptions.length === 0) return;
      const prevIndex =
        currentIndex > 0 ? currentIndex - 1 : enabledOptions.length - 1;
      const prevOption = enabledOptions[prevIndex];
      const prevOptionIndex = prevOption.index;
      setFocusedIndex(prevOptionIndex);
      if (menuRef.current) {
        const optionElement = testID
          ? menuRef.current.querySelector(
              `[data-testid="${testID}-option-${prevOptionIndex}"]`
            )
          : menuRef.current.querySelector(
              `[data-option-index="${prevOptionIndex}"]`
            );
        if (optionElement) {
          optionElement.focus();
        }
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const selected =
        currentIndex >= 0 && currentIndex < enabledOptions.length
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
        ? menuRef.current.querySelector(
            `[data-testid="${testID}-option-${firstEnabled.index}"]`
          )
        : menuRef.current.querySelector(
            '[role="option"]:not([aria-disabled="true"])'
          );
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
      const firstEnabled = visibleOptions.find(
        ({ option }) => !option.disabled
      );
      if (firstEnabled) handleSelect(firstEnabled.option.value);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      closeSelect();
    }
  };

  const menu = open ? (
    <StyledMenu
      ref={menuRef}
      role="listbox"
      onKeyDown={handleMenuKeyDown}
      data-testid={testID ? `${testID}-menu` : undefined}
      $portal={canPortalMenu}
      $position={menuPosition}
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
      {visibleOptions.length > 0
        ? visibleOptions.map(({ option: opt, index }, visibleIndex) => {
            const selected = value === opt.value;
            const optionIcon = getOptionIcon(opt);

            return (
              <StyledOption
                key={`${String(opt.value)}-${index}`}
                disabled={!!opt.disabled}
                onClick={() => {
                  if (opt.disabled) return;
                  handleSelect(opt.value);
                }}
                onFocus={() => setFocusedIndex(index)}
                role="option"
                aria-selected={selected}
                aria-disabled={opt.disabled}
                aria-label={opt.label}
                tabIndex={opt.disabled ? -1 : visibleIndex === 0 ? 0 : -1}
                data-option-index={index}
                data-testid={testID ? `${testID}-option-${index}` : undefined}
              >
                <StyledOptionContent>
                  {optionIcon ? (
                    <StyledOptionIcon aria-hidden="true">
                      {optionIcon}
                    </StyledOptionIcon>
                  ) : null}
                  <StyledOptionText $selected={selected}>
                    {opt.label}
                  </StyledOptionText>
                </StyledOptionContent>
                <StyledSelectedMark aria-hidden="true">
                  {selected ? '\u2713' : ''}
                </StyledSelectedMark>
              </StyledOption>
            );
          })
        : null}
      {canUseCustomValue ? (
        <StyledOption
          key="custom-value"
          onClick={() => handleSelect(normalizedSearchQuery)}
          role="option"
          aria-selected={value === normalizedSearchQuery}
          tabIndex={visibleOptions.length === 0 ? 0 : -1}
          data-testid={testID ? `${testID}-custom-option` : undefined}
        >
          <StyledOptionContent>
            <StyledOptionText $selected={value === normalizedSearchQuery}>
              {customValueLabel}
            </StyledOptionText>
          </StyledOptionContent>
          <StyledSelectedMark aria-hidden="true">
            {value === normalizedSearchQuery ? '\u2713' : ''}
          </StyledSelectedMark>
        </StyledOption>
      ) : null}
    </StyledMenu>
  ) : null;

  return (
    <StyledContainer
      ref={rootRef}
      style={style}
      className={className}
      $compact={compact}
      $isOpen={open}
    >
      {label ? (
        <StyledLabelRow $compact={compact}>
          <StyledLabel>{label}</StyledLabel>
          {required ? <StyledRequired> *</StyledRequired> : null}
        </StyledLabelRow>
      ) : null}

      <StyledTrigger
        ref={triggerRef}
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
        aria-describedby={
          displayHelperText ? `${testID || 'select'}-helper` : undefined
        }
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-invalid={finalValidationState === 'error'}
        aria-required={required}
        data-testid={testID}
      >
        <StyledTriggerContent>
          {selectedOptionIcon ? (
            <StyledOptionIcon aria-hidden="true">
              {selectedOptionIcon}
            </StyledOptionIcon>
          ) : null}
          <StyledTriggerText
            disabled={disabled}
            $isPlaceholder={isPlaceholderValue}
          >
            {displayValue}
          </StyledTriggerText>
        </StyledTriggerContent>
        <StyledChevron aria-hidden="true">{'\u25BE'}</StyledChevron>
      </StyledTrigger>

      {canPortalMenu && menu ? createPortal(menu, document.body) : menu}

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
