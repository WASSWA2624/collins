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
} from '@store/selectors';
import { actions } from '@store/slices/ui.slice';
import { async as asyncStorage } from '@services/storage';
import {
  canManageFacilitySettings,
  canSeeGovernanceSettings,
  getRoleLabel,
  loadFacilitySettingsUseCase,
  loadMySettingsUseCase,
  updateFacilitySettingsUseCase,
  updateMySettingsUseCase,
} from '@features/settings';
import { SETTINGS_TEST_IDS, DENSITY_MODES, DENSITY_MODE_VALUES } from './types';

const NO_ACTIVE_FACILITY = '__none__';
const isValidDensity = (value) => DENSITY_MODE_VALUES.includes(value);
const unique = (items) => [...new Set(items.filter(Boolean))];

const getErrorCode = (error) =>
  error?.code || error?.statusText || error?.message || 'UNKNOWN_ERROR';

const toSwitchValue = (value) => value === true;

export default function useSettingsScreen() {
  const { t } = useI18n();
  const dispatch = useDispatch();
  const storedDensity = useSelector(selectDensity);
  const footerVisible = useSelector(selectFooterVisible);
  const isOnline = useSelector(selectIsOnline);
  const isSyncing = useSelector(selectIsSyncing);
  const networkQuality = useSelector(selectNetworkQuality);
  const density = isValidDensity(storedDensity) ? storedDensity : DENSITY_MODES.COMFORTABLE;

  const [userSettings, setUserSettings] = useState(null);
  const [facilitySettings, setFacilitySettings] = useState(null);
  const [accountDraft, setAccountDraft] = useState({ name: '', phone: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorCode, setErrorCode] = useState(null);
  const [statusMessageKey, setStatusMessageKey] = useState(null);

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
    setStatusMessageKey(null);

    try {
      const nextUserSettings = await loadMySettingsUseCase();
      setUserSettings(nextUserSettings);
      setAccountDraft({
        name: nextUserSettings?.account?.name || '',
        phone: nextUserSettings?.account?.phone || '',
      });
      await loadFacilitySettings(nextUserSettings?.activeFacilityId || null);
    } catch (error) {
      setUserSettings(null);
      setFacilitySettings(null);
      setErrorCode(getErrorCode(error));
    } finally {
      setIsLoading(false);
    }
  }, [loadFacilitySettings]);

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

  const facilityOptions = useMemo(() => {
    const options = [{ label: t('settings.account.noActiveFacility'), value: NO_ACTIVE_FACILITY }];
    (userSettings?.memberships || []).forEach((membership) => {
      options.push({
        label: membership.facility?.name || membership.facilityId,
        value: membership.facilityId,
      });
    });
    return options;
  }, [t, userSettings?.memberships]);

  const activeFacilityId = userSettings?.activeFacilityId || null;
  const activeFacilityValue = activeFacilityId || NO_ACTIVE_FACILITY;

  const activeMemberships = useMemo(
    () =>
      (userSettings?.memberships || []).filter((membership) =>
        activeFacilityId ? membership.facilityId === activeFacilityId : true
      ),
    [activeFacilityId, userSettings?.memberships]
  );

  const approvedRoles = useMemo(
    () => unique((userSettings?.memberships || []).map((membership) => membership.role)),
    [userSettings?.memberships]
  );

  const activeFacilityRoles = useMemo(
    () => unique(activeMemberships.map((membership) => membership.role)),
    [activeMemberships]
  );

  const roleOptions = useMemo(() => {
    const roles = activeFacilityId ? activeFacilityRoles : approvedRoles;
    return roles.map((role) => ({ label: getRoleLabel(role), value: role }));
  }, [activeFacilityId, activeFacilityRoles, approvedRoles]);

  const activeRole = userSettings?.roleVisibility?.activeRole || roleOptions[0]?.value || null;
  const canManageActiveFacility = canManageFacilitySettings([...approvedRoles, ...activeFacilityRoles]);
  const canSeeGovernance = canSeeGovernanceSettings([...approvedRoles, ...activeFacilityRoles]);

  const patchUserSettings = useCallback(
    async (payload) => {
      setIsSaving(true);
      setErrorCode(null);
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

        setStatusMessageKey('settings.status.saved');
        return nextUserSettings;
      } catch (error) {
        setErrorCode(getErrorCode(error));
        return null;
      } finally {
        setIsSaving(false);
      }
    },
    [activeFacilityId, loadFacilitySettings]
  );

  const patchFacilitySettings = useCallback(
    async (payload) => {
      if (!activeFacilityId) return null;

      setIsSaving(true);
      setErrorCode(null);
      setStatusMessageKey(null);

      try {
        const nextFacilitySettings = await updateFacilitySettingsUseCase(activeFacilityId, payload);
        setFacilitySettings(nextFacilitySettings);
        setStatusMessageKey('settings.status.saved');
        return nextFacilitySettings;
      } catch (error) {
        setErrorCode(getErrorCode(error));
        return null;
      } finally {
        setIsSaving(false);
      }
    },
    [activeFacilityId]
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
  }, []);

  const saveAccountSettings = useCallback(() => {
    const name = accountDraft.name?.trim();
    return patchUserSettings({
      account: {
        name,
        phone: accountDraft.phone?.trim() || null,
      },
      reason: 'Account settings updated by user',
    });
  }, [accountDraft.name, accountDraft.phone, patchUserSettings]);

  const setActiveFacility = useCallback(
    (facilityId) =>
      patchUserSettings({
        activeFacilityId: facilityId === NO_ACTIVE_FACILITY ? null : facilityId,
        reason: 'Active facility changed from settings',
      }),
    [patchUserSettings]
  );

  const setActiveRole = useCallback(
    (role) =>
      patchUserSettings({
        roleVisibility: { activeRole: role },
        reason: 'Active role visibility changed from settings',
      }),
    [patchUserSettings]
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
      statusMessageKey,
      refreshSettings,
      userSettings,
      facilitySettings,
      accountDraft,
      setAccountField,
      saveAccountSettings,
      facilityOptions,
      activeFacilityValue,
      activeFacilityId,
      setActiveFacility,
      activeRole,
      roleOptions,
      setActiveRole,
      approvedRoles,
      activeFacilityRoles,
      canManageActiveFacility,
      canSeeGovernance,
      isOnline,
      isSyncing,
      networkQuality,
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
      statusMessageKey,
      refreshSettings,
      userSettings,
      facilitySettings,
      accountDraft,
      setAccountField,
      saveAccountSettings,
      facilityOptions,
      activeFacilityValue,
      activeFacilityId,
      setActiveFacility,
      activeRole,
      roleOptions,
      approvedRoles,
      activeFacilityRoles,
      canManageActiveFacility,
      canSeeGovernance,
      isOnline,
      isSyncing,
      networkQuality,
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
