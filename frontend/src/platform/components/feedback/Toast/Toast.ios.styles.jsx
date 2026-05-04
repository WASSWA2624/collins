/**
 * Toast iOS Styles
 * Styled-components for iOS platform
 * File: Toast.ios.styles.jsx
 */

import styled from 'styled-components/native';

const StyledToast = styled.View.withConfig({
  displayName: 'StyledToast',
  componentId: 'StyledToast',
})`
  position: absolute;
  left: ${({ theme }) => theme.spacing.lg}px;
  right: ${({ theme }) => theme.spacing.lg}px;
  ${({ position, theme }) => {
    if (position === 'top') {
      return `top: ${theme.spacing.lg}px;`;
    }
    if (position === 'center') {
      return `top: 50%; margin-top: -${theme.spacing.xl}px;`;
    }
    return `bottom: ${theme.spacing.lg}px;`;
  }}
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
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
  shadow-color: ${({ theme }) => theme.colors.text.primary};
  shadow-offset: 0px ${({ theme }) => theme.spacing.xs / 2}px;
  shadow-opacity: 0.15;
  shadow-radius: ${({ theme }) => theme.spacing.xs}px;
  min-width: ${({ theme }) => theme.spacing.xxl * 4}px;
  max-width: 100%;
`;

const StyledToastText = styled.Text.withConfig({
  displayName: 'StyledToastText',
  componentId: 'StyledToastText',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  line-height: ${({ theme }) => theme.typography.fontSize.md * theme.typography.lineHeight.normal}px;
  color: ${({ theme }) => theme.colors.onPrimary || theme.colors.text.inverse};
  text-align: center;
  flex: 1;
`;

export { StyledToast, StyledToastText };


