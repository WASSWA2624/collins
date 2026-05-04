# Phase 1 — Foundation, Security, and Facility Model

## Goal

Create the secure operating foundation for Ugandan facility-based ICU/HDU use.

## Scope

- Harden auth routes: register, login, logout, refresh, current user.
- Add refresh-token rotation and account lockout planning.
- Implement facility membership RBAC middleware.
- Add facility search and manual facility creation.
- Add NHFR/Master Facility List integration boundary.
- Add facility verification workflow for platform admins.
- Add facility equipment profile: ICU/HDU availability, ventilator count/type, oxygen source, ABG availability.
- Add audit logging for auth-sensitive events, memberships, facility verification, and equipment profile changes.

## Done when

- A user can register, log in, request facility membership, and access only approved facility data.
- Facility admins can manage one facility only.
- Platform admins can verify/reject/suspend facilities.
- Unauthorized cross-facility reads/writes fail.
- Tests cover auth, RBAC, facility membership, and audit creation.
