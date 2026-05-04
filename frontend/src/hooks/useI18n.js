/**
 * useI18n Hook
 * Provides translation helper for UI (no hardcoded UI strings).
 * File: useI18n.js
 */
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { createI18n } from '@i18n';
import { selectLocale } from '@store/selectors';

const useI18n = () => {
  const locale = useSelector(selectLocale);

  const i18n = useMemo(
    () => createI18n({ initialLocale: locale }),
    [locale]
  );

  const t = useCallback(
    (key, params) => i18n.tSync(key, params, locale),
    [i18n, locale]
  );

  return { t, locale };
};

export default useI18n;

