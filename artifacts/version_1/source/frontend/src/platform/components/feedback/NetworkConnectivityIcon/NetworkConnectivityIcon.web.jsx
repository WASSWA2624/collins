/**
 * NetworkConnectivityIcon - Web
 * Internet connectivity icon (wifi connected / offline). No status dot.
 * File: NetworkConnectivityIcon.web.jsx
 */
import React from 'react';
import { useNetwork } from '@hooks';
import { StyledIconWrap } from './NetworkConnectivityIcon.web.styles';

/** WiFi (connected) - bars */
const WifiSvg = ({ className, ...rest }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
    {...rest}
  >
    <path d="M5 13a10 10 0 0 1 14 0" />
    <path d="M8 16a6 6 0 0 1 8 0" />
    <path d="M12 19h.01" />
  </svg>
);

/** WiFi off (disconnected) */
const WifiOffSvg = ({ className, ...rest }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
    {...rest}
  >
    <path d="M12 19h.01" />
    <path d="M8.5 15.43a5 5 0 0 1 7 0" />
    <path d="M5 13a10 10 0 0 1 5.92-2.9" />
    <path d="M2 8.5a15 15 0 0 1 4.17-1.3" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

const NetworkConnectivityIconWeb = ({ className, title, ...rest }) => {
  const { isOffline } = useNetwork();
  return (
    <StyledIconWrap
      role="img"
      aria-label={title}
      title={title}
      className={className}
      $offline={isOffline}
      {...rest}
    >
      {isOffline ? <WifiOffSvg /> : <WifiSvg />}
    </StyledIconWrap>
  );
};

export default NetworkConnectivityIconWeb;
