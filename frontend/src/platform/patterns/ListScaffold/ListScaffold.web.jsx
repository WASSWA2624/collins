/**
 * ListScaffold Pattern - Web
 * Composition pattern for lists with loading/empty/error/offline states
 * File: ListScaffold.web.jsx
 */

// 1. External dependencies
import React from 'react';

// 2. Platform components (from barrel file)
import { LoadingSpinner, EmptyState, ErrorState, OfflineState } from '@platform/components';

// 3. Hooks and utilities (absolute imports via aliases)
import { useI18n } from '@hooks';

// 4. Styles (relative import - platform-specific)
import { StyledContainer } from './ListScaffold.web.styles';

/**
 * ListScaffold component for Web
 * @param {Object} props - ListScaffold props
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.isEmpty - Empty state (no data)
 * @param {boolean} props.hasError - Error state
 * @param {string|Object} props.error - Error message or object
 * @param {boolean} props.isOffline - Offline state
 * @param {React.ReactNode} props.children - List content (rendered when not loading/empty/error/offline)
 * @param {React.ReactNode} props.loadingComponent - Custom loading component
 * @param {React.ReactNode} props.emptyComponent - Custom empty state component
 * @param {React.ReactNode} props.errorComponent - Custom error state component
 * @param {React.ReactNode} props.offlineComponent - Custom offline state component
 * @param {Function} props.onRetry - Retry handler for error/offline states
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const ListScaffoldWeb = ({
  isLoading = false,
  isEmpty = false,
  hasError = false,
  error,
  isOffline = false,
  children,
  loadingComponent,
  emptyComponent,
  errorComponent,
  offlineComponent,
  onRetry,
  accessibilityLabel,
  testID,
  className,
  style,
  ...rest
}) => {
  const { t } = useI18n();

  // Loading state
  if (isLoading) {
    return (
      <StyledContainer
        className={className}
        style={style}
        data-testid={testID ? `${testID}-loading` : undefined}
        testID={testID ? `${testID}-loading` : undefined}
        role="status"
        aria-label={accessibilityLabel || t('listScaffold.loading')}
        {...rest}
      >
        {loadingComponent || <LoadingSpinner testID={testID ? `${testID}-spinner` : undefined} />}
      </StyledContainer>
    );
  }

  // Offline state (takes precedence over error)
  if (isOffline) {
    return (
      <StyledContainer
        className={className}
        style={style}
        data-testid={testID ? `${testID}-offline` : undefined}
        testID={testID ? `${testID}-offline` : undefined}
        role="status"
        aria-label={accessibilityLabel || t('listScaffold.offline')}
        {...rest}
      >
        {offlineComponent || (
          <OfflineState
            action={
              onRetry ? (
                <button onClick={onRetry} aria-label={t('common.retry')}>
                  {t('common.retry')}
                </button>
              ) : undefined
            }
            testID={testID ? `${testID}-offline-state` : undefined}
          />
        )}
      </StyledContainer>
    );
  }

  // Error state
  if (hasError) {
    const errorMessage = typeof error === 'string' ? error : error?.message || t('listScaffold.errorState.message');
    return (
      <StyledContainer
        className={className}
        style={style}
        data-testid={testID ? `${testID}-error` : undefined}
        testID={testID ? `${testID}-error` : undefined}
        role="alert"
        aria-label={accessibilityLabel || t('listScaffold.error')}
        {...rest}
      >
        {errorComponent || (
          <ErrorState
            title={t('listScaffold.errorState.title')}
            description={errorMessage}
            action={
              onRetry ? (
                <button onClick={onRetry} aria-label={t('common.retry')}>
                  {t('common.retry')}
                </button>
              ) : undefined
            }
            testID={testID ? `${testID}-error-state` : undefined}
          />
        )}
      </StyledContainer>
    );
  }

  // Empty state
  if (isEmpty) {
    return (
      <StyledContainer
        className={className}
        style={style}
        data-testid={testID ? `${testID}-empty` : undefined}
        testID={testID ? `${testID}-empty` : undefined}
        role="status"
        aria-label={accessibilityLabel || t('listScaffold.empty')}
        {...rest}
      >
        {emptyComponent || (
          <EmptyState
            title={t('listScaffold.emptyState.title')}
            description={t('listScaffold.emptyState.message')}
            testID={testID ? `${testID}-empty-state` : undefined}
          />
        )}
      </StyledContainer>
    );
  }

  // Default: render children (list content)
  return (
    <StyledContainer
      className={className}
      style={style}
      data-testid={testID}
      testID={testID}
      role="list"
      aria-label={accessibilityLabel || t('listScaffold.list')}
      {...rest}
    >
      {children}
    </StyledContainer>
  );
};

export default ListScaffoldWeb;

