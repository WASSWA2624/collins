/**
 * Error Boundary Component
 * Catches React rendering errors
 * File: ErrorBoundary.jsx
 */
import React from 'react';
import { logger } from '@logging';
import { handleError } from './error.handler';
import FallbackUI from './fallback.ui';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    const normalized = handleError(error, { errorInfo });
    logger.error('ErrorBoundary caught error', {
      error: normalized,
      errorInfo,
    });
    this.setState({ error: normalized });
  }

  render() {
    if (this.state.hasError) {
      return (
        <FallbackUI
          error={this.state.error}
          onRetry={() => this.setState({ hasError: false, error: null })}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

