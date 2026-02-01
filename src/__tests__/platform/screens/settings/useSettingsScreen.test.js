/**
 * useSettingsScreen Hook Tests
 * File: useSettingsScreen.test.js
 */
const React = require('react');
const TestRenderer = require('react-test-renderer');
const { useDispatch, useSelector } = require('react-redux');
const { useI18n } = require('@hooks');

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@services/storage', () => ({
  async: {
    setItem: jest.fn(),
    getItem: jest.fn().mockResolvedValue(null),
  },
  secure: {
    setItem: jest.fn().mockResolvedValue(true),
    removeItem: jest.fn().mockResolvedValue(true),
  },
}));

jest.mock('@config/constants', () => ({
  AI_API_KEY_CONFIGURED_ASYNC_KEY: 'ai_api_key_configured',
  VENTILATION_AI_API_KEY_STORAGE_KEY: 'VENTILATION_AI_API_KEY',
}));

const useSettingsScreen = require('@platform/screens/settings/SettingsScreen/useSettingsScreen').default;
const { DENSITY_MODES } = require('@platform/screens/settings/SettingsScreen/types');

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

describe('useSettingsScreen', () => {
  const mockT = jest.fn((key) => {
    const translations = {
      'settings.density.options.compact': 'Compact',
      'settings.density.options.comfortable': 'Comfortable',
    };
    return translations[key] || key;
  });

  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useDispatch.mockReturnValue(mockDispatch);
    const state = {
      ui: {
        density: 'comfortable',
        aiDecisionSupportEnabled: false,
        aiModelId: 'gpt-4o-mini',
      },
    };
    useSelector.mockImplementation((selector) => selector(state));
  });

  it('returns testIds', () => {
    const { result } = renderHook(() => useSettingsScreen());
    expect(result.current.testIds).toBeDefined();
    expect(result.current.testIds.screen).toBe('settings-screen');
  });

  it('returns density state', () => {
    const { result } = renderHook(() => useSettingsScreen());
    expect(result.current.density).toBe('comfortable');
  });

  it('returns density options', () => {
    const { result } = renderHook(() => useSettingsScreen());
    expect(result.current.densityOptions).toHaveLength(2);
    expect(result.current.densityOptions[0].value).toBe(DENSITY_MODES.COMPACT);
    expect(result.current.densityOptions[1].value).toBe(DENSITY_MODES.COMFORTABLE);
  });

  it('returns setDensity function', () => {
    const { result } = renderHook(() => useSettingsScreen());
    expect(typeof result.current.setDensity).toBe('function');
  });

  it('returns AI settings (aiEnabled, aiModelId, aiKeyConfigured, saveAiApiKey, clearAiApiKey)', () => {
    const { result } = renderHook(() => useSettingsScreen());
    expect(typeof result.current.aiEnabled).toBe('boolean');
    expect(typeof result.current.aiModelId).toBe('string');
    expect(typeof result.current.aiKeyConfigured).toBe('boolean');
    expect(typeof result.current.saveAiApiKey).toBe('function');
    expect(typeof result.current.clearAiApiKey).toBe('function');
    expect(Array.isArray(result.current.aiModelOptions)).toBe(true);
  });
});
