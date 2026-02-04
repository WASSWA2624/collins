/**
 * Mock for expo/src/winter (Jest cannot resolve Expo's .ts internals).
 * Real winter/index.ts only imports './runtime'; no-op in test environment.
 */
module.exports = {};
