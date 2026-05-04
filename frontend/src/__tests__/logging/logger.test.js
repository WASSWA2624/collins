/**
 * Logger Implementation Tests
 * File: logger.test.js
 */
import { logger } from '@logging/logger';
import { DEBUG, INFO, WARN, ERROR, FATAL } from '@logging/levels';

describe('logging/logger.js', () => {
  let originalConsole;
  let consoleLogs;

  beforeEach(() => {
    consoleLogs = [];
    originalConsole = global.console;
    global.console = {
      debug: jest.fn((...args) => consoleLogs.push({ level: 'debug', args })),
      info: jest.fn((...args) => consoleLogs.push({ level: 'info', args })),
      warn: jest.fn((...args) => consoleLogs.push({ level: 'warn', args })),
      error: jest.fn((...args) => consoleLogs.push({ level: 'error', args })),
      log: jest.fn((...args) => consoleLogs.push({ level: 'log', args })),
    };
  });

  afterEach(() => {
    global.console = originalConsole;
  });

  test('should have all logger methods', () => {
    expect(typeof logger.debug).toBe('function');
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.fatal).toBe('function');
  });

  test('should log debug messages', () => {
    logger.debug('Test debug message', { data: 'test' });
    expect(global.console.debug).toHaveBeenCalled();
  });

  test('should log info messages', () => {
    logger.info('Test info message', { data: 'test' });
    expect(global.console.info).toHaveBeenCalled();
  });

  test('should log warn messages', () => {
    logger.warn('Test warn message', { data: 'test' });
    expect(global.console.warn).toHaveBeenCalled();
  });

  test('should log error messages', () => {
    logger.error('Test error message', { data: 'test' });
    expect(global.console.error).toHaveBeenCalled();
  });

  test('should log fatal messages as error', () => {
    logger.fatal('Test fatal message', { data: 'test' });
    expect(global.console.error).toHaveBeenCalled();
  });

  test('should include timestamp in log entry', () => {
    logger.info('Test message');
    const call = consoleLogs.find((log) => log.level === 'info');
    expect(call).toBeDefined();
    const logEntry = JSON.parse(call.args[0]);
    expect(logEntry).toHaveProperty('timestamp');
    expect(logEntry.timestamp).toBeTruthy();
  });

  test('should include level in log entry', () => {
    logger.info('Test message');
    const call = consoleLogs.find((log) => log.level === 'info');
    const logEntry = JSON.parse(call.args[0]);
    expect(logEntry.level).toBe('info');
  });

  test('should include message in log entry', () => {
    logger.info('Test message');
    const call = consoleLogs.find((log) => log.level === 'info');
    const logEntry = JSON.parse(call.args[0]);
    expect(logEntry.message).toBe('Test message');
  });

  test('should include data in log entry', () => {
    logger.info('Test message', { key: 'value' });
    const call = consoleLogs.find((log) => log.level === 'info');
    const logEntry = JSON.parse(call.args[0]);
    expect(logEntry.key).toBe('value');
  });

  test('should filter DEBUG logs in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    jest.resetModules();

    // Re-import logger with production env
    const { logger: prodLogger } = require('@logging/logger');
    prodLogger.debug('Test debug message');
    expect(global.console.debug).not.toHaveBeenCalled();

    process.env.NODE_ENV = originalEnv;
    jest.resetModules();
  });
});

