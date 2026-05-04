/**
 * Animation Tokens Tests
 * File: animations.test.js
 * Step 3.10
 */

const getCjsOrEsmDefault = (mod) => mod?.default ?? mod;

describe('Animation Tokens (Step 3.10)', () => {
  it('should export all animation tokens', () => {
    const animations = getCjsOrEsmDefault(require('@theme/animations'));

    expect(animations).toEqual(expect.any(Object));
  });

  it('should have animation duration values (max 300ms)', () => {
    const animations = getCjsOrEsmDefault(require('@theme/animations'));

    expect(animations.duration).toEqual(
      expect.objectContaining({
        fast: expect.any(Number),
        normal: expect.any(Number),
        slow: expect.any(Number),
      })
    );

    // Verify max duration is 300ms
    expect(animations.duration.fast).toBeLessThanOrEqual(300);
    expect(animations.duration.normal).toBeLessThanOrEqual(300);
    expect(animations.duration.slow).toBeLessThanOrEqual(300);
    expect(animations.duration.slow).toBe(300);
  });

  it('should have easing functions', () => {
    const animations = getCjsOrEsmDefault(require('@theme/animations'));

    expect(animations.easing).toEqual(
      expect.objectContaining({
        easeIn: expect.any(String),
        easeOut: expect.any(String),
        easeInOut: expect.any(String),
      })
    );

    // Verify easing functions are valid cubic-bezier strings
    expect(animations.easing.easeIn).toMatch(/cubic-bezier/);
    expect(animations.easing.easeOut).toMatch(/cubic-bezier/);
    expect(animations.easing.easeInOut).toMatch(/cubic-bezier/);
  });
});

