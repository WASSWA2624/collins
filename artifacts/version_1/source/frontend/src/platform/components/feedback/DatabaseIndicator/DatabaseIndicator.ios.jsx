/**
 * DatabaseIndicator - iOS
 * Displays backend database connectivity using DatabaseConnectivityIcon.
 * File: DatabaseIndicator.ios.jsx
 */
import React from 'react';
import { useI18n } from '@hooks';
import DatabaseConnectivityIcon from '../DatabaseConnectivityIcon';
import { StyledIndicator } from './DatabaseIndicator.ios.styles';

const DatabaseIndicatorIOS = ({ testID, style, title, accessibilityLabel, ...rest }) => {
  const { t } = useI18n();
  const label = t('navigation.network.database.label');
  const a11yLabel = accessibilityLabel ?? title ?? label;

  return (
    <StyledIndicator
      accessibilityRole="none"
      accessibilityLabel={a11yLabel}
      testID={testID}
      style={style}
      {...rest}
    >
      <DatabaseConnectivityIcon title={label} accessibilityLabel={label} />
    </StyledIndicator>
  );
};

export default DatabaseIndicatorIOS;
