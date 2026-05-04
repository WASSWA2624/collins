/**
 * PasswordField iOS Styles
 * Styled-components for iOS platform
 * File: PasswordField.ios.styles.jsx
 */
import styled from 'styled-components/native';
import { View, Text } from 'react-native';

const StyledContainer = styled(View).withConfig({
  displayName: 'StyledContainer',
})`
  width: 100%;
  flex-direction: column;
`;

const StyledPasswordStrength = styled(View).withConfig({
  displayName: 'StyledPasswordStrength',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
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
`;

const StyledPasswordStrengthBarInner = styled(View).withConfig({
  displayName: 'StyledPasswordStrengthBarInner',
})`
  height: 100%;
  width: ${({ strength }) => ((strength + 1) / 5) * 100}%;
  background-color: ${({ color }) => color};
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
  StyledPasswordStrengthBarInner,
  StyledPasswordStrengthLabel,
};


