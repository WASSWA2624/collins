/**
 * BranchListScreen - iOS
 * File: BranchListScreen.ios.jsx
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
import { StyledContainer, StyledContent, StyledList } from './BranchListScreen.ios.styles';
import useBranchListScreen from './useBranchListScreen';

const BranchListScreenIOS = () => {
  const { t } = useI18n();
  const {
    items,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBranchPress,
    onDelete,
  } = useBranchListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('branch.list.emptyTitle')}
      description={t('branch.list.emptyMessage')}
      testID="branch-list-empty-state"
    />
  );

  const ItemSeparator = () => <View style={{ height: 8 }} />;

  const renderItem = ({ item: branch }) => {
    const title = branch?.name ?? branch?.id ?? '';
    return (
      <ListItem
        title={title}
        onPress={() => onBranchPress(branch.id)}
        actions={
          <Button
            variant="ghost"
            size="small"
            onPress={(e) => onDelete(branch.id, e)}
            accessibilityLabel={t('branch.list.delete')}
            accessibilityHint={t('branch.list.deleteHint')}
            testID={`branch-delete-${branch.id}`}
          >
            {t('common.remove')}
          </Button>
        }
        accessibilityLabel={t('branch.list.itemLabel', { name: title })}
        testID={`branch-item-${branch.id}`}
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
            testID="branch-list-title"
          >
            {t('branch.list.title')}
          </Text>
          <ListScaffold
            isLoading={isLoading}
            isEmpty={!isLoading && !hasError && !isOffline && items.length === 0}
            hasError={hasError}
            error={errorMessage}
            isOffline={isOffline}
            onRetry={onRetry}
            accessibilityLabel={t('branch.list.accessibilityLabel')}
            testID="branch-list"
            emptyComponent={emptyComponent}
          >
            {items.length > 0 ? (
              <StyledList>
                <FlatList
                  data={items}
                  keyExtractor={(b) => b.id}
                  renderItem={renderItem}
                  ItemSeparatorComponent={ItemSeparator}
                  scrollEnabled={false}
                  accessibilityLabel={t('branch.list.accessibilityLabel')}
                  testID="branch-list-flatlist"
                />
              </StyledList>
            ) : null}
          </ListScaffold>
        </StyledContent>
      </StyledContainer>
    </ScrollView>
  );
};

export default BranchListScreenIOS;
