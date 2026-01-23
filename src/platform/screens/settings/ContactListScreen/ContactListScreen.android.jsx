/**
 * ContactListScreen - Android
 * File: ContactListScreen.android.jsx
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
import { StyledContainer, StyledContent, StyledList } from './ContactListScreen.android.styles';
import useContactListScreen from './useContactListScreen';

const ContactListScreenAndroid = () => {
  const { t } = useI18n();
  const {
    items,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onContactPress,
    onDelete,
  } = useContactListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('contact.list.emptyTitle')}
      description={t('contact.list.emptyMessage')}
      testID="contact-list-empty-state"
    />
  );

  const ItemSeparator = () => <View style={{ height: 8 }} />;

  const renderItem = ({ item: contact }) => {
    const title = contact?.value ?? contact?.id ?? '';
    const subtitle = contact?.contact_type ? `${t('contact.list.typeLabel')}: ${contact.contact_type}` : '';
    return (
      <ListItem
        title={title}
        subtitle={subtitle}
        onPress={() => onContactPress(contact.id)}
        actions={
          <Button
            variant="ghost"
            size="small"
            onPress={(e) => onDelete(contact.id, e)}
            accessibilityLabel={t('contact.list.delete')}
            accessibilityHint={t('contact.list.deleteHint')}
            testID={`contact-delete-${contact.id}`}
          >
            {t('common.remove')}
          </Button>
        }
        accessibilityLabel={t('contact.list.itemLabel', { name: title })}
        testID={`contact-item-${contact.id}`}
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
            testID="contact-list-title"
          >
            {t('contact.list.title')}
          </Text>
          <ListScaffold
            isLoading={isLoading}
            isEmpty={!isLoading && !hasError && !isOffline && items.length === 0}
            hasError={hasError}
            error={errorMessage}
            isOffline={isOffline}
            onRetry={onRetry}
            accessibilityLabel={t('contact.list.accessibilityLabel')}
            testID="contact-list"
            emptyComponent={emptyComponent}
          >
            {items.length > 0 ? (
              <StyledList>
                <FlatList
                  data={items}
                  keyExtractor={(c) => c.id}
                  renderItem={renderItem}
                  ItemSeparatorComponent={ItemSeparator}
                  scrollEnabled={false}
                  accessibilityLabel={t('contact.list.accessibilityLabel')}
                  testID="contact-list-flatlist"
                />
              </StyledList>
            ) : null}
          </ListScaffold>
        </StyledContent>
      </StyledContainer>
    </ScrollView>
  );
};

export default ContactListScreenAndroid;
