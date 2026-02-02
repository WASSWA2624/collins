/**
 * useSettingsScreen
 * Shared logic for SettingsScreen.
 * File: useSettingsScreen.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useI18n } from '@hooks';
import { selectDensity, selectAiDecisionSupportEnabled, selectAiProviderId, selectAiModelId } from '@store/selectors';
import { actions } from '@store/slices/ui.slice';
import { async as asyncStorage, secure as secureStorage } from '@services/storage';
import { AI_PROVIDERS, getModelsForProvider } from '@config/constants';
import { SETTINGS_TEST_IDS, DENSITY_MODES, DENSITY_MODE_VALUES } from './types';

const isValidDensity = (value) => DENSITY_MODE_VALUES.includes(value);

export default function useSettingsScreen() {
  const { t } = useI18n();
  const dispatch = useDispatch();
  const storedDensity = useSelector(selectDensity);
  const density = isValidDensity(storedDensity) ? storedDensity : DENSITY_MODES.COMFORTABLE;
  const aiEnabled = useSelector(selectAiDecisionSupportEnabled);
  const aiProviderId = useSelector(selectAiProviderId);
  const aiModelId = useSelector(selectAiModelId);
  const [aiKeyConfigured, setAiKeyConfigured] = useState(false);

  const providerConfig = useMemo(
    () => AI_PROVIDERS.find((p) => p.id === aiProviderId) ?? AI_PROVIDERS[0],
    [aiProviderId]
  );

  useEffect(() => {
    let cancelled = false;
    asyncStorage.getItem(providerConfig.configuredAsyncKey).then((v) => {
      if (!cancelled) setAiKeyConfigured(v === 'true');
    });
    return () => { cancelled = true; };
  }, [providerConfig.configuredAsyncKey]);

  const densityOptions = useMemo(
    () => [
      { label: t('settings.density.options.compact'), value: DENSITY_MODES.COMPACT },
      { label: t('settings.density.options.comfortable'), value: DENSITY_MODES.COMFORTABLE },
    ],
    [t]
  );

  const aiProviderOptions = useMemo(
    () => AI_PROVIDERS.map((p) => ({ label: t(p.labelKey), value: p.id })),
    [t]
  );

  const aiModelOptions = useMemo(() => {
    const models = getModelsForProvider(aiProviderId);
    return models.map((m) => ({ label: t(m.labelKey), value: m.id }));
  }, [t, aiProviderId]);

  const setDensity = useCallback(
    (nextDensity) => {
      if (!isValidDensity(nextDensity)) return;
      if (nextDensity === density) return;
      dispatch(actions.setDensity(nextDensity));
      void asyncStorage.setItem('density_preference', nextDensity);
    },
    [dispatch, density]
  );

  const setAiEnabled = useCallback(
    (enabled) => dispatch(actions.setAiDecisionSupportEnabled(Boolean(enabled))),
    [dispatch]
  );

  const setAiProviderId = useCallback(
    (providerId) => {
      if (typeof providerId !== 'string' || !providerId.trim()) return;
      const nextId = providerId.trim();
      dispatch(actions.setAiProviderId(nextId));
      const models = getModelsForProvider(nextId);
      const currentInList = models.some((m) => m.id === aiModelId);
      if (!currentInList && models.length > 0) {
        dispatch(actions.setAiModelId(models[0].id));
      }
    },
    [dispatch, aiModelId]
  );

  const setAiModelId = useCallback(
    (model) => {
      if (typeof model === 'string' && model.trim()) dispatch(actions.setAiModelId(model.trim()));
    },
    [dispatch]
  );

  const saveAiApiKey = useCallback(
    async (value) => {
      if (typeof value !== 'string' || !value.trim()) return false;
      const ok = await secureStorage.setItem(providerConfig.storageKey, value.trim());
      if (ok) {
        await asyncStorage.setItem(providerConfig.configuredAsyncKey, 'true');
        setAiKeyConfigured(true);
      }
      return ok;
    },
    [providerConfig.storageKey, providerConfig.configuredAsyncKey]
  );

  const clearAiApiKey = useCallback(
    async () => {
      await secureStorage.removeItem(providerConfig.storageKey);
      await asyncStorage.setItem(providerConfig.configuredAsyncKey, 'false');
      setAiKeyConfigured(false);
    },
    [providerConfig.storageKey, providerConfig.configuredAsyncKey]
  );

  return useMemo(
    () => ({
      testIds: SETTINGS_TEST_IDS,
      density,
      densityOptions,
      setDensity,
      aiEnabled,
      aiProviderId,
      aiModelId,
      aiKeyConfigured,
      aiProviderOptions,
      aiModelOptions,
      setAiEnabled,
      setAiProviderId,
      setAiModelId,
      saveAiApiKey,
      clearAiApiKey,
    }),
    [
      density,
      densityOptions,
      setDensity,
      aiEnabled,
      aiProviderId,
      aiModelId,
      aiKeyConfigured,
      aiProviderOptions,
      aiModelOptions,
      setAiEnabled,
      setAiProviderId,
      setAiModelId,
      saveAiApiKey,
      clearAiApiKey,
    ]
  );
}
