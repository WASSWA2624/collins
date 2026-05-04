/**
 * Snackbar Component - iOS
 * Actionable notifications with action button
 * File: Snackbar.ios.jsx
 */

import React from 'react';
import { StyledSnackbar, StyledSnackbarText, StyledActionButton, StyledActionButtonText } from './Snackbar.ios.styles';
import { useI18n } from '@hooks';
import { VARIANTS, POSITIONS } from './types';

/**
 * Snackbar component for iOS
 * @param {Object} props - Snackbar props
 * @param {string} props.variant - Snackbar variant (success, error, warning, info)
 * @param {string} props.position - Snackbar position (top, bottom)
 * @param {boolean} props.visible - Visibility state
 * @param {string|React.ReactNode} props.message - Snackbar message
 * @param {string} props.actionLabel - Action button label
 * @param {Function} props.onAction - Action button handler
 * @param {Function} props.onDismiss - Dismiss handler
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const SnackbarIOS = ({
  variant = VARIANTS.INFO,
  position = POSITIONS.BOTTOM,
  visible = false,
  message,
  actionLabel,
  onAction,
  onDismiss,
  accessibilityLabel,
  testID,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  // Determine if we should use message as label (only for non-empty strings and numbers)
  const canUseMessageAsLabel = (typeof message === 'string' && message !== '') || typeof message === 'number';
  const defaultAccessibilityLabel = accessibilityLabel || (canUseMessageAsLabel ? undefined : t('common.message'));
  
  // Convert message to string for accessibility label if it's a number
  // For empty strings or React nodes, use default label
  const messageLabel = typeof message === 'string' && message !== ''
    ? message 
    : (typeof message === 'number' ? String(message) : defaultAccessibilityLabel);
  
  if (!visible) return null;

  return (
    <StyledSnackbar
      variant={variant}
      position={position}
      accessibilityRole="alert"
      accessibilityLabel={accessibilityLabel || messageLabel}
      testID={testID}
      style={style}
      {...rest}
    >
      <StyledSnackbarText variant={variant}>{message}</StyledSnackbarText>
      {actionLabel && onAction && (
        <StyledActionButton
          onPress={onAction}
          variant={variant}
          accessibilityRole="button"
          accessibilityLabel={actionLabel || t('common.action')}
          testID={testID ? `${testID}-action` : undefined}
        >
          <StyledActionButtonText>{actionLabel}</StyledActionButtonText>
        </StyledActionButton>
      )}
    </StyledSnackbar>
  );
};

export default SnackbarIOS;

