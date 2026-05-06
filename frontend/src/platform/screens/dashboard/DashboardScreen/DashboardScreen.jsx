import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from '@platform/components';
import { useI18n } from '@hooks';
import useDashboardScreen from './useDashboardScreen';

const renderRows = (rows) => rows.map((row) => (
  <View key={row.label} style={styles.row}>
    <Text variant="body">{row.label}</Text>
    <Text variant="label">{row.value}</Text>
  </View>
));

const DashboardScreen = () => {
  const { t } = useI18n();
  const screen = useDashboardScreen();

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      testID={screen.testIds.screen}
      accessibilityLabel={t('navigation.items.main.dashboard')}
    >
      <View style={styles.header}>
        <Text variant="h1" testID={screen.testIds.title}>
          {t('navigation.items.main.dashboard')}
        </Text>
        <Text variant="body">{screen.scopeLabel}</Text>
      </View>

      <View style={styles.tabs} testID={screen.testIds.tabs}>
        {screen.tabs.map((tab) => {
          const isActive = tab.id === screen.activeType;
          return (
            <Pressable
              key={tab.id}
              onPress={() => screen.setActiveType(tab.id)}
              style={[styles.tab, isActive ? styles.activeTab : null]}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <Text variant="label">{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Button text={t('common.retry')} onPress={screen.refresh} loading={screen.isLoading} testID={screen.testIds.refresh} />

      {screen.isLoading ? (
        <View style={styles.notice}>
          <Text variant="body">Loading dashboard...</Text>
        </View>
      ) : null}

      {screen.errorMessage ? (
        <View style={[styles.notice, styles.errorNotice]} accessibilityRole="alert">
          <Text variant="label">{screen.errorTitle}</Text>
          <Text variant="body">{screen.errorMessage}</Text>
          <Button text={t('common.retry')} onPress={screen.refresh} />
        </View>
      ) : null}

      {!screen.isLoading && !screen.errorMessage && !screen.dashboard ? (
        <View style={styles.notice}>
          <Text variant="body">No dashboard data available.</Text>
        </View>
      ) : null}

      <View style={styles.grid}>
        {screen.metrics.map((metric) => (
          <View key={metric.label} style={styles.metric} testID={`${screen.testIds.metric}-${metric.label}`}>
            <Text variant="caption">{metric.label}</Text>
            <Text variant="h2">{metric.value}</Text>
          </View>
        ))}
      </View>

      {screen.sections.map((section) => (
        <View key={section.id} style={styles.section} testID={`${screen.testIds.section}-${section.id}`}>
          <Text variant="h3">{section.title}</Text>
          {renderRows(section.rows)}
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
  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tab: {
    borderWidth: 1,
    borderColor: '#C8C8CC',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  activeTab: {
    borderColor: '#007AFF',
    backgroundColor: '#EAF3FF',
  },
  notice: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    padding: 10,
    backgroundColor: '#F2F2F7',
    gap: 8,
  },
  errorNotice: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFEBEE',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metric: {
    minWidth: 140,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    padding: 12,
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    gap: 8,
    paddingTop: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
});

export default DashboardScreen;
