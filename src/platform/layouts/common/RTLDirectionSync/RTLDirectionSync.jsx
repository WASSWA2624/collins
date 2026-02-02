/**
 * RTL Direction Sync (P013 13.4.4)
 * Applies document/layout direction when locale is RTL (ar, fa).
 * Must be mounted inside Redux Provider. Web: sets document.documentElement.dir; native: no-op.
 */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectLocale } from '@store/selectors';
import { applyDocumentDirection } from '@utils/rtl';

const RTLDirectionSync = ({ children }) => {
  const locale = useSelector(selectLocale);

  useEffect(() => {
    applyDocumentDirection(locale);
  }, [locale]);

  return <>{children}</>;
};

export default RTLDirectionSync;
