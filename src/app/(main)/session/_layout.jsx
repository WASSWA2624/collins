import React from 'react';
import { Slot } from 'expo-router';
import { useSessionGuard } from '@navigation/guards';

const MainSessionLayout = () => {
  useSessionGuard();
  return <Slot />;
};

export default MainSessionLayout;

