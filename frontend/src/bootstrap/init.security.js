/**
 * Security Initialization
 * File: init.security.js
 */
import { tokenManager } from '@security';
import { logger } from '@logging';

export async function initSecurity() {
  try {
    // Check if tokens exist and are valid
    const accessToken = await tokenManager.getAccessToken();
    const refreshToken = await tokenManager.getRefreshToken();
    
    if (accessToken) {
      const isExpired = tokenManager.isTokenExpired(accessToken);
      if (isExpired && refreshToken) {
        logger.info('Access token expired, refresh token available');
      } else if (isExpired) {
        logger.info('Tokens expired, user will need to re-authenticate');
      } else {
        logger.info('Valid session found on startup');
      }
    } else {
      logger.info('No session found on startup');
    }
    
    // Initialize encryption keys (if needed)
    // Encryption keys are initialized lazily when needed
    
    logger.info('Security initialized successfully');
  } catch (error) {
    // Security failures must not crash app, but should be logged
    logger.error('Security initialization failed', { error: error.message });
    // Don't throw - allow app to continue, but security features may be limited
  }
}

