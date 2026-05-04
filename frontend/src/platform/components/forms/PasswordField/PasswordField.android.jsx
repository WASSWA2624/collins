/**
 * PasswordField Component - Android
 * Password input field with strength indicator for Android platform
 * File: PasswordField.android.jsx
 */
import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import TextField from '../TextField';
import Button from '../Button';
import { useI18n } from '@hooks';
import {
  StyledContainer,
  StyledPasswordStrength,
  StyledPasswordStrengthBar,
  StyledPasswordStrengthBarInner,
  StyledPasswordStrengthLabel,
} from './PasswordField.android.styles';
import usePasswordField from './usePasswordField';
import { PASSWORD_STRENGTH } from './types';

/**
 * PasswordField component for Android
 * @param {Object} props - PasswordField props
 * @param {string} props.label - Field label
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Password value
 * @param {Function} props.onChangeText - Change handler
 * @param {string} props.errorMessage - Error message
 * @param {boolean} props.required - Required field
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.showPassword - Show password (for toggle)
 * @param {boolean} props.showStrengthIndicator - Show password strength indicator (default: true)
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const PasswordFieldAndroid = ({
  label,
  placeholder,
  value = '',
  onChangeText,
  errorMessage,
  required = false,
  disabled = false,
  showPassword: controlledShowPassword,
  showStrengthIndicator = true,
  accessibilityLabel,
  testID,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const { passwordStrength } = usePasswordField({ password: value });
  const [internalShowPassword, setInternalShowPassword] = useState(false);
  
  // Use controlled prop if provided, otherwise use internal state
  const showPassword = controlledShowPassword !== undefined ? controlledShowPassword : internalShowPassword;
  
  // Use i18n for default values
  const defaultLabel = label || t('auth.password');
  const defaultPlaceholder = placeholder || t('auth.enterPassword');
  
  // Translate password strength label
  const strengthLabelMap = {
    [PASSWORD_STRENGTH.WEAK]: t('auth.passwordStrength.weak'),
    [PASSWORD_STRENGTH.FAIR]: t('auth.passwordStrength.fair'),
    [PASSWORD_STRENGTH.GOOD]: t('auth.passwordStrength.good'),
    [PASSWORD_STRENGTH.STRONG]: t('auth.passwordStrength.strong'),
    [PASSWORD_STRENGTH.VERY_STRONG]: t('auth.passwordStrength.veryStrong'),
  };
  const strengthLabel = passwordStrength.strength !== undefined ? strengthLabelMap[passwordStrength.strength] : '';

  const handleTogglePassword = useCallback(() => {
    if (controlledShowPassword === undefined) {
      setInternalShowPassword((prev) => !prev);
    }
  }, [controlledShowPassword]);

  const toggleButtonLabel = showPassword 
    ? t('auth.password.hide') || 'Hide password'
    : t('auth.password.show') || 'Show password';

  const toggleIcon = showPassword ? '👁️‍🗨️' : '👁️';

  return (
    <StyledContainer style={style} testID={testID}>
      <TextField
        label={defaultLabel}
        placeholder={defaultPlaceholder}
        value={value}
        onChangeText={onChangeText}
        type="password"
        required={required}
        disabled={disabled}
        errorMessage={errorMessage}
        secureTextEntry={!showPassword}
        accessibilityLabel={accessibilityLabel || defaultLabel}
        testID={testID}
        suffix={
          <Button
            variant="text"
            size="small"
            onPress={handleTogglePassword}
            disabled={disabled || controlledShowPassword !== undefined}
            accessibilityLabel={toggleButtonLabel}
            testID={testID ? `${testID}-toggle` : undefined}
          >
            {toggleIcon}
          </Button>
        }
        {...rest}
      />
      {showStrengthIndicator && value && (
        <StyledPasswordStrength>
          <StyledPasswordStrengthBar>
            <StyledPasswordStrengthBarInner
              strength={passwordStrength.strength}
              color={passwordStrength.color}
            />
          </StyledPasswordStrengthBar>
          {strengthLabel && (
            <StyledPasswordStrengthLabel color={passwordStrength.color}>
              {strengthLabel}
            </StyledPasswordStrengthLabel>
          )}
        </StyledPasswordStrength>
      )}
    </StyledContainer>
  );
};

export default PasswordFieldAndroid;

