import { asyncHandler } from '../../utils/asyncHandler.js';
import { plannedResponse, successResponse } from '../../utils/apiResponse.js';
import {
  createFacility,
  getFacilityById,
  getMyFacilities,
  requestFacilityVerification,
  requestMembership,
  searchFacilities,
  updateEquipmentProfile,
} from './facilities.service.js';

export const listFacilities = asyncHandler(async (req, res) => {
  const result = await searchFacilities(req.validated.query);
  return successResponse(res, {
    message: 'Facilities loaded',
    data: result.items,
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
    },
  });
});

export const addFacility = asyncHandler(async (req, res) => {
  const facility = await createFacility(req.validated.body);
  return successResponse(res, {
    status: 201,
    message: 'Facility created',
    data: { facility },
  });
});

export const getFacility = asyncHandler(async (req, res) => {
  const facility = await getFacilityById(req.validated.params.id);
  return successResponse(res, {
    message: 'Facility loaded',
    data: { facility },
  });
});

export const requestVerification = asyncHandler(async (req, res) => {
  const facility = await requestFacilityVerification(req.validated.params.id);
  return successResponse(res, {
    message: 'Facility verification requested',
    data: { facility },
  });
});

export const getEquipmentProfile = asyncHandler(async (req, res) => {
  const facility = await getFacilityById(req.validated.params.id);
  return successResponse(res, {
    message: 'Equipment profile loaded',
    data: {
      oxygenProfileJson: facility.oxygenProfileJson,
      ventilatorProfileJson: facility.ventilatorProfileJson,
      abgAvailability: facility.abgAvailability,
    },
  });
});

export const patchEquipmentProfile = asyncHandler(async (req, res) => {
  const facility = await updateEquipmentProfile(req.validated.params.id, req.validated.body);
  return successResponse(res, {
    message: 'Equipment profile updated',
    data: { facility },
  });
});

export const createMembershipRequest = asyncHandler(async (req, res) => {
  const userId = req.user?.sub;
  if (!userId) {
    const error = new Error('Authentication required');
    error.status = 401;
    throw error;
  }

  const membership = await requestMembership({
    facilityId: req.validated.params.id,
    userId,
    role: req.validated.body.role,
  });

  return successResponse(res, {
    status: 201,
    message: 'Facility membership requested',
    data: { membership },
  });
});

export const updateMembership = (_req, res) => plannedResponse(res, 'Facility membership approval/update');

export const myFacilities = asyncHandler(async (req, res) => {
  const memberships = await getMyFacilities(req.user?.sub);
  return successResponse(res, {
    message: 'User facilities loaded',
    data: { memberships },
  });
});
