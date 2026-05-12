/**
 * DatabaseConnectivityIcon - Android
 * Backend database connectivity icon (connected / disconnected).
 * File: DatabaseConnectivityIcon.android.jsx
 */
import React from 'react';
import { useDatabaseHealth } from '@hooks';
import { StyledIconWrap, StyledIconText } from './DatabaseConnectivityIcon.android.styles';

const GLYPH_CONNECTED = '\u{1F4BE}'; // 💾
const GLYPH_DISCONNECTED = '\u{1F4BE}'; // same glyph, color indicates state

const DatabaseConnectivityIconAndroid = ({ title, accessibilityLabel, testID, ...rest }) => {
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

export default DatabaseConnectivityIconAndroid;
