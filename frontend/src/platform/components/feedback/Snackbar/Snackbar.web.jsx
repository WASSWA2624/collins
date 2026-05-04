/**
 * Snackbar Component - Web
 * Actionable notifications with action button
 * File: Snackbar.web.jsx
 */

import React, { useEffect } from 'react';
import { StyledSnackbar, StyledSnackbarText, StyledActionButton, StyledActionButtonText } from './Snackbar.web.styles';
import { useI18n } from '@hooks';
import { VARIANTS, POSITIONS } from './types';

/**
 * Snackbar component for Web
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
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const SnackbarWeb = ({
  variant = VARIANTS.INFO,
  position = POSITIONS.BOTTOM,
  visible = false,
  message,
  actionLabel,
  onAction,
  onDismiss,
  accessibilityLabel,
  testID,
  className,
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
  
  // Handle Escape key to dismiss snackbar
  useEffect(() => {
    if (!visible || !onDismiss || typeof window === 'undefined' || !window.addEventListener) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      if (window.removeEventListener) {
        window.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [visible, onDismiss]);

  if (!visible) return null;

  const handleAction = (e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    if (onAction) {
      onAction();
    }
  };

  return (
    <StyledSnackbar
      variant={variant}
      position={position}
      role="alert"
      aria-label={accessibilityLabel || messageLabel}
      data-testid={testID}
      testID={testID}
      className={className}
      style={style}
      {...rest}
    >
      <StyledSnackbarText variant={variant}>{message}</StyledSnackbarText>
      {actionLabel && onAction && (
        <StyledActionButton
          onClick={handleAction}
          onPress={handleAction}
          variant={variant}
          role="button"
          aria-label={actionLabel || t('common.action')}
          data-testid={testID ? `${testID}-action` : undefined}
          testID={testID ? `${testID}-action` : undefined}
        >
          <StyledActionButtonText>{actionLabel}</StyledActionButtonText>
        </StyledActionButton>
      )}
    </StyledSnackbar>
  );
};

export default SnackbarWeb;

