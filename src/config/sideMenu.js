/**
 * Sidebar menu configuration (app-router.mdc: paths omit group segments).
 * Labels via i18n: navigation.items.main.<id>. Icons via MENU_ICON_GLYPHS / getMenuIconGlyph.
 */

/** @typedef {{ id: string, icon: string, path: string }} SidebarItem */

/** Icon key → glyph (single source of truth for menu icons; UI uses getMenuIconGlyph). */
export const MENU_ICON_GLYPHS = {
  'menu-outline': '☰',
  'home-outline': '🏠',
  'settings-outline': '⚙',
  'shield-outline': '🛡',
  'folder-outline': '📁',
  'lock-closed-outline': '🔒',
  'layers-outline': '📚',
  'person-outline': '👤',
  'time-outline': '🕐',
  'medkit-outline': '🏥',
  'close-outline': '×',
};

const DEFAULT_ICON_GLYPH = '•';

/** Resolve menu icon key to glyph for display. */
export function getMenuIconGlyph(iconKey) {
  if (!iconKey) return DEFAULT_ICON_GLYPH;
  return MENU_ICON_GLYPHS[iconKey] ?? DEFAULT_ICON_GLYPH;
}

/** Main app sidebar: home, assessment, history, training, onboarding, settings */
const MAIN_NAV_ITEMS = [
  { id: 'home', icon: 'home-outline', path: '/' },
  { id: 'assessment', icon: 'medkit-outline', path: '/assessment' },
  { id: 'history', icon: 'time-outline', path: '/history' },
  { id: 'training', icon: 'layers-outline', path: '/training' },
  { id: 'onboarding', icon: 'layers-outline', path: '/onboarding' },
  { id: 'settings', icon: 'settings-outline', path: '/settings' },
];

/** Settings sub-routes (this app’s (settings) routes only) */
const SETTINGS_ITEMS = [
  { id: 'settings-about', icon: 'person-outline', path: '/settings/about' },
  { id: 'settings-data-sources', icon: 'folder-outline', path: '/settings/data-sources' },
  { id: 'settings-disclaimer', icon: 'shield-outline', path: '/settings/disclaimer' },
  { id: 'settings-help', icon: 'layers-outline', path: '/settings/help' },
  { id: 'settings-privacy', icon: 'lock-closed-outline', path: '/settings/privacy' },
];

/** Full list for main sidebar (main nav + settings children). Labels via t('navigation.items.main.<id>'). */
export const SIDE_MENU_ITEMS = [...MAIN_NAV_ITEMS, ...SETTINGS_ITEMS];

export { MAIN_NAV_ITEMS, SETTINGS_ITEMS };
