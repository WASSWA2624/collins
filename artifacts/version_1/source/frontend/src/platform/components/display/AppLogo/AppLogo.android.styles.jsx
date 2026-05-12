/**
 * AppLogo Android Styles
 * File: AppLogo.android.styles.jsx
 */
import styled from 'styled-components/native';
import { Image } from 'react-native';

const sizeMap = {
  sm: 24,
  md: 32,
  lg: 40,
};

const StyledLogoWrapper = styled.View.withConfig({
  displayName: 'StyledLogoWrapper',
  componentId: 'StyledLogoWrapper',
})`
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => sizeMap[$size] ?? sizeMap.md}px;
  height: ${({ $size }) => sizeMap[$size] ?? sizeMap.md}px;
`;

const StyledLogoImage = styled(Image).withConfig({
  displayName: 'StyledLogoImage',
  componentId: 'StyledLogoImage',
})`
  width: 100%;
  height: 100%;
`;

export { StyledLogoWrapper, StyledLogoImage };
