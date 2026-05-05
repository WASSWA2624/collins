import { runCommand } from './process-utils.mjs';

runCommand('npx', ['expo', 'start', '--clear'], {
  label: 'Expo debug startup',
  env: {
    EXPO_PUBLIC_WEB_LOG_ENDPOINT:
      process.env.EXPO_PUBLIC_WEB_LOG_ENDPOINT || 'http://127.0.0.1:8787/logs',
  },
});

