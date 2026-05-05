/**
 * DashboardScreen Component - Mobile
 * File: DashboardScreen.mobile.jsx
 */
import React from 'react';
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
  StyledTab,
  StyledTabs,
} from './DashboardScreen.native.styles';
import useDashboardScreen from './useDashboardScreen';

const formatValue = (value) => String(Number.isFinite(Number(value)) ? Number(value) : 0);

const DashboardScreenMobile = () => {
  const {
    activeType,
    dashboard,
    errorMessage,
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

  return (
    <StyledContainer accessibilityLabel="Dashboards" testID={testIds.screen}>
      <StyledContent>
        <StyledHeader>
          <StyledHeaderRow>
            <Text variant="h1" accessibilityRole="header" testID={testIds.title}>
              Dashboards
            </Text>
            <StyledRefreshButton
              onPress={refresh}
              accessibilityRole="button"
              accessibilityLabel="Refresh dashboard"
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
                  onPress={() => setActiveType(tab.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: tab.id === activeType }}
                  accessibilityLabel={tab.label}
                >
                  <Text variant="label">{tab.label}</Text>
                </StyledTab>
              ))}
            </StyledTabs>

            {isLoading ? <Text variant="body">Loading dashboard...</Text> : null}
            {errorMessage ? <Text variant="body">{errorMessage}</Text> : null}
            {!isLoading && !errorMessage && !dashboard ? (
              <Text variant="body">No dashboard data available.</Text>
            ) : null}

            {dashboard ? (
              <>
                <StyledMetricGrid>
                  {metrics.map((metric) => (
                    <StyledMetricTile key={metric.label} testID={`${testIds.metric}-${metric.label}`}>
                      <StyledMetricInner>
                        <Text variant="caption">{metric.label}</Text>
                        <Text variant="h2">{formatValue(metric.value)}</Text>
                      </StyledMetricInner>
                    </StyledMetricTile>
                  ))}
                </StyledMetricGrid>

                {sections.map((section) => (
                  <StyledSection key={section.id} testID={`${testIds.section}-${section.id}`}>
                    <Text variant="h3" accessibilityRole="header">
                      {section.title}
                    </Text>
                    {section.rows.map((item) => (
                      <StyledRow key={`${section.id}-${item.label}`}>
                        <Text variant="body">{item.label}</Text>
                        <Text variant="label">{formatValue(item.value)}</Text>
                      </StyledRow>
                    ))}
                  </StyledSection>
                ))}

                {dashboard.safetyStatement ? (
                  <StyledSection>
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
