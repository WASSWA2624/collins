/**
 * NoticeSurface Component - Web
 * Global surface for toast/notice messaging
 * File: NoticeSurface.web.jsx
 */
import React from 'react';
import { useI18n } from '@hooks';
import Toast from '@platform/components/feedback/Toast';
import { StyledSurface } from './NoticeSurface.web.styles';

/**
 * NoticeSurface component for Web
 * @param {Object} props - NoticeSurface props
 * @param {Object} props.toast - Toast configuration
 * @param {React.ReactNode} props.children - Custom notice content
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 */
const NoticeSurfaceWeb = ({
  toast,
  children,
  accessibilityLabel,
  testID,
  className,
  ...rest
}) => {
  const { t } = useI18n();
  const hasToast = Boolean(toast && toast.visible);
  const hasContent = hasToast || Boolean(children);
  if (!hasContent) return null;

  const label = accessibilityLabel || t('shell.notices.surfaceLabel');

  return (
    <StyledSurface
      role="region"
      aria-live="polite"
      aria-label={label}
      data-testid={testID}
      testID={testID}
      className={className}
      {...rest}
    >
      {hasToast ? <Toast {...toast} /> : null}
      {children}
    </StyledSurface>
  );
};

export default NoticeSurfaceWeb;
