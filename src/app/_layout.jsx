import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Slot } from 'expo-router';
import { ErrorBoundary } from '@errors';
import { I18nProvider } from '@i18n';
import { bootstrapApp } from '@bootstrap';
import { logger } from '@logging';
import store from '@store';
import {
  StyledRootContainer,
  StyledLoadingContainer,
  StyledActivityIndicator,
} from '@platform/layouts/common/RootLayoutStyles';
import ThemeProviderWrapper from '@platform/layouts/common/ThemeProviderWrapper';

/**
 * Root Layout Component
 * 
 * This is the root layout for Expo App Router.
 * All providers will be added here in subsequent steps.
 * 
 * Per app-router.mdc: Root layout responsibilities (providers/startup wiring)
 * are defined in bootstrap-config.mdc.
 * 
 * Per bootstrap-config.mdc: ErrorBoundary is mounted only in root layout.
 * Per errors-logging.mdc: ErrorBoundary catches render/runtime errors and displays fallback UI.
 * 
 * Per bootstrap-config.mdc: Redux Provider mounted only in root layout.
 * Per state-management.mdc: Store access patterns via Provider.
 * 
 * Per bootstrap-config.mdc: ThemeProvider mounted only in root layout.
 * Per theme-design.mdc: Theme consumption via styled-components.
 * 
 * Per bootstrap-config.mdc: Localization Provider mounted only in root layout.
 * Per i18n.mdc: i18n provider/registry, locale handling.
 * 
 * Per bootstrap-config.mdc: Bootstrap runs in correct order (security → store → theme → offline)
 * before rendering providers. Bootstrap errors are handled gracefully per bootstrap-config.mdc.
 * 
 * Note: Expo Router root layout uses <Slot /> to render child routes, not {children}
 */
const RootLayout = () => {
  const [isBootstrapReady, setIsBootstrapReady] = useState(false);
  const [bootstrapError, setBootstrapError] = useState(null);

  const isNonFatalBootstrapError = (error) =>
    Boolean(error?.nonFatal) || error?.name === 'NonFatalBootstrapError';

  useEffect(() => {
    /**
     * Initialize app systems in correct order per bootstrap-config.mdc:
     * 1. Security (protects everything)
     * 2. Store (required by most layers)
     * 3. Theme (required by UI)
     * 4. Offline (depends on store and services)
     */
    const initializeApp = async () => {
      try {
        await bootstrapApp();
        setIsBootstrapReady(true);
      } catch (error) {
        // Per bootstrap-config.mdc: Fatal errors must block rendering
        // Non-fatal errors must be logged
        // Per errors-logging.mdc: Log errors via logger
        logger.error('Bootstrap initialization failed', {
          error: error.message,
          stack: error.stack,
        });

        // Per bootstrap-config.mdc: non-fatal errors are logged but should not block rendering.
        if (isNonFatalBootstrapError(error)) {
          setIsBootstrapReady(true);
          return;
        }

        // Store error to block rendering (fatal error)
        setBootstrapError(error);
      }
    };

    initializeApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Per bootstrap-config.mdc: Fatal errors must block rendering
  if (bootstrapError) {
    // ErrorBoundary will handle this, but we prevent rendering providers
    // until bootstrap succeeds
    return (
      <ErrorBoundary>
        <StyledLoadingContainer>
          <StyledActivityIndicator size="large" />
        </StyledLoadingContainer>
      </ErrorBoundary>
    );
  }

  // Per bootstrap-config.mdc: Add loading state while bootstrap completes
  if (!isBootstrapReady) {
    return (
      <ErrorBoundary>
        <StyledLoadingContainer>
          <StyledActivityIndicator size="large" />
        </StyledLoadingContainer>
      </ErrorBoundary>
    );
  }

  // Bootstrap completed successfully, render providers
  const persistor = store?.persistor;
  const appContent = (
    <ThemeProviderWrapper>
      <I18nProvider>
        <StyledRootContainer>
          <Slot />
        </StyledRootContainer>
      </I18nProvider>
    </ThemeProviderWrapper>
  );

  return (
    <ErrorBoundary>
      <Provider store={store}>
        {persistor ? (
          <PersistGate
            loading={
              <StyledLoadingContainer>
                <StyledActivityIndicator size="large" />
              </StyledLoadingContainer>
            }
            persistor={persistor}
          >
            {appContent}
          </PersistGate>
        ) : (
          appContent
        )}
      </Provider>
    </ErrorBoundary>
  );
};

export default RootLayout;

