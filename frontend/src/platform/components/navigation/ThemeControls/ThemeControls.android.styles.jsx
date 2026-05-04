/**
 * ThemeControls Styles - Android
 * File: ThemeControls.android.styles.jsx
 */
import styled from 'styled-components/native';
import { View } from 'react-native';

const StyledThemeControls = styled(View).withConfig({
  displayName: 'StyledThemeControls',
  componentId: 'StyledThemeControls',
})`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  flex-wrap: wrap;
`;

export { StyledThemeControls };
