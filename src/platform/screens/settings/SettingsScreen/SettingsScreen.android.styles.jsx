/**
 * SettingsScreen Android Styles
 * File: SettingsScreen.android.styles.jsx
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
`;
