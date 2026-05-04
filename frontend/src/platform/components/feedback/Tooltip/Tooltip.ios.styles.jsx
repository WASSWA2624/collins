/**
 * Tooltip iOS Styles
 * Styled-components for iOS platform
 * File: Tooltip.ios.styles.jsx
 */

import styled from 'styled-components/native';

const StyledTooltip = styled.View.withConfig({
  displayName: 'StyledTooltip',
  componentId: 'StyledTooltip',
})`
  position: absolute;
  z-index: 10000;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => {
    return theme.colors.background.primary === '#FFFFFF' || theme.mode === 'light'
      ? 'rgba(0, 0, 0, 0.85)'
      : 'rgba(255, 255, 255, 0.15)';
  }};
  max-width: ${({ theme }) => theme.spacing.xxl * 4}px;
  shadow-color: ${({ theme }) => theme.colors.text.primary};
  shadow-offset: 0px ${({ theme }) => theme.spacing.xs / 2}px;
  shadow-opacity: 0.2;
  shadow-radius: ${({ theme }) => theme.spacing.xs}px;
  ${({ position, theme }) => {
    const margin = theme.spacing.sm;
    if (position === 'top') {
      return `bottom: 100%; margin-bottom: ${margin}px;`;
    }
    if (position === 'bottom') {
      return `top: 100%; margin-top: ${margin}px;`;
    }
    if (position === 'left') {
      return `right: 100%; margin-right: ${margin}px;`;
    }
    return `left: 100%; margin-left: ${margin}px;`;
  }}
`;

const StyledTooltipText = styled.Text.withConfig({
  displayName: 'StyledTooltipText',
  componentId: 'StyledTooltipText',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
  line-height: ${({ theme }) => theme.typography.fontSize.sm * theme.typography.lineHeight.normal}px;
  color: ${({ theme }) => theme.colors.text.inverse};
  text-align: center;
`;

export { StyledTooltip, StyledTooltipText };


