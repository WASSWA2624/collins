/**
 * Returns true if the given locale uses right-to-left layout.
 * English is the only supported UI locale.
 * @returns {boolean}
 */
export function isRTL() {
  return false;
}

/**
 * Applies layout direction to the document (web).
 * Call when locale changes. Idempotent.
 */
export function applyDocumentDirection() {
  if (typeof document === 'undefined' || !document.documentElement) return;
  if (document.documentElement.getAttribute('dir') !== 'ltr') {
    document.documentElement.setAttribute('dir', 'ltr');
  }
  if (document.documentElement.getAttribute('lang') !== 'en') {
    document.documentElement.setAttribute('lang', 'en');
  }
}
