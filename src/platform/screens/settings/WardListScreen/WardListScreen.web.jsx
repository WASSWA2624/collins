/**
 * WardListScreen - Web
 * File: WardListScreen.web.jsx
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
import { StyledContainer, StyledContent, StyledList } from './WardListScreen.web.styles';
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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StyledContainer>
        <StyledContent>
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="ward-list-title"
          >
            {t('ward.list.title')}
          </Text>
          <ListScaffold
            isLoading={isLoading}
            isEmpty={!isLoading && !hasError && !isOffline && items.length === 0}
            hasError={hasError}
            error={errorMessage}
            isOffline={isOffline}
            onRetry={onRetry}
            accessibilityLabel={t('ward.list.accessibilityLabel')}
            testID="ward-list"
            emptyComponent={emptyComponent}
          >
            {items.length > 0 ? (
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
                        accessibilityLabel={t('ward.list.itemLabel', {
                          name: title,
                        })}
                        testID={`ward-item-${ward.id}`}
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

export default WardListScreenWeb;
