/**
 * useKeyboardShortcuts Hook
 * Handles keyboard shortcuts for MainRouteLayout
 * File: useKeyboardShortcuts.js
 */

import { useEffect, useCallback } from 'react';

/**
 * Keyboard shortcuts hook for MainRouteLayout
 * @param {Object} handlers - Shortcut handlers
 * @param {Function} handlers.toggleSidebar - Toggle sidebar handler
 * @param {Function} handlers.toggleHeader - Toggle header visibility handler
 * @param {Function} handlers.openCommandPalette - Open command palette handler
 * @param {Function} handlers.showShortcuts - Show shortcuts help handler
 * @param {Function} handlers.closeMenus - Close all open menus handler
 * @param {boolean} enabled - Whether shortcuts are enabled
 */
const useKeyboardShortcuts = (
  {
    toggleSidebar,
    toggleHeader,
    openCommandPalette,
    showShortcuts,
    closeMenus,
  },
  enabled = true
) => {
  const handleKeyDown = useCallback(
    (event) => {
      if (!enabled) return;

      const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? event.metaKey : event.ctrlKey;

      // Ctrl/Cmd + B - Toggle sidebar
      if (modifier && event.key === 'b' && toggleSidebar) {
        event.preventDefault();
        toggleSidebar();
        return;
      }

      // Ctrl/Cmd + H - Toggle header
      if (modifier && event.key === 'h' && toggleHeader) {
        event.preventDefault();
        toggleHeader();
        return;
      }

      // Ctrl/Cmd + K - Open command palette
      if (modifier && event.key === 'k' && openCommandPalette) {
        event.preventDefault();
        openCommandPalette();
        return;
      }

      // Ctrl/Cmd + / - Show keyboard shortcuts
      if (modifier && event.key === '/' && showShortcuts) {
        event.preventDefault();
        showShortcuts();
        return;
      }

      // Esc - Close open menus/overlays
      if (event.key === 'Escape' && closeMenus) {
        event.preventDefault();
        closeMenus();
        return;
      }
    },
    [enabled, toggleSidebar, toggleHeader, openCommandPalette, showShortcuts, closeMenus]
  );

  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return undefined;

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown]);
};

export default useKeyboardShortcuts;
