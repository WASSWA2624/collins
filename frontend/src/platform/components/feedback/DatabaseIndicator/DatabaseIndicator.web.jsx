/**
 * DatabaseIndicator Component - Web
 * Displays backend database connectivity using DatabaseConnectivityIcon.
 * File: DatabaseIndicator.web.jsx
 */
import React from 'react';
import { useI18n } from '@hooks';
import DatabaseConnectivityIcon from '../DatabaseConnectivityIcon';
import { StyledIndicator } from './DatabaseIndicator.web.styles';

/**
 * DatabaseIndicator component for Web.
 * @param {Object} props
 * @param {string} [props.testID]
 * @param {string} [props.className]
 * @param {string} [props.title] - Tooltip text (falls back to a11y label)
 */
const DatabaseIndicatorWeb = ({ testID, className, title }) => {
  const { t } = useI18n();
  const label = t('navigation.network.database.label');
  const tooltip = title ?? label;

  return (
    <StyledIndicator
      role="status"
      aria-live="polite"
      aria-label={label}
      title={tooltip}
      data-testid={testID}
      className={className}
    >
      <DatabaseConnectivityIcon title={tooltip} />
    </StyledIndicator>
  );
};

export default DatabaseIndicatorWeb;
