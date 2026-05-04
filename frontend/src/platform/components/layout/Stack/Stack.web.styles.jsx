/**
 * Stack Web Styles
 * File: Stack.web.styles.jsx
 */

import styled from 'styled-components';

const StyledStack = styled.div.withConfig({
  displayName: 'StyledStack',
  componentId: 'StyledStack',
  shouldForwardProp: (prop) => !prop.startsWith('$') && prop !== 'gap' && prop !== 'flexWrap',
})`
  display: flex;
  flex-direction: ${({ $direction }) => ($direction === 'horizontal' ? 'row' : 'column')};
  align-items: ${({ $align }) => $align || 'flex-start'};
  justify-content: ${({ $justify }) => $justify || 'flex-start'};
  flex-wrap: ${({ $wrap }) => ($wrap ? 'wrap' : 'nowrap')};
  gap: ${({ theme, $spacing }) => (theme.spacing?.[$spacing] || theme.spacing?.md || 0)}px;
`;

export { StyledStack };



