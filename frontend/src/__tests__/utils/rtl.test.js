import { isRTL, applyDocumentDirection } from '@utils/rtl';

describe('utils/rtl', () => {
  describe('isRTL', () => {
    it('returns false for all locales because English is the only supported UI locale', () => {
      expect(isRTL('en')).toBe(false);
      expect(isRTL('ar')).toBe(false);
      expect(isRTL('fa')).toBe(false);
      expect(isRTL('fr')).toBe(false);
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
