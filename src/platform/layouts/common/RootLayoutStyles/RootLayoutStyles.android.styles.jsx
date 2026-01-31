/**
 * Root Layout Styles - Android
 * Styled-components for Android platform
 * File: RootLayoutStyles.android.styles.jsx
 * 
 * Per theme-design.mdc: Android styles use styled-components/native entrypoint
 * Per component-structure.mdc: Platform separation is MANDATORY
 */

import styled from 'styled-components/native';
import { View, ActivityIndicator } from 'react-native';

const StyledRootContainer = styled(View).withConfig({
  displayName: 'StyledRootContainer',
  componentId: 'StyledRootContainer',
})`
  flex: 1;
`;

const StyledLoadingContainer = styled(View).withConfig({
  displayName: 'StyledLoadingContainer',
  componentId: 'StyledLoadingContainer',
})`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const StyledActivityIndicator = styled(ActivityIndicator).withConfig({
  displayName: 'StyledActivityIndicator',
  componentId: 'StyledActivityIndicator',
})`
  /* ActivityIndicator styling if needed */
`;

export {
  StyledRootContainer,
  StyledLoadingContainer,
  StyledActivityIndicator,
};

