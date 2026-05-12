const en = require('@i18n/locales/en.json');
const manifest = require('../../../public/manifest.json');
const appConfigModule = require('../../../app.config.js');

const appConfig = appConfigModule.default || appConfigModule;

describe('AI Vent branding', () => {
  it('uses AI Vent in translated app and auth entry copy', () => {
    expect(en.app.name).toBe('AI Vent');
    expect(en.app.shortName).toBe('AI Vent');
    expect(en.auth.brand.name).toBe('AI Vent');
    expect(en.auth.login.description).toBeUndefined();
    expect(en.auth.register.description).toContain('AI Vent');
  });

  it('removes the obsolete hidden-session account creation wording', () => {
    const authCopy = JSON.stringify(en.auth);

    expect(authCopy).not.toMatch(/Clinical data stays hidden/i);
    expect(authCopy).not.toMatch(/CDT/i);
  });

  it('updates native and web app metadata branding', () => {
    expect(appConfig.expo.name).toBe('AI Vent');
    expect(appConfig.expo.web.name).toBe('AI Vent');
    expect(appConfig.expo.web.shortName).toBe('AI Vent');
    expect(manifest.name).toBe('AI Vent');
    expect(manifest.short_name).toBe('AI Vent');
    expect(manifest.description).toContain('AI Vent');
  });
});
