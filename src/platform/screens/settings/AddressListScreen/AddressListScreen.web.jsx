/**
 * AddressListScreen - Web
 * File: AddressListScreen.web.jsx
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
import { StyledContainer, StyledContent, StyledList } from './AddressListScreen.web.styles';
import useAddressListScreen from './useAddressListScreen';

const AddressListScreenWeb = () => {
  const { t } = useI18n();
  const {
    items,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onAddressPress,
    onDelete,
  } = useAddressListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('address.list.emptyTitle')}
      description={t('address.list.emptyMessage')}
      testID="address-list-empty-state"
    />
  );

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StyledContainer>
        <StyledContent>
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="address-list-title"
          >
            {t('address.list.title')}
          </Text>
          <ListScaffold
            isLoading={isLoading}
            isEmpty={!isLoading && !hasError && !isOffline && items.length === 0}
            hasError={hasError}
            error={errorMessage}
            isOffline={isOffline}
            onRetry={onRetry}
            accessibilityLabel={t('address.list.accessibilityLabel')}
            testID="address-list"
            emptyComponent={emptyComponent}
          >
            {items.length > 0 ? (
              <StyledList role="list">
                {items.map((address) => {
                  const title = address?.line1 ?? address?.id ?? '';
                  const subtitle = address?.city && address?.state
                    ? `${address.city}, ${address.state}`
                    : address?.city ?? address?.state ?? '';
                  return (
                    <li key={address.id} role="listitem">
                      <ListItem
                        title={title}
                        subtitle={subtitle}
                        onPress={() => onAddressPress(address.id)}
                        actions={
                          <Button
                            variant="ghost"
                            size="small"
                            onPress={(e) => onDelete(address.id, e)}
                            accessibilityLabel={t('address.list.delete')}
                            accessibilityHint={t('address.list.deleteHint')}
                            testID={`address-delete-${address.id}`}
                          >
                            {t('common.remove')}
                          </Button>
                        }
                        accessibilityLabel={t('address.list.itemLabel', {
                          name: title,
                        })}
                        testID={`address-item-${address.id}`}
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

export default AddressListScreenWeb;
