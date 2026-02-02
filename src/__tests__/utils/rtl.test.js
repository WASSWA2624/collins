/**
 * RTL utility tests (P013 13.4.4)
 */
import { isRTL, applyDocumentDirection } from '@utils/rtl';

describe('utils/rtl', () => {
  describe('isRTL', () => {
    it('returns true for Arabic (ar)', () => {
      expect(isRTL('ar')).toBe(true);
      expect(isRTL('ar-SA')).toBe(true);
    });

    it('returns true for Persian/Farsi (fa)', () => {
      expect(isRTL('fa')).toBe(true);
      expect(isRTL('fa-IR')).toBe(true);
    });

    it('returns false for LTR locales', () => {
      expect(isRTL('en')).toBe(false);
      expect(isRTL('fr')).toBe(false);
      expect(isRTL('zh')).toBe(false);
    });

    it('returns false for null/undefined/empty', () => {
      expect(isRTL(null)).toBe(false);
      expect(isRTL(undefined)).toBe(false);
      expect(isRTL('')).toBe(false);
    });
  });

  describe('applyDocumentDirection', () => {
    it('does not throw when document is undefined (e.g. Jest)', () => {
      expect(() => applyDocumentDirection('ar')).not.toThrow();
    });
  });
});
