/**
 * Container Android Styles
 * Styled-components for Android platform
 * File: Container.android.styles.jsx
 */
import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
})`
  width: 100%;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  max-width: ${({ size }) => {
    const widths = {
      small: 640,
      medium: 768,
      large: 1024,
      full: '100%',
    };
    return typeof widths[size] === 'number' ? `${widths[size]}px` : widths[size] || widths.medium;
  }};
`;

export {
  StyledContainer,
};


