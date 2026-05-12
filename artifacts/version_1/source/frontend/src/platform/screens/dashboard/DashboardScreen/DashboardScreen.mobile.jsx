/**
 * DashboardScreen Component - Mobile
 * File: DashboardScreen.mobile.jsx
 */
import React from 'react';
import { useWindowDimensions } from 'react-native';
import { Text } from '@platform/components';
import {
  StyledContainer,
  StyledContent,
  StyledHeader,
  StyledHeaderRow,
  StyledMetricGrid,
  StyledMetricInner,
  StyledMetricTile,
  StyledRefreshButton,
  StyledRow,
  StyledSection,
  StyledSections,
  StyledStatusActions,
  StyledStatusPanel,
  StyledTab,
  StyledTabs,
} from './DashboardScreen.native.styles';
import useDashboardScreen from './useDashboardScreen';

const formatValue = (value) => String(Number.isFinite(Number(value)) ? Number(value) : 0);
const getMetricColumns = (width) => {
  if (width >= 720) return 3;
  if (width >= 360) return 2;
  return 1;
};
const getSectionColumns = (width) => (width >= 720 ? 2 : 1);
const headerTitleStyle = { flexShrink: 1 };
const rowLabelStyle = { flex: 1, paddingRight: 8 };
const rowValueStyle = { flexShrink: 0, textAlign: 'right' };

const DashboardScreenMobile = () => {
  const { width } = useWindowDimensions();
  const {
    activeType,
    dashboard,
    emptyMessage,
    errorMessage,
    errorTitle,
    isLoading,
    metrics,
    refresh,
    scopeLabel,
    sections,
    setActiveType,
    tabs,
    testIds,
    visibleTypes,
  } = useDashboardScreen();

  const hasAccess = visibleTypes.length > 0;
  const metricColumns = getMetricColumns(width);
  const sectionColumns = getSectionColumns(width);

  return (
    <StyledContainer
      accessibilityLabel="Dashboards"
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      testID={testIds.screen}
    >
      <StyledContent>
        <StyledHeader>
          <StyledHeaderRow>
            <Text
              variant="h1"
              accessibilityRole="header"
              style={headerTitleStyle}
              testID={testIds.title}
            >
              Dashboards
            </Text>
            <StyledRefreshButton
              disabled={isLoading}
              onPress={refresh}
              accessibilityRole="button"
              accessibilityLabel="Refresh dashboard"
              accessibilityState={{ disabled: isLoading, busy: isLoading }}
              testID={testIds.refresh}
            >
              <Text variant="label">Refresh</Text>
            </StyledRefreshButton>
          </StyledHeaderRow>
          <Text variant="caption">{scopeLabel}</Text>
          <Text variant="caption">
            Aggregate counts only. Patient identifiers are not shown.
          </Text>
        </StyledHeader>

        {!hasAccess ? (
          <Text variant="body">Dashboard access requires an approved facility role.</Text>
        ) : (
          <>
            <StyledTabs testID={testIds.tabs}>
              {tabs.map((tab) => (
                <StyledTab
                  key={tab.id}
                  $active={tab.id === activeType}
                  disabled={isLoading}
                  onPress={() => setActiveType(tab.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: tab.id === activeType, disabled: isLoading }}
                  accessibilityLabel={tab.label}
                >
                  <Text
                    variant="label"
                    align="center"
                    color={tab.id === activeType ? 'text.inverse' : 'text.primary'}
                  >
                    {tab.label}
                  </Text>
                </StyledTab>
              ))}
            </StyledTabs>

            {isLoading ? (
              <StyledStatusPanel $tone="loading" accessibilityRole="none">
                <Text variant="body">{dashboard ? 'Refreshing dashboard...' : 'Loading dashboard...'}</Text>
              </StyledStatusPanel>
            ) : null}
            {errorMessage ? (
              <StyledStatusPanel $tone="error" accessibilityRole="alert">
                <Text variant="label" color="status.error.text">
                  {errorTitle}
                </Text>
                <Text variant="body" color="status.error.text">
                  {errorMessage}
                </Text>
                <StyledStatusActions>
                  <StyledRefreshButton
                    onPress={refresh}
                    accessibilityRole="button"
                    accessibilityLabel="Retry loading dashboard"
                  >
                    <Text variant="label">Retry</Text>
                  </StyledRefreshButton>
                </StyledStatusActions>
              </StyledStatusPanel>
            ) : null}
            {!isLoading && !errorMessage && !dashboard ? (
              <StyledStatusPanel $tone="empty" accessibilityRole="none">
                <Text variant="body">{emptyMessage}</Text>
              </StyledStatusPanel>
            ) : null}

            {dashboard ? (
              <>
                <StyledMetricGrid>
                  {metrics.map((metric) => (
                    <StyledMetricTile
                      key={metric.label}
                      $columns={metricColumns}
                      testID={`${testIds.metric}-${metric.label}`}
                    >
                      <StyledMetricInner>
                        <Text variant="caption">{metric.label}</Text>
                        <Text variant="h2">{formatValue(metric.value)}</Text>
                      </StyledMetricInner>
                    </StyledMetricTile>
                  ))}
                </StyledMetricGrid>

                <StyledSections>
                  {sections.map((section) => (
                    <StyledSection
                      key={section.id}
                      $columns={sectionColumns}
                      testID={`${testIds.section}-${section.id}`}
                    >
                      <Text variant="h3" accessibilityRole="header">
                        {section.title}
                      </Text>
                      {section.rows.map((item) => (
                        <StyledRow key={`${section.id}-${item.label}`}>
                          <Text variant="body" style={rowLabelStyle}>{item.label}</Text>
                          <Text variant="label" style={rowValueStyle}>{formatValue(item.value)}</Text>
                        </StyledRow>
                      ))}
                    </StyledSection>
                  ))}
                </StyledSections>

                {dashboard.safetyStatement ? (
                  <StyledSection $columns={1}>
                    <Text variant="caption">{dashboard.safetyStatement}</Text>
                  </StyledSection>
                ) : null}
              </>
            ) : null}
          </>
        )}
      </StyledContent>
    </StyledContainer>
  );
};

export default DashboardScreenMobile;
