/**
 * Tooltip Hook
 * Manages tooltip visibility
 * File: useTooltip.js
 */

import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Hook for managing tooltip state
 * @param {number} delay - Show delay in ms (default: 500)
 */
const useTooltip = ({ delay = 500 } = {}) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);

  const show = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setVisible(true);
    }, delay);
  }, [delay]);

  const hide = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setVisible(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    visible,
    show,
    hide,
  };
};

export default useTooltip;

