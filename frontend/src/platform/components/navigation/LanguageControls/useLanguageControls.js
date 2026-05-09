/**
 * useLanguageControls Hook
 * Language selection logic with persistence
 * File: useLanguageControls.js
 */
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createI18n } from '@i18n';
import { useI18n } from '@hooks';
import { selectLocale } from '@store/selectors';
import { actions } from '@store/slices/ui.slice';
import { async as asyncStorage } from '@services/storage';
import {
  DEFAULT_LOCALE_FLAG_COUNTRY_CODE,
  LOCALE_FLAG_COUNTRY_CODES,
  LOCALE_LABEL_KEYS,
  LOCALE_STORAGE_KEY,
} from './types';
import LocaleFlagIcon from './LocaleFlagIcon';

const getDefaultLocale = (supportedLocales) => supportedLocales?.[0] || 'en';

const isSupportedLocale = (value, supportedLocales) => {
  if (!value || !Array.isArray(supportedLocales)) return false;
  return supportedLocales.includes(value);
};

const buildOptions = (supportedLocales, t) => {
  if (!Array.isArray(supportedLocales)) return [];
  return supportedLocales.map((value) => {
    const labelKey = LOCALE_LABEL_KEYS[value] || `settings.language.options.${value}`;
    const label = t(labelKey);
    const countryCode =
      LOCALE_FLAG_COUNTRY_CODES[value] || DEFAULT_LOCALE_FLAG_COUNTRY_CODE;
    return {
      value,
      label,
      icon: <LocaleFlagIcon countryCode={countryCode} />,
      searchText: [value, label, countryCode],
    };
  });
};

const useLanguageControls = () => {
  const { t } = useI18n();
  const dispatch = useDispatch();
  const storedLocale = useSelector(selectLocale);
  const i18n = useMemo(() => createI18n({ initialLocale: storedLocale }), [storedLocale]);
  const supportedLocales = i18n.supportedLocales;
  const fallbackLocale = getDefaultLocale(supportedLocales);
  const locale = isSupportedLocale(storedLocale, supportedLocales) ? storedLocale : fallbackLocale;

  const options = useMemo(() => buildOptions(supportedLocales, t), [supportedLocales, t]);

  const setLocale = useCallback(
    (nextLocale) => {
      if (!isSupportedLocale(nextLocale, supportedLocales)) return;
      if (nextLocale === locale) return;
      dispatch(actions.setLocale(nextLocale));
      void asyncStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    },
    [dispatch, locale, supportedLocales]
  );

  return {
    locale,
    options,
    setLocale,
  };
};

export default useLanguageControls;
