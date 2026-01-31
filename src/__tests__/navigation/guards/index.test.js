/**
 * Guard Infrastructure Tests (Step 7.11)
 * 
 * Verifies:
 * - Folder structure exists (src/navigation/guards/)
 * - Barrel export file exists (src/navigation/guards/index.js)
 * - Barrel export correctly exports all guards
 * 
 * Rule References:
 * - project-structure.mdc (navigation guards in src/navigation/guards/)
 * - coding-conventions.mdc (barrel exports via index.js)
 */

import fs from 'fs';
import path from 'path';
import {
  useAcknowledgementGuard,
  useSessionGuard,
} from '@navigation/guards';

describe('Step 7.11: Guard Infrastructure', () => {
  const guardsDir = path.join(__dirname, '../../../navigation/guards');
  const barrelFile = path.join(guardsDir, 'index.js');

  describe('Folder Structure', () => {
    it('should have guards directory at src/navigation/guards/', () => {
      expect(fs.existsSync(guardsDir)).toBe(true);
      expect(fs.statSync(guardsDir).isDirectory()).toBe(true);
    });

    it('should have barrel export file at src/navigation/guards/index.js', () => {
      expect(fs.existsSync(barrelFile)).toBe(true);
      expect(fs.statSync(barrelFile).isFile()).toBe(true);
    });
  });

  describe('Barrel Export', () => {
    it('should export useAcknowledgementGuard hook', () => {
      expect(typeof useAcknowledgementGuard).toBe('function');
    });

    it('should export useSessionGuard hook', () => {
      expect(typeof useSessionGuard).toBe('function');
    });

    it('should allow importing from @navigation/guards alias', () => {
      // Verify that the alias resolves correctly
      // This test verifies the imports at the top of the file work correctly
      // The imports are already tested above, this confirms alias resolution
      expect(useAcknowledgementGuard).toBeDefined();
      expect(useSessionGuard).toBeDefined();
    });
  });
});

