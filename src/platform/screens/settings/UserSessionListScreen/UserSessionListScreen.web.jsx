/**
 * UserSessionListScreen - Web
 * File: UserSessionListScreen.web.jsx
 */
import React from 'react';
import { ScrollView } from 'react-native';
import {
  Button,
  EmptyState,
  ListItem,
  Text,
} from '@platform/components';
import { ListScaffold } from '@platform/patterns';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent, StyledList } from './UserSessionListScreen.web.styles';
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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StyledContainer>
        <StyledContent>
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="user-session-list-title"
          >
            {t('userSession.list.title')}
          </Text>
          <ListScaffold
            isLoading={isLoading}
            isEmpty={!isLoading && !hasError && !isOffline && items.length === 0}
            hasError={hasError}
            error={errorMessage}
            isOffline={isOffline}
            onRetry={onRetry}
            accessibilityLabel={t('userSession.list.accessibilityLabel')}
            testID="user-session-list"
            emptyComponent={emptyComponent}
          >
            {items.length > 0 ? (
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
                        accessibilityLabel={t('userSession.list.itemLabel', {
                          email: title,
                        })}
                        testID={`user-session-item-${session.id}`}
                      />
                    </li>
                  );
                })}
              </StyledList>
            ) : null}
          </ListScaffold>
        </StyledContent>
      </StyledContainer>
    </ScrollView>
  );
};

export default UserSessionListScreenWeb;
