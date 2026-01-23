/**
 * UnitListScreen - Web
 * File: UnitListScreen.web.jsx
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
import { StyledContainer, StyledContent, StyledList } from './UnitListScreen.web.styles';
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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StyledContainer>
        <StyledContent>
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="unit-list-title"
          >
            {t('unit.list.title')}
          </Text>
          <ListScaffold
            isLoading={isLoading}
            isEmpty={!isLoading && !hasError && !isOffline && items.length === 0}
            hasError={hasError}
            error={errorMessage}
            isOffline={isOffline}
            onRetry={onRetry}
            accessibilityLabel={t('unit.list.accessibilityLabel')}
            testID="unit-list"
            emptyComponent={emptyComponent}
          >
            {items.length > 0 ? (
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
                        accessibilityLabel={t('unit.list.itemLabel', {
                          name: title,
                        })}
                        testID={`unit-item-${unit.id}`}
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

export default UnitListScreenWeb;
