/**
 * DatabaseConnectivityIcon - Web
 * Backend database connectivity icon (connected / disconnected).
 * File: DatabaseConnectivityIcon.web.jsx
 */
import React from 'react';
import { useDatabaseHealth } from '@hooks';
import { StyledIconWrap } from './DatabaseConnectivityIcon.web.styles';

/** Database cylinder - connected (filled) */
const DatabaseOnSvg = ({ className, ...rest }) => (
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
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
  </svg>
);

/** Database cylinder - disconnected (outline / dim) */
const DatabaseOffSvg = ({ className, ...rest }) => (
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
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <line x1="3" y1="3" x2="21" y2="21" />
  </svg>
);

const DatabaseConnectivityIconWeb = ({ className, title, ...rest }) => {
  const { isConnected } = useDatabaseHealth();
  return (
    <StyledIconWrap
      role="img"
      aria-label={title}
      title={title}
      className={className}
      $connected={isConnected}
      {...rest}
    >
      {isConnected ? <DatabaseOnSvg /> : <DatabaseOffSvg />}
    </StyledIconWrap>
  );
};

export default DatabaseConnectivityIconWeb;
