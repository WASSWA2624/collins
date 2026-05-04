/**
 * TextField Component Types
 * Defines input types, validation states, and constants
 * File: types.js
 */

/**
 * Input types
 * @type {Object}
 */
export const INPUT_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  PASSWORD: 'password',
  NUMBER: 'number',
  TEL: 'tel',
  URL: 'url',
  SEARCH: 'search',
  DATE: 'date',
  TIME: 'time',
  DATETIME_LOCAL: 'datetime-local',
};

/**
 * Validation states
 * @type {Object}
 */
export const VALIDATION_STATES = {
  DEFAULT: 'default',
  ERROR: 'error',
  SUCCESS: 'success',
  DISABLED: 'disabled',
};
