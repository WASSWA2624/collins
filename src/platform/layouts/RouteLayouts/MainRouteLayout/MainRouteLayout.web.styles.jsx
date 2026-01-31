/**
 * MainRouteLayout Web Styles
 * File: MainRouteLayout.web.styles.jsx
 */
import styled from 'styled-components';

const StyledMain = styled.main.withConfig({
  displayName: 'StyledMain',
  componentId: 'StyledMain',
})`
  flex: 1;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

export { StyledMain };

