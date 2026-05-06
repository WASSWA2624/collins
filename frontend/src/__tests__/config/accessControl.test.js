import {
  MEMBERSHIP_ROLES,
  PERMISSIONS,
  canAccessNavigationItem,
  getActiveFacilityContext,
  getFacilityOptionsForUser,
  getPermissionsForUser,
} from '@config/accessControl';
import { MAIN_NAV_ITEMS } from '@config/sideMenu';

const user = {
  id: 'user-1',
  activeFacility: {
    facilityId: 'facility-1',
    name: 'Kampala ICU',
    roles: [MEMBERSHIP_ROLES.CLINICIAN],
  },
  memberships: [
    {
      id: 'membership-1',
      facilityId: 'facility-1',
      role: MEMBERSHIP_ROLES.CLINICIAN,
      status: 'APPROVED',
      facility: { id: 'facility-1', name: 'Kampala ICU' },
    },
  ],
};

describe('accessControl', () => {
  it('derives active facility context from approved memberships', () => {
    expect(getActiveFacilityContext(user)).toMatchObject({
      facilityId: 'facility-1',
      name: 'Kampala ICU',
      roles: [MEMBERSHIP_ROLES.CLINICIAN],
    });
    expect(getFacilityOptionsForUser(user)).toHaveLength(1);
  });

  it('derives permissions from facility roles', () => {
    expect(getPermissionsForUser(user)).toEqual(expect.arrayContaining([
      PERMISSIONS.CLINICAL_READ,
      PERMISSIONS.CLINICAL_WRITE,
    ]));
  });

  it('checks facility scoped navigation permissions', () => {
    expect(canAccessNavigationItem({
      isAuthenticated: true,
      user,
      item: {
        id: 'admit',
        facilityScoped: true,
        requireActiveFacility: true,
        permissions: [PERMISSIONS.CLINICAL_WRITE],
      },
    })).toBe(true);

    expect(canAccessNavigationItem({
      isAuthenticated: true,
      user: { id: 'user-2', memberships: [] },
      item: {
        id: 'admit',
        facilityScoped: true,
        requireActiveFacility: true,
        permissions: [PERMISSIONS.CLINICAL_WRITE],
      },
    })).toBe(false);
  });

  it('exposes user management only to administrators', () => {
    const item = MAIN_NAV_ITEMS.find((navItem) => navItem.id === 'user-management');
    const adminUser = {
      id: 'admin-1',
      memberships: [{
        id: 'membership-admin',
        facilityId: 'facility-1',
        role: MEMBERSHIP_ROLES.FACILITY_ADMIN,
        status: 'APPROVED',
        facility: { id: 'facility-1', name: 'Kampala ICU' },
      }],
    };

    expect(canAccessNavigationItem({ isAuthenticated: true, user: adminUser, item })).toBe(true);
    expect(canAccessNavigationItem({ isAuthenticated: true, user, item })).toBe(false);
  });
});
