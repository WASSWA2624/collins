/**
 * Container Web Styles
 * Styled-components for Web platform
 * File: Container.web.styles.jsx
 */
import styled from 'styled-components';
import { View } from 'react-native';

const StyledContainer = styled(View).withConfig({
  displayName: 'StyledContainer',
})`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  max-width: ${({ size }) => {
    const widths = {
      small: '640px',
      medium: '768px',
      large: '1024px',
      full: '100%',
    };
    return widths[size] || widths.medium;
  }};
`;

export { StyledContainer };



