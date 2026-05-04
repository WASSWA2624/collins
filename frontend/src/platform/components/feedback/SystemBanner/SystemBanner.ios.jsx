/**
 * SystemBanner Component - iOS
 * Global system banner for offline/online/maintenance notices
 * File: SystemBanner.ios.jsx
 */
import React from 'react';
import { useI18n } from '@hooks';
import {
  StyledActions,
  StyledActionButton,
  StyledActionText,
  StyledBanner,
  StyledContent,
  StyledDismissButton,
  StyledMessage,
  StyledTitle,
} from './SystemBanner.ios.styles';
import { VARIANTS } from './types';

const toLabelText = (value) => {
  if (typeof value === 'string' && value.trim() !== '') return value;
  if (typeof value === 'number') return String(value);
  return '';
};

/**
 * SystemBanner component for iOS
 * @param {Object} props - SystemBanner props
 */
const SystemBannerIOS = ({
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
      accessibilityRole="alert"
      accessibilityLabel={computedLabel}
      testID={testID}
      {...rest}
    >
      <StyledContent>
        {title ? <StyledTitle variant={variant}>{title}</StyledTitle> : null}
        {message ? <StyledMessage variant={variant}>{message}</StyledMessage> : null}
      </StyledContent>
      {(actionLabel && onAction) || (dismissLabel && onDismiss) ? (
        <StyledActions>
          {actionLabel && onAction ? (
            <StyledActionButton
              variant={variant}
              accessibilityRole="button"
              accessibilityLabel={actionLabel}
              onPress={onAction}
            >
              <StyledActionText variant={variant}>{actionLabel}</StyledActionText>
            </StyledActionButton>
          ) : null}
          {dismissLabel && onDismiss ? (
            <StyledDismissButton accessibilityRole="button" accessibilityLabel={dismissLabel} onPress={onDismiss}>
              <StyledActionText variant={variant}>{dismissLabel}</StyledActionText>
            </StyledDismissButton>
          ) : null}
        </StyledActions>
      ) : null}
    </StyledBanner>
  );
};

export default SystemBannerIOS;
