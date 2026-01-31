import React from 'react';
import { Slot } from 'expo-router';

const SettingsLayout = () => {
  // Intentionally unguarded: settings routes should remain accessible.
  return <Slot />;
};

export default SettingsLayout;

