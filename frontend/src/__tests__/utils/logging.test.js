/**
 * Logging Tests
 * File: logging.test.js
 */
import { logger, levels } from '@logging';

describe('Logging Layer', () => {
  let originalConsole;
  let consoleLogs;

  beforeEach(() => {
    consoleLogs = [];
    originalConsole = {
      debug: console.debug,
      info: console.info,
      warn: console.warn,
      error: console.error,
    };

    console.debug = jest.fn((...args) => consoleLogs.push({ level: 'debug', args }));
    console.info = jest.fn((...args) => consoleLogs.push({ level: 'info', args }));
    console.warn = jest.fn((...args) => consoleLogs.push({ level: 'warn', args }));
    console.error = jest.fn((...args) => consoleLogs.push({ level: 'error', args }));
  });

  afterEach(() => {
    console.debug = originalConsole.debug;
    console.info = originalConsole.info;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
    consoleLogs = [];
  });

  describe('Log Levels', () => {
    it('should export all required log levels', () => {
      expect(levels.DEBUG).toBe('debug');
      expect(levels.INFO).toBe('info');
      expect(levels.WARN).toBe('warn');
      expect(levels.ERROR).toBe('error');
      expect(levels.FATAL).toBe('fatal');
    });
  });

  describe('Logger', () => {
    it('should log debug messages', () => {
      logger.debug('Test debug message', { key: 'value' });
      expect(console.debug).toHaveBeenCalled();
      const logCall = consoleLogs.find(log => log.level === 'debug');
      expect(logCall).toBeDefined();
      const logEntry = JSON.parse(logCall.args[0]);
      expect(logEntry.message).toBe('Test debug message');
      expect(logEntry.key).toBe('value');
      expect(logEntry.level).toBe('debug');
      expect(logEntry.timestamp).toBeDefined();
    });

    it('should log info messages', () => {
      logger.info('Test info message');
      expect(console.info).toHaveBeenCalled();
      const logCall = consoleLogs.find(log => log.level === 'info');
      expect(logCall).toBeDefined();
      const logEntry = JSON.parse(logCall.args[0]);
      expect(logEntry.message).toBe('Test info message');
      expect(logEntry.level).toBe('info');
    });

    it('should log warn messages', () => {
      logger.warn('Test warn message', { warning: true });
      expect(console.warn).toHaveBeenCalled();
      const logCall = consoleLogs.find(log => log.level === 'warn');
      expect(logCall).toBeDefined();
      const logEntry = JSON.parse(logCall.args[0]);
      expect(logEntry.message).toBe('Test warn message');
      expect(logEntry.warning).toBe(true);
      expect(logEntry.level).toBe('warn');
    });

    it('should log error messages', () => {
      logger.error('Test error message', { code: 'TEST_ERROR' });
      expect(console.error).toHaveBeenCalled();
      const logCall = consoleLogs.find(log => log.level === 'error');
      expect(logCall).toBeDefined();
      const logEntry = JSON.parse(logCall.args[0]);
      expect(logEntry.message).toBe('Test error message');
      expect(logEntry.code).toBe('TEST_ERROR');
      expect(logEntry.level).toBe('error');
    });

    it('should log fatal messages as error', () => {
      logger.fatal('Test fatal message', { critical: true });
      expect(console.error).toHaveBeenCalled();
      const logCall = consoleLogs.find(log => log.level === 'error');
      expect(logCall).toBeDefined();
      const logEntry = JSON.parse(logCall.args[0]);
      expect(logEntry.message).toBe('Test fatal message');
      expect(logEntry.critical).toBe(true);
      expect(logEntry.level).toBe('fatal');
    });

    it('should include timestamp in log entries', () => {
      logger.info('Test message');
      const logCall = consoleLogs.find(log => log.level === 'info');
      const logEntry = JSON.parse(logCall.args[0]);
      expect(logEntry.timestamp).toBeDefined();
      expect(new Date(logEntry.timestamp).getTime()).toBeTruthy();
    });

    it('should handle empty data object', () => {
      logger.info('Test message');
      const logCall = consoleLogs.find(log => log.level === 'info');
      const logEntry = JSON.parse(logCall.args[0]);
      expect(logEntry.message).toBe('Test message');
      expect(logEntry.level).toBe('info');
      expect(logEntry.timestamp).toBeDefined();
    });
  });
});

