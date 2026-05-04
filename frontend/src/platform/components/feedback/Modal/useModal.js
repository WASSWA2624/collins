/**
 * Modal Hook
 * Shared logic for Modal component (backdrop handling)
 * File: useModal.js
 */

import { useCallback } from 'react';

/**
 * Custom hook for Modal component logic
 * @param {Object} props - Modal props
 * @param {boolean} props.visible - Modal visibility
 * @param {Function} props.onDismiss - Dismiss handler
 * @param {boolean} props.dismissOnBackdrop - Dismiss on backdrop press
 * @returns {Object} Modal state and handlers
 */
const useModal = ({ visible, onDismiss, dismissOnBackdrop = true }) => {
  // Keyboard handling is done at component level (KeyboardAvoidingView for native, focus trap for web)
  // No platform-specific logic needed here per platform-ui.mdc rules

  const handleBackdropPress = useCallback(() => {
    if (dismissOnBackdrop && onDismiss) {
      onDismiss();
    }
  }, [dismissOnBackdrop, onDismiss]);

  return {
    handleBackdropPress,
  };
};

export default useModal;

