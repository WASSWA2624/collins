/**
 * SystemBanner Component - Web
 * Global system banner for offline/online/maintenance notices
 * File: SystemBanner.web.jsx
 */
import React from 'react';
import { useI18n } from '@hooks';
import {
  StyledActions,
  StyledActionButton,
  StyledBanner,
  StyledContent,
  StyledDismissButton,
  StyledMessage,
  StyledTitle,
} from './SystemBanner.web.styles';
import { VARIANTS } from './types';

const toLabelText = (value) => {
  if (typeof value === 'string' && value.trim() !== '') return value;
  if (typeof value === 'number') return String(value);
  return '';
};

/**
 * SystemBanner component for Web
 * @param {Object} props - SystemBanner props
 * @param {string} props.variant - Banner variant
 * @param {string|React.ReactNode} props.title - Banner title
 * @param {string|React.ReactNode} props.message - Banner message
 * @param {string} props.actionLabel - Action label
 * @param {Function} props.onAction - Action handler
 * @param {string} props.dismissLabel - Dismiss label
 * @param {Function} props.onDismiss - Dismiss handler
 * @param {boolean} props.visible - Visibility state
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const SystemBannerWeb = ({
  variant = VARIANTS.INFO,
  title,
  message,
  actionLabel,
  onAction,
  dismissLabel,
  onDismiss,
  visible = true,
  accessibilityLabel,
  testID,
  className,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  if (!visible) return null;

  const labelParts = [toLabelText(title), toLabelText(message)].filter(Boolean);
  const fallbackLabel = accessibilityLabel || t('common.message');
  const computedLabel = accessibilityLabel || labelParts.join(' ') || fallbackLabel;

  return (
    <StyledBanner
      variant={variant}
      role="status"
      aria-live="polite"
      aria-label={computedLabel}
      data-testid={testID}
      testID={testID}
      className={className}
      style={style}
      {...rest}
    >
      <StyledContent>
        {title ? <StyledTitle>{title}</StyledTitle> : null}
        {message ? <StyledMessage>{message}</StyledMessage> : null}
      </StyledContent>
      {(actionLabel && onAction) || (dismissLabel && onDismiss) ? (
        <StyledActions>
          {actionLabel && onAction ? (
            <StyledActionButton type="button" onClick={onAction} onPress={onAction} variant={variant}>
              {actionLabel}
            </StyledActionButton>
          ) : null}
          {dismissLabel && onDismiss ? (
            <StyledDismissButton type="button" onClick={onDismiss} onPress={onDismiss}>
              {dismissLabel}
            </StyledDismissButton>
          ) : null}
        </StyledActions>
      ) : null}
    </StyledBanner>
  );
};

export default SystemBannerWeb;
