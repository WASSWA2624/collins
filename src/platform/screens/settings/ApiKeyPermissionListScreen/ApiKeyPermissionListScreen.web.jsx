/**
 * ApiKeyPermissionListScreen - Web
 * Full UI always renders: title + list area. On error/offline shows inline message + empty list.
 */
import React from 'react';
import {
  Button,
  EmptyState,
  ErrorState,
  ListItem,
  LoadingSpinner,
  OfflineState,
  Text,
} from '@platform/components';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent, StyledList, StyledListBody } from './ApiKeyPermissionListScreen.web.styles';
import useApiKeyPermissionListScreen from './useApiKeyPermissionListScreen';

const ApiKeyPermissionListScreenWeb = () => {
  const { t } = useI18n();
  const {
    items,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onItemPress,
    onDelete,
  } = useApiKeyPermissionListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('pi-key-permission.list.emptyTitle')}
      description={t('pi-key-permission.list.emptyMessage')}
      testID="pi-key-permission-list-empty-state"
    />
  );

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h1" accessibilityRole="header" testID="pi-key-permission-list-title">
          {t('pi-key-permission.list.title')}
        </Text>
        <StyledListBody role="region" aria-label={t('pi-key-permission.list.accessibilityLabel')} data-testid="pi-key-permission-list">
          {isLoading && <LoadingSpinner testID="pi-key-permission-list-spinner" />}
          {!isLoading && hasError && (
            <>
              <ErrorState
                title={t('listScaffold.errorState.title')}
                description={errorMessage}
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="pi-key-permission-list-error-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && isOffline && (
            <>
              <OfflineState
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="pi-key-permission-list-offline-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && !hasError && !isOffline && items.length === 0 && emptyComponent}
          {!isLoading && !hasError && !isOffline && items.length > 0 && (
            <StyledList role="list">
              {items.map((item) => {
                const title = item?.name ?? item?.id ?? '';
                return (
                  <li key={item.id} role="listitem">
                    <ListItem
                      title={title}
                      onPress={() => onItemPress(item.id)}
                      actions={
                        <Button
                          variant="ghost"
                          size="small"
                          onPress={(e) => onDelete(item.id, e)}
                          accessibilityLabel={t('pi-key-permission.list.delete')}
                          accessibilityHint={t('pi-key-permission.list.deleteHint')}
                          testID={`pi-key-permission-delete-${item.id}`}
                        >
                          {t('common.remove')}
                        </Button>
                      }
                      accessibilityLabel={t('pi-key-permission.list.itemLabel', { name: title })}
                      testID={`pi-key-permission-item-${item.id}`}
                    />
                  </li>
                );
              })}
            </StyledList>
          )}
        </StyledListBody>
      </StyledContent>
    </StyledContainer>
  );
};

export default ApiKeyPermissionListScreenWeb;
