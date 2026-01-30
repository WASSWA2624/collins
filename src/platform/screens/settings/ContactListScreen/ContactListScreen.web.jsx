/**
 * ContactListScreen - Web
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
import { StyledContainer, StyledContent, StyledList, StyledListBody } from './ContactListScreen.web.styles';
import useContactListScreen from './useContactListScreen';

const ContactListScreenWeb = () => {
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

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h1" accessibilityRole="header" testID="contact-list-title">
          {t('contact.list.title')}
        </Text>
        <StyledListBody role="region" aria-label={t('contact.list.accessibilityLabel')} data-testid="contact-list">
          {isLoading && <LoadingSpinner testID="contact-list-spinner" />}
          {!isLoading && hasError && (
            <>
              <ErrorState
                title={t('listScaffold.errorState.title')}
                description={errorMessage}
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="contact-list-error-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && isOffline && (
            <>
              <OfflineState
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="contact-list-offline-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && !hasError && !isOffline && items.length === 0 && emptyComponent}
          {!isLoading && !hasError && !isOffline && items.length > 0 && (
            <StyledList role="list">
              {items.map((contact) => {
                const title = contact?.value ?? contact?.id ?? '';
                const subtitle = contact?.contact_type ? `${t('contact.list.typeLabel')}: ${contact.contact_type}` : '';
                return (
                  <li key={contact.id} role="listitem">
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

export default ContactListScreenWeb;
