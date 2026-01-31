/**
 * useLandingScreen Hook Tests
 * File: useLandingScreen.test.js
 */
const React = require('react');
const TestRenderer = require('react-test-renderer');
const { useRouter } = require('expo-router');

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

const useLandingScreen = require('@platform/screens/common/LandingScreen/useLandingScreen').default;

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

describe('useLandingScreen', () => {
  it('pushes /assessment on handleGetStarted', () => {
    const mockRouter = { push: jest.fn() };
    useRouter.mockReturnValue(mockRouter);

    const { result } = renderHook(() => useLandingScreen());
    act(() => {
      result.current.handleGetStarted();
    });

    expect(mockRouter.push).toHaveBeenCalledWith('/assessment');
  });
});

