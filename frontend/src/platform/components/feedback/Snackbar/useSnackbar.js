/**
 * Snackbar Hook
 * Manages snackbar visibility and auto-dismiss
 * File: useSnackbar.js
 */

import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Hook for managing snackbar state
 * @param {number} duration - Auto-dismiss duration in ms (default: 4000)
 * @param {Function} onDismiss - Callback when snackbar is dismissed
 */
const useSnackbar = ({ duration = 4000, onDismiss } = {}) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);
  const hasCalledOnDismissRef = useRef(false);

  const hide = useCallback(() => {
    setVisible((prevVisible) => {
      // Call onDismiss only when transitioning from visible to hidden, or if it hasn't been called yet
      if (!hasCalledOnDismissRef.current && onDismiss) {
        hasCalledOnDismissRef.current = true;
        onDismiss();
      }
      return false;
    });
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [onDismiss]);

  const show = useCallback(() => {
    setVisible(true);
    // Reset the onDismiss flag when showing
    hasCalledOnDismissRef.current = false;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      hide();
    }, duration);
  }, [duration, hide]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Reset onDismiss flag when onDismiss changes
  useEffect(() => {
    hasCalledOnDismissRef.current = false;
  }, [onDismiss]);

  return {
    visible,
    show,
    hide,
  };
};

export default useSnackbar;

