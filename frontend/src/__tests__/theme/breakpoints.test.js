/**
 * Responsive Breakpoints Tests
 * File: breakpoints.test.js
 * Step 3.9
 */

const getCjsOrEsmDefault = (mod) => mod?.default ?? mod;

describe('Responsive Breakpoints (Step 3.9)', () => {
  it('should export all breakpoints', () => {
    const breakpoints = getCjsOrEsmDefault(require('@theme/breakpoints'));

    expect(breakpoints).toEqual(expect.any(Object));
  });

  it('should have breakpoint values match requirements (320px, 768px, 1024px, 1440px)', () => {
    const breakpoints = getCjsOrEsmDefault(require('@theme/breakpoints'));

    expect(breakpoints.mobile).toBe(320);
    expect(breakpoints.tablet).toBe(768);
    expect(breakpoints.desktop).toBe(1024);
    expect(breakpoints.large).toBe(1440);
  });

  it('should have breakpoints in ascending order', () => {
    const breakpoints = getCjsOrEsmDefault(require('@theme/breakpoints'));

    expect(breakpoints.mobile).toBeLessThan(breakpoints.tablet);
    expect(breakpoints.tablet).toBeLessThan(breakpoints.desktop);
    expect(breakpoints.desktop).toBeLessThan(breakpoints.large);
  });
});

