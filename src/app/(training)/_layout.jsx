import React from 'react';
import { Slot } from 'expo-router';
import { useAcknowledgementGuard } from '@navigation/guards';

const TrainingLayout = () => {
  useAcknowledgementGuard();
  return <Slot />;
};

export default TrainingLayout;

