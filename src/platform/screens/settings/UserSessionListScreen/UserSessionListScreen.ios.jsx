/**
 * UserSessionListScreen - iOS
 * File: UserSessionListScreen.ios.jsx
 */
import React from 'react';
import { FlatList, ScrollView, View } from 'react-native';
import {
  Button,
  EmptyState,
  ListItem,
  Text,
} from '@platform/components';
import ListScaffold from '@platform/patterns/ListScaffold/ListScaffold.ios';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent, StyledList } from './UserSessionListScreen.ios.styles';
import useUserSessionListScreen from './useUserSessionListScreen';

const UserSessionListScreenIOS = () => {
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

  const ItemSeparator = () => <View style={{ height: 8 }} />;

  const renderItem = ({ item: session }) => {
    const title = session?.user?.email ?? session?.id ?? '';
    const subtitle = session?.created_at
      ? new Date(session.created_at).toLocaleString()
      : '';
    return (
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
    );
  };

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
              <StyledList>
                <FlatList
                  data={items}
                  keyExtractor={(s) => s.id}
                  renderItem={renderItem}
                  ItemSeparatorComponent={ItemSeparator}
                  scrollEnabled={false}
                  accessibilityLabel={t('userSession.list.accessibilityLabel')}
                  testID="user-session-list-flatlist"
                />
              </StyledList>
            ) : null}
          </ListScaffold>
        </StyledContent>
      </StyledContainer>
    </ScrollView>
  );
};

export default UserSessionListScreenIOS;
