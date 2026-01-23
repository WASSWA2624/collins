/**
 * BedListScreen - Web
 * File: BedListScreen.web.jsx
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
import { StyledContainer, StyledContent, StyledList } from './BedListScreen.web.styles';
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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StyledContainer>
        <StyledContent>
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="bed-list-title"
          >
            {t('bed.list.title')}
          </Text>
          <ListScaffold
            isLoading={isLoading}
            isEmpty={!isLoading && !hasError && !isOffline && items.length === 0}
            hasError={hasError}
            error={errorMessage}
            isOffline={isOffline}
            onRetry={onRetry}
            accessibilityLabel={t('bed.list.accessibilityLabel')}
            testID="bed-list"
            emptyComponent={emptyComponent}
          >
            {items.length > 0 ? (
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
                        accessibilityLabel={t('bed.list.itemLabel', {
                          name: title,
                        })}
                        testID={`bed-item-${bed.id}`}
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

export default BedListScreenWeb;
