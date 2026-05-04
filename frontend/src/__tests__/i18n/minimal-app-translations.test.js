/**
 * Minimal App Translations Tests
 * File: minimal-app-translations.test.js
 * 
 * Verifies that all translation keys used in Phase 8 screens exist in en.json
 */
const enTranslations = require('@i18n/locales/en.json');

describe('Minimal App Translations (Phase 8)', () => {
  describe('Home Screen Translations', () => {
    it('should have home.title', () => {
      expect(enTranslations.home).toBeDefined();
      expect(enTranslations.home.title).toBeDefined();
      expect(typeof enTranslations.home.title).toBe('string');
    });

    it('should have home.welcome.title', () => {
      expect(enTranslations.home.welcome).toBeDefined();
      expect(enTranslations.home.welcome.title).toBeDefined();
      expect(typeof enTranslations.home.welcome.title).toBe('string');
    });

    it('should have home.welcome.message', () => {
      expect(enTranslations.home.welcome.message).toBeDefined();
      expect(typeof enTranslations.home.welcome.message).toBe('string');
    });
  });

  describe('Not Found Screen Translations', () => {
    it('should have notFound.title', () => {
      expect(enTranslations.notFound).toBeDefined();
      expect(enTranslations.notFound.title).toBeDefined();
      expect(typeof enTranslations.notFound.title).toBe('string');
    });

    it('should have notFound.message', () => {
      expect(enTranslations.notFound.message).toBeDefined();
      expect(typeof enTranslations.notFound.message).toBe('string');
    });

    it('should have notFound.goHome', () => {
      expect(enTranslations.notFound.goHome).toBeDefined();
      expect(typeof enTranslations.notFound.goHome).toBe('string');
    });

    it('should have notFound.goHomeHint', () => {
      expect(enTranslations.notFound.goHomeHint).toBeDefined();
      expect(typeof enTranslations.notFound.goHomeHint).toBe('string');
    });
  });

  describe('Error Screen Translations', () => {
    it('should have error.title', () => {
      expect(enTranslations.error).toBeDefined();
      expect(enTranslations.error.title).toBeDefined();
      expect(typeof enTranslations.error.title).toBe('string');
    });

    it('should have error.message', () => {
      expect(enTranslations.error.message).toBeDefined();
      expect(typeof enTranslations.error.message).toBe('string');
    });

    it('should have error.retry', () => {
      expect(enTranslations.error.retry).toBeDefined();
      expect(typeof enTranslations.error.retry).toBe('string');
    });

    it('should have error.retryHint', () => {
      expect(enTranslations.error.retryHint).toBeDefined();
      expect(typeof enTranslations.error.retryHint).toBe('string');
    });

    it('should have error.goHome', () => {
      expect(enTranslations.error.goHome).toBeDefined();
      expect(typeof enTranslations.error.goHome).toBe('string');
    });

    it('should have error.goHomeHint', () => {
      expect(enTranslations.error.goHomeHint).toBeDefined();
      expect(typeof enTranslations.error.goHomeHint).toBe('string');
    });
  });
});

