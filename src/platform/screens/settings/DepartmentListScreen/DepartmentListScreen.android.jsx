/**
 * DepartmentListScreen - Android
 * File: DepartmentListScreen.android.jsx
 */
import React from 'react';
import { FlatList, ScrollView, View } from 'react-native';
import {
  Button,
  EmptyState,
  ListItem,
  Text,
} from '@platform/components';
import ListScaffold from '@platform/patterns/ListScaffold/ListScaffold.android';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent, StyledList } from './DepartmentListScreen.android.styles';
import useDepartmentListScreen from './useDepartmentListScreen';

const DepartmentListScreenAndroid = () => {
  const { t } = useI18n();
  const {
    items,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onDepartmentPress,
    onDelete,
  } = useDepartmentListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('department.list.emptyTitle')}
      description={t('department.list.emptyMessage')}
      testID="department-list-empty-state"
    />
  );

  const ItemSeparator = () => <View style={{ height: 8 }} />;

  const renderItem = ({ item: department }) => {
    const title = department?.name ?? department?.id ?? '';
    const subtitle = department?.department_type ? `${t('department.list.typeLabel')}: ${department.department_type}` : '';
    return (
      <ListItem
        title={title}
        subtitle={subtitle}
        onPress={() => onDepartmentPress(department.id)}
        actions={
          <Button
            variant="ghost"
            size="small"
            onPress={(e) => onDelete(department.id, e)}
            accessibilityLabel={t('department.list.delete')}
            accessibilityHint={t('department.list.deleteHint')}
            testID={`department-delete-${department.id}`}
          >
            {t('common.remove')}
          </Button>
        }
        accessibilityLabel={t('department.list.itemLabel', { name: title })}
        testID={`department-item-${department.id}`}
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
            testID="department-list-title"
          >
            {t('department.list.title')}
          </Text>
          <ListScaffold
            isLoading={isLoading}
            isEmpty={!isLoading && !hasError && !isOffline && items.length === 0}
            hasError={hasError}
            error={errorMessage}
            isOffline={isOffline}
            onRetry={onRetry}
            accessibilityLabel={t('department.list.accessibilityLabel')}
            testID="department-list"
            emptyComponent={emptyComponent}
          >
            {items.length > 0 ? (
              <StyledList>
                <FlatList
                  data={items}
                  keyExtractor={(d) => d.id}
                  renderItem={renderItem}
                  ItemSeparatorComponent={ItemSeparator}
                  scrollEnabled={false}
                  accessibilityLabel={t('department.list.accessibilityLabel')}
                  testID="department-list-flatlist"
                />
              </StyledList>
            ) : null}
          </ListScaffold>
        </StyledContent>
      </StyledContainer>
    </ScrollView>
  );
};

export default DepartmentListScreenAndroid;
