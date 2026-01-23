/**
 * RoomListScreen - Web
 * File: RoomListScreen.web.jsx
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
import { StyledContainer, StyledContent, StyledList } from './RoomListScreen.web.styles';
import useRoomListScreen from './useRoomListScreen';

const RoomListScreenWeb = () => {
  const { t } = useI18n();
  const {
    items,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onRoomPress,
    onDelete,
  } = useRoomListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('room.list.emptyTitle')}
      description={t('room.list.emptyMessage')}
      testID="room-list-empty-state"
    />
  );

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StyledContainer>
        <StyledContent>
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="room-list-title"
          >
            {t('room.list.title')}
          </Text>
          <ListScaffold
            isLoading={isLoading}
            isEmpty={!isLoading && !hasError && !isOffline && items.length === 0}
            hasError={hasError}
            error={errorMessage}
            isOffline={isOffline}
            onRetry={onRetry}
            accessibilityLabel={t('room.list.accessibilityLabel')}
            testID="room-list"
            emptyComponent={emptyComponent}
          >
            {items.length > 0 ? (
              <StyledList role="list">
                {items.map((room) => {
                  const title = room?.name ?? room?.id ?? '';
                  const subtitle = room?.floor ? `${t('room.list.floorLabel')}: ${room.floor}` : '';
                  return (
                    <li key={room.id} role="listitem">
                      <ListItem
                        title={title}
                        subtitle={subtitle}
                        onPress={() => onRoomPress(room.id)}
                        actions={
                          <Button
                            variant="ghost"
                            size="small"
                            onPress={(e) => onDelete(room.id, e)}
                            accessibilityLabel={t('room.list.delete')}
                            accessibilityHint={t('room.list.deleteHint')}
                            testID={`room-delete-${room.id}`}
                          >
                            {t('common.remove')}
                          </Button>
                        }
                        accessibilityLabel={t('room.list.itemLabel', {
                          name: title,
                        })}
                        testID={`room-item-${room.id}`}
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

export default RoomListScreenWeb;
