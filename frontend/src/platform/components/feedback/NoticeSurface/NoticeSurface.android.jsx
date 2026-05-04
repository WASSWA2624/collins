/**
 * NoticeSurface Component - Android
 * Global surface for toast/notice messaging
 * File: NoticeSurface.android.jsx
 */
import React from 'react';
import { useI18n } from '@hooks';
import Toast from '@platform/components/feedback/Toast';
import { StyledSurface } from './NoticeSurface.android.styles';

/**
 * NoticeSurface component for Android
 * @param {Object} props - NoticeSurface props
 */
const NoticeSurfaceAndroid = ({
  toast,
  children,
  accessibilityLabel,
  testID,
  ...rest
}) => {
  const { t } = useI18n();
  const hasToast = Boolean(toast && toast.visible);
  const hasContent = hasToast || Boolean(children);
  if (!hasContent) return null;

  const label = accessibilityLabel || t('shell.notices.surfaceLabel');

  return (
    <StyledSurface accessibilityLabel={label} testID={testID} pointerEvents="box-none" {...rest}>
      {hasToast ? <Toast {...toast} /> : null}
      {children}
    </StyledSurface>
  );
};

export default NoticeSurfaceAndroid;
