/**
 * FacilitySearchSelect
 * Platform dispatcher for searchable facility selection.
 * File: FacilitySearchSelect.jsx
 */
import { Platform } from 'react-native';

const FacilitySearchSelect = Platform.OS === 'web'
  ? require('./FacilitySearchSelect.web').default
  : require('./FacilitySearchSelect.native').default;

export default FacilitySearchSelect;
