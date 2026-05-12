/**
 * useSettingsScreen
 * Shared logic for audited user/facility settings plus local accessibility controls.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useI18n } from '@hooks';
import {
  selectDensity,
  selectFooterVisible,
  selectIsOnline,
  selectIsSyncing,
  selectNetworkQuality,
  selectTheme,
} from '@store/selectors';
import { actions } from '@store/slices/ui.slice';
import { actions as authActions } from '@store/slices/auth.slice';
import { async as asyncStorage } from '@services/storage';
import { MEMBERSHIP_ROLES, normalizeRoleKey } from '@config/accessControl';
import {
  canManageFacilitySettings,
  canSeeGovernanceSettings,
  getRoleLabel,
  loadFacilitySettingsUseCase,
  loadMySettingsUseCase,
  updateFacilitySettingsUseCase,
  updateMySettingsUseCase,
} from '@features/settings';
import { THEME_MODE_VALUES, THEME_MODES } from '@platform/components/navigation/ThemeControls/types';
import { SETTINGS_TEST_IDS, DENSITY_MODES, DENSITY_MODE_VALUES } from './types';

const NO_ACTIVE_FACILITY = '__none__';
const isValidDensity = (value) => DENSITY_MODE_VALUES.includes(value);
const isValidTheme = (value) => THEME_MODE_VALUES.includes(value);
const unique = (items) => [...new Set(items.filter(Boolean))];

const getErrorCode = (error) =>
  error?.code || error?.statusText || error?.message || 'UNKNOWN_ERROR';

const toSwitchValue = (value) => value === true;

const normalizeMembership = (membership) => ({
  ...membership,
  facilityId: membership?.facilityId || membership?.facility?.id || null,
});

const getFacilityLabel = (membership) => {
  const facility = membership?.facility || {};
  return facility.name || facility.registryCode || membership.facilityId || '';
};

export default function useSettingsScreen() {
  const { t } = useI18n();
  const dispatch = useDispatch();
  const storedTheme = useSelector(selectTheme);
  const storedDensity = useSelector(selectDensity);
  const footerVisible = useSelector(selectFooterVisible);
  const isOnline = useSelector(selectIsOnline);
  const isSyncing = useSelector(selectIsSyncing);
  const networkQuality = useSelector(selectNetworkQuality);
  const density = isValidDensity(storedDensity) ? storedDensity : DENSITY_MODES.COMFORTABLE;

  const [userSettings, setUserSettings] = useState(null);
  const [facilitySettings, setFacilitySettings] = useState(null);
  const [accountDraft, setAccountDraft] = useState({ name: '', phone: '' });
  const [accountErrors, setAccountErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorCode, setErrorCode] = useState(null);
  const [errorMessageKey, setErrorMessageKey] = useState(null);
  const [statusMessageKey, setStatusMessageKey] = useState(null);
  const theme = isValidTheme(storedTheme) ? storedTheme : THEME_MODES.LIGHT;

  const loadFacilitySettings = useCallback(async (facilityId) => {
    if (!facilityId) {
      setFacilitySettings(null);
      return null;
    }

    const settings = await loadFacilitySettingsUseCase(facilityId);
    setFacilitySettings(settings);
    return settings;
  }, []);

  const refreshSettings = useCallback(async () => {
    setIsLoading(true);
    setErrorCode(null);
    setErrorMessageKey(null);
    setStatusMessageKey(null);

    try {
      const nextUserSettings = await loadMySettingsUseCase();
      setUserSettings(nextUserSettings);
      setAccountErrors({});
      setAccountDraft({
        name: nextUserSettings?.account?.name || '',
        phone: nextUserSettings?.account?.phone || '',
      });

      const savedTheme = nextUserSettings?.displayPreferences?.themePreference;
      if (isValidTheme(savedTheme)) {
        dispatch(actions.setTheme(savedTheme));
        void asyncStorage.setItem('theme_preference', savedTheme);
      }

      await loadFacilitySettings(nextUserSettings?.activeFacilityId || null);
    } catch (error) {
      setUserSettings(null);
      setFacilitySettings(null);
      setErrorCode(getErrorCode(error));
      setErrorMessageKey('settings.status.loadError');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, loadFacilitySettings]);

  useEffect(() => {
    void refreshSettings();
  }, [refreshSettings]);

  const densityOptions = useMemo(
    () => [
      { label: t('settings.density.options.compact'), value: DENSITY_MODES.COMPACT },
      { label: t('settings.density.options.comfortable'), value: DENSITY_MODES.COMFORTABLE },
    ],
    [t]
  );

  const themeOptions = useMemo(
    () => [
      { label: t('settings.theme.options.system'), value: THEME_MODES.SYSTEM },
      { label: t('settings.theme.options.light'), value: THEME_MODES.LIGHT },
      { label: t('settings.theme.options.dark'), value: THEME_MODES.DARK },
      { label: t('settings.theme.options.highContrast'), value: THEME_MODES.HIGH_CONTRAST },
    ],
    [t]
  );

  const facilityOptions = useMemo(() => {
    const optionsById = new Map();
    (userSettings?.memberships || []).map(normalizeMembership).forEach((membership) => {
      if (!membership.facilityId || optionsById.has(membership.facilityId)) return;
      optionsById.set(membership.facilityId, {
        label: getFacilityLabel(membership),
        value: membership.facilityId,
      });
    });
    return [...optionsById.values()];
  }, [userSettings?.memberships]);

  const activeFacilityId = userSettings?.activeFacilityId || null;
  const hasAssignedFacilities = facilityOptions.length > 0;
  const activeFacilityValue = activeFacilityId || NO_ACTIVE_FACILITY;

  const activeMemberships = useMemo(
    () =>
      (userSettings?.memberships || [])
        .map(normalizeMembership)
        .filter((membership) => activeFacilityId && membership.facilityId === activeFacilityId),
    [activeFacilityId, userSettings?.memberships]
  );

  const approvedRoles = useMemo(
    () => unique((userSettings?.memberships || []).map((membership) => normalizeRoleKey(membership?.role))),
    [userSettings?.memberships]
  );
  const canSelectActiveFacility = approvedRoles.includes(MEMBERSHIP_ROLES.PLATFORM_ADMIN);

  const activeFacilityRoles = useMemo(
    () => unique(activeMemberships.map((membership) => membership.role)),
    [activeMemberships]
  );

  const roleOptions = useMemo(() => {
    const roles = activeFacilityId ? activeFacilityRoles : [];
    return roles.map((role) => ({ label: getRoleLabel(role), value: role }));
  }, [activeFacilityId, activeFacilityRoles]);

  const activeRole = userSettings?.roleVisibility?.activeRole || roleOptions[0]?.value || null;
  const approvedRoleLabels = useMemo(() => approvedRoles.map(getRoleLabel), [approvedRoles]);
  const activeFacilityRoleLabels = useMemo(
    () => activeFacilityRoles.map(getRoleLabel),
    [activeFacilityRoles]
  );
  const canManageActiveFacility = activeFacilityId
    ? canManageFacilitySettings(activeFacilityRoles)
    : false;
  const canSeeGovernance = activeFacilityId
    ? canSeeGovernanceSettings(activeFacilityRoles)
    : false;

  const patchUserSettings = useCallback(
    async (payload, options = {}) => {
      if (isSaving) return null;

      setIsSaving(true);
      setErrorCode(null);
      setErrorMessageKey(null);
      setStatusMessageKey(null);

      try {
        const nextUserSettings = await updateMySettingsUseCase(payload);
        setUserSettings(nextUserSettings);
        setAccountDraft({
          name: nextUserSettings?.account?.name || '',
          phone: nextUserSettings?.account?.phone || '',
        });

        const nextFacilityId = nextUserSettings?.activeFacilityId || null;
        if (nextFacilityId !== activeFacilityId) {
          await loadFacilitySettings(nextFacilityId);
        }

        setStatusMessageKey(options.successMessageKey || 'settings.status.saved');
        return nextUserSettings;
      } catch (error) {
        setErrorCode(getErrorCode(error));
        setErrorMessageKey(options.errorMessageKey || 'settings.status.saveError');
        return null;
      } finally {
        setIsSaving(false);
      }
    },
    [activeFacilityId, isSaving, loadFacilitySettings]
  );

  const patchFacilitySettings = useCallback(
    async (payload) => {
      if (!activeFacilityId || isSaving) return null;

      setIsSaving(true);
      setErrorCode(null);
      setErrorMessageKey(null);
      setStatusMessageKey(null);

      try {
        const nextFacilitySettings = await updateFacilitySettingsUseCase(activeFacilityId, payload);
        setFacilitySettings(nextFacilitySettings);
        setStatusMessageKey('settings.status.saved');
        return nextFacilitySettings;
      } catch (error) {
        setErrorCode(getErrorCode(error));
        setErrorMessageKey('settings.status.saveError');
        return null;
      } finally {
        setIsSaving(false);
      }
    },
    [activeFacilityId, isSaving]
  );

  const setDensity = useCallback(
    (nextDensity) => {
      if (!isValidDensity(nextDensity) || nextDensity === density) return;
      dispatch(actions.setDensity(nextDensity));
      void asyncStorage.setItem('density_preference', nextDensity);
    },
    [dispatch, density]
  );

  const setFooterVisible = useCallback(
    (visible) => dispatch(actions.setFooterVisible(Boolean(visible))),
    [dispatch]
  );

  const setAccountField = useCallback((field, value) => {
    setAccountDraft((current) => ({
      ...current,
      [field]: value,
    }));
    setAccountErrors((current) => ({
      ...current,
      [field]: null,
    }));
  }, []);

  const validateAccountDraft = useCallback(() => {
    const name = accountDraft.name?.trim();
    const phone = accountDraft.phone?.trim() || '';
    const nextErrors = {};

    if (!name || name.length < 2) {
      nextErrors.name = t('settings.account.validation.nameRequired');
    } else if (name.length > 160) {
      nextErrors.name = t('settings.account.validation.nameTooLong');
    }

    if (phone.length > 40) {
      nextErrors.phone = t('settings.account.validation.phoneTooLong');
    }

    setAccountErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [accountDraft.name, accountDraft.phone, t]);

  const saveAccountSettings = useCallback(() => {
    if (isSaving || !validateAccountDraft()) {
      if (!isSaving) {
        setErrorCode(null);
        setStatusMessageKey(null);
        setErrorMessageKey('settings.account.validation.profileInvalid');
      }
      return null;
    }

    const name = accountDraft.name.trim();
    return patchUserSettings({
      account: {
        name,
        phone: accountDraft.phone?.trim() || null,
      },
      reason: 'Account settings updated by user',
    }, {
      successMessageKey: 'settings.status.profileSaved',
      errorMessageKey: 'settings.status.profileSaveError',
    });
  }, [accountDraft.name, accountDraft.phone, isSaving, patchUserSettings, validateAccountDraft]);

  const setActiveFacility = useCallback(async (facilityId) => {
    if (
      !canSelectActiveFacility ||
      !hasAssignedFacilities ||
      facilityId === NO_ACTIVE_FACILITY ||
      isSaving
    ) {
      return null;
    }

    const nextUserSettings = await patchUserSettings({
      activeFacilityId: facilityId,
      reason: 'Active facility changed from settings',
    }, {
      successMessageKey: 'settings.status.facilitySaved',
      errorMessageKey: 'settings.status.facilitySaveError',
    });

    if (nextUserSettings) {
      dispatch(authActions.setActiveFacilityId(facilityId));
      void dispatch(authActions.selectActiveFacility({ activeFacilityId: facilityId }));
    }

    return nextUserSettings;
  }, [canSelectActiveFacility, dispatch, hasAssignedFacilities, isSaving, patchUserSettings]);

  const setActiveRole = useCallback(
    (role) =>
      patchUserSettings({
        roleVisibility: { activeRole: role },
        reason: 'Active role visibility changed from settings',
      }, {
        successMessageKey: 'settings.status.roleSaved',
      }),
    [patchUserSettings]
  );

  const setThemePreference = useCallback(
    (nextTheme) => {
      if (!isValidTheme(nextTheme) || nextTheme === theme || isSaving) return null;

      dispatch(actions.setTheme(nextTheme));
      void asyncStorage.setItem('theme_preference', nextTheme);

      if (!userSettings) {
        setErrorCode(null);
        setErrorMessageKey(null);
        setStatusMessageKey('settings.status.themeLocalSaved');
        return null;
      }

      return patchUserSettings({
        displayPreferences: { themePreference: nextTheme },
        reason: 'Theme preference changed from settings',
      }, {
        successMessageKey: 'settings.status.themeSaved',
        errorMessageKey: 'settings.status.themeSaveError',
      });
    },
    [dispatch, isSaving, patchUserSettings, theme, userSettings]
  );

  const updateOfflineSyncPreference = useCallback(
    (key, value) =>
      patchUserSettings({
        offlineSyncPreferences: { [key]: value },
        reason: 'Offline and sync preferences changed from settings',
      }),
    [patchUserSettings]
  );

  const updatePrivacyControl = useCallback(
    (key, value) =>
      patchUserSettings({
        privacyControls: { [key]: value },
        reason: 'Privacy controls changed from settings',
      }),
    [patchUserSettings]
  );

  const updateFacilitySection = useCallback(
    (section, key, value) =>
      patchFacilitySettings({
        [section]: { [key]: value },
        reason: 'Facility settings changed from settings',
      }),
    [patchFacilitySettings]
  );

  const syncIntervalOptions = useMemo(
    () => [5, 15, 30, 60, 120].map((value) => ({
      label: t('settings.sync.intervalOption', { value }),
      value,
    })),
    [t]
  );

  const purgeDraftOptions = useMemo(
    () => [7, 30, 90, 180, 365].map((value) => ({
      label: t('settings.sync.purgeOption', { value }),
      value,
    })),
    [t]
  );

  const referenceScopeOptions = useMemo(
    () => [
      { label: t('settings.governance.referenceScope.global'), value: 'global' },
      { label: t('settings.governance.referenceScope.facility'), value: 'facility' },
    ],
    [t]
  );

  return useMemo(
    () => ({
      testIds: SETTINGS_TEST_IDS,
      isLoading,
      isSaving,
      errorCode,
      errorMessageKey,
      statusMessageKey,
      refreshSettings,
      userSettings,
      facilitySettings,
      accountDraft,
      accountErrors,
      setAccountField,
      saveAccountSettings,
      facilityOptions,
      hasAssignedFacilities,
      canSelectActiveFacility,
      activeFacilityValue,
      activeFacilityId,
      setActiveFacility,
      activeRole,
      roleOptions,
      setActiveRole,
      approvedRoles,
      activeFacilityRoles,
      approvedRoleLabels,
      activeFacilityRoleLabels,
      canManageActiveFacility,
      canSeeGovernance,
      isOnline,
      isSyncing,
      networkQuality,
      theme,
      themeOptions,
      setThemePreference,
      density,
      densityOptions,
      setDensity,
      footerVisible: toSwitchValue(footerVisible),
      setFooterVisible,
      syncIntervalOptions,
      purgeDraftOptions,
      referenceScopeOptions,
      updateOfflineSyncPreference,
      updatePrivacyControl,
      updateFacilitySection,
    }),
    [
      isLoading,
      isSaving,
      errorCode,
      errorMessageKey,
      statusMessageKey,
      refreshSettings,
      userSettings,
      facilitySettings,
      accountDraft,
      accountErrors,
      setAccountField,
      saveAccountSettings,
      facilityOptions,
      hasAssignedFacilities,
      canSelectActiveFacility,
      activeFacilityValue,
      activeFacilityId,
      setActiveFacility,
      activeRole,
      roleOptions,
      setActiveRole,
      approvedRoles,
      activeFacilityRoles,
      approvedRoleLabels,
      activeFacilityRoleLabels,
      canManageActiveFacility,
      canSeeGovernance,
      isOnline,
      isSyncing,
      networkQuality,
      theme,
      themeOptions,
      setThemePreference,
      density,
      densityOptions,
      setDensity,
      footerVisible,
      setFooterVisible,
      syncIntervalOptions,
      purgeDraftOptions,
      referenceScopeOptions,
      updateOfflineSyncPreference,
      updatePrivacyControl,
      updateFacilitySection,
    ]
  );
}
