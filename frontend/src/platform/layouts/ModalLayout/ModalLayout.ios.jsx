/**
 * ModalLayout Component - iOS
 * Modal layout wrapper for iOS platform
 * File: ModalLayout.ios.jsx
 */

import React from 'react';
import { StyledContainer, StyledContentWrapper, StyledKeyboardAvoidingView } from './ModalLayout.ios.styles';
import Modal from '@platform/components/feedback/Modal';

/**
 * ModalLayout component for iOS
 * Wrapper around Modal component with layout-specific features
 * @param {Object} props - ModalLayout props
 * @param {boolean} props.visible - Modal visibility
 * @param {Function} props.onDismiss - Dismiss handler
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.size - Modal size
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 */
const ModalLayoutIOS = ({
  visible,
  onDismiss,
  children,
  size = 'medium',
  accessibilityLabel,
  testID,
}) => {
  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      size={size}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      <StyledKeyboardAvoidingView behavior="padding">
        <StyledContentWrapper>
          <StyledContainer>
            {children}
          </StyledContainer>
        </StyledContentWrapper>
      </StyledKeyboardAvoidingView>
    </Modal>
  );
};

export default ModalLayoutIOS;

