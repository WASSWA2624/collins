/**
 * SettingsScreen iOS Styles
 * File: SettingsScreen.ios.styles.jsx
 */

import styled from 'styled-components/native';

export const StyledContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

export const StyledContent = styled.View`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md}px;
`;

export const StyledTabBarContainer = styled.View`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border.light};
`;
