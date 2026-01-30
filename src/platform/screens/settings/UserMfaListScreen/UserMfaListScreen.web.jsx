/**
 * UserMfaListScreen - Web
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
import { StyledContainer, StyledContent, StyledList, StyledListBody } from './UserMfaListScreen.web.styles';
import useUserMfaListScreen from './useUserMfaListScreen';

const UserMfaListScreenWeb = () => {
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
  } = useUserMfaListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('ser-mfa.list.emptyTitle')}
      description={t('ser-mfa.list.emptyMessage')}
      testID="ser-mfa-list-empty-state"
    />
  );

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h1" accessibilityRole="header" testID="ser-mfa-list-title">
          {t('ser-mfa.list.title')}
        </Text>
        <StyledListBody role="region" aria-label={t('ser-mfa.list.accessibilityLabel')} data-testid="ser-mfa-list">
          {isLoading && <LoadingSpinner testID="ser-mfa-list-spinner" />}
          {!isLoading && hasError && (
            <>
              <ErrorState
                title={t('listScaffold.errorState.title')}
                description={errorMessage}
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="ser-mfa-list-error-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && isOffline && (
            <>
              <OfflineState
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="ser-mfa-list-offline-state"
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
                          accessibilityLabel={t('ser-mfa.list.delete')}
                          accessibilityHint={t('ser-mfa.list.deleteHint')}
                          testID={`ser-mfa-delete-${item.id}`}
                        >
                          {t('common.remove')}
                        </Button>
                      }
                      accessibilityLabel={t('ser-mfa.list.itemLabel', { name: title })}
                      testID={`ser-mfa-item-${item.id}`}
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

export default UserMfaListScreenWeb;
