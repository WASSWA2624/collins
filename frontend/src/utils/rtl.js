/**
 * RTL (right-to-left) support per i18n.mdc and P013 13.4.4.
 * Locales that use RTL script: Arabic (ar), Persian/Farsi (fa).
 */

const RTL_LOCALES = new Set(['ar', 'fa']);

/**
 * Returns true if the given locale uses right-to-left layout.
 * @param {string} locale - Locale code (e.g. 'ar', 'fa', 'en')
 * @returns {boolean}
 */
export function isRTL(locale) {
  if (!locale || typeof locale !== 'string') return false;
  const base = locale.split('-')[0].toLowerCase();
  return RTL_LOCALES.has(base);
}

/**
 * Applies layout direction to the document (web).
 * Call when locale changes. Idempotent.
 * @param {string} locale - Current locale code
 */
export function applyDocumentDirection(locale) {
  if (typeof document === 'undefined' || !document.documentElement) return;
  const dir = isRTL(locale) ? 'rtl' : 'ltr';
  if (document.documentElement.getAttribute('dir') !== dir) {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', locale.split('-')[0]);
  }
}
