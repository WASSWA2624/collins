/**
 * NavItemIcon for iOS Platform
 * File: NavItemIcon.ios.jsx
 * Uses React Native Text components with styled-components/native
 */

import React from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components/native';

// Icon name to Unicode symbol mapping for iOS
const iconSymbolMap = {
  Home: '🏠',
  Overview: '📊',
  Cog: '⚙️',
  Settings: '⚙️',
  Building: '🏢',
  Folder: '📁',
  Facilities: '🏢',
  Tenants: '🏢',
  Branches: '🌳',
  Departments: '🏢',
  Units: '📦',
  Rooms: '🚪',
  Wards: '🏥',
  Beds: '🛏️',
  Users: '👥',
  User: '👤',
  Roles: '🔑',
  Permissions: '🔐',
  Contacts: '📞',
  Contact: '📞',
  Addresses: '📍',
  Address: '📍',
  Sessions: '💻',
  ApiKeys: '🔑',
  Mfa: '🔐',
  OAuth: '🔐',
  Lock: '🔒',
  Key: '🔑',
  Shield: '🛡️',
  Phone: '📞',
  MapPin: '📍',
  Search: '🔍',
  Menu: '☰',
  X: '✕',
  ChevronDown: '▼',
  ChevronUp: '▲',
};

const StyledIconContainer = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  flex-shrink: 0;
`;

const StyledIconText = styled(Text)`
  font-size: ${({ size }) => (size * 0.75)}px;
  line-height: ${({ size }) => size}px;
  text-align: center;
  color: ${({ color, theme }) => color || theme?.colors?.text?.primary || '#000000'};
`;

/**
 * NavItemIcon Component for iOS
 * Renders Unicode symbols as iOS-compatible icons
 *
 * @param {Object} props - Component props
 * @param {string} props.name - Icon identifier (e.g., 'Cog', 'Building', 'User')
 * @param {number} props.size - Icon size in pixels (default: 24)
 * @param {string} props.color - Icon color (uses theme if not provided)
 *
 * @returns {JSX.Element} Text-based icon for iOS
 */
const NavItemIcon = ({
  name = 'Menu',
  size = 24,
  color = undefined,
}) => {
  const symbol = iconSymbolMap[name] || '•';

  return (
    <StyledIconContainer size={size} testID={`nav-item-icon-ios-${name}`}>
      <StyledIconText
        size={size}
        color={color}
        allowFontScaling={false}
      >
        {symbol}
      </StyledIconText>
    </StyledIconContainer>
  );
};

export default NavItemIcon;
