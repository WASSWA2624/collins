/**
 * AddressListScreen - Web
 * Full UI always renders: title + list area. On error/offline shows inline message + empty list.
 */
import React from 'react';
import {
  Button,
  EmptyState,
  ErrorState,
  ListItem,
  LoadingSpinner,
  OfflineState,
  Text,
} from '@platform/components';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent, StyledList, StyledListBody } from './AddressListScreen.web.styles';
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
    <StyledContainer>
      <StyledContent>
        <Text
          variant="h1"
          accessibilityRole="header"
          testID="address-list-title"
        >
          {t('address.list.title')}
        </Text>
        <StyledListBody role="region" aria-label={t('address.list.accessibilityLabel')} data-testid="address-list">
          {isLoading && (
            <LoadingSpinner testID="address-list-spinner" />
          )}
          {!isLoading && hasError && (
            <>
              <ErrorState
                title={t('listScaffold.errorState.title')}
                description={errorMessage}
                action={
                  onRetry ? (
                    <button type="button" onClick={onRetry} aria-label={t('common.retry')}>
                      {t('common.retry')}
                    </button>
                  ) : undefined
                }
                testID="address-list-error-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && isOffline && (
            <>
              <OfflineState
                action={
                  onRetry ? (
                    <button type="button" onClick={onRetry} aria-label={t('common.retry')}>
                      {t('common.retry')}
                    </button>
                  ) : undefined
                }
                testID="address-list-offline-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && !hasError && !isOffline && items.length === 0 && emptyComponent}
          {!isLoading && !hasError && !isOffline && items.length > 0 && (
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
                      accessibilityLabel={t('address.list.itemLabel', { name: title })}
                      testID={`address-item-${address.id}`}
                    />
                  </li>
                );
              })}
            </StyledList>
          )}
        </StyledListBody>
      </StyledContent>
    </StyledContainer>
  );
};

export default AddressListScreenWeb;
