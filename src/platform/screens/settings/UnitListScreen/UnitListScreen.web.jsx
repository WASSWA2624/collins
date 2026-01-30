/**
 * UnitListScreen - Web
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
import { StyledContainer, StyledContent, StyledList, StyledListBody } from './UnitListScreen.web.styles';
import useUnitListScreen from './useUnitListScreen';

const UnitListScreenWeb = () => {
  const { t } = useI18n();
  const {
    items,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onUnitPress,
    onDelete,
  } = useUnitListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('unit.list.emptyTitle')}
      description={t('unit.list.emptyMessage')}
      testID="unit-list-empty-state"
    />
  );

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h1" accessibilityRole="header" testID="unit-list-title">
          {t('unit.list.title')}
        </Text>
        <StyledListBody role="region" aria-label={t('unit.list.accessibilityLabel')} data-testid="unit-list">
          {isLoading && <LoadingSpinner testID="unit-list-spinner" />}
          {!isLoading && hasError && (
            <>
              <ErrorState
                title={t('listScaffold.errorState.title')}
                description={errorMessage}
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="unit-list-error-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && isOffline && (
            <>
              <OfflineState
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="unit-list-offline-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && !hasError && !isOffline && items.length === 0 && emptyComponent}
          {!isLoading && !hasError && !isOffline && items.length > 0 && (
            <StyledList role="list">
              {items.map((unit) => {
                const title = unit?.name ?? unit?.id ?? '';
                return (
                  <li key={unit.id} role="listitem">
                    <ListItem
                      title={title}
                      onPress={() => onUnitPress(unit.id)}
                      actions={
                        <Button
                          variant="ghost"
                          size="small"
                          onPress={(e) => onDelete(unit.id, e)}
                          accessibilityLabel={t('unit.list.delete')}
                          accessibilityHint={t('unit.list.deleteHint')}
                          testID={`unit-delete-${unit.id}`}
                        >
                          {t('common.remove')}
                        </Button>
                      }
                      accessibilityLabel={t('unit.list.itemLabel', { name: title })}
                      testID={`unit-item-${unit.id}`}
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

export default UnitListScreenWeb;
