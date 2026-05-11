/**
 * Locale keys validation.
 * English is the only supported UI locale.
 */
import fs from 'fs';
import path from 'path';
import en from '@i18n/locales/en.json';

const LOCALES_DIR = path.resolve(process.cwd(), 'src', 'i18n', 'locales');

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

describe('Locale keys validation', () => {
  const enKeys = new Set(flattenKeys(en));
  const enKeysArray = Array.from(enKeys).sort();

  it('en.json should have at least one key', () => {
    expect(enKeysArray.length).toBeGreaterThan(0);
  });

  it('should keep only en.json in the locale directory', () => {
    const localeFiles = fs.readdirSync(LOCALES_DIR).filter((file) => file.endsWith('.json')).sort();
    expect(localeFiles).toEqual(['en.json']);
  });
});
