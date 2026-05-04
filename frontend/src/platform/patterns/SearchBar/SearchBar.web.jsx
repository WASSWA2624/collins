/**
 * SearchBar Pattern - Web
 * Input + Icon + Clear button composition
 * File: SearchBar.web.jsx
 */

// 1. External dependencies
import React from 'react';

// 2. Platform components (from barrel file)
import { Button, TextField } from '@platform/components';

// 3. Hooks and utilities (absolute imports via aliases)
import { useI18n } from '@hooks';

// 4. Styles (relative import - platform-specific)
import { StyledContainer, StyledSearchIcon, StyledTextFieldWrapper } from './SearchBar.web.styles';

// 5. Component-specific hook (relative import)
import useSearchBar from './useSearchBar';

/**
 * SearchBar component for Web
 * @param {Object} props - SearchBar props
 * @param {string} props.value - Search value
 * @param {Function} props.onChange - Change handler
 * @param {Function} props.onSearch - Search handler (called on submit/enter)
 * @param {string} props.placeholder - Placeholder text (i18n key or string)
 * @param {boolean} props.showClearButton - Show clear button when value exists
 * @param {string} props.accessibilityLabel - Accessibility label (i18n key or string)
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const SearchBarWeb = ({
  value = '',
  onChange,
  onSearch,
  placeholder,
  showClearButton = true,
  debounceMs = 300,
  accessibilityLabel,
  testID,
  className,
  ...rest
}) => {
  const { t } = useI18n();
  const {
    localValue,
    hasValue,
    handleChange,
    handleClear,
    handleSubmit,
  } = useSearchBar({
    value,
    onChange,
    onSearch,
    debounceMs,
  });

  const placeholderText = placeholder || t('common.searchPlaceholder');
  const searchIconLabel = t('common.searchIcon');
  const clearButtonLabel = t('common.clearSearch');
  // Only pass accessibilityLabel if explicitly provided, otherwise let TextField use placeholder fallback
  const accessibilityLabelText = accessibilityLabel;

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <StyledContainer
      className={className}
      data-testid={testID}
      testID={testID}
      {...rest}
    >
      <StyledSearchIcon
        accessibilityLabel={searchIconLabel}
        testID={testID ? `${testID}-icon` : undefined}
      >
        🔍
      </StyledSearchIcon>
      <StyledTextFieldWrapper>
        <TextField
          value={localValue}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholderText}
          type="search"
          {...(accessibilityLabelText && { accessibilityLabel: accessibilityLabelText })}
          testID={testID ? `${testID}-input` : undefined}
        />
      </StyledTextFieldWrapper>
      {showClearButton && hasValue && (
        <Button
          variant="text"
          size="small"
          onClick={handleClear}
          accessibilityLabel={clearButtonLabel}
          testID={testID ? `${testID}-clear` : undefined}
        >
          ✕
        </Button>
      )}
    </StyledContainer>
  );
};

export default SearchBarWeb;

