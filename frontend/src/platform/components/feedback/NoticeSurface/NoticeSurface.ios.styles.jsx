/**
 * NoticeSurface iOS Styles
 * Styled-components for iOS platform
 * File: NoticeSurface.ios.styles.jsx
 */
import styled from 'styled-components/native';

const StyledSurface = styled.View.withConfig({
  displayName: 'StyledSurface',
  componentId: 'StyledSurface',
})`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 4;
`;

export { StyledSurface };
