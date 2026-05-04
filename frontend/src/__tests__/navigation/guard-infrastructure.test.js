/**
 * Guard Infrastructure Folder Structure Tests
 * File: guard-infrastructure.test.js
 * 
 * Tests for Step 7.11: Create guard infrastructure folder
 * Per testing.mdc: Tests verify folder structure exists
 * Per project-structure.mdc: Navigation guards in src/navigation/guards/
 * Per coding-conventions.mdc: Barrel exports via index.js
 */
import fs from 'fs';
import path from 'path';
import * as guards from '@navigation/guards';

describe('Step 7.11: Guard Infrastructure Folder Structure', () => {
  const navigationDir = path.join(__dirname, '../../navigation');
  const guardsDir = path.join(navigationDir, 'guards');
  const indexFile = path.join(guardsDir, 'index.js');

  test('should have guards directory', () => {
    // Per Step 7.11: Create src/navigation/guards/ directory per project-structure.mdc
    expect(fs.existsSync(guardsDir)).toBe(true);
  });

  test('should have barrel export file', () => {
    // Per Step 7.11: Create src/navigation/guards/index.js barrel export file per coding-conventions.mdc
    expect(fs.existsSync(indexFile)).toBe(true);
  });

  test('should be located in navigation directory', () => {
    // Verify the directory is in the correct location
    expect(fs.existsSync(navigationDir)).toBe(true);
    expect(fs.existsSync(guardsDir)).toBe(true);
    
    // Verify it's a directory, not a file
    const stats = fs.statSync(guardsDir);
    expect(stats.isDirectory()).toBe(true);
  });

  test('should have index.js as a file', () => {
    // Verify index.js is a file, not a directory
    const stats = fs.statSync(indexFile);
    expect(stats.isFile()).toBe(true);
  });

  test('should allow guard files to exist in guards directory', () => {
    // Per Step 7.12: Auth guard should exist in guards/auth.guard.js
    // Per Step 7.13: Role guard should exist in guards/role.guard.js
    const authGuardFile = path.join(guardsDir, 'auth.guard.js');
    const roleGuardFile = path.join(guardsDir, 'role.guard.js');
    
    // These files may or may not exist at Step 7.11, but the directory should allow them
    expect(fs.existsSync(guardsDir)).toBe(true);
    
    // If files exist, verify they are files
    if (fs.existsSync(authGuardFile)) {
      const stats = fs.statSync(authGuardFile);
      expect(stats.isFile()).toBe(true);
    }
    
    if (fs.existsSync(roleGuardFile)) {
      const stats = fs.statSync(roleGuardFile);
      expect(stats.isFile()).toBe(true);
    }
  });

  test('should export guards from barrel export file', () => {
    // Per coding-conventions.mdc: Barrel exports via index.js
    // Verify that the barrel can be imported via the alias (ESM-only; no CommonJS require)
    expect(guards).toBeDefined();
    expect(typeof guards).toBe('object');
  });
});

