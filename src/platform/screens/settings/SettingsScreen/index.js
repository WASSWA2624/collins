/**
 * SettingsScreen Index
 * File: index.js
 * 
 * Per component-structure.mdc: Barrel export for platform-specific implementations
 */

import SettingsScreenWeb from './SettingsScreen.web';
import SettingsScreenAndroid from './SettingsScreen.android';
import SettingsScreenIOS from './SettingsScreen.ios';

// Metro bundler will resolve platform-specific implementations automatically
export default SettingsScreenWeb;
export { default as SettingsScreenWeb } from './SettingsScreen.web';
export { default as SettingsScreenAndroid } from './SettingsScreen.android';
export { default as SettingsScreenIOS } from './SettingsScreen.ios';
