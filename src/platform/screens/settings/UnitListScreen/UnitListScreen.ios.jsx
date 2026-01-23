/**
 * UnitListScreen - iOS
 * File: UnitListScreen.ios.jsx
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
import { StyledContainer, StyledContent, StyledList } from './UnitListScreen.ios.styles';
import useUnitListScreen from './useUnitListScreen';

const UnitListScreenIOS = () => {
  const { t } = useI18n();
  const {
    items,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onUnitPress,
    onDelete,
  } = useUnitListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('unit.list.emptyTitle')}
      description={t('unit.list.emptyMessage')}
      testID="unit-list-empty-state"
    />
  );

  const ItemSeparator = () => <View style={{ height: 8 }} />;

  const renderItem = ({ item: unit }) => {
    const title = unit?.name ?? unit?.id ?? '';
    return (
      <ListItem
        title={title}
        onPress={() => onUnitPress(unit.id)}
        actions={
          <Button
            variant="ghost"
            size="small"
            onPress={(e) => onDelete(unit.id, e)}
            accessibilityLabel={t('unit.list.delete')}
            accessibilityHint={t('unit.list.deleteHint')}
            testID={`unit-delete-${unit.id}`}
          >
            {t('common.remove')}
          </Button>
        }
        accessibilityLabel={t('unit.list.itemLabel', { name: title })}
        testID={`unit-item-${unit.id}`}
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
            testID="unit-list-title"
          >
            {t('unit.list.title')}
          </Text>
          <ListScaffold
            isLoading={isLoading}
            isEmpty={!isLoading && !hasError && !isOffline && items.length === 0}
            hasError={hasError}
            error={errorMessage}
            isOffline={isOffline}
            onRetry={onRetry}
            accessibilityLabel={t('unit.list.accessibilityLabel')}
            testID="unit-list"
            emptyComponent={emptyComponent}
          >
            {items.length > 0 ? (
              <StyledList>
                <FlatList
                  data={items}
                  keyExtractor={(u) => u.id}
                  renderItem={renderItem}
                  ItemSeparatorComponent={ItemSeparator}
                  scrollEnabled={false}
                  accessibilityLabel={t('unit.list.accessibilityLabel')}
                  testID="unit-list-flatlist"
                />
              </StyledList>
            ) : null}
          </ListScaffold>
        </StyledContent>
      </StyledContainer>
    </ScrollView>
  );
};

export default UnitListScreenIOS;
