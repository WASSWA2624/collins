/**
 * Hook Assertion Helpers
 * File: hook-assertions.js
 */
const expectCrudHook = (result, actions = []) => {
  expect(result).toBeDefined();
  expect(result.isLoading).toBe(false);
  expect(result.errorCode).toBeNull();
  expect(result.data).toBeNull();
  expect(typeof result.reset).toBe('function');
  actions.forEach((key) => {
    expect(typeof result[key]).toBe('function');
  });
};

export { expectCrudHook };
