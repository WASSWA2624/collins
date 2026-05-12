/**
 * Radio iOS Styles
 * Styled-components for iOS platform
 * File: Radio.ios.styles.jsx
 */

import styled from 'styled-components/native';

const StyledRadio = styled.Pressable.withConfig({
  displayName: 'StyledRadio',
  componentId: 'StyledRadio',
})`
  flex-direction: row;
  align-items: center;
  min-height: ${({ theme }) => theme.spacing.xxl}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const StyledRadioCircle = styled.View.withConfig({
  displayName: 'StyledRadioCircle',
  componentId: 'StyledRadioCircle',
})`
  width: ${({ theme }) => theme.spacing.lg}px;
  height: ${({ theme }) => theme.spacing.lg}px;
  border-width: ${({ theme }) => Math.round(theme.spacing.xs / 2)}px;
  border-color: ${({ selected, disabled, theme }) => {
    if (disabled) return theme.colors.background.tertiary;
    if (selected) return theme.colors.primary;
    return theme.colors.background.tertiary;
  }};
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledRadioDot = styled.View.withConfig({
  displayName: 'StyledRadioDot',
  componentId: 'StyledRadioDot',
})`
  width: ${({ theme }) => theme.spacing.sm}px;
  height: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.primary};
`;

const StyledRadioLabel = styled.Text.withConfig({
  displayName: 'StyledRadioLabel',
  componentId: 'StyledRadioLabel',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: 400;
  line-height: ${({ theme }) => theme.typography.fontSize.md * theme.typography.lineHeight.normal}px;
  color: ${({ disabled, theme }) => (disabled ? theme.colors.text.tertiary : theme.colors.text.primary)};
`;

export { StyledRadio, StyledRadioCircle, StyledRadioDot, StyledRadioLabel };
