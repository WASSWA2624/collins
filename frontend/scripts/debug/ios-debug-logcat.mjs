import { runCommand } from './process-utils.mjs';

if (process.platform !== 'darwin') {
  console.error('[collins-debug] iOS simulator logs require macOS with Xcode command line tools.');
  process.exit(1);
}

runCommand(
  'xcrun',
  [
    'simctl',
    'spawn',
    'booted',
    'log',
    'stream',
    '--style',
    'compact',
    '--predicate',
    'eventMessage CONTAINS "ReactNative" OR eventMessage CONTAINS "Expo" OR processImagePath CONTAINS "Collins"',
  ],
  { label: 'iOS simulator log stream' }
);

