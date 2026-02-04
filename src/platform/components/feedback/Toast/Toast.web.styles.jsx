/**
 * Toast Web Styles
 * Styled-components for Web platform
 * File: Toast.web.styles.jsx
 */

import styled, { keyframes } from 'styled-components';

const slideInTop = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-24px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
`;

const slideInCenter = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, calc(-50% - 24px));
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
`;

const slideInBottom = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
`;

const StyledToast = styled.div.withConfig({
  displayName: 'StyledToast',
  componentId: 'StyledToast',
})`
  position: fixed;
  left: 50%;
  z-index: 9999;
  ${({ position, theme }) => {
    if (position === 'top') {
      return `
        top: ${theme.spacing.lg}px;
        transform: translateX(-50%);
      `;
    }
    if (position === 'center') {
      return `
        top: 50%;
        transform: translate(-50%, -50%);
      `;
    }
    return `
      bottom: ${theme.spacing.lg}px;
      transform: translateX(-50%);
    `;
  }}
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: ${({ theme }) => theme.spacing.lg}px;
  padding-right: ${({ theme }) => theme.spacing.lg}px;
  padding-top: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ variant, theme }) => {
    const colors = {
      success: theme.colors.success,
      error: theme.colors.error,
      warning: theme.colors.warning,
      info: theme.colors.primary,
    };
    return colors[variant] || colors.info;
  }};
  box-shadow: ${({ theme }) => theme.shadows?.md || '0 4px 12px rgba(0, 0, 0, 0.15)'};
  min-width: ${({ theme }) => theme.spacing.xxl * 4}px;
  max-width: ${({ theme }) => theme.spacing.xxl * 8}px;
  ${({ position }) => {
    if (position === 'top') {
      return `animation: ${slideInTop} 0.3s ease-out;`;
    }
    if (position === 'center') {
      return `animation: ${slideInCenter} 0.3s ease-out;`;
    }
    return `animation: ${slideInBottom} 0.3s ease-out;`;
  }}

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const StyledToastText = styled.span.withConfig({
  displayName: 'StyledToastText',
  componentId: 'StyledToastText',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  line-height: ${({ theme }) => theme.typography.fontSize.md * theme.typography.lineHeight.normal}px;
  color: ${({ theme }) => theme.colors.onPrimary || theme.colors.text.inverse};
  text-align: center;
  flex: 1;
`;

export { StyledToast, StyledToastText };



