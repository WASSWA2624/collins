/**
 * LanguageControls Types
 * File: types.js
 * Per P013: 22 locales + en; labels resolved via settings.language.options.<code>
 */
const SUPPORTED_LOCALE_CODES = [
  'en', 'ar', 'de', 'es', 'fa', 'fr', 'hi', 'id', 'it', 'ja', 'ko', 'ms',
  'nl', 'pl', 'pt', 'ru', 'sw', 'ta', 'th', 'tr', 'uk', 'vi', 'zh',
];

const LOCALE_LABEL_KEYS = Object.fromEntries(
  SUPPORTED_LOCALE_CODES.map((code) => [code, `settings.language.options.${code}`])
);

const LOCALE_VALUES = SUPPORTED_LOCALE_CODES;
const LOCALE_STORAGE_KEY = 'user_locale';

export { LOCALE_LABEL_KEYS, LOCALE_VALUES, LOCALE_STORAGE_KEY };
