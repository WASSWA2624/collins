/**
 * Stack Types & Constants
 * File: types.js
 */

const DIRECTIONS = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
};

const ALIGN = {
  START: 'flex-start',
  CENTER: 'center',
  END: 'flex-end',
  STRETCH: 'stretch',
  BASELINE: 'baseline',
};

const JUSTIFY = {
  START: 'flex-start',
  CENTER: 'center',
  END: 'flex-end',
  BETWEEN: 'space-between',
  AROUND: 'space-around',
  EVENLY: 'space-evenly',
};

const SPACING = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
  XXL: 'xxl',
};

const SPACING_KEYS = Object.values(SPACING);
const DIRECTION_KEYS = Object.values(DIRECTIONS);

export { ALIGN, DIRECTIONS, DIRECTION_KEYS, JUSTIFY, SPACING, SPACING_KEYS };


