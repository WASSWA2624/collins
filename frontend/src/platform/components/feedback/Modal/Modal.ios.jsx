/**
 * Modal Component - iOS
 * Modal dialog component for iOS platform
 * File: Modal.ios.jsx
 */

import React from 'react';
import { Modal, KeyboardAvoidingView } from 'react-native';
import { StyledBackdrop, StyledModalContainer, StyledCloseButton, StyledCloseButtonText, StyledKeyboardAvoidingView, StyledContentWrap, StyledScrollViewContent } from './Modal.ios.styles';
import useModal from './useModal';
import { useI18n } from '@hooks';
import { SIZES } from './types';

/**
 * Modal component for iOS
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
 */
const ModalIOS = ({
  visible = false,
  onDismiss,
  size = SIZES.MEDIUM,
  showCloseButton = true,
  dismissOnBackdrop = true,
  children,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const { t } = useI18n();
  const { handleBackdropPress } = useModal({
    visible,
    onDismiss,
    dismissOnBackdrop,
  });

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      testID={testID}
    >
      <StyledBackdrop onStartShouldSetResponder={() => true} onResponderRelease={handleBackdropPress} testID={testID}>
        <StyledKeyboardAvoidingView behavior="padding">
          <StyledModalContainer size={size}>
            {showCloseButton && onDismiss && (
              <StyledCloseButton onPress={onDismiss} accessibilityLabel={t('common.close')} accessibilityRole="button" testID={testID ? `${testID}-close` : undefined}>
                <StyledCloseButtonText>×</StyledCloseButtonText>
              </StyledCloseButton>
            )}
            <StyledContentWrap>
              <StyledScrollViewContent>
                {children}
              </StyledScrollViewContent>
            </StyledContentWrap>
          </StyledModalContainer>
        </StyledKeyboardAvoidingView>
      </StyledBackdrop>
    </Modal>
  );
};

export default ModalIOS;

