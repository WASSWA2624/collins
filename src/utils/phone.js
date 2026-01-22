/**
 * Phone helpers
 * File: phone.js
 */
const normalizePhoneNumber = (value) => String(value || '').replace(/\D/g, '');

export { normalizePhoneNumber };
