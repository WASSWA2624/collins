/**
 * Modal Component - Web
 * Modal dialog component for Web platform
 * File: Modal.web.jsx
 */

import React, { useEffect, useRef } from 'react';
import { StyledBackdrop, StyledModalContainer, StyledCloseButton, StyledContent, StyledDescription } from './Modal.web.styles';
import useModal from './useModal';
import { useI18n } from '@hooks';
import { SIZES } from './types';

/**
 * Modal component for Web
 * @param {Object} props - Modal props
 * @param {boolean} props.visible - Modal visibility
 * @param {Function} props.onDismiss - Dismiss handler
 * @param {string} props.size - Modal size (small, medium, large, fullscreen)
 * @param {boolean} props.showCloseButton - Show close button
 * @param {boolean} props.dismissOnBackdrop - Dismiss on backdrop press
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.accessibilityHint - Accessibility hint
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 */
const ModalWeb = ({
  visible = false,
  onDismiss,
  size = SIZES.MEDIUM,
  showCloseButton = true,
  dismissOnBackdrop = true,
  children,
  accessibilityLabel,
  accessibilityHint,
  testID,
  className,
}) => {
  const { t } = useI18n();
  const { handleBackdropPress } = useModal({
    visible,
    onDismiss,
    dismissOnBackdrop,
  });

  const modalRef = useRef(null);

  // Focus trap and ESC key handling
  useEffect(() => {
    if (!visible) return;
    
    // Guard for non-web environments (e.g., tests)
    if (typeof document === 'undefined') return;

    const handleEscape = (e) => {
      if (e.key === 'Escape' && onDismiss) {
        onDismiss();
      }
    };

    const handleTab = (e) => {
      if (!modalRef.current || typeof modalRef.current.querySelectorAll !== 'function') return;

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTab);

    // Focus first element
    if (modalRef.current && typeof modalRef.current.querySelector === 'function') {
      const firstFocusable = modalRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('keydown', handleTab);
        document.body.style.overflow = '';
      }
    };
  }, [visible, onDismiss]);

  if (!visible) return null;

  return (
    <StyledBackdrop
      onClick={handleBackdropPress}
      role="dialog"
      aria-modal="true"
      aria-label={accessibilityLabel}
      aria-describedby={accessibilityHint && testID ? `${testID}-description` : undefined}
      data-testid={testID}
      testID={testID}
      className={className}
    >
      <StyledModalContainer
        size={size}
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && onDismiss && (
          <StyledCloseButton
            onClick={onDismiss}
            onPress={onDismiss}
            aria-label={t('common.close')}
            type="button"
            data-testid={testID ? `${testID}-close` : undefined}
            testID={testID ? `${testID}-close` : undefined}
          >
            ×
          </StyledCloseButton>
        )}
        {accessibilityHint && testID && (
          <StyledDescription id={`${testID}-description`}>
            {accessibilityHint}
          </StyledDescription>
        )}
        <StyledContent>
          {children}
        </StyledContent>
      </StyledModalContainer>
    </StyledBackdrop>
  );
};

export default ModalWeb;

