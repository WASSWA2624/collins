/**
 * Modal Web Styles
 * Styled-components for Web platform
 * File: Modal.web.styles.jsx
 */

import styled from 'styled-components';

const StyledBackdrop = styled.div.withConfig({
  displayName: 'StyledBackdrop',
  componentId: 'StyledBackdrop',
}).attrs(({ testID }) => ({
  'data-testid': testID,
  testID,
}))`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.overlay?.backdrop || 'rgba(0, 0, 0, 0.5)'};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const StyledModalContainer = styled.div.withConfig({
  displayName: 'StyledModalContainer',
  componentId: 'StyledModalContainer',
})`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme, size }) => (size === 'fullscreen' ? 0 : theme.radius.lg)}px;
  width: ${({ size }) => {
    const widths = {
      small: '400px',
      medium: '600px',
      large: '800px',
      fullscreen: '100%',
    };
    return widths[size] || widths.medium;
  }};
  max-width: ${({ size }) => (size === 'fullscreen' ? '100%' : '90vw')};
  max-height: ${({ size }) => (size === 'fullscreen' ? '100%' : '90vh')};
  ${({ size }) => (size === 'fullscreen' ? 'height: 100%;' : '')}
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows?.md ? `${theme.shadows.md.shadowOffset.width}px ${theme.shadows.md.shadowOffset.height * 5}px ${theme.shadows.md.shadowRadius * 5}px rgba(0, 0, 0, ${theme.shadows.md.shadowOpacity})` : '0 4px 20px rgba(0, 0, 0, 0.15)'};
  animation: slideUp 0.3s ease;
  position: relative;
  
  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const StyledCloseButton = styled.button.withConfig({
  displayName: 'StyledCloseButton',
  componentId: 'StyledCloseButton',
}).attrs(({ testID }) => ({
  'data-testid': testID,
  testID,
}))`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md}px;
  right: ${({ theme }) => theme.spacing.md}px;
  z-index: 10;
  width: ${({ theme }) => theme.spacing.xl}px;
  height: ${({ theme }) => theme.spacing.xl}px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border: none;
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  line-height: ${({ theme }) => theme.typography.fontSize.xl}px;
  color: ${({ theme }) => theme.colors.text.primary};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  padding: ${({ theme }) => theme.spacing.lg}px;
  overflow-y: auto;
  max-height: 100%;
`;

const StyledDescription = styled.div.withConfig({
  displayName: 'StyledDescription',
  componentId: 'StyledDescription',
})`
  display: none;
`;

export { StyledBackdrop, StyledModalContainer, StyledCloseButton, StyledContent, StyledDescription };



