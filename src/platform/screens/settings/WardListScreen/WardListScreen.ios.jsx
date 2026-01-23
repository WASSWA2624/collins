/**
 * WardListScreen - iOS
 * File: WardListScreen.ios.jsx
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
import { StyledContainer, StyledContent, StyledList } from './WardListScreen.ios.styles';
import useWardListScreen from './useWardListScreen';

const WardListScreenIOS = () => {
  const { t } = useI18n();
  const {
    items,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onWardPress,
    onDelete,
  } = useWardListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('ward.list.emptyTitle')}
      description={t('ward.list.emptyMessage')}
      testID="ward-list-empty-state"
    />
  );

  const ItemSeparator = () => <View style={{ height: 8 }} />;

  const renderItem = ({ item: ward }) => {
    const title = ward?.name ?? ward?.id ?? '';
    const subtitle = ward?.ward_type ? `${t('ward.list.typeLabel')}: ${ward.ward_type}` : '';
    return (
      <ListItem
        title={title}
        subtitle={subtitle}
        onPress={() => onWardPress(ward.id)}
        actions={
          <Button
            variant="ghost"
            size="small"
            onPress={(e) => onDelete(ward.id, e)}
            accessibilityLabel={t('ward.list.delete')}
            accessibilityHint={t('ward.list.deleteHint')}
            testID={`ward-delete-${ward.id}`}
          >
            {t('common.remove')}
          </Button>
        }
        accessibilityLabel={t('ward.list.itemLabel', { name: title })}
        testID={`ward-item-${ward.id}`}
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
            testID="ward-list-title"
          >
            {t('ward.list.title')}
          </Text>
          <ListScaffold
            isLoading={isLoading}
            isEmpty={!isLoading && !hasError && !isOffline && items.length === 0}
            hasError={hasError}
            error={errorMessage}
            isOffline={isOffline}
            onRetry={onRetry}
            accessibilityLabel={t('ward.list.accessibilityLabel')}
            testID="ward-list"
            emptyComponent={emptyComponent}
          >
            {items.length > 0 ? (
              <StyledList>
                <FlatList
                  data={items}
                  keyExtractor={(w) => w.id}
                  renderItem={renderItem}
                  ItemSeparatorComponent={ItemSeparator}
                  scrollEnabled={false}
                  accessibilityLabel={t('ward.list.accessibilityLabel')}
                  testID="ward-list-flatlist"
                />
              </StyledList>
            ) : null}
          </ListScaffold>
        </StyledContent>
      </StyledContainer>
    </ScrollView>
  );
};

export default WardListScreenIOS;
