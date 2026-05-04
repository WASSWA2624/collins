/**
 * Switch Android Styles
 * Styled-components for Android platform
 * File: Switch.android.styles.jsx
 */

import styled from 'styled-components/native';

const StyledSwitch = styled.Pressable.withConfig({
  displayName: 'StyledSwitch',
  componentId: 'StyledSwitch',
})`
  align-items: center;
  justify-content: center;
  min-height: ${({ theme }) => theme.spacing.xxl - theme.spacing.xs}px;
  min-width: ${({ theme }) => theme.spacing.xxl - theme.spacing.xs}px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const StyledSwitchTrack = styled.View.withConfig({
  displayName: 'StyledSwitchTrack',
  componentId: 'StyledSwitchTrack',
})`
  width: ${({ theme }) => theme.spacing.xxl - theme.spacing.xs}px;
  height: ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ value, disabled, theme }) => {
    if (disabled) return theme.colors.background.tertiary;
    return value ? theme.colors.primary : theme.colors.background.tertiary;
  }};
  padding: ${({ theme }) => theme.spacing.xs / 2}px;
`;

const StyledSwitchThumb = styled.View.withConfig({
  displayName: 'StyledSwitchThumb',
  componentId: 'StyledSwitchThumb',
})`
  width: ${({ theme }) => theme.spacing.lg - theme.spacing.xs}px;
  height: ${({ theme }) => theme.spacing.lg - theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.onPrimary || theme.colors.text.inverse};
  transform: translateX(
    ${({ value, theme }) => (value ? theme.spacing.xxl - theme.spacing.xs - theme.spacing.lg : 0)}px
  );
  ${({ theme }) => {
    if (theme.shadows?.sm) {
      return `
        shadow-color: ${theme.shadows.sm.shadowColor};
        shadow-offset: ${theme.shadows.sm.shadowOffset.width}px ${theme.shadows.sm.shadowOffset.height}px;
        shadow-opacity: ${theme.shadows.sm.shadowOpacity};
        shadow-radius: ${theme.shadows.sm.shadowRadius}px;
        elevation: ${theme.shadows.sm.elevation || 2};
      `;
    }
    return '';
  }}
`;

export { StyledSwitch, StyledSwitchTrack, StyledSwitchThumb };

