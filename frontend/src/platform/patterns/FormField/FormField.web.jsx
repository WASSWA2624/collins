/**
 * FormField Pattern - Web
 * Label + TextField + Error message composition
 * File: FormField.web.jsx
 */

// 1. External dependencies
import React from 'react';

// 2. Platform components (from barrel file)
import TextField from '@platform/components/forms/TextField';
import Text from '@platform/components/display/Text';

// 3. Hooks and utilities (absolute imports via aliases)
import { useI18n } from '@hooks';

// 4. Styles (relative import - platform-specific)
import { StyledContainer, StyledLabel } from './FormField.web.styles';

/**
 * FormField component for Web
 * @param {Object} props - FormField props
 * @param {string} props.label - Field label
 * @param {string} props.name - Field name (for form handling)
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {Function} props.onChangeText - Change handler (alias)
 * @param {string} props.type - Input type
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.errorMessage - Error message to display
 * @param {string} props.helperText - Helper text
 * @param {boolean} props.required - Required field indicator
 * @param {boolean} props.disabled - Disabled state
 * @param {Object} props.textFieldProps - Additional TextField props
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 */
const FormFieldWeb = ({
  label,
  name,
  value,
  onChange,
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
  className,
  ...rest
}) => {
  const { t } = useI18n();
  const hasError = !!errorMessage;
  const validationState = hasError ? 'error' : 'default';
  const inputId =
    (typeof name === 'string' && name.length > 0 ? name : undefined) ||
    (typeof testID === 'string' && testID.length > 0 ? `formfield-${testID}` : undefined);

  return (
    <StyledContainer
      className={className}
      data-testid={testID}
      {...rest}
    >
      {label && (
        <StyledLabel
          htmlFor={inputId}
          aria-label={accessibilityLabel || label}
        >
          {label}
          {required && <span aria-label={t('common.requiredLabel')}> *</span>}
        </StyledLabel>
      )}
      <TextField
        name={name}
        id={inputId}
        value={value}
        onChange={onChange}
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

export default FormFieldWeb;

