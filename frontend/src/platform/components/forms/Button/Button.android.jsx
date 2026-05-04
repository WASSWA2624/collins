/**
 * Button Component - Android
 * Reusable button component for Android platform
 * File: Button.android.jsx
 */
// 1. External dependencies
import React from 'react';

// 2. Platform components (from barrel file) - N/A for Button

// 3. Hooks and utilities (absolute imports via aliases)
import { useTheme } from 'styled-components/native';

// 4. Styles (relative import - platform-specific)
import { StyledButton, StyledButtonContent, StyledButtonText, StyledSpinner } from './Button.android.styles';

// 5. Component-specific hook (relative import)
import useButton from './useButton';

// 6. Types and constants (relative import)
import { SIZES, VARIANTS } from './types';

/**
 * Button component for Android
 * @param {Object} props - Button props
 * @param {string} props.variant - Button variant (primary, secondary, outline, text)
 * @param {string} props.size - Button size (small, medium, large)
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.loading - Loading state
 * @param {Function} props.onPress - Press handler
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.text - Button text (alternative to children)
 * @param {React.ReactNode} props.icon - Icon component
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.accessibilityHint - Accessibility hint
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const ButtonAndroid = ({
  variant = VARIANTS.PRIMARY,
  size = SIZES.MEDIUM,
  disabled = false,
  loading = false,
  onPress,
  children,
  text,
  icon,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
  ...rest
}) => {
  const theme = useTheme();
  const { state, handlePress, handlePressIn, handlePressOut } = useButton({
    onPress,
    disabled,
    loading,
  });

  const displayText = text || children;
  const hasIcon = !!icon;
  const hasText = !!displayText;
  const computedA11yLabel =
    accessibilityLabel ||
    (typeof displayText === 'string' ? displayText : undefined);
  
  // Compute spinner color based on variant
  const spinnerColor =
    variant === VARIANTS.PRIMARY || variant === VARIANTS.SECONDARY
      ? theme.colors.text.inverse
      : theme.colors.primary;

  return (
    <StyledButton
      variant={variant}
      size={size}
      state={state}
      disabled={disabled || loading}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={computedA11yLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading }}
      testID={testID}
      style={style}
      {...rest}
    >
      <StyledButtonContent>
        {loading && (
          <StyledSpinner
            size={size === SIZES.SMALL ? 'small' : size === SIZES.LARGE ? 'large' : 'medium'}
            color={spinnerColor}
            hasText={hasText}
          />
        )}
        {!loading && icon && icon}
        {displayText && (
          <StyledButtonText variant={variant} size={size} state={state} hasIcon={hasIcon && !loading}>
            {displayText}
          </StyledButtonText>
        )}
      </StyledButtonContent>
    </StyledButton>
  );
};

export default ButtonAndroid;

