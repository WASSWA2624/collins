/**
 * Tooltip Web Styles
 * Styled-components for Web platform
 * File: Tooltip.web.styles.jsx
 */

import styled from 'styled-components';

const StyledTooltip = styled.div.withConfig({
  displayName: 'StyledTooltip',
  componentId: 'StyledTooltip',
})`
  position: absolute;
  z-index: 10000;
  padding-left: ${({ theme }) => theme.spacing.md}px;
  padding-right: ${({ theme }) => theme.spacing.md}px;
  padding-top: ${({ theme }) => theme.spacing.sm}px;
  padding-bottom: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => {
    // Use semi-transparent dark background for tooltip
    return theme.colors.background.primary === '#FFFFFF' || theme.mode === 'light'
      ? 'rgba(0, 0, 0, 0.85)'
      : 'rgba(255, 255, 255, 0.15)';
  }};
  max-width: ${({ theme }) => theme.spacing.xxl * 4}px;
  animation: fadeIn 0.2s ease-out;
  
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

  ${({ position, theme }) => {
    const margin = theme.spacing.sm;
    const arrowSize = theme.spacing.xs + theme.spacing.xs / 2;
    const bgColor = theme.colors.background.primary === '#FFFFFF' || theme.mode === 'light'
      ? 'rgba(0, 0, 0, 0.85)'
      : 'rgba(255, 255, 255, 0.15)';
    if (position === 'top') {
      return `
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-bottom: ${margin}px;
        &::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: ${arrowSize}px solid transparent;
          border-top-color: ${bgColor};
        }
      `;
    }
    if (position === 'bottom') {
      return `
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-top: ${margin}px;
        &::after {
          content: '';
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: ${arrowSize}px solid transparent;
          border-bottom-color: ${bgColor};
        }
      `;
    }
    if (position === 'left') {
      return `
        right: 100%;
        top: 50%;
        transform: translateY(-50%);
        margin-right: ${margin}px;
        &::after {
          content: '';
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          border: ${arrowSize}px solid transparent;
          border-left-color: ${bgColor};
        }
      `;
    }
    return `
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      margin-left: ${margin}px;
      &::after {
        content: '';
        position: absolute;
        right: 100%;
        top: 50%;
        transform: translateY(-50%);
        border: ${arrowSize}px solid transparent;
        border-right-color: ${bgColor};
      }
    `;
  }}
`;

const StyledTooltipText = styled.span.withConfig({
  displayName: 'StyledTooltipText',
  componentId: 'StyledTooltipText',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
  line-height: ${({ theme }) => theme.typography.fontSize.sm * theme.typography.lineHeight.normal}px;
  color: ${({ theme }) => theme.colors.text.inverse};
  text-align: center;
`;

export { StyledTooltip, StyledTooltipText };



