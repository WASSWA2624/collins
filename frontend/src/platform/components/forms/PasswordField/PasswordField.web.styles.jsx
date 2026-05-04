/**
 * PasswordField Web Styles
 * Styled-components for Web platform
 * File: PasswordField.web.styles.jsx
 */
import styled from 'styled-components';
import { View, Text } from 'react-native';

const StyledContainer = styled(View).withConfig({
  displayName: 'StyledContainer',
})`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const StyledPasswordStrength = styled(View).withConfig({
  displayName: 'StyledPasswordStrength',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledPasswordStrengthBar = styled(View).withConfig({
  displayName: 'StyledPasswordStrengthBar',
})`
  height: 4px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 2px;
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ strength }) => ((strength + 1) / 5) * 100}%;
    background-color: ${({ color }) => color};
    transition: width 0.3s ease, background-color 0.3s ease;
  }
`;

const StyledPasswordStrengthLabel = styled(Text).withConfig({
  displayName: 'StyledPasswordStrengthLabel',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ color }) => color};
  font-weight: 500;
`;

export {
  StyledContainer,
  StyledPasswordStrength,
  StyledPasswordStrengthBar,
  StyledPasswordStrengthLabel,
};



