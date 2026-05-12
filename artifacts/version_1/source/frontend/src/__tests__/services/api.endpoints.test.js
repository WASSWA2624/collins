/**
 * Services API Endpoints Tests
 * File: api.endpoints.test.js
 */
import { endpoints } from '@services/api/endpoints';

describe('services/api/endpoints', () => {
  it('re-exports config endpoints', () => {
    expect(endpoints).toBeDefined();
    expect(endpoints.AUTH).toBeDefined();
  });

  it('defines three-step New Patient endpoints', () => {
    expect(endpoints.NEW_PATIENTS.THREE_STEP_PATIENT_REASON).toContain('/new-patients/three-step/patient-reason');
    expect(endpoints.NEW_PATIENTS.THREE_STEP_OXYGEN_ABG_VENTILATOR('admission-1')).toContain(
      '/new-patients/admission-1/three-step/oxygen-abg-ventilator'
    );
    expect(endpoints.NEW_PATIENTS.THREE_STEP_SAVE_REVIEW('admission-1')).toContain(
      '/new-patients/admission-1/three-step/save-review'
    );
    expect(endpoints.NEW_PATIENTS.CURRENT_READINGS('admission-1')).toContain(
      '/new-patients/admission-1/current-readings'
    );
  });

  it('defines administrator user-management endpoints', () => {
    expect(endpoints.ADMIN.USERS).toContain('/admin/users');
    expect(endpoints.ADMIN.USER('user-1')).toContain('/admin/users/user-1');
    expect(endpoints.ADMIN.USER_FACILITIES('user-1')).toContain('/admin/users/user-1/facilities');
    expect(endpoints.ADMIN.USER_MEMBERSHIPS('user-1')).toContain('/admin/users/user-1/facility-memberships');
    expect(endpoints.ADMIN.USER_MEMBERSHIP('user-1', 'membership-1')).toContain(
      '/admin/users/user-1/facility-memberships/membership-1'
    );
  });

  it('defines administrator facility-management endpoints', () => {
    expect(endpoints.ADMIN.FACILITIES).toContain('/admin/facilities');
    expect(endpoints.ADMIN.FACILITY('facility-1')).toContain('/admin/facilities/facility-1');
    expect(endpoints.ADMIN.VERIFY_FACILITY('facility-1')).toContain('/admin/facilities/facility-1/verify');
  });
});
