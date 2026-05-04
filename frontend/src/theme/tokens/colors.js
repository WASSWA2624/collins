/**
 * Color Tokens
 * Semantic color definitions
 * File: colors.js
 */

export default {
  primary: '#007AFF',
  onPrimary: '#FFFFFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  background: {
    primary: '#FFFFFF',
    secondary: '#F2F2F7',
    tertiary: '#E5E5EA',
  },
  text: {
    primary: '#000000',
    secondary: '#3C3C43',
    tertiary: '#8E8E93',
    inverse: '#FFFFFF',
  },
  // Convenience semantic aliases used throughout UI (avoid hardcoding in components)
  textPrimary: '#000000',
  textSecondary: '#3C3C43',
  audit: {
    action: {
      CREATE: '#34C759',
      UPDATE: '#007AFF',
      DELETE: '#FF3B30',
      APPROVE: '#34C759',
      REJECT: '#FF3B30',
      SUSPEND: '#FF9500',
      ACTIVATE: '#34C759',
      LOGIN: '#5856D6',
      LOGOUT: '#8E8E93',
      default: '#8E8E93',
    },
    entity: {
      USER: '#007AFF',
      PRODUCT: '#34C759',
      ORDER: '#5856D6',
      VENDOR: '#FF9500',
      SHOP: '#FF9500',
      PAYMENT: '#34C759',
      CERTIFICATE: '#007AFF',
      RECALL: '#FF3B30',
      default: '#8E8E93',
    },
  },
  status: {
    error: {
      background: '#FFEBEE',
      text: '#C62828',
    },
    warning: {
      background: '#FFF3CD',
      text: '#856404',
    },
  },
  overlay: {
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
};

