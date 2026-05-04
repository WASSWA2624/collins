import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import {
  addFacility,
  createMembershipRequest,
  getEquipmentProfile,
  getFacility,
  listFacilities,
  patchEquipmentProfile,
  requestVerification,
  updateMembership,
} from './facilities.controller.js';
import {
  createFacilitySchema,
  facilityIdSchema,
  facilitySearchSchema,
  membershipRequestSchema,
  updateEquipmentProfileSchema,
  updateMembershipSchema,
} from './facilities.validators.js';

export const facilitiesRouter = Router();

facilitiesRouter.get('/search', validateRequest(facilitySearchSchema), listFacilities);
facilitiesRouter.get('/', validateRequest(facilitySearchSchema), listFacilities);
facilitiesRouter.post('/', requireAuth, validateRequest(createFacilitySchema), addFacility);
facilitiesRouter.get('/:id', validateRequest(facilityIdSchema), getFacility);
facilitiesRouter.post('/:id/request-verification', requireAuth, validateRequest(facilityIdSchema), requestVerification);
facilitiesRouter.get('/:id/equipment-profile', validateRequest(facilityIdSchema), getEquipmentProfile);
facilitiesRouter.patch('/:id/equipment-profile', requireAuth, validateRequest(updateEquipmentProfileSchema), patchEquipmentProfile);
facilitiesRouter.post('/:id/memberships/request', requireAuth, validateRequest(membershipRequestSchema), createMembershipRequest);
facilitiesRouter.patch('/:id/memberships/:membershipId', requireAuth, validateRequest(updateMembershipSchema), updateMembership);
