import fs from 'node:fs';
import path from 'node:path';
import appConfig from '../../../app.config';
import babelConfig from '../../../babel.config';
import jestConfig from '../../../jest.config';
import packageJson from '../../../package.json';

const projectRoot = path.resolve(__dirname, '../../..');

const getBabelModuleResolverConfig = () => {
  const config = babelConfig({ cache: jest.fn() });
  const moduleResolverPlugin = config.plugins.find((plugin) => Array.isArray(plugin) && plugin[0] === 'module-resolver');
  return moduleResolverPlugin[1];
};

const aliasRoots = {
  '@': 'src',
  '@app': 'src/app',
  '@platform': 'src/platform',
  '@theme': 'src/theme',
  '@store': 'src/store',
  '@features': 'src/features',
  '@services': 'src/services',
  '@offline': 'src/offline',
  '@security': 'src/security',
  '@hooks': 'src/hooks',
  '@utils': 'src/utils',
  '@config': 'src/config',
  '@i18n': 'src/i18n',
  '@errors': 'src/errors',
  '@logging': 'src/logging',
  '@bootstrap': 'src/bootstrap',
  '@navigation': 'src/navigation',
  '@debug': 'src/debug',
};

describe('Expo web startup config', () => {
  test('uses single-page web output for Expo dev server startup stability', () => {
    expect(appConfig.expo.web.bundler).toBe('metro');
    expect(appConfig.expo.web.output).toBe('single');
  });

  test('uses Expo SDK 54 managed startup dependencies', () => {
    expect(packageJson.dependencies.expo).toMatch(/^~54\./);
    expect(packageJson.dependencies['expo-router']).toMatch(/^~6\./);
    expect(packageJson.dependencies['react-native']).toBe('0.81.5');
    expect(packageJson.engines.node).toBe('>=20.0.0');
  });

  test('uses Expo Metro defaults for cross-platform startup', () => {
    const metroConfigSource = fs.readFileSync(path.join(projectRoot, 'metro.config.js'), 'utf8');

    expect(metroConfigSource).toContain("require('expo/metro-config')");
    expect(metroConfigSource).toContain('getDefaultConfig(__dirname)');
    expect(metroConfigSource).toContain('module.exports = config');
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

  test('keeps debug startup scripts backed by checked-in files', () => {
    const debugScriptEntries = Object.entries(packageJson.scripts).filter(([name]) =>
      name.startsWith('debug:')
    );

    expect(debugScriptEntries.length).toBeGreaterThan(0);

    debugScriptEntries.forEach(([, command]) => {
      const [, scriptPath] = command.match(/^node\s+(.+)$/) || [];
      expect(scriptPath).toBeTruthy();
      expect(fs.existsSync(path.join(projectRoot, scriptPath))).toBe(true);
    });
  });
});

describe('Expo startup module resolution', () => {
  test('keeps Babel startup aliases mapped to existing source roots', () => {
    const resolverConfig = getBabelModuleResolverConfig();

    expect(resolverConfig.extensions).toEqual(
      expect.arrayContaining(['.js', '.jsx', '.json', '.txt'])
    );
    expect(resolverConfig.alias).toMatchObject(aliasRoots);

    Object.values(aliasRoots).forEach((aliasPath) => {
      expect(fs.existsSync(path.join(projectRoot, aliasPath))).toBe(true);
    });
  });

  test('keeps Jest native and web root aliases aligned with Babel aliases', () => {
    jestConfig.projects.forEach((project) => {
      Object.keys(aliasRoots).forEach((aliasName) => {
        const exactAliasPattern = `^${aliasName.replace('@', '@')}$`;
        const wildcardAliasPattern = aliasName === '@' ? '^@/(.*)$' : `^${aliasName}/(.*)$`;

        expect(project.moduleNameMapper[exactAliasPattern]).toBeTruthy();
        expect(project.moduleNameMapper[wildcardAliasPattern]).toBeTruthy();
      });
    });
  });

  test('keeps debug and root-layout platform files resolvable on startup', () => {
    [
      'src/debug/web-console-logger.native.js',
      'src/debug/web-console-logger.web.js',
      'src/platform/layouts/common/RootLayoutStyles/index.android.js',
      'src/platform/layouts/common/RootLayoutStyles/index.ios.js',
      'src/platform/layouts/common/RootLayoutStyles/index.web.js',
      'src/platform/layouts/common/ThemeProviderWrapper/ThemeProviderWrapper.android.jsx',
      'src/platform/layouts/common/ThemeProviderWrapper/ThemeProviderWrapper.ios.jsx',
      'src/platform/layouts/common/ThemeProviderWrapper/ThemeProviderWrapper.web.jsx',
    ].forEach((filePath) => {
      expect(fs.existsSync(path.join(projectRoot, filePath))).toBe(true);
    });
  });
});
