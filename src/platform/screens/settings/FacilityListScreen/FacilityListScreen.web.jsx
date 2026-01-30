/**
 * FacilityListScreen - Web
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
import { StyledContainer, StyledContent, StyledList, StyledListBody } from './FacilityListScreen.web.styles';
import useFacilityListScreen from './useFacilityListScreen';

const FacilityListScreenWeb = () => {
  const { t } = useI18n();
  const {
    items,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onFacilityPress,
    onDelete,
    onAdd,
  } = useFacilityListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('facility.list.emptyTitle')}
      description={t('facility.list.emptyMessage')}
      testID="facility-list-empty-state"
    />
  );

  return (
    <StyledContainer>
      <StyledContent>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="facility-list-title"
          >
            {t('facility.list.title')}
          </Text>
          {onAdd && (
            <Button
              variant="primary"
              onPress={onAdd}
              accessibilityLabel={t('facility.list.addLabel')}
              accessibilityHint={t('facility.list.addHint')}
              testID="facility-list-add"
            >
              {t('facility.list.addLabel')}
            </Button>
          )}
        </div>
        <StyledListBody role="region" aria-label={t('facility.list.accessibilityLabel')} data-testid="facility-list">
          {isLoading && (
            <LoadingSpinner testID="facility-list-spinner" />
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
                testID="facility-list-error-state"
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
                testID="facility-list-offline-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && !hasError && !isOffline && items.length === 0 && emptyComponent}
          {!isLoading && !hasError && !isOffline && items.length > 0 && (
            <StyledList role="list">
              {items.map((facility) => {
                const title = facility?.name ?? facility?.id ?? '';
                const subtitle = facility?.facility_type ? `${t('facility.list.typeLabel')}: ${facility.facility_type}` : '';
                return (
                  <li key={facility.id} role="listitem">
                    <ListItem
                      title={title}
                      subtitle={subtitle}
                      onPress={() => onFacilityPress(facility.id)}
                      actions={
                        <Button
                          variant="ghost"
                          size="small"
                          onPress={(e) => onDelete(facility.id, e)}
                          accessibilityLabel={t('facility.list.delete')}
                          accessibilityHint={t('facility.list.deleteHint')}
                          testID={`facility-delete-${facility.id}`}
                        >
                          {t('common.remove')}
                        </Button>
                      }
                      accessibilityLabel={t('facility.list.itemLabel', { name: title })}
                      testID={`facility-item-${facility.id}`}
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

export default FacilityListScreenWeb;
