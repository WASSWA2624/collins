/**
 * Image Component Types & Constants
 * File: types.js
 */

/**
 * Image resize modes
 * @type {Object}
 */
const RESIZE_MODE = {
  COVER: 'cover',
  CONTAIN: 'contain',
  STRETCH: 'stretch',
  REPEAT: 'repeat',
  CENTER: 'center',
};

const RESIZE_MODE_KEYS = Object.values(RESIZE_MODE);

export { RESIZE_MODE, RESIZE_MODE_KEYS };

