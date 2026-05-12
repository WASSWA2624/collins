/**
 * NetworkConnectivityIcon - iOS
 * Internet connectivity icon (wifi connected / offline). No status dot.
 * File: NetworkConnectivityIcon.ios.jsx
 */
import React from 'react';
import { useNetwork } from '@hooks';
import { StyledIconWrap, StyledIconText } from './NetworkConnectivityIcon.ios.styles';

const GLYPH_ONLINE = '\u{1F4F6}'; // 📶
const GLYPH_OFFLINE = '\u{1F4F4}'; // 📵

const NetworkConnectivityIconIOS = ({ title, accessibilityLabel, testID, ...rest }) => {
  const { isOffline } = useNetwork();
  const a11y = accessibilityLabel ?? title;
  return (
    <StyledIconWrap
      role="img"
      accessibilityLabel={a11y}
      accessibilityRole="image"
      testID={testID}
      {...rest}
    >
      <StyledIconText $offline={isOffline}>
        {isOffline ? GLYPH_OFFLINE : GLYPH_ONLINE}
      </StyledIconText>
    </StyledIconWrap>
  );
};

export default NetworkConnectivityIconIOS;
