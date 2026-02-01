/**
 * Sidebar menu configuration (app-router.mdc: paths omit group segments).
 * Labels via i18n: navigation.items.main.<id>. Icons via MENU_ICON_GLYPHS / getMenuIconGlyph.
 */

/** @typedef {{ id: string, icon: string, path: string }} SidebarItem */

/** Icon key → glyph (single source of truth for menu icons; UI uses getMenuIconGlyph). */
export const MENU_ICON_GLYPHS = {
  /* outline keys (sideMenu items) */
  'menu-outline': '☰',
  'home-outline': '🏠',
  'settings-outline': '⚙',
  'map-outline': '📍',
  'key-outline': '🔑',
  'shield-outline': '🛡',
  'shield-checkmark-outline': '🛡',
  'bed-outline': '🛏',
  'git-branch-outline': '〰',
  'people-outline': '👥',
  'folder-outline': '📁',
  'business-outline': '🏢',
  'lock-open-outline': '🔓',
  'lock-closed-outline': '🔒',
  'layers-outline': '📚',
  'grid-outline': '▦',
  'person-outline': '👤',
  'time-outline': '🕐',
  'medkit-outline': '🏥',
  'log-in-outline': '🔐',
  'person-add-outline': '👤',
  'mail-outline': '✉',
  'call-outline': '📞',
};

const DEFAULT_ICON_GLYPH = '•';

/** Resolve menu icon key to glyph for display. */
export function getMenuIconGlyph(iconKey) {
  if (!iconKey) return DEFAULT_ICON_GLYPH;
  return MENU_ICON_GLYPHS[iconKey] ?? DEFAULT_ICON_GLYPH;
}

/** Main app sidebar: home + assessment + settings */
const MAIN_NAV_ITEMS = [
  { id: 'home', icon: 'home-outline', path: '/' },
  { id: 'assessment', icon: 'medkit-outline', path: '/assessment' },
  { id: 'settings', icon: 'settings-outline', path: '/settings' },
];

/** Settings sub-routes (index list) */
const SETTINGS_ITEMS = [
  { id: 'settings-addresses', icon: 'map-outline', path: '/settings/addresses' },
  { id: 'settings-api-keys', icon: 'key-outline', path: '/settings/api-keys' },
  { id: 'settings-api-key-permissions', icon: 'shield-outline', path: '/settings/api-key-permissions' },
  { id: 'settings-beds', icon: 'bed-outline', path: '/settings/beds' },
  { id: 'settings-branches', icon: 'git-branch-outline', path: '/settings/branches' },
  { id: 'settings-contacts', icon: 'people-outline', path: '/settings/contacts' },
  { id: 'settings-departments', icon: 'folder-outline', path: '/settings/departments' },
  { id: 'settings-facilities', icon: 'business-outline', path: '/settings/facilities' },
  { id: 'settings-oauth-accounts', icon: 'lock-open-outline', path: '/settings/oauth-accounts' },
  { id: 'settings-permissions', icon: 'shield-outline', path: '/settings/permissions' },
  { id: 'settings-role-permissions', icon: 'shield-checkmark-outline', path: '/settings/role-permissions' },
  { id: 'settings-roles', icon: 'people-outline', path: '/settings/roles' },
  { id: 'settings-rooms', icon: 'home-outline', path: '/settings/rooms' },
  { id: 'settings-tenants', icon: 'layers-outline', path: '/settings/tenants' },
  { id: 'settings-units', icon: 'grid-outline', path: '/settings/units' },
  { id: 'settings-user-mfas', icon: 'lock-closed-outline', path: '/settings/user-mfas' },
  { id: 'settings-user-profiles', icon: 'person-outline', path: '/settings/user-profiles' },
  { id: 'settings-user-roles', icon: 'people-outline', path: '/settings/user-roles' },
  { id: 'settings-user-sessions', icon: 'time-outline', path: '/settings/user-sessions' },
  { id: 'settings-users', icon: 'people-outline', path: '/settings/users' },
  { id: 'settings-wards', icon: 'medkit-outline', path: '/settings/wards' },
];

/** Auth routes (reference; typically not in main sidebar) */
const AUTH_ITEMS = [
  { id: 'login', icon: 'log-in-outline', path: '/login' },
  { id: 'register', icon: 'person-add-outline', path: '/register' },
  { id: 'forgot-password', icon: 'key-outline', path: '/forgot-password' },
  { id: 'reset-password', icon: 'key-outline', path: '/reset-password' },
  { id: 'facility-selection', icon: 'business-outline', path: '/facility-selection' },
  { id: 'tenant-selection', icon: 'layers-outline', path: '/tenant-selection' },
  { id: 'verify-email', icon: 'mail-outline', path: '/verify-email' },
  { id: 'verify-phone', icon: 'call-outline', path: '/verify-phone' },
];

/** Full list for main sidebar (main nav + settings children). Labels via t('navigation.items.main.<id>'). */
export const SIDE_MENU_ITEMS = [...MAIN_NAV_ITEMS, ...SETTINGS_ITEMS];

/** Patient shell nav. Labels via t('navigation.items.patient.<id>'). */
export const PATIENT_MENU_ITEMS = [
  { id: 'home', icon: 'home-outline', path: '/' },
];

export { MAIN_NAV_ITEMS, SETTINGS_ITEMS, AUTH_ITEMS };
