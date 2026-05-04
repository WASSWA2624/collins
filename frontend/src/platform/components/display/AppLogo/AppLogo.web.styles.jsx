/**
 * AppLogo Web Styles
 * File: AppLogo.web.styles.jsx
 */
import styled from 'styled-components';

const sizeMap = {
  sm: 24,
  md: 32,
  lg: 40,
};

const StyledLogoWrapper = styled.span.withConfig({
  displayName: 'StyledLogoWrapper',
  componentId: 'StyledLogoWrapper',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${({ $size }) => sizeMap[$size] ?? sizeMap.md}px;
  height: ${({ $size }) => sizeMap[$size] ?? sizeMap.md}px;
`;

const StyledLogoImg = styled.img.withConfig({
  displayName: 'StyledLogoImg',
  componentId: 'StyledLogoImg',
})`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export { StyledLogoWrapper, StyledLogoImg };
