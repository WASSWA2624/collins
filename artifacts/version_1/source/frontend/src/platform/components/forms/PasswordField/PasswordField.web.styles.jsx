/**
 * PasswordField Web Styles
 * Styled-components for Web platform
 * File: PasswordField.web.styles.jsx
 */
import styled from 'styled-components';

const StyledContainer = styled.div.withConfig({
  displayName: 'StyledContainer',
})`
  width: 100%;
  min-width: 0;
  align-self: stretch;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const StyledPasswordStrength = styled.div.withConfig({
  displayName: 'StyledPasswordStrength',
})`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledPasswordStrengthBar = styled.div.withConfig({
  displayName: 'StyledPasswordStrengthBar',
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})`
  width: 100%;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 2px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ $strength }) => (($strength + 1) / 5) * 100}%;
    background-color: ${({ $color }) => $color};
    transition: width 0.3s ease, background-color 0.3s ease;
  }
`;

const StyledPasswordStrengthLabel = styled.span.withConfig({
  displayName: 'StyledPasswordStrengthLabel',
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ $color }) => $color};
  font-weight: 500;
`;

export {
  StyledContainer,
  StyledPasswordStrength,
  StyledPasswordStrengthBar,
  StyledPasswordStrengthLabel,
};
