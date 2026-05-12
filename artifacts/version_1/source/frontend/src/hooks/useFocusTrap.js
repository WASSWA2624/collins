/**
 * useFocusTrap Hook
 * Traps keyboard focus within a container while active.
 * File: useFocusTrap.js
 */
import { useEffect } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

const getFocusableElements = (container) => {
  if (!container) return [];
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter((element) => {
    return !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true';
  });
};

const useFocusTrap = (containerRef, isActive, options = {}) => {
  const { initialFocusRef } = options;

  useEffect(() => {
    if (!isActive || typeof document === 'undefined') return undefined;
    const container = containerRef?.current;
    if (!container) return undefined;

    const focusInitial = () => {
      const focusTarget = initialFocusRef?.current || getFocusableElements(container)[0];
      if (focusTarget && typeof focusTarget.focus === 'function') {
        focusTarget.focus();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key !== 'Tab') return;
      const focusableElements = getFocusableElements(container);
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const isShift = event.shiftKey;
      const activeElement = document.activeElement;

      if (isShift && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!isShift && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    focusInitial();
    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [containerRef, initialFocusRef, isActive]);
};

export default useFocusTrap;
