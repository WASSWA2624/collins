/**
 * Root Layout Styles - Web
 * Styled-components for Web platform
 * File: RootLayoutStyles.web.styles.jsx
 * 
 * Per theme-design.mdc: Web styles use styled-components entrypoint (not /native)
 * Per component-structure.mdc: Platform separation is MANDATORY
 */

import styled from 'styled-components';
import { ActivityIndicator } from 'react-native';

const StyledRootContainer = styled.div.withConfig({
  displayName: 'StyledRootContainer',
  componentId: 'StyledRootContainer',
})`
  flex: 1;
  display: flex;
  width: 100%;
  height: 100%;
`;

const StyledLoadingContainer = styled.div.withConfig({
  displayName: 'StyledLoadingContainer',
  componentId: 'StyledLoadingContainer',
})`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

// Kept as the React Native primitive for compatibility with existing usage.
const StyledActivityIndicator = ActivityIndicator;

export {
  StyledRootContainer,
  StyledLoadingContainer,
  StyledActivityIndicator,
};

