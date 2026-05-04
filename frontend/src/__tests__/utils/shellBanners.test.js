/**
 * shellBanners Utils Tests
 * File: shellBanners.test.js
 */
import { BANNER_VARIANTS } from '@utils/shellBanners';

describe('shellBanners utils', () => {
  it('exposes banner variants', () => {
    expect(BANNER_VARIANTS).toBeDefined();
    expect(BANNER_VARIANTS.OFFLINE).toBe('offline');
    expect(BANNER_VARIANTS.ONLINE).toBe('online');
    expect(BANNER_VARIANTS.MAINTENANCE).toBe('maintenance');
    expect(BANNER_VARIANTS.INFO).toBe('info');
  });
});
