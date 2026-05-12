/**
 * SettingsScreen Component - Android
 */
import React from 'react';
import SettingsScreenContent from './SettingsScreenContent';
import * as styles from './SettingsScreen.android.styles';

const SettingsScreenAndroid = () => (
  <SettingsScreenContent platform="native" styles={styles} />
);

export default SettingsScreenAndroid;
