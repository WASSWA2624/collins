/**
 * BranchListScreen - Web
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
import { StyledContainer, StyledContent, StyledList, StyledListBody } from './BranchListScreen.web.styles';
import useBranchListScreen from './useBranchListScreen';

const BranchListScreenWeb = () => {
  const { t } = useI18n();
  const {
    items,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBranchPress,
    onDelete,
  } = useBranchListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('branch.list.emptyTitle')}
      description={t('branch.list.emptyMessage')}
      testID="branch-list-empty-state"
    />
  );

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h1" accessibilityRole="header" testID="branch-list-title">
          {t('branch.list.title')}
        </Text>
        <StyledListBody role="region" aria-label={t('branch.list.accessibilityLabel')} data-testid="branch-list">
          {isLoading && <LoadingSpinner testID="branch-list-spinner" />}
          {!isLoading && hasError && (
            <>
              <ErrorState
                title={t('listScaffold.errorState.title')}
                description={errorMessage}
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="branch-list-error-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && isOffline && (
            <>
              <OfflineState
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="branch-list-offline-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && !hasError && !isOffline && items.length === 0 && emptyComponent}
          {!isLoading && !hasError && !isOffline && items.length > 0 && (
            <StyledList role="list">
              {items.map((branch) => {
                const title = branch?.name ?? branch?.id ?? '';
                return (
                  <li key={branch.id} role="listitem">
                    <ListItem
                      title={title}
                      onPress={() => onBranchPress(branch.id)}
                      actions={
                        <Button
                          variant="ghost"
                          size="small"
                          onPress={(e) => onDelete(branch.id, e)}
                          accessibilityLabel={t('branch.list.delete')}
                          accessibilityHint={t('branch.list.deleteHint')}
                          testID={`branch-delete-${branch.id}`}
                        >
                          {t('common.remove')}
                        </Button>
                      }
                      accessibilityLabel={t('branch.list.itemLabel', { name: title })}
                      testID={`branch-item-${branch.id}`}
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

export default BranchListScreenWeb;
