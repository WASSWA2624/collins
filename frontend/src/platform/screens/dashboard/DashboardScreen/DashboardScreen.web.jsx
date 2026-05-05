/**
 * DashboardScreen Component - Web
 * File: DashboardScreen.web.jsx
 */
import React from 'react';
import { Text } from '@platform/components';
import {
  StyledContainer,
  StyledContent,
  StyledHeader,
  StyledHeaderRow,
  StyledMetricGrid,
  StyledMetricTile,
  StyledRefreshButton,
  StyledRow,
  StyledSection,
  StyledSections,
  StyledTab,
  StyledTabs,
} from './DashboardScreen.web.styles';
import useDashboardScreen from './useDashboardScreen';

const formatValue = (value) => String(Number.isFinite(Number(value)) ? Number(value) : 0);

const DashboardScreenWeb = () => {
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
    <StyledContainer aria-label="Dashboards" data-testid={testIds.screen}>
      <StyledContent>
        <StyledHeader>
          <StyledHeaderRow>
            <Text as="h1" variant="h1" data-testid={testIds.title}>
              Dashboards
            </Text>
            <StyledRefreshButton
              type="button"
              onClick={refresh}
              aria-label="Refresh dashboard"
              data-testid={testIds.refresh}
            >
              Refresh
            </StyledRefreshButton>
          </StyledHeaderRow>
          <Text variant="caption">{scopeLabel}</Text>
          <Text variant="caption">Aggregate counts only. Patient identifiers are not shown.</Text>
        </StyledHeader>

        {!hasAccess ? (
          <Text variant="body">Dashboard access requires an approved facility role.</Text>
        ) : (
          <>
            <StyledTabs role="tablist" aria-label="Dashboard views" data-testid={testIds.tabs}>
              {tabs.map((tab) => (
                <StyledTab
                  key={tab.id}
                  type="button"
                  role="tab"
                  $active={tab.id === activeType}
                  aria-selected={tab.id === activeType}
                  onClick={() => setActiveType(tab.id)}
                >
                  {tab.label}
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
                    <StyledMetricTile key={metric.label} data-testid={`${testIds.metric}-${metric.label}`}>
                      <Text variant="caption">{metric.label}</Text>
                      <Text variant="h2">{formatValue(metric.value)}</Text>
                    </StyledMetricTile>
                  ))}
                </StyledMetricGrid>

                <StyledSections>
                  {sections.map((section) => (
                    <StyledSection key={section.id} data-testid={`${testIds.section}-${section.id}`}>
                      <Text as="h2" variant="h3">
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
                </StyledSections>

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

export default DashboardScreenWeb;
