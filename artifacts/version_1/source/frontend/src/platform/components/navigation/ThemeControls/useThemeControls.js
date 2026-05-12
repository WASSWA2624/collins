/**
 * useThemeControls Hook
 * Theme selection logic with persistence
 * File: useThemeControls.js
 */
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useI18n } from '@hooks';
import { selectTheme } from '@store/selectors';
import { actions } from '@store/slices/ui.slice';
import { async as asyncStorage } from '@services/storage';
import { THEME_MODES, THEME_MODE_VALUES } from './types';

const isValidTheme = (value) => THEME_MODE_VALUES.includes(value);

const useThemeControls = () => {
  const { t } = useI18n();
  const dispatch = useDispatch();
  const storedTheme = useSelector(selectTheme);
  const theme = isValidTheme(storedTheme) ? storedTheme : THEME_MODES.LIGHT;

  const options = useMemo(
    () => [
      { label: t('settings.theme.options.system'), value: THEME_MODES.SYSTEM },
      { label: t('settings.theme.options.light'), value: THEME_MODES.LIGHT },
      { label: t('settings.theme.options.dark'), value: THEME_MODES.DARK },
      { label: t('settings.theme.options.highContrast'), value: THEME_MODES.HIGH_CONTRAST },
    ],
    [t]
  );

  const setTheme = useCallback(
    (nextTheme) => {
      if (!isValidTheme(nextTheme)) return;
      if (nextTheme === theme) return;
      dispatch(actions.setTheme(nextTheme));
      void asyncStorage.setItem('theme_preference', nextTheme);
    },
    [dispatch, theme]
  );

  return {
    theme,
    options,
    setTheme,
  };
};

export default useThemeControls;
