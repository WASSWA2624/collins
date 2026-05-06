/**
 * FacilitySearchSelect
 * Platform dispatcher for registration-time facility selector.
 * File: FacilitySearchSelect.jsx
 */
import { Platform } from 'react-native';

const FacilitySearchSelect = Platform.OS === 'web'
  ? require('./FacilitySearchSelect.web').default
  : require('./FacilitySearchSelect.native').default;

export default FacilitySearchSelect;
