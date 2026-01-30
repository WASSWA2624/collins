/**
 * BedListScreen - Web
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
import { StyledContainer, StyledContent, StyledList, StyledListBody } from './BedListScreen.web.styles';
import useBedListScreen from './useBedListScreen';

const BedListScreenWeb = () => {
  const { t } = useI18n();
  const {
    items,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBedPress,
    onDelete,
  } = useBedListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('bed.list.emptyTitle')}
      description={t('bed.list.emptyMessage')}
      testID="bed-list-empty-state"
    />
  );

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h1" accessibilityRole="header" testID="bed-list-title">
          {t('bed.list.title')}
        </Text>
        <StyledListBody role="region" aria-label={t('bed.list.accessibilityLabel')} data-testid="bed-list">
          {isLoading && <LoadingSpinner testID="bed-list-spinner" />}
          {!isLoading && hasError && (
            <>
              <ErrorState
                title={t('listScaffold.errorState.title')}
                description={errorMessage}
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="bed-list-error-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && isOffline && (
            <>
              <OfflineState
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="bed-list-offline-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && !hasError && !isOffline && items.length === 0 && emptyComponent}
          {!isLoading && !hasError && !isOffline && items.length > 0 && (
            <StyledList role="list">
              {items.map((bed) => {
                const title = bed?.label ?? bed?.id ?? '';
                const subtitle = bed?.status ? `${t('bed.list.statusLabel')}: ${bed.status}` : '';
                return (
                  <li key={bed.id} role="listitem">
                    <ListItem
                      title={title}
                      subtitle={subtitle}
                      onPress={() => onBedPress(bed.id)}
                      actions={
                        <Button
                          variant="ghost"
                          size="small"
                          onPress={(e) => onDelete(bed.id, e)}
                          accessibilityLabel={t('bed.list.delete')}
                          accessibilityHint={t('bed.list.deleteHint')}
                          testID={`bed-delete-${bed.id}`}
                        >
                          {t('common.remove')}
                        </Button>
                      }
                      accessibilityLabel={t('bed.list.itemLabel', { name: title })}
                      testID={`bed-item-${bed.id}`}
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

export default BedListScreenWeb;
