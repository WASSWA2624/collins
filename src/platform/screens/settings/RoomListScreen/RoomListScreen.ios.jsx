/**
 * RoomListScreen - iOS
 * File: RoomListScreen.ios.jsx
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
import { StyledContainer, StyledContent, StyledList } from './RoomListScreen.ios.styles';
import useRoomListScreen from './useRoomListScreen';

const RoomListScreenIOS = () => {
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

  const ItemSeparator = () => <View style={{ height: 8 }} />;

  const renderItem = ({ item: room }) => {
    const title = room?.name ?? room?.id ?? '';
    const subtitle = room?.floor ? `${t('room.list.floorLabel')}: ${room.floor}` : '';
    return (
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
        accessibilityLabel={t('room.list.itemLabel', { name: title })}
        testID={`room-item-${room.id}`}
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
              <StyledList>
                <FlatList
                  data={items}
                  keyExtractor={(r) => r.id}
                  renderItem={renderItem}
                  ItemSeparatorComponent={ItemSeparator}
                  scrollEnabled={false}
                  accessibilityLabel={t('room.list.accessibilityLabel')}
                  testID="room-list-flatlist"
                />
              </StyledList>
            ) : null}
          </ListScaffold>
        </StyledContent>
      </StyledContainer>
    </ScrollView>
  );
};

export default RoomListScreenIOS;
