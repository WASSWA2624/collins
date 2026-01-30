/**
 * OauthAccountListScreen - Web
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
import { StyledContainer, StyledContent, StyledList, StyledListBody } from './OauthAccountListScreen.web.styles';
import useOauthAccountListScreen from './useOauthAccountListScreen';

const OauthAccountListScreenWeb = () => {
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
  } = useOauthAccountListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('auth-account.list.emptyTitle')}
      description={t('auth-account.list.emptyMessage')}
      testID="auth-account-list-empty-state"
    />
  );

  return (
    <StyledContainer>
      <StyledContent>
        <Text
          variant="h1"
          accessibilityRole="header"
          testID="auth-account-list-title"
        >
          {t('auth-account.list.title')}
        </Text>
        <StyledListBody role="region" aria-label={t('auth-account.list.accessibilityLabel')} data-testid="auth-account-list">
          {isLoading && (
            <LoadingSpinner testID="auth-account-list-spinner" />
          )}
          {!isLoading && hasError && (
            <>
              <ErrorState
                title={t('listScaffold.errorState.title')}
                description={errorMessage}
                action={
                  onRetry ? (
                    <button type="button" onClick={onRetry} aria-label={t('common.retry')}>
                      {t('common.retry')}
                    </button>
                  ) : undefined
                }
                testID="auth-account-list-error-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && isOffline && (
            <>
              <OfflineState
                action={
                  onRetry ? (
                    <button type="button" onClick={onRetry} aria-label={t('common.retry')}>
                      {t('common.retry')}
                    </button>
                  ) : undefined
                }
                testID="auth-account-list-offline-state"
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
                          accessibilityLabel={t('auth-account.list.delete')}
                          accessibilityHint={t('auth-account.list.deleteHint')}
                          testID={`auth-account-delete-${item.id}`}
                        >
                          {t('common.remove')}
                        </Button>
                      }
                      accessibilityLabel={t('auth-account.list.itemLabel', { name: title })}
                      testID={`auth-account-item-${item.id}`}
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

export default OauthAccountListScreenWeb;
