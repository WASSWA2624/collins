/**
 * DepartmentListScreen - Web
 * File: DepartmentListScreen.web.jsx
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
import { StyledContainer, StyledContent, StyledList } from './DepartmentListScreen.web.styles';
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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StyledContainer>
        <StyledContent>
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="department-list-title"
          >
            {t('department.list.title')}
          </Text>
          <ListScaffold
            isLoading={isLoading}
            isEmpty={!isLoading && !hasError && !isOffline && items.length === 0}
            hasError={hasError}
            error={errorMessage}
            isOffline={isOffline}
            onRetry={onRetry}
            accessibilityLabel={t('department.list.accessibilityLabel')}
            testID="department-list"
            emptyComponent={emptyComponent}
          >
            {items.length > 0 ? (
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
                        accessibilityLabel={t('department.list.itemLabel', {
                          name: title,
                        })}
                        testID={`department-item-${department.id}`}
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

export default DepartmentListScreenWeb;
