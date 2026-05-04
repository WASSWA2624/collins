/**
 * Main Route Group Folder Structure Tests
 * File: main-route-group.test.js
 * 
 * Tests for Step 7.8: Create main route group folder
 * Per testing.mdc: Tests mirror source structure
 * Per app-router.mdc: Route groups use `(group-name)` syntax
 */
import fs from 'fs';
import path from 'path';

describe('Step 7.8: Main Route Group Folder Structure', () => {
  const appDir = path.join(__dirname, '../../app');
  const mainGroupDir = path.join(appDir, '(main)');

  test('should have main route group directory', () => {
    // Per Step 7.8: Create src/app/(main)/ directory per app-router.mdc
    expect(fs.existsSync(mainGroupDir)).toBe(true);
  });

  test('should follow route group naming convention', () => {
    // Per app-router.mdc: Route groups use (group-name) syntax
    const dirName = path.basename(mainGroupDir);
    expect(dirName).toBe('(main)');
    expect(dirName.startsWith('(')).toBe(true);
    expect(dirName.endsWith(')')).toBe(true);
  });

  test('should be located in app directory', () => {
    // Verify the directory is in the correct location
    expect(fs.existsSync(appDir)).toBe(true);
    expect(fs.existsSync(mainGroupDir)).toBe(true);
    
    // Verify it's a directory, not a file
    const stats = fs.statSync(mainGroupDir);
    expect(stats.isDirectory()).toBe(true);
  });

  test('should allow layout file to exist in main group', () => {
    // Per Step 7.10: Main group layout should exist in (main)/_layout.jsx
    const layoutFile = path.join(mainGroupDir, '_layout.jsx');
    expect(fs.existsSync(layoutFile)).toBe(true);
  });
});

