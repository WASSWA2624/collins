/**
 * ListScaffold Pattern - Android
 * Composition pattern for lists with loading/empty/error/offline states
 * File: ListScaffold.android.jsx
 */

import React from 'react';
import { Pressable } from 'react-native';
import { LoadingSpinner, EmptyState, ErrorState, OfflineState, Button } from '@platform/components';
import { useI18n } from '@hooks';
import { StyledContainer } from './ListScaffold.android.styles';

/**
 * ListScaffold component for Android
 */
const ListScaffoldAndroid = ({
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
  style,
  ...rest
}) => {
  const { t } = useI18n();

  // Loading state
  if (isLoading) {
    return (
      <StyledContainer
        style={style}
        testID={testID ? `${testID}-loading` : undefined}
        accessibilityLabel={accessibilityLabel || t('listScaffold.loading')}
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
        style={style}
        testID={testID ? `${testID}-offline` : undefined}
        accessibilityLabel={accessibilityLabel || t('listScaffold.offline')}
        {...rest}
      >
        {offlineComponent || (
          <OfflineState
            action={
              onRetry ? (
                <Button onPress={onRetry} accessibilityLabel={t('common.retry')} testID={testID ? `${testID}-retry` : undefined}>
                  {t('common.retry')}
                </Button>
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
        style={style}
        testID={testID ? `${testID}-error` : undefined}
        accessibilityLabel={accessibilityLabel || t('listScaffold.error')}
        {...rest}
      >
        {errorComponent || (
          <ErrorState
            title={t('listScaffold.errorState.title')}
            description={errorMessage}
            action={
              onRetry ? (
                <Button onPress={onRetry} accessibilityLabel={t('common.retry')} testID={testID ? `${testID}-retry` : undefined}>
                  {t('common.retry')}
                </Button>
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
        style={style}
        testID={testID ? `${testID}-empty` : undefined}
        accessibilityLabel={accessibilityLabel || t('listScaffold.empty')}
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
      style={style}
      testID={testID}
      accessibilityLabel={accessibilityLabel || t('listScaffold.list')}
      {...rest}
    >
      {children}
    </StyledContainer>
  );
};

export default ListScaffoldAndroid;

