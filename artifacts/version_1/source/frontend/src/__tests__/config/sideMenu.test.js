import {
  MAIN_NAV_ITEMS,
  MENU_ICON_GLYPHS,
  MOBILE_TAB_ITEMS,
  SIDE_MENU_ITEMS,
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
    expect(iconById['new-patient']).toBe('🩺');
    expect(iconById.history).toBe('📈');
    expect(iconById['current-readings']).toBe('🫁');
    expect(iconById['dataset-capture']).toBe('🗂️');
    expect(iconById['review-queue']).toBe('☑️');
    expect(iconById.dashboard).toBe('📊');
    expect(iconById['user-management']).toBe('UM');
    expect(iconById.settings).toBe('⚙️');
  });

  it('does not expose Training / Help entry points in main or mobile navigation', () => {
    const allItems = [...SIDE_MENU_ITEMS, ...MOBILE_TAB_ITEMS];

    expect(allItems.some((item) => item.id === 'training')).toBe(false);
    expect(allItems.some((item) => item.path === '/training')).toBe(false);
  });
});
