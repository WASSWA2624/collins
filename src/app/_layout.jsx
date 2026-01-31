import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
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
        
        // Store error to block rendering (fatal error)
        setBootstrapError(error);
        
        // Note: ErrorBoundary will catch if this causes a render error
        // For now, we'll log and set error state to prevent rendering
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
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProviderWrapper>
          <I18nProvider>
            <StyledRootContainer>
              <Slot />
            </StyledRootContainer>
          </I18nProvider>
        </ThemeProviderWrapper>
      </Provider>
    </ErrorBoundary>
  );
};

export default RootLayout;

