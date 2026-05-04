/**
 * Button Component - Web
 * Reusable button component for Web platform
 * File: Button.web.jsx
 */
// 1. External dependencies
import React from 'react';

// 2. Platform components (from barrel file) - N/A for Button

// 3. Hooks and utilities (absolute imports via aliases) - N/A for Button

// 4. Styles (relative import - platform-specific)
import { StyledButton, StyledButtonContent, StyledButtonText, StyledSpinner } from './Button.web.styles';

// 5. Component-specific hook (relative import)
import useButton from './useButton';

// 6. Types and constants (relative import)
import { SIZES, VARIANTS } from './types';

/**
 * Button component for Web
 * @param {Object} props - Button props
 * @param {string} props.variant - Button variant (primary, secondary, outline, text)
 * @param {string} props.size - Button size (small, medium, large)
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.loading - Loading state
 * @param {Function} props.onClick - Click handler (web uses onClick)
 * @param {Function} props.onPress - Press handler (alias for onClick)
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.text - Button text (alternative to children)
 * @param {React.ReactNode} props.icon - Icon component
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.accessibilityHint - Accessibility hint
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const ButtonWeb = ({
  variant = VARIANTS.PRIMARY,
  size = SIZES.MEDIUM,
  disabled = false,
  loading = false,
  onClick,
  onPress,
  children,
  text,
  icon,
  accessibilityLabel,
  accessibilityHint,
  testID,
  className,
  style,
  type = 'button',
  ...rest
}) => {
  // Extract onPress from rest to prevent it from being passed to the button element
  // We handle it through onClick instead
  const { onPress: _onPressFromRest, ...cleanRest } = rest;
  const onPressHandler = onClick || onPress;
  const isDisabled = disabled || loading;
  
  // Only pass onPress handler to useButton if not disabled/loading
  // This prevents the handler from being created unnecessarily
  const { state, handlePress } = useButton({
    onPress: isDisabled ? undefined : onPressHandler,
    disabled,
    loading,
  });

  const displayText = text || children;
  const hasIcon = !!icon;
  const hasText = !!displayText;
  const computedA11yLabel =
    accessibilityLabel ||
    (typeof displayText === 'string' ? displayText : undefined);

  // Handle keyboard events for web accessibility (Enter and Space)
  const handleKeyDown = React.useCallback((event) => {
    if (isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    // Allow Enter and Space to trigger button
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handlePress(event);
    }
  }, [isDisabled, handlePress]);

  // Click handler - useButton's handlePress already checks disabled/loading state
  // Setting disabled attribute on button element provides additional browser-level protection
  const handleClick = React.useCallback((event) => {
    // Defensive check - should not be needed since handlePress checks, but safety net
    if (isDisabled) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      return;
    }
    handlePress(event);
  }, [isDisabled, handlePress]);

  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $state={state}
      type={type}
      disabled={isDisabled}
      onClick={isDisabled ? undefined : handleClick}
      onKeyDown={handleKeyDown}
      aria-label={computedA11yLabel}
      aria-description={accessibilityHint}
      aria-busy={loading}
      testID={testID}
      data-testid={testID}
      className={className}
      style={style}
      {...cleanRest}
    >
      <StyledButtonContent>
        {loading && (
          <StyledSpinner
            $variant={variant}
            $size={size}
            $hasText={hasText}
            aria-hidden="true"
          />
        )}
        {!loading && icon && icon}
        {displayText && (
          <StyledButtonText $variant={variant} $size={size} $state={state} $hasIcon={hasIcon && !loading}>
            {displayText}
          </StyledButtonText>
        )}
      </StyledButtonContent>
    </StyledButton>
  );
};

export default ButtonWeb;

