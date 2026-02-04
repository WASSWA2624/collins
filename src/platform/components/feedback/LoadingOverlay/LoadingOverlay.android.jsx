/**
 * LoadingOverlay Component - Android
 * Full-screen loading overlay content
 * File: LoadingOverlay.android.jsx
 */
import React from 'react';
import { useI18n } from '@hooks';
import LoadingSpinner from '../LoadingSpinner';
import { StyledCard, StyledContainer, StyledMessage, StyledTitle } from './LoadingOverlay.android.styles';

/**
 * LoadingOverlay component for Android
 * @param {Object} props - LoadingOverlay props
 */
const LoadingOverlayAndroid = ({
  visible = false,
  title,
  message,
  accessibilityLabel,
  testID,
  ...rest
}) => {
  const { t } = useI18n();
  if (!visible) return null;

  const resolvedTitle = title || t('shell.loadingOverlay.title');
  const resolvedMessage = message || t('shell.loadingOverlay.message');
  const label = accessibilityLabel || t('common.loading');

  return (
    <StyledContainer accessibilityRole="alert" accessibilityLabel={label} testID={testID} {...rest}>
      <StyledCard>
        <LoadingSpinner testID={testID ? `${testID}-spinner` : undefined} />
        {resolvedTitle ? <StyledTitle>{resolvedTitle}</StyledTitle> : null}
        {resolvedMessage ? <StyledMessage>{resolvedMessage}</StyledMessage> : null}
      </StyledCard>
    </StyledContainer>
  );
};

export default LoadingOverlayAndroid;
