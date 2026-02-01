/**
 * useSettingsScreen
 * Shared logic for SettingsScreen.
 * File: useSettingsScreen.js
 */
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useI18n } from '@hooks';
import { selectDensity } from '@store/selectors';
import { actions } from '@store/slices/ui.slice';
import { async as asyncStorage } from '@services/storage';
import { SETTINGS_TEST_IDS, DENSITY_MODES, DENSITY_MODE_VALUES } from './types';

const isValidDensity = (value) => DENSITY_MODE_VALUES.includes(value);

export default function useSettingsScreen() {
  const { t } = useI18n();
  const dispatch = useDispatch();
  const storedDensity = useSelector(selectDensity);
  const density = isValidDensity(storedDensity) ? storedDensity : DENSITY_MODES.COMFORTABLE;

  const densityOptions = useMemo(
    () => [
      { label: t('settings.density.options.compact'), value: DENSITY_MODES.COMPACT },
      { label: t('settings.density.options.comfortable'), value: DENSITY_MODES.COMFORTABLE },
    ],
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

  return useMemo(
    () => ({
      testIds: SETTINGS_TEST_IDS,
      density,
      densityOptions,
      setDensity,
    }),
    [density, densityOptions, setDensity]
  );
}
