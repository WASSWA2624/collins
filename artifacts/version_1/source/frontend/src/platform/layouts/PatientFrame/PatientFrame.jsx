/**
 * PatientFrame platform selector
 * File: PatientFrame.jsx
 */
import { Platform } from 'react-native';
import PatientFrameAndroid from './PatientFrame.android';
import PatientFrameIOS from './PatientFrame.ios';
import PatientFrameWeb from './PatientFrame.web';

const PatientFrame = Platform.select({
  android: PatientFrameAndroid,
  ios: PatientFrameIOS,
  web: PatientFrameWeb,
  default: PatientFrameWeb,
});

export default PatientFrame;
