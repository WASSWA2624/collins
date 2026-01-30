/**
 * UserListScreen - Web
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
import { StyledContainer, StyledContent, StyledList, StyledListBody } from './UserListScreen.web.styles';
import useUserListScreen from './useUserListScreen';

const UserListScreenWeb = () => {
  const { t } = useI18n();
  const {
    items,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onUserPress,
    onDelete,
  } = useUserListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('user.list.emptyTitle')}
      description={t('user.list.emptyMessage')}
      testID="user-list-empty-state"
    />
  );

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h1" accessibilityRole="header" testID="user-list-title">
          {t('user.list.title')}
        </Text>
        <StyledListBody role="region" aria-label={t('user.list.accessibilityLabel')} data-testid="user-list">
          {isLoading && <LoadingSpinner testID="user-list-spinner" />}
          {!isLoading && hasError && (
            <>
              <ErrorState
                title={t('listScaffold.errorState.title')}
                description={errorMessage}
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="user-list-error-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && isOffline && (
            <>
              <OfflineState
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="user-list-offline-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && !hasError && !isOffline && items.length === 0 && emptyComponent}
          {!isLoading && !hasError && !isOffline && items.length > 0 && (
            <StyledList role="list">
              {items.map((user) => {
                const title = user?.email ?? user?.phone ?? user?.id ?? '';
                const subtitle = user?.role ? `Role: ${user.role}` : '';
                return (
                  <li key={user.id} role="listitem">
                    <ListItem
                      title={title}
                      subtitle={subtitle}
                      onPress={() => onUserPress(user.id)}
                      actions={
                        <Button
                          variant="ghost"
                          size="small"
                          onPress={(e) => onDelete(user.id, e)}
                          accessibilityLabel={t('user.list.delete')}
                          accessibilityHint={t('user.list.deleteHint')}
                          testID={`user-delete-${user.id}`}
                        >
                          {t('common.remove')}
                        </Button>
                      }
                      accessibilityLabel={t('user.list.itemLabel', { name: title })}
                      testID={`user-item-${user.id}`}
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

export default UserListScreenWeb;
