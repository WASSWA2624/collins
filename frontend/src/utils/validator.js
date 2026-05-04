/**
 * Validation Utilities
 * Pure validation functions
 * File: validator.js
 */

const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const value = email.trim();
  if (!value) return false;
  if (value.includes('..')) return false;

  // Intentionally simple and deterministic; avoids false-positives like "@example.com"
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const isValidUuid = (value) => {
  if (!value || typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(trimmed);
};

export { isValidEmail, isValidUrl, isValidUuid };

