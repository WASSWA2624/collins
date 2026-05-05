import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, TextField } from '@platform/components';
import useReviewQueueScreen from './useReviewQueueScreen';

const getActionLabelKey = (action) => {
  if (action === 'request_correction') return 'requestCorrection';
  if (action === 'triage') return 'defer';
  return action;
};

const ReviewQueueScreen = () => {
  const screen = useReviewQueueScreen();
  const actionValues = Object.values(screen.actions || {});

  if (!screen.canReview) {
    return (
      <View style={styles.content} testID={screen.testIds.screen}>
        <Text variant="h1">{screen.t('reviewQueue.forbidden.title')}</Text>
        <Text variant="body">{screen.t('reviewQueue.forbidden.message')}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      testID={screen.testIds.screen}
      accessibilityLabel={screen.t('reviewQueue.accessibilityLabel')}
    >
      <View style={styles.header}>
        <Text variant="h1">{screen.t('reviewQueue.title')}</Text>
        <Text variant="body">{screen.t('reviewQueue.subtitle')}</Text>
      </View>

      <View style={styles.filters}>
        <Pressable
          onPress={() => screen.setSelectedEntityType('')}
          style={[styles.filter, screen.selectedEntityType === '' ? styles.activeFilter : null]}
          accessibilityRole="button"
        >
          <Text variant="label">{screen.t('reviewQueue.filters.all')}</Text>
        </Pressable>
        {screen.filterOptions.map((option) => (
          <Pressable
            key={option.value}
            onPress={() => screen.setSelectedEntityType(option.value)}
            style={[styles.filter, screen.selectedEntityType === option.value ? styles.activeFilter : null]}
            accessibilityRole="button"
          >
            <Text variant="label">{option.label}</Text>
          </Pressable>
        ))}
      </View>

      <Button text={screen.t('common.retry')} onPress={screen.refresh} loading={screen.isLoading} />

      {screen.errorCode ? (
        <View style={styles.notice}>
          <Text variant="body">{screen.errorCode}</Text>
        </View>
      ) : null}

      <View style={styles.summary}>
        {Object.entries(screen.summary).map(([key, value]) => (
          <View key={key} style={styles.summaryItem}>
            <Text variant="caption">{screen.t(`reviewQueue.summary.${key}`)}</Text>
            <Text variant="h2">{value}</Text>
          </View>
        ))}
      </View>

      {screen.items.map((item) => (
        <View key={`${item.entityType}-${item.entityId}`} style={styles.item}>
          <Text variant="h3">{item.title || item.entityId}</Text>
          <Text variant="body">{item.entityType}</Text>
          <TextField
            label={screen.t('reviewQueue.commentPlaceholder')}
            value={screen.commentsById[item.entityId] || ''}
            onChangeText={(value) => screen.setComment(item.entityId, value)}
            testID={`${screen.testIds.comment}-${item.entityId}`}
          />
          <View style={styles.actions}>
            {actionValues.map((action) => (
              <Button
                key={action}
                text={screen.t(`reviewQueue.actions.${getActionLabelKey(action)}`)}
                onPress={() => screen.handleAction(item, action)}
                loading={Boolean(screen.actionLoadingById[item.entityId])}
              />
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    gap: 16,
    padding: 16,
  },
  header: {
    gap: 4,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filter: {
    borderWidth: 1,
    borderColor: '#C8C8CC',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  activeFilter: {
    borderColor: '#007AFF',
    backgroundColor: '#EAF3FF',
  },
  notice: {
    borderLeftWidth: 3,
    borderLeftColor: '#FF3B30',
    padding: 10,
    backgroundColor: '#FFEBEE',
  },
  summary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryItem: {
    minWidth: 110,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    padding: 12,
  },
  item: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    gap: 10,
    paddingTop: 12,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});

export default ReviewQueueScreen;
