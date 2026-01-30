/**
 * RolePermissionListScreen - Web
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
import { StyledContainer, StyledContent, StyledList, StyledListBody } from './RolePermissionListScreen.web.styles';
import useRolePermissionListScreen from './useRolePermissionListScreen';

const RolePermissionListScreenWeb = () => {
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
  } = useRolePermissionListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('ole-permission.list.emptyTitle')}
      description={t('ole-permission.list.emptyMessage')}
      testID="ole-permission-list-empty-state"
    />
  );

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h1" accessibilityRole="header" testID="ole-permission-list-title">
          {t('ole-permission.list.title')}
        </Text>
        <StyledListBody role="region" aria-label={t('ole-permission.list.accessibilityLabel')} data-testid="ole-permission-list">
          {isLoading && <LoadingSpinner testID="ole-permission-list-spinner" />}
          {!isLoading && hasError && (
            <>
              <ErrorState
                title={t('listScaffold.errorState.title')}
                description={errorMessage}
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="ole-permission-list-error-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && isOffline && (
            <>
              <OfflineState
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="ole-permission-list-offline-state"
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
                          accessibilityLabel={t('ole-permission.list.delete')}
                          accessibilityHint={t('ole-permission.list.deleteHint')}
                          testID={`ole-permission-delete-${item.id}`}
                        >
                          {t('common.remove')}
                        </Button>
                      }
                      accessibilityLabel={t('ole-permission.list.itemLabel', { name: title })}
                      testID={`ole-permission-item-${item.id}`}
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

export default RolePermissionListScreenWeb;
