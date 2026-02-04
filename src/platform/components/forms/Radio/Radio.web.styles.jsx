/**
 * Radio Web Styles
 * Styled-components for Web platform
 * File: Radio.web.styles.jsx
 */
import styled from 'styled-components';

const StyledRadio = styled.button.withConfig({
  displayName: 'StyledRadio',
  componentId: 'StyledRadio',
})`
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: ${({ theme }) => theme.spacing.xxl}px;
  padding: ${({ theme }) => theme.spacing.sm}px;
  background: transparent;
  border: 0;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  gap: ${({ theme }) => theme.spacing.sm}px;

  &:focus-visible {
    outline: ${({ theme }) => Math.round(theme.spacing.xs / 2)}px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.radius.sm}px;
  }
`;

const StyledRadioCircle = styled.span.withConfig({
  displayName: 'StyledRadioCircle',
  componentId: 'StyledRadioCircle',
})`
  display: inline-flex;
  width: ${({ theme }) => theme.spacing.lg}px;
  height: ${({ theme }) => theme.spacing.lg}px;
  border-width: ${({ theme }) => Math.round(theme.spacing.xs / 2)}px;
  border-style: solid;
  border-color: ${({ selected, disabled, theme }) => {
    if (disabled) return theme.colors.background.tertiary;
    if (selected) return theme.colors.primary;
    return theme.colors.background.tertiary;
  }};
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
`;

const StyledRadioDot = styled.span.withConfig({
  displayName: 'StyledRadioDot',
  componentId: 'StyledRadioDot',
})`
  display: inline-flex;
  width: ${({ theme }) => theme.spacing.sm}px;
  height: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.primary};
`;

const StyledRadioLabel = styled.span.withConfig({
  displayName: 'StyledRadioLabel',
  componentId: 'StyledRadioLabel',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regularWeb};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: 400;
  line-height: ${({ theme }) => theme.typography.fontSize.md * theme.typography.lineHeight.normal}px;
  color: ${({ disabled, theme }) => (disabled ? theme.colors.text.tertiary : theme.colors.text.primary)};
`;

export { StyledRadio, StyledRadioCircle, StyledRadioDot, StyledRadioLabel };

