/**
 * Log Levels Tests
 * File: levels.test.js
 */
import { DEBUG, INFO, WARN, ERROR, FATAL, levels } from '@logging/levels';

describe('logging/levels.js', () => {
  test('should export all log levels', () => {
    expect(DEBUG).toBe('debug');
    expect(INFO).toBe('info');
    expect(WARN).toBe('warn');
    expect(ERROR).toBe('error');
    expect(FATAL).toBe('fatal');
  });

  test('should export levels namespace', () => {
    expect(levels).toBeDefined();
    expect(levels.DEBUG).toBe('debug');
    expect(levels.INFO).toBe('info');
    expect(levels.WARN).toBe('warn');
    expect(levels.ERROR).toBe('error');
    expect(levels.FATAL).toBe('fatal');
  });

  test('should have correct log level values', () => {
    expect(typeof DEBUG).toBe('string');
    expect(typeof INFO).toBe('string');
    expect(typeof WARN).toBe('string');
    expect(typeof ERROR).toBe('string');
    expect(typeof FATAL).toBe('string');
  });
});

