import { runCommand } from './process-utils.mjs';

runCommand('adb', ['logcat', 'ReactNative:V', 'ReactNativeJS:V', 'Expo:V', '*:S'], {
  label: 'Android logcat',
});
