/**
 * Formatting Utilities
 * Pure functions for data formatting
 * File: formatter.js
 */

/**
 * Formats a date into a locale string.
 * Note: defaults to UTC for deterministic output across environments.
 * @param {Date|string|number} date
 * @param {string} [locale='en-US']
 * @param {Object} [options]
 * @param {string} [options.timeZone='UTC']
 * @returns {string}
 */
const formatDate = (date, locale = 'en-US', options = {}) => {
  if (!date) return '';

  const timeZone = options.timeZone || 'UTC';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';

  return new Intl.DateTimeFormat(locale, { timeZone }).format(parsed);
};

const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  if (typeof amount !== 'number') return '';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

const formatNumber = (number, locale = 'en-US') => {
  if (typeof number !== 'number') return '';
  return new Intl.NumberFormat(locale).format(number);
};

export { formatDate, formatCurrency, formatNumber };

