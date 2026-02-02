/**
 * Locale Keys Validation (P013 13.4.3)
 * Ensures every locale file has the same keys as en.json.
 * Per i18n.mdc: Every translation key must exist in every locale file.
 */
import path from 'path';
import en from '@i18n/locales/en.json';

const SUPPORTED_LOCALES = [
  'ar', 'de', 'es', 'fa', 'fr', 'hi', 'id', 'it', 'ja', 'ko', 'ms', 'nl',
  'pl', 'pt', 'ru', 'sw', 'ta', 'th', 'tr', 'uk', 'vi', 'zh',
];

function loadLocale(localeCode) {
  const fullPath = path.resolve(process.cwd(), 'src', 'i18n', 'locales', `${localeCode}.json`);
  return require(fullPath);
}

/**
 * Flatten nested object to dot-notation keys (leaf values only).
 * @param {object} obj
 * @param {string} prefix
 * @returns {string[]}
 */
function flattenKeys(obj, prefix = '') {
  if (obj === null || typeof obj !== 'object') return prefix ? [prefix] : [];
  return Object.keys(obj).reduce((acc, key) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const val = obj[key];
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      return acc.concat(flattenKeys(val, fullKey));
    }
    acc.push(fullKey);
    return acc;
  }, []);
}

describe('Locale keys validation (P013 13.4.3)', () => {
  const enKeys = new Set(flattenKeys(en));
  const enKeysArray = Array.from(enKeys).sort();

  it('en.json should have at least one key', () => {
    expect(enKeysArray.length).toBeGreaterThan(0);
  });

  SUPPORTED_LOCALES.forEach((localeCode) => {
    describe(`locale: ${localeCode}.json`, () => {
      let localeModule;
      beforeAll(() => {
        localeModule = loadLocale(localeCode);
      });

      it(`should have all keys present in en.json`, () => {
        const localeKeys = new Set(flattenKeys(localeModule));
        const missing = enKeysArray.filter((k) => !localeKeys.has(k));
        expect(missing).toEqual([]);
      });

      it(`should not have extra top-level keys beyond en`, () => {
        const localeKeys = new Set(flattenKeys(localeModule));
        const extra = Array.from(localeKeys).filter((k) => !enKeys.has(k));
        expect(extra).toEqual([]);
      });
    });
  });
});
