/**
 * Accordion Hook
 * Manages accordion open/close state
 * File: useAccordion.js
 */
import { useState, useCallback } from 'react';

/**
 * Hook for managing accordion state
 * @param {boolean} defaultExpanded - Default expanded state
 * @param {Function} onChange - Callback when expanded state changes
 */
const useAccordion = ({ defaultExpanded = false, onChange } = {}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggle = useCallback(() => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    if (onChange) {
      onChange(newExpanded);
    }
  }, [expanded, onChange]);

  return {
    expanded,
    toggle,
    setExpanded,
  };
};

export default useAccordion;

