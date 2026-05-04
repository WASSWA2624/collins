/**
 * Image Web Styles
 * Styled-components for Web platform
 * File: Image.web.styles.jsx
 */
import styled from 'styled-components';

const StyledContainer = styled.div.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  position: relative;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  display: inline-block;
  ${({ width }) =>
    width !== undefined && width !== null
      ? `width: ${typeof width === 'number' ? `${width}px` : width};`
      : ''}
  ${({ height }) =>
    height !== undefined && height !== null
      ? `height: ${typeof height === 'number' ? `${height}px` : height};`
      : ''}
`;

const StyledImage = styled.img.withConfig({
  displayName: 'StyledImage',
  componentId: 'StyledImage',
})`
  width: 100%;
  height: 100%;
  display: block;
`;

const StyledPlaceholder = styled.div.withConfig({
  displayName: 'StyledPlaceholder',
  componentId: 'StyledPlaceholder',
})`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledErrorContainer = styled.div.withConfig({
  displayName: 'StyledErrorContainer',
  componentId: 'StyledErrorContainer',
})`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledSpinner = styled.div.withConfig({
  displayName: 'StyledSpinner',
  componentId: 'StyledSpinner',
})`
  width: 20px;
  height: 20px;
  border: 2px solid ${({ theme }) => theme.colors.text.tertiary};
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export {
  StyledContainer,
  StyledImage,
  StyledPlaceholder,
  StyledErrorContainer,
  StyledSpinner,
};



