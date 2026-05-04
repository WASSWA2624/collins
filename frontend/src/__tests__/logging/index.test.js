/**
 * Logging Barrel Export Tests
 * File: index.test.js
 */
import { logger, DEBUG, INFO, WARN, ERROR, FATAL } from '@logging';

describe('logging/index.js (barrel export)', () => {
  test('should export logger', () => {
    expect(logger).toBeDefined();
    expect(typeof logger.debug).toBe('function');
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.fatal).toBe('function');
  });

  test('should export all log levels', () => {
    expect(DEBUG).toBe('debug');
    expect(INFO).toBe('info');
    expect(WARN).toBe('warn');
    expect(ERROR).toBe('error');
    expect(FATAL).toBe('fatal');
  });

  test('should have correct barrel export structure', () => {
    const expectedExports = ['logger', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'];
    expectedExports.forEach((exportName) => {
      expect({ logger, DEBUG, INFO, WARN, ERROR, FATAL }).toHaveProperty(exportName);
    });
  });
});

