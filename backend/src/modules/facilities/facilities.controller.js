import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import { buildAuditContext } from '../../utils/audit.js';
import {
  createFacility,
  decideFacilityVerification,
  getFacilityById,
  getMyFacilities,
  requestFacilityVerification,
  requestMembership,
  searchFacilities,
  updateEquipmentProfile,
  updateMembershipDecision,
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
      hasNextPage: (result.page * result.limit) < result.total,
    },
  });
});

export const addFacility = asyncHandler(async (req, res) => {
  const facility = await createFacility(req.validated.body, req.user?.sub || null, buildAuditContext(req));
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
  const facility = await requestFacilityVerification(req.validated.params.id, req.user?.sub, buildAuditContext(req));
  return successResponse(res, {
    message: 'Facility verification requested',
    data: { facility },
  });
});

export const verifyFacility = asyncHandler(async (req, res) => {
  const facility = await decideFacilityVerification(req.validated.params.id, req.validated.body, req.user?.sub, buildAuditContext(req));
  return successResponse(res, {
    message: 'Facility verification updated',
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
  const facility = await updateEquipmentProfile(req.validated.params.id, req.validated.body, req.user?.sub, buildAuditContext(req));
  return successResponse(res, {
    message: 'Equipment profile updated',
    data: { facility },
  });
});

export const createMembershipRequest = asyncHandler(async (req, res) => {
  const membership = await requestMembership({
    facilityId: req.validated.params.id,
    userId: req.user?.sub,
    role: req.validated.body.role,
  }, buildAuditContext(req));

  return successResponse(res, {
    status: 201,
    message: 'Facility membership requested',
    data: { membership },
  });
});

export const updateMembership = asyncHandler(async (req, res) => {
  const membership = await updateMembershipDecision(
    req.validated.params.id,
    req.validated.params.membershipId,
    req.validated.body,
    req.user?.sub,
    buildAuditContext(req)
  );
  return successResponse(res, {
    message: 'Facility membership updated',
    data: { membership },
  });
});

export const myFacilities = asyncHandler(async (req, res) => {
  const memberships = await getMyFacilities(req.user?.sub);
  return successResponse(res, {
    message: 'User facilities loaded',
    data: { memberships },
  });
});
