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

  it('defines three-step admission endpoints', () => {
    expect(endpoints.ADMISSIONS.THREE_STEP_PATIENT_REASON).toContain('/admissions/three-step/patient-reason');
    expect(endpoints.ADMISSIONS.THREE_STEP_OXYGEN_ABG_VENTILATOR('admission-1')).toContain(
      '/admissions/admission-1/three-step/oxygen-abg-ventilator'
    );
    expect(endpoints.ADMISSIONS.THREE_STEP_SAVE_REVIEW('admission-1')).toContain(
      '/admissions/admission-1/three-step/save-review'
    );
    expect(endpoints.ADMISSIONS.ABG_VENTILATOR_UPDATES('admission-1')).toContain(
      '/admissions/admission-1/abg-ventilator-updates'
    );
  });

  it('defines administrator user-management endpoints', () => {
    expect(endpoints.ADMIN.USERS).toContain('/admin/users');
    expect(endpoints.ADMIN.USER_MEMBERSHIPS('user-1')).toContain('/admin/users/user-1/facility-memberships');
    expect(endpoints.ADMIN.USER_MEMBERSHIP('user-1', 'membership-1')).toContain(
      '/admin/users/user-1/facility-memberships/membership-1'
    );
  });
});
