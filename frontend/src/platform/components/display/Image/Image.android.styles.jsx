/**
 * Image Android Styles
 * Styled-components for Android platform
 * File: Image.android.styles.jsx
 */
import styled from 'styled-components/native';
import { View, Image } from 'react-native';

const StyledContainer = styled(View).withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  position: relative;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const StyledImage = styled(Image).withConfig({
  displayName: 'StyledImage',
  componentId: 'StyledImage',
})`
  width: 100%;
  height: 100%;
`;

const StyledPlaceholder = styled(View).withConfig({
  displayName: 'StyledPlaceholder',
  componentId: 'StyledPlaceholder',
})`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  align-items: center;
  justify-content: center;
`;

const StyledErrorContainer = styled(View).withConfig({
  displayName: 'StyledErrorContainer',
  componentId: 'StyledErrorContainer',
})`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  align-items: center;
  justify-content: center;
`;

export {
  StyledContainer,
  StyledImage,
  StyledPlaceholder,
  StyledErrorContainer,
};


