/**
 * UserSessionListScreen - Web
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
import { StyledContainer, StyledContent, StyledList, StyledListBody } from './UserSessionListScreen.web.styles';
import useUserSessionListScreen from './useUserSessionListScreen';

const UserSessionListScreenWeb = () => {
  const { t } = useI18n();
  const {
    items,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onSessionPress,
    onRevoke,
  } = useUserSessionListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('userSession.list.emptyTitle')}
      description={t('userSession.list.emptyMessage')}
      testID="user-session-list-empty-state"
    />
  );

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h1" accessibilityRole="header" testID="user-session-list-title">
          {t('userSession.list.title')}
        </Text>
        <StyledListBody role="region" aria-label={t('userSession.list.accessibilityLabel')} data-testid="user-session-list">
          {isLoading && <LoadingSpinner testID="user-session-list-spinner" />}
          {!isLoading && hasError && (
            <>
              <ErrorState
                title={t('listScaffold.errorState.title')}
                description={errorMessage}
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="user-session-list-error-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && isOffline && (
            <>
              <OfflineState
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="user-session-list-offline-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && !hasError && !isOffline && items.length === 0 && emptyComponent}
          {!isLoading && !hasError && !isOffline && items.length > 0 && (
            <StyledList role="list">
              {items.map((session) => {
                const title = session?.user?.email ?? session?.id ?? '';
                const subtitle = session?.created_at
                  ? new Date(session.created_at).toLocaleString()
                  : '';
                return (
                  <li key={session.id} role="listitem">
                    <ListItem
                      title={title}
                      subtitle={subtitle}
                      onPress={() => onSessionPress(session.id)}
                      actions={
                        session.revoked_at ? null : (
                          <Button
                            variant="ghost"
                            size="small"
                            onPress={(e) => onRevoke(session.id, e)}
                            accessibilityLabel={t('userSession.list.revoke')}
                            accessibilityHint={t('userSession.list.revokeHint')}
                            testID={`user-session-revoke-${session.id}`}
                          >
                            {t('common.remove')}
                          </Button>
                        )
                      }
                      accessibilityLabel={t('userSession.list.itemLabel', { email: title })}
                      testID={`user-session-item-${session.id}`}
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

export default UserSessionListScreenWeb;
