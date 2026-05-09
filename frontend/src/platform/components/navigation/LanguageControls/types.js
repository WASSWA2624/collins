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

const DEFAULT_LOCALE_FLAG_COUNTRY_CODE = 'WORLD';

const LOCALE_FLAG_COUNTRY_CODES = {
  en: 'GB',
  ar: 'SA',
  de: 'DE',
  es: 'ES',
  fa: 'IR',
  fr: 'FR',
  hi: 'IN',
  id: 'ID',
  it: 'IT',
  ja: 'JP',
  ko: 'KR',
  ms: 'MY',
  nl: 'NL',
  pl: 'PL',
  pt: 'PT',
  ru: 'RU',
  sw: 'TZ',
  ta: 'IN',
  th: 'TH',
  tr: 'TR',
  uk: 'UA',
  vi: 'VN',
  zh: 'CN',
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
