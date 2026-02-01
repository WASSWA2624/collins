/**
 * useSettingsScreen
 * Shared logic for SettingsScreen.
 * File: useSettingsScreen.js
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useI18n } from '@hooks';
import { selectDensity, selectAiDecisionSupportEnabled, selectAiModelId } from '@store/selectors';
import { actions } from '@store/slices/ui.slice';
import { async as asyncStorage, secure as secureStorage } from '@services/storage';
import { AI_API_KEY_CONFIGURED_ASYNC_KEY, VENTILATION_AI_API_KEY_STORAGE_KEY } from '@config/constants';
import { SETTINGS_TEST_IDS, DENSITY_MODES, DENSITY_MODE_VALUES, AI_MODEL_OPTIONS } from './types';

const isValidDensity = (value) => DENSITY_MODE_VALUES.includes(value);

export default function useSettingsScreen() {
  const { t } = useI18n();
  const dispatch = useDispatch();
  const storedDensity = useSelector(selectDensity);
  const density = isValidDensity(storedDensity) ? storedDensity : DENSITY_MODES.COMFORTABLE;
  const aiEnabled = useSelector(selectAiDecisionSupportEnabled);
  const aiModelId = useSelector(selectAiModelId);
  const [aiKeyConfigured, setAiKeyConfigured] = useState(false);

  useEffect(() => {
    let cancelled = false;
    asyncStorage.getItem(AI_API_KEY_CONFIGURED_ASYNC_KEY).then((v) => {
      if (!cancelled) setAiKeyConfigured(v === 'true');
    });
    return () => { cancelled = true; };
  }, []);

  const densityOptions = useMemo(
    () => [
      { label: t('settings.density.options.compact'), value: DENSITY_MODES.COMPACT },
      { label: t('settings.density.options.comfortable'), value: DENSITY_MODES.COMFORTABLE },
    ],
    [t]
  );

  const aiModelOptions = useMemo(
    () => AI_MODEL_OPTIONS.map((o) => ({ label: t(o.labelKey), value: o.value })),
    [t]
  );

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

  const setAiModelId = useCallback(
    (model) => {
      if (typeof model === 'string' && model.trim()) dispatch(actions.setAiModelId(model.trim()));
    },
    [dispatch]
  );

  const saveAiApiKey = useCallback(async (value) => {
    if (typeof value !== 'string' || !value.trim()) return false;
    const ok = await secureStorage.setItem(VENTILATION_AI_API_KEY_STORAGE_KEY, value.trim());
    if (ok) {
      await asyncStorage.setItem(AI_API_KEY_CONFIGURED_ASYNC_KEY, 'true');
      setAiKeyConfigured(true);
    }
    return ok;
  }, []);

  const clearAiApiKey = useCallback(async () => {
    await secureStorage.removeItem(VENTILATION_AI_API_KEY_STORAGE_KEY);
    await asyncStorage.setItem(AI_API_KEY_CONFIGURED_ASYNC_KEY, 'false');
    setAiKeyConfigured(false);
  }, []);

  return useMemo(
    () => ({
      testIds: SETTINGS_TEST_IDS,
      density,
      densityOptions,
      setDensity,
      aiEnabled,
      aiModelId,
      aiKeyConfigured,
      aiModelOptions,
      setAiEnabled,
      setAiModelId,
      saveAiApiKey,
      clearAiApiKey,
    }),
    [density, densityOptions, setDensity, aiEnabled, aiModelId, aiKeyConfigured, aiModelOptions, setAiEnabled, setAiModelId, saveAiApiKey, clearAiApiKey]
  );
}
