/**
 * FormField Pattern - Android
 * Label + TextField + Error message composition
 * File: FormField.android.jsx
 */

// 1. External dependencies
import React from 'react';

// 2. Platform components (from barrel file)
import TextField from '@platform/components/forms/TextField';
import Text from '@platform/components/display/Text';

// 3. Hooks and utilities (absolute imports via aliases)
import { useI18n } from '@hooks';

// 4. Styles (relative import - platform-specific)
import { StyledContainer, StyledLabel } from './FormField.android.styles';

/**
 * FormField component for Android
 */
const FormFieldAndroid = ({
  label,
  name,
  value,
  onChangeText,
  type = 'text',
  placeholder,
  errorMessage,
  helperText,
  required = false,
  disabled = false,
  textFieldProps = {},
  accessibilityLabel,
  testID,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const hasError = !!errorMessage;
  const validationState = hasError ? 'error' : 'default';

  return (
    <StyledContainer
      style={style}
      testID={testID}
      {...rest}
    >
      {label && (
        <StyledLabel
          accessibilityLabel={accessibilityLabel || label}
        >
          {label}
          {required && <Text accessibilityLabel={t('common.requiredLabel')}> *</Text>}
        </StyledLabel>
      )}
      <TextField
        name={name}
        value={value}
        onChangeText={onChangeText}
        type={type}
        placeholder={placeholder}
        validationState={validationState}
        errorMessage={hasError ? errorMessage : undefined}
        helperText={!hasError ? helperText : undefined}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel || label}
        testID={testID ? `${testID}-input` : undefined}
        {...textFieldProps}
      />
      {hasError && (
        <Text
          variant="caption"
          color="error"
          accessibilityRole="alert"
          testID={testID ? `${testID}-error` : undefined}
        >
          {errorMessage}
        </Text>
      )}
    </StyledContainer>
  );
};

export default FormFieldAndroid;

