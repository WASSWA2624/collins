/**
 * Modal Android Styles
 * Styled-components for Android platform
 * File: Modal.android.styles.jsx
 */

import styled from 'styled-components/native';

const StyledBackdrop = styled.View.withConfig({
  displayName: 'StyledBackdrop',
  componentId: 'StyledBackdrop',
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.overlay?.backdrop || 'rgba(0, 0, 0, 0.5)'};
  justify-content: center;
  align-items: center;
`;

const StyledModalContainer = styled.View.withConfig({
  displayName: 'StyledModalContainer',
  componentId: 'StyledModalContainer',
})`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme, size }) => (size === 'fullscreen' ? 0 : theme.radius.lg)}px;
  width: ${({ size }) => {
    const widths = {
      small: '80%',
      medium: '90%',
      large: '95%',
      fullscreen: '100%',
    };
    return widths[size] || widths.medium;
  }};
  max-width: ${({ size }) => (size === 'fullscreen' ? '100%' : '500px')};
  max-height: ${({ size }) => (size === 'fullscreen' ? '100%' : '90%')};
  ${({ size }) => (size === 'fullscreen' ? 'height: 100%;' : '')}
  overflow: hidden;
`;

const StyledCloseButton = styled.Pressable.withConfig({
  displayName: 'StyledCloseButton',
  componentId: 'StyledCloseButton',
})`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md}px;
  right: ${({ theme }) => theme.spacing.md}px;
  z-index: 10;
  width: ${({ theme }) => theme.spacing.xl}px;
  height: ${({ theme }) => theme.spacing.xl}px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const StyledCloseButtonText = styled.Text.withConfig({
  displayName: 'StyledCloseButtonText',
  componentId: 'StyledCloseButtonText',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  line-height: ${({ theme }) => theme.typography.fontSize.xl}px;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const StyledKeyboardAvoidingView = styled.KeyboardAvoidingView.withConfig({
  displayName: 'StyledKeyboardAvoidingView',
  componentId: 'StyledKeyboardAvoidingView',
})`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const StyledContentWrap = styled.View.withConfig({
  displayName: 'StyledContentWrap',
  componentId: 'StyledContentWrap',
})`
  flex: 1;
  min-height: 0;
`;

const StyledScrollViewContent = styled.View.withConfig({
  displayName: 'StyledScrollViewContent',
  componentId: 'StyledScrollViewContent',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
`;

export { StyledBackdrop, StyledModalContainer, StyledCloseButton, StyledCloseButtonText, StyledKeyboardAvoidingView, StyledContentWrap, StyledScrollViewContent };


