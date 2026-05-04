/**
 * Training Route Group Folder Structure Tests
 * File: training-route-group.test.js
 */
import fs from 'fs';
import path from 'path';

describe('Step 7.8: Training Route Group Folder Structure', () => {
  const appDir = path.join(__dirname, '../../app');
  const trainingGroupDir = path.join(appDir, '(training)');

  test('should have training route group directory', () => {
    expect(fs.existsSync(trainingGroupDir)).toBe(true);
  });

  test('should follow route group naming convention', () => {
    const dirName = path.basename(trainingGroupDir);
    expect(dirName).toBe('(training)');
    expect(dirName.startsWith('(')).toBe(true);
    expect(dirName.endsWith(')')).toBe(true);
  });

  test('should be located in app directory', () => {
    expect(fs.existsSync(appDir)).toBe(true);
    expect(fs.existsSync(trainingGroupDir)).toBe(true);
    expect(fs.statSync(trainingGroupDir).isDirectory()).toBe(true);
  });

  test('should have layout file in training group', () => {
    const layoutFile = path.join(trainingGroupDir, '_layout.jsx');
    expect(fs.existsSync(layoutFile)).toBe(true);
  });
});

