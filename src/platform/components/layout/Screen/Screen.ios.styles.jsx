/**
 * Screen iOS Styles
 * Styled-components for iOS platform
 * File: Screen.ios.styles.jsx
 */

import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const StyledSafeArea = styled(SafeAreaView).withConfig({
  displayName: 'StyledSafeArea',
  componentId: 'StyledSafeArea',
})`
  flex: 1;
`;

const StyledRoot = styled.View.withConfig({
  displayName: 'StyledRoot',
  componentId: 'StyledRoot',
})`
  flex: 1;
  background-color: ${({ background, theme }) => {
    if (background === 'surface') return theme.colors.background.secondary;
    return theme.colors.background.primary;
  }};
`;

const StyledContent = styled.View.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  flex: 1;
  padding: ${({ padding, theme }) => {
    const map = {
      none: 0,
      sm: theme.spacing.sm,
      md: theme.spacing.md,
      lg: theme.spacing.lg,
    };
    const value = Object.prototype.hasOwnProperty.call(map, padding) ? map[padding] : map.md;
    return `${value}px`;
  }};
`;

export { StyledSafeArea, StyledRoot, StyledContent };


