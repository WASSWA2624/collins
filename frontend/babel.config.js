process.env.EXPO_ROUTER_IMPORT_MODE = 'sync';

module.exports = function babelConfig(api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json','txt'],
          alias: {
            '@': './src',
            '@app': './src/app',
            '@platform': './src/platform',
            '@theme': './src/theme',
            '@store': './src/store',
            '@features': './src/features',
            '@services': './src/services',
            '@offline': './src/offline',
            '@security': './src/security',
            '@hooks': './src/hooks',
            '@utils': './src/utils',
            '@config': './src/config',
            '@i18n': './src/i18n',
            '@errors': './src/errors',
            '@logging': './src/logging',
            '@bootstrap': './src/bootstrap',
            '@navigation': './src/navigation',
            '@debug': './src/debug',
          },
        },
      ],
    ],
  };
};

