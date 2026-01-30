/**
 * LoadingOverlay Component - Web
 * Full-screen loading overlay content
 * File: LoadingOverlay.web.jsx
 */
import React from 'react';
import { useI18n } from '@hooks';
import LoadingSpinner from '../LoadingSpinner';
import { StyledCard, StyledContainer, StyledMessage, StyledTitle } from './LoadingOverlay.web.styles';

/**
 * LoadingOverlay component for Web
 * @param {Object} props - LoadingOverlay props
 * @param {boolean} props.visible - Visibility state
 * @param {string|React.ReactNode} props.title - Title text
 * @param {string|React.ReactNode} props.message - Message text
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const LoadingOverlayWeb = ({
  visible = false,
  title,
  message,
  accessibilityLabel,
  testID,
  className,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  if (!visible) return null;

  const resolvedTitle = title || t('shell.loadingOverlay.title');
  const resolvedMessage = message || t('shell.loadingOverlay.message');
  const label = accessibilityLabel || t('common.loading');

  return (
    <StyledContainer
      role="status"
      aria-live="polite"
      aria-label={label}
      data-testid={testID}
      testID={testID}
      className={className}
      style={style}
      {...rest}
    >
      <StyledCard>
        <LoadingSpinner testID={testID ? `${testID}-spinner` : undefined} />
        {resolvedTitle ? <StyledTitle>{resolvedTitle}</StyledTitle> : null}
        {resolvedMessage ? <StyledMessage>{resolvedMessage}</StyledMessage> : null}
      </StyledCard>
    </StyledContainer>
  );
};

export default LoadingOverlayWeb;
