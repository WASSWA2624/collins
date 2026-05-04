/**
 * DatabaseConnectivityIcon - iOS
 * Backend database connectivity icon (connected / disconnected).
 * File: DatabaseConnectivityIcon.ios.jsx
 */
import React from 'react';
import { useDatabaseHealth } from '@hooks';
import { StyledIconWrap, StyledIconText } from './DatabaseConnectivityIcon.ios.styles';

const GLYPH_DISCONNECTED = '\u{1F4BE}'; // 💾 (color indicates state)

const DatabaseConnectivityIconIOS = ({ title, accessibilityLabel, testID, ...rest }) => {
  const { isConnected } = useDatabaseHealth();
  const a11y = accessibilityLabel ?? title;
  return (
    <StyledIconWrap
      role="img"
      accessibilityLabel={a11y}
      accessibilityRole="image"
      testID={testID}
      {...rest}
    >
      <StyledIconText $connected={isConnected}>{GLYPH_DISCONNECTED}</StyledIconText>
    </StyledIconWrap>
  );
};

export default DatabaseConnectivityIconIOS;
