/**
 * DepartmentListScreen - Web
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
import { StyledContainer, StyledContent, StyledList, StyledListBody } from './DepartmentListScreen.web.styles';
import useDepartmentListScreen from './useDepartmentListScreen';

const DepartmentListScreenWeb = () => {
  const { t } = useI18n();
  const {
    items,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onDepartmentPress,
    onDelete,
  } = useDepartmentListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('department.list.emptyTitle')}
      description={t('department.list.emptyMessage')}
      testID="department-list-empty-state"
    />
  );

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h1" accessibilityRole="header" testID="department-list-title">
          {t('department.list.title')}
        </Text>
        <StyledListBody role="region" aria-label={t('department.list.accessibilityLabel')} data-testid="department-list">
          {isLoading && <LoadingSpinner testID="department-list-spinner" />}
          {!isLoading && hasError && (
            <>
              <ErrorState
                title={t('listScaffold.errorState.title')}
                description={errorMessage}
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="department-list-error-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && isOffline && (
            <>
              <OfflineState
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="department-list-offline-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && !hasError && !isOffline && items.length === 0 && emptyComponent}
          {!isLoading && !hasError && !isOffline && items.length > 0 && (
            <StyledList role="list">
              {items.map((department) => {
                const title = department?.name ?? department?.id ?? '';
                const subtitle = department?.department_type ? `${t('department.list.typeLabel')}: ${department.department_type}` : '';
                return (
                  <li key={department.id} role="listitem">
                    <ListItem
                      title={title}
                      subtitle={subtitle}
                      onPress={() => onDepartmentPress(department.id)}
                      actions={
                        <Button
                          variant="ghost"
                          size="small"
                          onPress={(e) => onDelete(department.id, e)}
                          accessibilityLabel={t('department.list.delete')}
                          accessibilityHint={t('department.list.deleteHint')}
                          testID={`department-delete-${department.id}`}
                        >
                          {t('common.remove')}
                        </Button>
                      }
                      accessibilityLabel={t('department.list.itemLabel', { name: title })}
                      testID={`department-item-${department.id}`}
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

export default DepartmentListScreenWeb;
