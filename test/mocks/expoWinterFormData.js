/**
 * Mock for expo/src/winter/FormData (Jest cannot resolve Expo's .ts internals).
 * jest-expo preset expects installFormDataPatch for native runtime; no-op in tests.
 */
module.exports = {
  installFormDataPatch: jest.fn(),
};
