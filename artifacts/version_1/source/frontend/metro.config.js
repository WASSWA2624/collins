const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
const platforms = Array.isArray(config.resolver?.platforms) ? config.resolver.platforms : [];

config.resolver.platforms = ['web', ...platforms.filter((platform) => platform !== 'web')];

module.exports = config;
