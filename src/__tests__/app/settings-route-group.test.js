/**
 * Settings Route Group Folder Structure Tests
 * File: settings-route-group.test.js
 */
import fs from 'fs';
import path from 'path';

describe('Step 7.9: Settings Route Group Folder Structure', () => {
  const appDir = path.join(__dirname, '../../app');
  const settingsGroupDir = path.join(appDir, '(settings)');

  test('should have settings route group directory', () => {
    expect(fs.existsSync(settingsGroupDir)).toBe(true);
  });

  test('should follow route group naming convention', () => {
    const dirName = path.basename(settingsGroupDir);
    expect(dirName).toBe('(settings)');
    expect(dirName.startsWith('(')).toBe(true);
    expect(dirName.endsWith(')')).toBe(true);
  });

  test('should be located in app directory', () => {
    expect(fs.existsSync(appDir)).toBe(true);
    expect(fs.existsSync(settingsGroupDir)).toBe(true);
    expect(fs.statSync(settingsGroupDir).isDirectory()).toBe(true);
  });

  test('should have layout file in settings group', () => {
    const layoutFile = path.join(settingsGroupDir, '_layout.jsx');
    expect(fs.existsSync(layoutFile)).toBe(true);
  });
});

