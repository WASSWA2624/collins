/**
 * WardListScreen - Web
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
import { StyledContainer, StyledContent, StyledList, StyledListBody } from './WardListScreen.web.styles';
import useWardListScreen from './useWardListScreen';

const WardListScreenWeb = () => {
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

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h1" accessibilityRole="header" testID="ward-list-title">
          {t('ward.list.title')}
        </Text>
        <StyledListBody role="region" aria-label={t('ward.list.accessibilityLabel')} data-testid="ward-list">
          {isLoading && <LoadingSpinner testID="ward-list-spinner" />}
          {!isLoading && hasError && (
            <>
              <ErrorState
                title={t('listScaffold.errorState.title')}
                description={errorMessage}
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="ward-list-error-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && isOffline && (
            <>
              <OfflineState
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="ward-list-offline-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && !hasError && !isOffline && items.length === 0 && emptyComponent}
          {!isLoading && !hasError && !isOffline && items.length > 0 && (
            <StyledList role="list">
              {items.map((ward) => {
                const title = ward?.name ?? ward?.id ?? '';
                const subtitle = ward?.ward_type ? `${t('ward.list.typeLabel')}: ${ward.ward_type}` : '';
                return (
                  <li key={ward.id} role="listitem">
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

export default WardListScreenWeb;
