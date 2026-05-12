import {
  buildUserManagementSummary,
  canManageUsers,
  normalizeManagedUser,
  normalizeManagedUsersResponse,
} from '@features/user-management';

describe('userManagement.model', () => {
  it('normalizes user role capabilities for capture and validation', () => {
    const user = normalizeManagedUser({
      id: 'user-1',
      name: 'Clinician One',
      email: 'clinician@example.com',
      memberships: [
        {
          id: 'membership-1',
          facilityId: 'facility-1',
          role: 'SPECIALIST_REVIEWER',
          status: 'APPROVED',
          facility: { id: 'facility-1', name: 'Kampala ICU' },
        },
      ],
    });

    expect(user.capabilities.canCaptureData).toBe(true);
    expect(user.capabilities.canValidateData).toBe(true);
    expect(user.memberships[0].roleLabel).toBe('Capture and validate');
  });

  it('summarizes managed users by clinical capability', () => {
    const response = normalizeManagedUsersResponse({
      data: [
        { id: 'user-1', memberships: [{ id: 'm1', role: 'CLINICIAN', status: 'APPROVED' }] },
        { id: 'user-2', memberships: [{ id: 'm2', role: 'FACILITY_ADMIN', status: 'APPROVED' }] },
      ],
      meta: { total: 2 },
    });

    expect(response.meta.total).toBe(2);
    expect(buildUserManagementSummary(response.users)).toMatchObject({
      total: 2,
      clinicians: 2,
      validators: 1,
      administrators: 1,
    });
  });

  it('allows user management for platform or facility administrators only', () => {
    expect(canManageUsers({ roles: ['PLATFORM_ADMIN'] })).toBe(true);
    expect(canManageUsers({ permissions: ['facility:admin'] })).toBe(true);
    expect(canManageUsers({ roles: ['CLINICIAN'], permissions: ['clinical:write'] })).toBe(false);
  });
});
