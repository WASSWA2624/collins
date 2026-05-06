import {
  MAIN_NAV_ITEMS,
  MENU_ICON_GLYPHS,
  SETTINGS_ITEMS,
  getMenuIconGlyph,
} from '@config/sideMenu';

describe('sideMenu icon configuration', () => {
  it('maps every visible menu item to a real configured icon', () => {
    [...MAIN_NAV_ITEMS, ...SETTINGS_ITEMS].forEach((item) => {
      expect(MENU_ICON_GLYPHS[item.icon]).toBeTruthy();
      expect(getMenuIconGlyph(item.icon)).not.toBe('•');
    });
  });

  it('uses descriptive icons for the core app workflow', () => {
    const iconById = Object.fromEntries(MAIN_NAV_ITEMS.map((item) => [item.id, getMenuIconGlyph(item.icon)]));

    expect(iconById.home).toBe('🏠');
    expect(iconById.assessment).toBe('🩺');
    expect(iconById.history).toBe('📈');
    expect(iconById['abg-vent-update']).toBe('🫁');
    expect(iconById['dataset-capture']).toBe('🗂️');
    expect(iconById['review-queue']).toBe('☑️');
    expect(iconById.dashboard).toBe('📊');
    expect(iconById.training).toBe('🎓');
    expect(iconById.settings).toBe('⚙️');
  });
});
