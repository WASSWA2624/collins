import appConfig from '../../../app.config';
import packageJson from '../../../package.json';

describe('Expo web startup config', () => {
  test('uses single-page web output for Expo dev server startup stability', () => {
    expect(appConfig.expo.web.bundler).toBe('metro');
    expect(appConfig.expo.web.output).toBe('single');
  });
});

describe('Expo startup scripts', () => {
  test('uses Expo Go start commands for managed mobile development', () => {
    expect(packageJson.scripts.android).toBe('expo start --android --clear');
    expect(packageJson.scripts.ios).toBe('expo start --ios --clear');
  });

  test('keeps explicit LAN, tunnel, and development-build entry points', () => {
    expect(packageJson.scripts['android:lan']).toBe(
      'expo start --android --lan --clear'
    );
    expect(packageJson.scripts['android:tunnel']).toBe(
      'expo start --android --tunnel --clear'
    );
    expect(packageJson.scripts['android:dev-client']).toBe('expo run:android');

    expect(packageJson.scripts['ios:lan']).toBe(
      'expo start --ios --lan --clear'
    );
    expect(packageJson.scripts['ios:tunnel']).toBe(
      'expo start --ios --tunnel --clear'
    );
    expect(packageJson.scripts['ios:dev-client']).toBe('expo run:ios');
  });
});
