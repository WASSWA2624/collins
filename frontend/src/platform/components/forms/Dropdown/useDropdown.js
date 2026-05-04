/**
 * Dropdown Hook
 * Manages dropdown open/close state
 * File: useDropdown.js
 */
import React from 'react';

/**
 * Hook for managing dropdown state
 * @param {boolean} defaultOpen - Default open state
 * @param {Function} onOpenChange - Callback when open state changes
 */
const useDropdown = ({ defaultOpen = false, onOpenChange } = {}) => {
  const [open, setOpen] = React.useState(defaultOpen);

  const toggle = React.useCallback(() => {
    const newOpen = !open;
    setOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  }, [open, onOpenChange]);

  const close = React.useCallback(() => {
    setOpen(false);
    if (onOpenChange) {
      onOpenChange(false);
    }
  }, [onOpenChange]);

  const openDropdown = React.useCallback(() => {
    setOpen(true);
    if (onOpenChange) {
      onOpenChange(true);
    }
  }, [onOpenChange]);

  return {
    open,
    toggle,
    close,
    openDropdown,
  };
};

export default useDropdown;

