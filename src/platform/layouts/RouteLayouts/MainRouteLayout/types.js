/**
 * MainRouteLayout types and constants
 * File: types.js
 */

export const SIDEBAR_ICON_SIZE = 18;
export const SIDEBAR_COLLAPSED_WIDTH = SIDEBAR_ICON_SIZE + 8;
export const SIDEBAR_MIN_WIDTH = SIDEBAR_COLLAPSED_WIDTH;
export const SIDEBAR_MAX_WIDTH = 360;
export const SIDEBAR_DEFAULT_WIDTH = 260;

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
