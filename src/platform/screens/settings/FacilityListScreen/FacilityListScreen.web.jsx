/**
 * FacilityListScreen - Web
 * File: FacilityListScreen.web.jsx
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
import { StyledContainer, StyledContent, StyledList } from './FacilityListScreen.web.styles';
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
  } = useFacilityListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('facility.list.emptyTitle')}
      description={t('facility.list.emptyMessage')}
      testID="facility-list-empty-state"
    />
  );

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StyledContainer>
        <StyledContent>
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="facility-list-title"
          >
            {t('facility.list.title')}
          </Text>
          <ListScaffold
            isLoading={isLoading}
            isEmpty={!isLoading && !hasError && !isOffline && items.length === 0}
            hasError={hasError}
            error={errorMessage}
            isOffline={isOffline}
            onRetry={onRetry}
            accessibilityLabel={t('facility.list.accessibilityLabel')}
            testID="facility-list"
            emptyComponent={emptyComponent}
          >
            {items.length > 0 ? (
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
                        accessibilityLabel={t('facility.list.itemLabel', {
                          name: title,
                        })}
                        testID={`facility-item-${facility.id}`}
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

export default FacilityListScreenWeb;
