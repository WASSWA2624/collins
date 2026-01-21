/**
 * Ambulance Trip Rules
 * File: ambulance-trip.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseAmbulanceTripId = (value) => parseId(value);
const parseAmbulanceTripPayload = (value) => parsePayload(value);
const parseAmbulanceTripListParams = (value) => parseListParams(value);

export { parseAmbulanceTripId, parseAmbulanceTripPayload, parseAmbulanceTripListParams };
