/**
 * useAssessmentEntryScreen Hook Tests
 * File: useAssessmentEntryScreen.test.js
 */
const React = require('react');
const TestRenderer = require('react-test-renderer');
const { useRouter } = require('expo-router');

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

const useAssessmentEntryScreen =
  require('@platform/screens/ventilation/AssessmentEntryScreen/useAssessmentEntryScreen').default;

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

describe('useAssessmentEntryScreen', () => {
  it('replaces to /assessment on handleStart', () => {
    const mockRouter = { replace: jest.fn() };
    useRouter.mockReturnValue(mockRouter);

    const { result } = renderHook(() => useAssessmentEntryScreen());
    act(() => {
      result.current.handleStart();
    });

    expect(mockRouter.replace).toHaveBeenCalledWith('/assessment');
  });
});

