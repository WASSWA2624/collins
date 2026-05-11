/**
 * LanguageControls Types
 */
const SUPPORTED_LOCALE_CODES = ['en'];

const LOCALE_LABEL_KEYS = Object.fromEntries(
  SUPPORTED_LOCALE_CODES.map((code) => [code, `settings.language.options.${code}`])
);

const DEFAULT_LOCALE_FLAG_COUNTRY_CODE = 'WORLD';

const LOCALE_FLAG_COUNTRY_CODES = {
  en: 'GB',
};

const LOCALE_VALUES = SUPPORTED_LOCALE_CODES;
const LOCALE_STORAGE_KEY = 'user_locale';

export {
  DEFAULT_LOCALE_FLAG_COUNTRY_CODE,
  LOCALE_FLAG_COUNTRY_CODES,
  LOCALE_LABEL_KEYS,
  LOCALE_VALUES,
  LOCALE_STORAGE_KEY,
};
