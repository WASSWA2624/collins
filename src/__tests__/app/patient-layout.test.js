/**
 * Patient Layout Tests
 * File: patient-layout.test.js
 */
import PatientLayout from '@app/(patient)/_layout';
import PatientRouteLayout from '@platform/layouts/RouteLayouts/PatientRouteLayout';

describe('app/(patient)/_layout.jsx', () => {
  it('re-exports PatientRouteLayout as default', () => {
    expect(PatientLayout).toBe(PatientRouteLayout);
  });
});
