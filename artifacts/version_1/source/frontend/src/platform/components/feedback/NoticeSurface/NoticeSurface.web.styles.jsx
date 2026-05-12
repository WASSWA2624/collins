/**
 * NoticeSurface Web Styles
 * Styled-components for Web platform
 * File: NoticeSurface.web.styles.jsx
 */
import styled from 'styled-components';

const StyledSurface = styled.div.withConfig({
  displayName: 'StyledSurface',
  componentId: 'StyledSurface',
})`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 4;
`;

export { StyledSurface };
