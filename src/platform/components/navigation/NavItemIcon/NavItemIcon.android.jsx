/**
 * NavItemIcon for Android Platform
 * File: NavItemIcon.android.jsx
 * Uses Material Design-style Unicode icons for Android
 */

import React from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components/native';

// Icon name to Unicode/Material Design symbol mapping for Android
const iconSymbolMap = {
  Home: '⌂',
  Overview: '▦',
  Cog: '⚙',
  Settings: '⚙',
  Building: '🏢',
  Folder: '📁',
  Facilities: '🏢',
  Tenants: '🏢',
  Branches: '🌳',
  Departments: '🏢',
  Units: '📦',
  Rooms: '🚪',
  Wards: '🏥',
  Beds: '🛏',
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
  Shield: '🛡',
  Phone: '📞',
  MapPin: '📍',
  Search: '⊙',
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
  color: ${({ color, theme }) => color || theme?.colors?.text?.primary || '#212121'};
  font-weight: 500;
`;

/**
 * NavItemIcon Component for Android
 * Renders Material Design-style icons for Android
 *
 * @param {Object} props - Component props
 * @param {string} props.name - Icon identifier (e.g., 'Cog', 'Building', 'User')
 * @param {number} props.size - Icon size in pixels (default: 24)
 * @param {string} props.color - Icon color (uses theme if not provided)
 *
 * @returns {JSX.Element} Material Design style icon for Android
 */
const NavItemIcon = ({
  name = 'Menu',
  size = 24,
  color = undefined,
}) => {
  const symbol = iconSymbolMap[name] || '•';

  return (
    <StyledIconContainer size={size} testID={`nav-item-icon-android-${name}`}>
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
