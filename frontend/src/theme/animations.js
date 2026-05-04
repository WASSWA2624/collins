/**
 * Animation Tokens
 * Per write-up: Smooth, purposeful transitions (max 300ms)
 * File: animations.js
 */

export default {
  duration: {
    fast: 150,
    normal: 200,
    slow: 300,
  },
  easing: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

