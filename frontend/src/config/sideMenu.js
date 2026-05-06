/**
 * Sidebar menu configuration (app-router.mdc: paths omit group segments).
 * Labels via i18n: navigation.items.main.<id>. Icons via MENU_ICON_GLYPHS / getMenuIconGlyph.
 */
import { MEMBERSHIP_ROLES, PERMISSIONS } from '@config/accessControl';

/** @typedef {{ id: string, icon: string, path: string }} SidebarItem */

/** Icon key to glyph (single source of truth for menu icons; UI uses getMenuIconGlyph). */
export const MENU_ICON_GLYPHS = {
  'menu-outline': '☰',
  'home-outline': '🏠',
  'admit-outline': '🩺',
  'tracking-outline': '📈',
  'ventilator-outline': '🫁',
  'dataset-outline': '🗂️',
  'review-queue-outline': '☑️',
  'dashboard-outline': '📊',
  'training-outline': '🎓',
  'settings-outline': '⚙️',
  'about-outline': '👤',
  'data-sources-outline': '🗄️',
  'help-outline': '❔',
  'privacy-outline': '🔒',
  'close-outline': '×',
};

const DEFAULT_ICON_GLYPH = '•';

/** Resolve menu icon key to glyph for display. */
export function getMenuIconGlyph(iconKey) {
  if (!iconKey) return DEFAULT_ICON_GLYPH;
  return MENU_ICON_GLYPHS[iconKey] ?? DEFAULT_ICON_GLYPH;
}

const CLINICAL_WRITE_ROLES = [
  MEMBERSHIP_ROLES.PLATFORM_ADMIN,
  MEMBERSHIP_ROLES.FACILITY_ADMIN,
  MEMBERSHIP_ROLES.CLINICIAN,
  MEMBERSHIP_ROLES.ICU_NURSE,
  MEMBERSHIP_ROLES.SPECIALIST_REVIEWER,
];

const REVIEW_ROLES = [
  MEMBERSHIP_ROLES.PLATFORM_ADMIN,
  MEMBERSHIP_ROLES.FACILITY_ADMIN,
  MEMBERSHIP_ROLES.SPECIALIST_REVIEWER,
  MEMBERSHIP_ROLES.RESEARCH_GOVERNANCE_OFFICER,
];

const DASHBOARD_ROLES = [
  MEMBERSHIP_ROLES.PLATFORM_ADMIN,
  MEMBERSHIP_ROLES.FACILITY_ADMIN,
  MEMBERSHIP_ROLES.CLINICIAN,
  MEMBERSHIP_ROLES.ICU_NURSE,
  MEMBERSHIP_ROLES.SPECIALIST_REVIEWER,
  MEMBERSHIP_ROLES.RESEARCH_GOVERNANCE_OFFICER,
  MEMBERSHIP_ROLES.MODEL_GOVERNANCE_OFFICER,
  MEMBERSHIP_ROLES.READ_ONLY_REVIEWER,
];

/** Main app sidebar: clinical, review, governance, training/help, and settings entrypoints. */
const MAIN_NAV_ITEMS = [
  { id: 'home', icon: 'home-outline', path: '/' },
  {
    id: 'assessment',
    icon: 'admit-outline',
    path: '/assessment',
    facilityScoped: true,
    requireActiveFacility: true,
    roles: CLINICAL_WRITE_ROLES,
    permissions: [PERMISSIONS.CLINICAL_WRITE],
  },
  {
    id: 'history',
    icon: 'tracking-outline',
    path: '/tracking',
    facilityScoped: true,
    requireActiveFacility: true,
    permissions: [PERMISSIONS.CLINICAL_READ],
  },
  {
    id: 'abg-vent-update',
    icon: 'ventilator-outline',
    path: '/abg-vent-update',
    facilityScoped: true,
    requireActiveFacility: true,
    roles: CLINICAL_WRITE_ROLES,
    permissions: [PERMISSIONS.CLINICAL_WRITE],
  },
  {
    id: 'dataset-capture',
    icon: 'dataset-outline',
    path: '/dataset-capture',
    facilityScoped: true,
    requireActiveFacility: true,
    roles: REVIEW_ROLES,
    permissions: [PERMISSIONS.REVIEW_WRITE],
  },
  {
    id: 'review-queue',
    icon: 'review-queue-outline',
    path: '/review-queue',
    facilityScoped: true,
    requireActiveFacility: true,
    allowPlatformScope: true,
    roles: REVIEW_ROLES,
    permissions: [PERMISSIONS.REVIEW_WRITE],
  },
  {
    id: 'dashboard',
    icon: 'dashboard-outline',
    path: '/dashboard',
    allowPlatformScope: true,
    roles: DASHBOARD_ROLES,
    anyPermissions: [
      PERMISSIONS.CLINICAL_READ,
      PERMISSIONS.FACILITY_ADMIN,
      PERMISSIONS.AUDIT_READ,
      PERMISSIONS.REVIEW_WRITE,
      PERMISSIONS.DATASET_EXPORT,
      PERMISSIONS.MODEL_GOVERN,
    ],
  },
  { id: 'training', icon: 'training-outline', path: '/training' },
  { id: 'settings', icon: 'settings-outline', path: '/settings' },
];

const MOBILE_TAB_ITEM_IDS = ['home', 'assessment', 'history', 'training', 'settings'];
const MOBILE_TAB_ITEMS = MAIN_NAV_ITEMS.filter((item) => MOBILE_TAB_ITEM_IDS.includes(item.id));

/** Settings sub-routes (this app's (settings) routes only). */
const SETTINGS_ITEMS = [
  { id: 'settings-about', icon: 'about-outline', path: '/settings/about' },
  { id: 'settings-data-sources', icon: 'data-sources-outline', path: '/settings/data-sources' },
  { id: 'settings-help', icon: 'help-outline', path: '/settings/help' },
  { id: 'settings-privacy', icon: 'privacy-outline', path: '/settings/privacy' },
];

/** Full list for main sidebar (main nav + settings children). Labels via t('navigation.items.main.<id>'). */
export const SIDE_MENU_ITEMS = [...MAIN_NAV_ITEMS, ...SETTINGS_ITEMS];

export { MAIN_NAV_ITEMS, MOBILE_TAB_ITEMS, SETTINGS_ITEMS };
