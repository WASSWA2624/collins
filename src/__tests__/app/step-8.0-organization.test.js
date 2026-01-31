/**
 * Step 8.0 Organization Tests
 * Verifies app folder structure organization per Step 8.0 requirements
 * File: step-8.0-organization.test.js
 * 
 * Per P008_minimal-app.md Step 8.0: Organize App Folder Structure (Prerequisite)
 */

import fs from 'fs';
import path from 'path';

describe('Step 8.0: App Folder Organization', () => {
  const srcPath = path.join(process.cwd(), 'src');
  const appPath = path.join(srcPath, 'app');
  const platformLayoutsPath = path.join(srcPath, 'platform', 'layouts');
  const platformCommonPath = path.join(platformLayoutsPath, 'common');
  const platformRouteLayoutsPath = path.join(platformLayoutsPath, 'RouteLayouts');

  describe('Layout Helpers Organization', () => {
    it('should have ThemeProviderWrapper in platform/layouts/common/', () => {
      const themeProviderPath = path.join(platformCommonPath, 'ThemeProviderWrapper');
      expect(fs.existsSync(themeProviderPath)).toBe(true);
      
      const indexFile = path.join(themeProviderPath, 'index.js');
      const androidFile = path.join(themeProviderPath, 'ThemeProviderWrapper.android.jsx');
      const iosFile = path.join(themeProviderPath, 'ThemeProviderWrapper.ios.jsx');
      const webFile = path.join(themeProviderPath, 'ThemeProviderWrapper.web.jsx');
      
      expect(fs.existsSync(indexFile)).toBe(true);
      expect(fs.existsSync(androidFile)).toBe(true);
      expect(fs.existsSync(iosFile)).toBe(true);
      expect(fs.existsSync(webFile)).toBe(true);
    });

    it('should NOT have ThemeProviderWrapper in app/', () => {
      const appThemeProviderPath = path.join(appPath, 'ThemeProviderWrapper');
      expect(fs.existsSync(appThemeProviderPath)).toBe(false);
    });

    it('should import ThemeProviderWrapper from platform in root layout', () => {
      const rootLayoutPath = path.join(appPath, '_layout.jsx');
      const rootLayoutContent = fs.readFileSync(rootLayoutPath, 'utf8');
      
      expect(rootLayoutContent).toMatch(/@platform\/layouts\/common\/ThemeProviderWrapper/);
      expect(rootLayoutContent).not.toMatch(/\.\/ThemeProviderWrapper/);
      expect(rootLayoutContent).not.toMatch(/\.\.\/ThemeProviderWrapper/);
    });
  });

  describe('Layout Styles Organization', () => {
    it('should have RootLayoutStyles in platform/layouts/common/', () => {
      const rootLayoutStylesPath = path.join(platformCommonPath, 'RootLayoutStyles');
      expect(fs.existsSync(rootLayoutStylesPath)).toBe(true);
    });

    it('should have platform-specific style files for RootLayoutStyles', () => {
      const rootLayoutStylesPath = path.join(platformCommonPath, 'RootLayoutStyles');
      
      const androidStyles = path.join(rootLayoutStylesPath, 'RootLayoutStyles.android.styles.jsx');
      const iosStyles = path.join(rootLayoutStylesPath, 'RootLayoutStyles.ios.styles.jsx');
      const webStyles = path.join(rootLayoutStylesPath, 'RootLayoutStyles.web.styles.jsx');
      const indexFile = path.join(rootLayoutStylesPath, 'index.js');
      
      expect(fs.existsSync(androidStyles)).toBe(true);
      expect(fs.existsSync(iosStyles)).toBe(true);
      expect(fs.existsSync(webStyles)).toBe(true);
      expect(fs.existsSync(indexFile)).toBe(true);
    });

    it('should NOT have RootLayoutStyles in app/', () => {
      const appRootLayoutStylesPath = path.join(appPath, 'RootLayoutStyles');
      expect(fs.existsSync(appRootLayoutStylesPath)).toBe(false);
    });

    it('should use correct styled-components entrypoints in RootLayoutStyles', () => {
      const rootLayoutStylesPath = path.join(platformCommonPath, 'RootLayoutStyles');
      
      const androidStyles = fs.readFileSync(
        path.join(rootLayoutStylesPath, 'RootLayoutStyles.android.styles.jsx'),
        'utf8'
      );
      const iosStyles = fs.readFileSync(
        path.join(rootLayoutStylesPath, 'RootLayoutStyles.ios.styles.jsx'),
        'utf8'
      );
      const webStyles = fs.readFileSync(
        path.join(rootLayoutStylesPath, 'RootLayoutStyles.web.styles.jsx'),
        'utf8'
      );
      
      // Android and iOS should use styled-components/native
      expect(androidStyles).toMatch(/from ['"]styled-components\/native['"]/);
      expect(iosStyles).toMatch(/from ['"]styled-components\/native['"]/);
      
      // Web should use styled-components (not /native)
      expect(webStyles).toMatch(/from ['"]styled-components['"]/);
      expect(webStyles).not.toMatch(/from ['"]styled-components\/native['"]/);
    });

    it('should NOT have default exports in RootLayoutStyles style files', () => {
      const rootLayoutStylesPath = path.join(platformCommonPath, 'RootLayoutStyles');
      
      const androidStyles = fs.readFileSync(
        path.join(rootLayoutStylesPath, 'RootLayoutStyles.android.styles.jsx'),
        'utf8'
      );
      const iosStyles = fs.readFileSync(
        path.join(rootLayoutStylesPath, 'RootLayoutStyles.ios.styles.jsx'),
        'utf8'
      );
      const webStyles = fs.readFileSync(
        path.join(rootLayoutStylesPath, 'RootLayoutStyles.web.styles.jsx'),
        'utf8'
      );
      
      // Check for default export patterns (should only have named exports)
      expect(androidStyles).not.toMatch(/export default/);
      expect(iosStyles).not.toMatch(/export default/);
      expect(webStyles).not.toMatch(/export default/);
    });

    it('should import RootLayoutStyles from platform in root layout', () => {
      const rootLayoutPath = path.join(appPath, '_layout.jsx');
      const rootLayoutContent = fs.readFileSync(rootLayoutPath, 'utf8');
      
      expect(rootLayoutContent).toMatch(/@platform\/layouts\/common\/RootLayoutStyles/);
      expect(rootLayoutContent).not.toMatch(/\.\/RootLayoutStyles/);
      expect(rootLayoutContent).not.toMatch(/\.\.\/RootLayoutStyles/);
    });
  });

  describe('Route File Organization', () => {
    it('should have lightweight route files', () => {
      const routeFiles = ['index.jsx', '+not-found.jsx', '_error.jsx'];
      
      routeFiles.forEach((file) => {
        const filePath = path.join(appPath, file);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          // Route files should be minimal - check they're not excessively long
          // This is a basic check - actual logic delegation is tested in component tests
          expect(content.length).toBeLessThan(2000); // Reasonable limit for lightweight files
        }
      });
    });

    it('should have route files that are lightweight and delegate', () => {
      const indexPath = path.join(appPath, 'index.jsx');
      if (fs.existsSync(indexPath)) {
        const content = fs.readFileSync(indexPath, 'utf8');
        // Root index should either render a platform screen or redirect into a route group.
        const usesPlatform = /@platform\//.test(content);
        const usesRedirect = /Redirect/.test(content);
        expect(usesPlatform || usesRedirect).toBe(true);
      }
    });
  });

  describe('Route Group Layouts Organization', () => {
    it('should have route groups with parentheses', () => {
      const mainGroupPath = path.join(appPath, '(main)');
      const trainingGroupPath = path.join(appPath, '(training)');
      const settingsGroupPath = path.join(appPath, '(settings)');
      
      expect(fs.existsSync(mainGroupPath)).toBe(true);
      expect(fs.existsSync(trainingGroupPath)).toBe(true);
      expect(fs.existsSync(settingsGroupPath)).toBe(true);
    });

    it('should have single _layout.jsx file per route group', () => {
      const mainLayoutPath = path.join(appPath, '(main)', '_layout.jsx');
      const trainingLayoutPath = path.join(appPath, '(training)', '_layout.jsx');
      const settingsLayoutPath = path.join(appPath, '(settings)', '_layout.jsx');
      
      expect(fs.existsSync(mainLayoutPath)).toBe(true);
      expect(fs.existsSync(trainingLayoutPath)).toBe(true);
      expect(fs.existsSync(settingsLayoutPath)).toBe(true);
      
      // Should NOT have platform-specific layout files in app/
      const mainLayoutAndroid = path.join(appPath, '(main)', '_layout.android.jsx');
      const mainLayoutIos = path.join(appPath, '(main)', '_layout.ios.jsx');
      const mainLayoutWeb = path.join(appPath, '(main)', '_layout.web.jsx');
      
      expect(fs.existsSync(mainLayoutAndroid)).toBe(false);
      expect(fs.existsSync(mainLayoutIos)).toBe(false);
      expect(fs.existsSync(mainLayoutWeb)).toBe(false);
    });

    it('should have main route layout importing from platform', () => {
      const mainLayoutPath = path.join(appPath, '(main)', '_layout.jsx');
      const mainLayoutContent = fs.readFileSync(mainLayoutPath, 'utf8');
      
      expect(mainLayoutContent).toMatch(/@platform\/layouts/);
      // Should be a minimal wrapper - re-exporting platform component
      // Check that it's re-exporting (not implementing logic directly)
      expect(mainLayoutContent).toMatch(/export default/);
      // Should not have complex logic like useEffect, useState, etc.
      expect(mainLayoutContent).not.toMatch(/useEffect/);
      expect(mainLayoutContent).not.toMatch(/useState/);
    });

    it('should have layout logic in platform/layouts/RouteLayouts/', () => {
      const mainRouteLayoutPath = path.join(platformRouteLayoutsPath, 'MainRouteLayout');
      expect(fs.existsSync(mainRouteLayoutPath)).toBe(true);
      
      const mainRouteLayoutAndroid = path.join(mainRouteLayoutPath, 'MainRouteLayout.android.jsx');
      const mainRouteLayoutIos = path.join(mainRouteLayoutPath, 'MainRouteLayout.ios.jsx');
      const mainRouteLayoutWeb = path.join(mainRouteLayoutPath, 'MainRouteLayout.web.jsx');
      
      expect(fs.existsSync(mainRouteLayoutAndroid)).toBe(true);
      expect(fs.existsSync(mainRouteLayoutIos)).toBe(true);
      expect(fs.existsSync(mainRouteLayoutWeb)).toBe(true);
    });
  });

  describe('Platform Layouts Barrel Export', () => {
    it('should export ThemeProviderWrapper from platform layouts barrel', () => {
      const layoutsIndexPath = path.join(platformLayoutsPath, 'index.js');
      const layoutsIndexContent = fs.readFileSync(layoutsIndexPath, 'utf8');
      
      expect(layoutsIndexContent).toMatch(/ThemeProviderWrapper/);
      expect(layoutsIndexContent).toMatch(/common\/ThemeProviderWrapper/);
    });

    it('should export RootLayoutStyles from platform layouts barrel', () => {
      const layoutsIndexPath = path.join(platformLayoutsPath, 'index.js');
      const layoutsIndexContent = fs.readFileSync(layoutsIndexPath, 'utf8');
      
      expect(layoutsIndexContent).toMatch(/RootLayoutStyles/);
      expect(layoutsIndexContent).toMatch(/common\/RootLayoutStyles/);
    });
  });
});

