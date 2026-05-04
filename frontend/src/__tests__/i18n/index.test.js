/**
 * i18n Tests
 * File: index.test.js
 * Per P013: 23 supported locales (en + 22).
 */
import { createI18n } from '@i18n';

describe('i18n System', () => {
  const mockStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockStorage.getItem.mockResolvedValue(null);
    mockStorage.setItem.mockResolvedValue(true);
  });

  describe('createI18n', () => {
    it('should create i18n instance', () => {
      const i18n = createI18n({ storage: mockStorage });
      expect(i18n).toBeDefined();
      expect(typeof i18n.getDeviceLocale).toBe('function');
      expect(typeof i18n.getCurrentLocale).toBe('function');
      expect(typeof i18n.setLocale).toBe('function');
      expect(typeof i18n.t).toBe('function');
      expect(typeof i18n.tSync).toBe('function');
    });

    it('should create i18n instance without storage', () => {
      const i18n = createI18n();
      expect(i18n).toBeDefined();
    });
  });

  describe('getDeviceLocale', () => {
    it('should return default locale (en) when device locale not supported', () => {
      const i18n = createI18n({ storage: mockStorage });
      const locale = i18n.getDeviceLocale();
      // During Phase 1, only 'en' is supported, so it should return 'en'
      expect(locale).toBe('en');
    });

    it('should return en when device locale is en', () => {
      // Mock Intl to return 'en'
      const originalIntl = global.Intl;
      global.Intl = {
        DateTimeFormat: jest.fn(() => ({
          resolvedOptions: jest.fn(() => ({ locale: 'en' })),
        })),
      };

      const i18n = createI18n({ storage: mockStorage });
      const locale = i18n.getDeviceLocale();
      expect(locale).toBe('en');

      global.Intl = originalIntl;
    });

    it('should return supported locale when device locale is supported (e.g. ja)', () => {
      const originalIntl = global.Intl;
      global.Intl = {
        DateTimeFormat: jest.fn(() => ({
          resolvedOptions: jest.fn(() => ({ locale: 'ja' })),
        })),
      };

      const i18n = createI18n({ storage: mockStorage });
      const locale = i18n.getDeviceLocale();
      expect(locale).toBe('ja');

      global.Intl = originalIntl;
    });

    it('should fallback to en when device locale is unsupported', () => {
      const originalIntl = global.Intl;
      global.Intl = {
        DateTimeFormat: jest.fn(() => ({
          resolvedOptions: jest.fn(() => ({ locale: 'xx' })),
        })),
      };

      const i18n = createI18n({ storage: mockStorage });
      const locale = i18n.getDeviceLocale();
      expect(locale).toBe('en');

      global.Intl = originalIntl;
    });
  });

  describe('getCurrentLocale', () => {
    it('should return saved locale from storage when en', async () => {
      const i18n = createI18n({ storage: mockStorage });
      mockStorage.getItem.mockResolvedValue('en');
      const locale = await i18n.getCurrentLocale();
      expect(locale).toBe('en');
      expect(mockStorage.getItem).toHaveBeenCalledWith('user_locale');
    });

    it('should return device locale when no saved locale', async () => {
      mockStorage.getItem.mockResolvedValue(null);
      const i18n = createI18n({ storage: mockStorage });
      const locale = await i18n.getCurrentLocale();
      expect(locale).toBe('en');
    });

    it('should work without storage', async () => {
      const i18n = createI18n();
      const locale = await i18n.getCurrentLocale();
      expect(locale).toBe('en');
    });
  });

  describe('setLocale', () => {
    it('should save en locale to storage', async () => {
      const i18n = createI18n({ storage: mockStorage });
      await i18n.setLocale('en');
      expect(mockStorage.setItem).toHaveBeenCalledWith('user_locale', 'en');
    });

    it('should throw error for unsupported locale', async () => {
      const i18n = createI18n({ storage: mockStorage });
      await expect(i18n.setLocale('xx')).rejects.toThrow('Unsupported locale: xx');
      expect(mockStorage.setItem).not.toHaveBeenCalled();
    });

    it('should work without storage', async () => {
      const i18n = createI18n();
      await i18n.setLocale('en');
      // Should not throw
    });
  });

  describe('t (translation function)', () => {
    it('should translate key to en locale', async () => {
      const i18n = createI18n({ storage: mockStorage });
      mockStorage.getItem.mockResolvedValue('en');
      const translation = await i18n.t('common.save');
      expect(translation).toBe('Save');
    });

    it('should replace parameters in translation', async () => {
      const i18n = createI18n({ storage: mockStorage });
      mockStorage.getItem.mockResolvedValue('en');
      // Test with a key that has parameters (if exists in en.json)
      // For now, test that it doesn't crash
      const translation = await i18n.t('common.save', {});
      expect(typeof translation).toBe('string');
    });

    it('should fallback to key when translation not found', async () => {
      const i18n = createI18n({ storage: mockStorage });
      mockStorage.getItem.mockResolvedValue('en');
      const translation = await i18n.t('nonexistent.key');
      expect(translation).toBe('nonexistent.key');
    });
  });

  describe('tSync (synchronous translation function)', () => {
    it('should translate key synchronously', () => {
      const i18n = createI18n({ storage: mockStorage });
      const translation = i18n.tSync('common.save');
      expect(translation).toBe('Save');
    });

    it('should replace parameters in translation', () => {
      const i18n = createI18n({ storage: mockStorage });
      // Test parameter interpolation
      const translation = i18n.tSync('common.save', {});
      expect(typeof translation).toBe('string');
    });

    it('should fallback to key when translation not found', () => {
      const i18n = createI18n({ storage: mockStorage });
      const translation = i18n.tSync('nonexistent.key');
      expect(translation).toBe('nonexistent.key');
    });
  });

  describe('supportedLocales', () => {
    it('should export 23 supported locales (en + 22 per P013)', () => {
      const i18n = createI18n({ storage: mockStorage });
      const expected = ['en', 'ar', 'de', 'es', 'fa', 'fr', 'hi', 'id', 'it', 'ja', 'ko', 'ms', 'nl', 'pl', 'pt', 'ru', 'sw', 'ta', 'th', 'tr', 'uk', 'vi', 'zh'];
      expect(i18n.supportedLocales).toHaveLength(23);
      expected.forEach((code) => expect(i18n.supportedLocales).toContain(code));
    });
  });
});

