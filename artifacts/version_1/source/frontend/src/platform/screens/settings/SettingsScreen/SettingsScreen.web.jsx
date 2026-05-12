/**
 * SettingsScreen Component - Web
 */
import React from 'react';
import SettingsScreenContent from './SettingsScreenContent';
import * as styles from './SettingsScreen.web.styles';

const SettingsScreenWeb = () => (
  <SettingsScreenContent platform="web" styles={styles} />
);

export default SettingsScreenWeb;
