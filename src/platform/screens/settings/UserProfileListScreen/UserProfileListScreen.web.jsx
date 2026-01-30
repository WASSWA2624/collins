/**
 * UserProfileListScreen - Web
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
import { StyledContainer, StyledContent, StyledList, StyledListBody } from './UserProfileListScreen.web.styles';
import useUserProfileListScreen from './useUserProfileListScreen';

const UserProfileListScreenWeb = () => {
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
  } = useUserProfileListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('ser-profile.list.emptyTitle')}
      description={t('ser-profile.list.emptyMessage')}
      testID="ser-profile-list-empty-state"
    />
  );

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h1" accessibilityRole="header" testID="ser-profile-list-title">
          {t('ser-profile.list.title')}
        </Text>
        <StyledListBody role="region" aria-label={t('ser-profile.list.accessibilityLabel')} data-testid="ser-profile-list">
          {isLoading && <LoadingSpinner testID="ser-profile-list-spinner" />}
          {!isLoading && hasError && (
            <>
              <ErrorState
                title={t('listScaffold.errorState.title')}
                description={errorMessage}
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="ser-profile-list-error-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && isOffline && (
            <>
              <OfflineState
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="ser-profile-list-offline-state"
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
                          accessibilityLabel={t('ser-profile.list.delete')}
                          accessibilityHint={t('ser-profile.list.deleteHint')}
                          testID={`ser-profile-delete-${item.id}`}
                        >
                          {t('common.remove')}
                        </Button>
                      }
                      accessibilityLabel={t('ser-profile.list.itemLabel', { name: title })}
                      testID={`ser-profile-item-${item.id}`}
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

export default UserProfileListScreenWeb;
