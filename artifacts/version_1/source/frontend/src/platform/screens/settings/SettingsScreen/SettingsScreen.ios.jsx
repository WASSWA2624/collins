/**
 * SettingsScreen Component - iOS
 */
import React from 'react';
import SettingsScreenContent from './SettingsScreenContent';
import * as styles from './SettingsScreen.ios.styles';

const SettingsScreenIOS = () => (
  <SettingsScreenContent platform="native" styles={styles} />
);

export default SettingsScreenIOS;
