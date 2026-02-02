/**
 * ModalLayout iOS Styles
 * Styled-components for iOS platform
 * File: ModalLayout.ios.styles.jsx
 */

import styled from 'styled-components/native';
import { KeyboardAvoidingView } from 'react-native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView).withConfig({
  displayName: 'StyledKeyboardAvoidingView',
})`
  flex: 1;
`;

const StyledContentWrapper = styled.View.withConfig({
  displayName: 'StyledContentWrapper',
})`
  flex: 1;
  min-height: 0;
`;

export {
  StyledContainer,
  StyledKeyboardAvoidingView,
  StyledContentWrapper,
};


