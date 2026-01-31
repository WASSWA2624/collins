import React from 'react';
import { Slot } from 'expo-router';

const SettingsLayout = () => {
  // Intentionally unguarded: users must always be able to reach disclaimer/settings.
  return <Slot />;
};

export default SettingsLayout;

