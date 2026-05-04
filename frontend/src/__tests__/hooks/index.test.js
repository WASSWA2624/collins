/**
 * Hooks Barrel Export Tests
 * File: index.test.js
 */
import {
  useAsyncState,
  useCrud,
  useDebounce,
  useI18n,
  useNetworkBanner,
  useNetwork,
  usePagination,
  useShellBanners,
  useTheme,
  useUiState,
} from '@hooks';

describe('@hooks barrel', () => {
  it('exports cross-cutting hooks as named exports', () => {
    expect(typeof useTheme).toBe('function');
    expect(typeof useNetwork).toBe('function');
    expect(typeof useI18n).toBe('function');
    expect(typeof useDebounce).toBe('function');
    expect(typeof usePagination).toBe('function');
    expect(typeof useAsyncState).toBe('function');
    expect(typeof useCrud).toBe('function');
    expect(typeof useUiState).toBe('function');
    expect(typeof useNetworkBanner).toBe('function');
    expect(typeof useShellBanners).toBe('function');
  });
});


