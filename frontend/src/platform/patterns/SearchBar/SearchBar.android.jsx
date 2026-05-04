/**
 * SearchBar Pattern - Android
 * Input + Icon + Clear button composition
 * File: SearchBar.android.jsx
 */

import React from 'react';
import { Button, TextField } from '@platform/components';
import { useI18n } from '@hooks';
import useSearchBar from './useSearchBar';
import { StyledContainer, StyledSearchIcon, StyledClearButtonWrapper, StyledTextFieldWrapper } from './SearchBar.android.styles';

const SearchBarAndroid = ({
  value = '',
  onChangeText,
  onSearch,
  placeholder,
  showClearButton = true,
  debounceMs = 300,
  accessibilityLabel,
  testID,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const {
    localValue,
    hasValue,
    handleChangeText,
    handleClear,
    handleSubmit,
  } = useSearchBar({
    value,
    onChangeText,
    onSearch,
    debounceMs,
  });

  const placeholderText = placeholder || t('common.searchPlaceholder');
  const searchIconLabel = t('common.searchIcon');
  const clearButtonLabel = t('common.clearSearch');
  // Only pass accessibilityLabel if explicitly provided, otherwise let TextField use placeholder fallback
  const accessibilityLabelText = accessibilityLabel;

  return (
    <StyledContainer
      style={style}
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
          onChangeText={handleChangeText}
          onSubmitEditing={() => handleSubmit()}
          placeholder={placeholderText}
          type="search"
          {...(accessibilityLabelText && { accessibilityLabel: accessibilityLabelText })}
          testID={testID ? `${testID}-input` : undefined}
        />
      </StyledTextFieldWrapper>
      {showClearButton && hasValue && (
        <StyledClearButtonWrapper>
          <Button
            variant="text"
            size="small"
            onPress={handleClear}
            accessibilityLabel={clearButtonLabel}
            testID={testID ? `${testID}-clear` : undefined}
          >
            ✕
          </Button>
        </StyledClearButtonWrapper>
      )}
    </StyledContainer>
  );
};

export default SearchBarAndroid;

