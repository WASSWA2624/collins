/**
 * TenantListScreen - Android
 * File: TenantListScreen.android.jsx
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
import { StyledContainer, StyledContent, StyledList } from './TenantListScreen.android.styles';
import useTenantListScreen from './useTenantListScreen';

const TenantListScreenAndroid = () => {
  const { t } = useI18n();
  const {
    items,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onTenantPress,
    onDelete,
    onAdd,
  } = useTenantListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('tenant.list.emptyTitle')}
      description={t('tenant.list.emptyMessage')}
      testID="tenant-list-empty-state"
    />
  );

  const ItemSeparator = () => <View style={{ height: 8 }} />;

  const renderItem = ({ item: tenant }) => {
    const title = tenant?.name ?? tenant?.slug ?? tenant?.id ?? '';
    const subtitle = tenant?.slug ? `Slug: ${tenant.slug}` : '';
    return (
      <ListItem
        title={title}
        subtitle={subtitle}
        onPress={() => onTenantPress(tenant.id)}
        actions={
          <Button
            variant="ghost"
            size="small"
            onPress={(e) => onDelete(tenant.id, e)}
            accessibilityLabel={t('tenant.list.delete')}
            accessibilityHint={t('tenant.list.deleteHint')}
            testID={`tenant-delete-${tenant.id}`}
          >
            {t('common.remove')}
          </Button>
        }
        accessibilityLabel={t('tenant.list.itemLabel', { name: title })}
        testID={`tenant-item-${tenant.id}`}
      />
    );
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StyledContainer>
        <StyledContent>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <Text
              variant="h1"
              accessibilityRole="header"
              testID="tenant-list-title"
            >
              {t('tenant.list.title')}
            </Text>
            {onAdd && (
              <Button
                variant="primary"
                onPress={onAdd}
                accessibilityLabel={t('tenant.list.addLabel')}
                accessibilityHint={t('tenant.list.addHint')}
                testID="tenant-list-add"
              >
                {t('tenant.list.addLabel')}
              </Button>
            )}
          </View>
          <ListScaffold
            isLoading={isLoading}
            isEmpty={!isLoading && !hasError && !isOffline && items.length === 0}
            hasError={hasError}
            error={errorMessage}
            isOffline={isOffline}
            onRetry={onRetry}
            accessibilityLabel={t('tenant.list.accessibilityLabel')}
            testID="tenant-list"
            emptyComponent={emptyComponent}
          >
            {items.length > 0 ? (
              <StyledList>
                <FlatList
                  data={items}
                  keyExtractor={(t) => t.id}
                  renderItem={renderItem}
                  ItemSeparatorComponent={ItemSeparator}
                  scrollEnabled={false}
                  accessibilityLabel={t('tenant.list.accessibilityLabel')}
                  testID="tenant-list-flatlist"
                />
              </StyledList>
            ) : null}
          </ListScaffold>
        </StyledContent>
      </StyledContainer>
    </ScrollView>
  );
};

export default TenantListScreenAndroid;
