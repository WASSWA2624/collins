/**
 * BranchListScreen - Web
 * File: BranchListScreen.web.jsx
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
import { StyledContainer, StyledContent, StyledList } from './BranchListScreen.web.styles';
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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StyledContainer>
        <StyledContent>
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="branch-list-title"
          >
            {t('branch.list.title')}
          </Text>
          <ListScaffold
            isLoading={isLoading}
            isEmpty={!isLoading && !hasError && !isOffline && items.length === 0}
            hasError={hasError}
            error={errorMessage}
            isOffline={isOffline}
            onRetry={onRetry}
            accessibilityLabel={t('branch.list.accessibilityLabel')}
            testID="branch-list"
            emptyComponent={emptyComponent}
          >
            {items.length > 0 ? (
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
                        accessibilityLabel={t('branch.list.itemLabel', {
                          name: title,
                        })}
                        testID={`branch-item-${branch.id}`}
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

export default BranchListScreenWeb;
