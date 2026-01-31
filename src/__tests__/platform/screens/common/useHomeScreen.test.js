/**
 * useHomeScreen Hook Tests
 * File: useHomeScreen.test.js
 */
const React = require('react');
const TestRenderer = require('react-test-renderer');

const useHomeScreen = require('@platform/screens/common/HomeScreen/useHomeScreen').default;

const act = TestRenderer.act;
const renderHook = (hook) => {
  const result = {};
  const HookHarness = () => {
    Object.assign(result, hook());
    return null;
  };
  let renderer;
  act(() => {
    renderer = TestRenderer.create(React.createElement(HookHarness));
  });
  return { result: { current: result }, unmount: () => renderer.unmount() };
};

describe('useHomeScreen', () => {
  it('returns testIds', () => {
    const { result } = renderHook(() => useHomeScreen());
    expect(result.current.testIds).toBeDefined();
    expect(result.current.testIds.screen).toBe('home-screen');
  });
});
