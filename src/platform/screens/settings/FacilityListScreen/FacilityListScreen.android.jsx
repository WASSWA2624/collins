/**
 * FacilityListScreen - Android
 * File: FacilityListScreen.android.jsx
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
import { StyledContainer, StyledContent, StyledList } from './FacilityListScreen.android.styles';
import useFacilityListScreen from './useFacilityListScreen';

const FacilityListScreenAndroid = () => {
  const { t } = useI18n();
  const {
    items,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onFacilityPress,
    onDelete,
    onAdd,
  } = useFacilityListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('facility.list.emptyTitle')}
      description={t('facility.list.emptyMessage')}
      testID="facility-list-empty-state"
    />
  );

  const ItemSeparator = () => <View style={{ height: 8 }} />;

  const renderItem = ({ item: facility }) => {
    const title = facility?.name ?? facility?.id ?? '';
    const subtitle = facility?.facility_type ? `${t('facility.list.typeLabel')}: ${facility.facility_type}` : '';
    return (
      <ListItem
        title={title}
        subtitle={subtitle}
        onPress={() => onFacilityPress(facility.id)}
        actions={
          <Button
            variant="ghost"
            size="small"
            onPress={(e) => onDelete(facility.id, e)}
            accessibilityLabel={t('facility.list.delete')}
            accessibilityHint={t('facility.list.deleteHint')}
            testID={`facility-delete-${facility.id}`}
          >
            {t('common.remove')}
          </Button>
        }
        accessibilityLabel={t('facility.list.itemLabel', { name: title })}
        testID={`facility-item-${facility.id}`}
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
              testID="facility-list-title"
            >
              {t('facility.list.title')}
            </Text>
            {onAdd && (
              <Button
                variant="primary"
                onPress={onAdd}
                accessibilityLabel={t('facility.list.addLabel')}
                accessibilityHint={t('facility.list.addHint')}
                testID="facility-list-add"
              >
                {t('facility.list.addLabel')}
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
            accessibilityLabel={t('facility.list.accessibilityLabel')}
            testID="facility-list"
            emptyComponent={emptyComponent}
          >
            {items.length > 0 ? (
              <StyledList>
                <FlatList
                  data={items}
                  keyExtractor={(f) => f.id}
                  renderItem={renderItem}
                  ItemSeparatorComponent={ItemSeparator}
                  scrollEnabled={false}
                  accessibilityLabel={t('facility.list.accessibilityLabel')}
                  testID="facility-list-flatlist"
                />
              </StyledList>
            ) : null}
          </ListScaffold>
        </StyledContent>
      </StyledContainer>
    </ScrollView>
  );
};

export default FacilityListScreenAndroid;
