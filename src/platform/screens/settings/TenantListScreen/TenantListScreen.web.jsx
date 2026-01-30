/**
 * TenantListScreen - Web
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
import { StyledContainer, StyledContent, StyledList, StyledListBody } from './TenantListScreen.web.styles';
import useTenantListScreen from './useTenantListScreen';

const TenantListScreenWeb = () => {
  const { t } = useI18n();
  const {
    items,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onTenantPress,
    onDelete,
    onAdd,
  } = useTenantListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('tenant.list.emptyTitle')}
      description={t('tenant.list.emptyMessage')}
      testID="tenant-list-empty-state"
    />
  );

  return (
    <StyledContainer>
      <StyledContent>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <Text variant="h1" accessibilityRole="header" testID="tenant-list-title">
            {t('tenant.list.title')}
          </Text>
          {onAdd && (
            <Button
              variant="primary"
              onPress={onAdd}
              accessibilityLabel={t('tenant.list.addLabel')}
              accessibilityHint={t('tenant.list.addHint')}
              testID="tenant-list-add"
            >
              {t('tenant.list.addLabel')}
            </Button>
          )}
        </div>
        <StyledListBody role="region" aria-label={t('tenant.list.accessibilityLabel')} data-testid="tenant-list">
          {isLoading && <LoadingSpinner testID="tenant-list-spinner" />}
          {!isLoading && hasError && (
            <>
              <ErrorState
                title={t('listScaffold.errorState.title')}
                description={errorMessage}
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="tenant-list-error-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && isOffline && (
            <>
              <OfflineState
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="tenant-list-offline-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && !hasError && !isOffline && items.length === 0 && emptyComponent}
          {!isLoading && !hasError && !isOffline && items.length > 0 && (
            <StyledList role="list">
              {items.map((tenant) => {
                const title = tenant?.name ?? tenant?.slug ?? tenant?.id ?? '';
                const subtitle = tenant?.slug ? `Slug: ${tenant.slug}` : '';
                return (
                  <li key={tenant.id} role="listitem">
                    <ListItem
                      title={title}
                      subtitle={subtitle}
                      onPress={() => onTenantPress(tenant.id)}
                      actions={
                        <Button
                          variant="ghost"
                          size="small"
                          onPress={(e) => onDelete(tenant.id, e)}
                          accessibilityLabel={t('tenant.list.delete')}
                          accessibilityHint={t('tenant.list.deleteHint')}
                          testID={`tenant-delete-${tenant.id}`}
                        >
                          {t('common.remove')}
                        </Button>
                      }
                      accessibilityLabel={t('tenant.list.itemLabel', { name: title })}
                      testID={`tenant-item-${tenant.id}`}
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

export default TenantListScreenWeb;
