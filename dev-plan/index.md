# HMS Frontend Development Plan

## Purpose
This development plan provides a **complete, step-by-step, chronological guide** for building the React Native (Expo + App Router) HMS application. Each step is **modular**, creates the **smallest unit** of functionality, and ensures **100% compliance** with project rules defined in `.cursor/rules/` and alignment with `hms-backend/write-up.md` plus `hms-backend/dev-plan/`.

## Principles
- **Modularity**: Each step is independent and testable
- **Reproducibility**: Any developer following this plan will produce the same application
- **Rule Compliance**: Every step strictly follows `.cursor/rules/` standards (rules are not redefined here)
- **Incremental**: Each step builds on previous steps
- **Testable**: Every step includes testing requirements

## Development Order
The plan follows the **layered architecture** and **initialization order**, but intentionally implements **reusable app building blocks first** and **app-specific features last**.

**IMPORTANT**: Phases 0-8 are **generic React Native app building blocks** that apply to any React Native application without requiring modifications. HMS-specific implementations start in Phase 9.

1. **Foundation** → Config, Utils, Logging, Errors (generic)
2. **Infrastructure** → Services, Security (generic)
3. **State & Theme** → Store, Theme System (generic)
4. **Offline** → Offline-first architecture + Bootstrap layer (wires security, store, theme, offline) (generic)
5. **Reusable Hooks** → Cross-cutting hooks used by any app (used by UI patterns) (generic)
6. **Reusable Platform UI Foundation** → Primitives, patterns, layouts (no domain coupling) (generic)
7. **App Shell (App Router + Guards)** → Providers, route groups, navigation shell, error routes (generic)
8. **Minimal Runnable App** → Landing page, home screen, error routes (verify app runs before features) (generic)
9. **Base Layouts & Global UI** → Layouts, headers, footers, navigation, theme/language controls, shared UI shell (**app-specific starts here**)
10. **Core Features** → Implement HMS core modules (auth, tenancy, RBAC, patient registry, scheduling, clinical, diagnostics, pharmacy, inventory, emergency, billing, HR, reporting, notifications, subscriptions, compliance, integrations) (**app-specific**)
11. **Screens & Routes** → Implement screens, routes, and UI wiring for all core modules (**app-specific**)
12. **Advanced Features** → Optional modules and advanced capabilities (telemedicine, patient engagement, AI insights, research, PACS/IoT integrations) (**app-specific**)
13. **Finalization** → Onboarding/help + comprehensive testing/polish (**app-specific**)

## File Structure
- `P000_setup.md` - Project initialization
- `P001_foundation.md` - Foundation layer (config, utils, logging, errors, i18n)
- `P002_infrastructure.md` - Infrastructure layer (services, security)
- `P003_state-theme.md` - State management & theming (light, dark, high-contrast)
- `P004_offline.md` - Offline-first architecture + Bootstrap layer
- `P005_reusable-hooks.md` - Reusable Hooks (cross-cutting hooks; no feature hooks)
- `P006_platform-ui-foundation.md` - Reusable Platform UI Foundation (primitives, patterns, layouts)
- `P007_app-shell.md` - App Shell (App Router + guards + navigation skeleton)
- `P008_minimal-app.md` - Minimal Runnable App (landing page, home screen, error routes)
- `P009_app-layouts.md` - Base Layouts & Global UI (headers, footers, navigation, theme/i18n controls, etc)
- `P010_core-features.md` - Core Features (implement HMS modules aligned to backend)
- `P011_screens-routes.md` - Screens & Routes (implement screens, routes, and UI wiring)
- `P012_advanced-features.md` - Advanced Features (optional modules + advanced capabilities)
- `P013_finalization.md` - Finalization (onboarding/help + testing/polish)

## Development Flow

```
Phase 0: Setup (Generic)
    ↓
Phase 1: Foundation (Config, Utils, Logging, Errors) (Generic)
    ↓
Phase 2: Infrastructure (Services, Security) (Generic)
    ↓
Phase 3: State & Theme (Redux, Theme System) (Generic)
    ↓
Phase 4: Offline (Queue, Sync, Network) + Bootstrap (wires all systems) (Generic)
    ↓
Phase 5: Reusable Hooks (Cross-cutting hooks) (Generic)
    ↓
Phase 6: Reusable Platform UI Foundation (Primitives, Patterns, Layouts) (Generic)
    ↓
Phase 7: App Shell (App Router + Guards + Navigation Skeleton) (Generic)
    ↓
Phase 8: Minimal Runnable App (Landing page, home screen, error routes) (Generic)
    ↓
Phase 9: Base Layouts & Global UI (App-specific - Layouts, navigation, global controls)
    ↓
Phase 10: Core Features (App-specific starts here - Implement HMS core modules)
    ↓
Phase 11: Screens & Routes (App-specific - Implement screens, routes, and UI wiring)
    ↓
Phase 12: Advanced Features (App-specific - Telemedicine, patient engagement, AI insights, advanced integrations)
    ↓
Phase 13: Finalization (App-specific - Onboarding/Help + Testing/Polish)
```

## How to Use This Plan
1. Follow steps **sequentially** within each phase
2. Complete **all steps** in a phase before moving to the next
3. Write **tests immediately** after each implementation step
4. Verify **rule compliance** by referencing `.cursor/rules/` files
5. **Do not skip** steps or merge them
6. **Use correct file extensions** (`.jsx` for JSX, `.js` for everything else)
7. **Enforce 100% internationalization** - All UI text must use i18n (see `.cursor/rules/i18n.mdc`)
8. **Enforce mandatory grouping** - All related routes MUST be grouped using parentheses `(group-name)` in `src/app/` (see `.cursor/rules/app-router.mdc`). All related components and screens MUST be grouped using regular folder names (NO parentheses) in `src/platform/` (see `.cursor/rules/component-structure.mdc`)

## Quick Start

1. **Read** `index.md` (this file)
2. **Review** relevant rules in `.cursor/rules/` before starting each phase
3. **Start** with `P000_setup.md`
4. **Follow** each phase sequentially
5. **Complete** all steps in a phase before moving to next
6. **Test** after each implementation
7. **Verify** rule compliance at each step

## Rule References
All implementation steps follow rules defined in `.cursor/rules/`:
- `core-principles.mdc` - Fundamental principles
- `project-structure.mdc` - Folder structure
- `tech-stack.mdc` - Technology stack
- `bootstrap-config.mdc` - Initialization order
- And all other rule files as needed

**Note**: This dev-plan contains **implementation steps only**. Rules are defined in `.cursor/rules/` and should be referenced, not redefined here.

## Feature Coverage

This development plan covers all features specified in the write-up (`@write-up/`) and aligns with all backend modules (`@backend/src/modules/`):

### HMS Core Modules (Phase 10)
- ✅ Authentication & Sessions
- ✅ Tenancy, Facilities, Branches, Departments, Units, Wards, Rooms, Beds
- ✅ User Management & RBAC (roles, permissions, user-role)
- ✅ Patient Registry & Consent
- ✅ Scheduling, Availability, and Queues
- ✅ Encounters & Clinical Documentation
- ✅ Inpatient (IPD) & Bed Management
- ✅ ICU & Critical Care
- ✅ Theatre & Anesthesia
- ✅ Diagnostics (Laboratory & Radiology)
- ✅ Pharmacy
- ✅ Inventory & Procurement
- ✅ Emergency & Ambulance
- ✅ Billing, Payments & Insurance
- ✅ HR, Payroll & Staffing
- ✅ Housekeeping & Facilities
- ✅ Notifications & Communications
- ✅ Reporting & Analytics
- ✅ Subscriptions, Licensing & Modules
- ✅ Compliance, Audit & Security
- ✅ Integrations & Webhooks

### Advanced/Optional Modules (Phase 12)
- ✅ Telemedicine & Remote Patient Management
- ✅ Patient Experience & Engagement (portal, feedback, education)
- ✅ AI-Assisted Diagnostics & Predictive Analytics
- ✅ Clinical Research & Trials Support
- ✅ PACS/Imaging integrations and IoT device integrations
- ✅ Advanced reporting templates and executive dashboards
- ✅ Multi-hospital enterprise management enhancements

### Platform Features
- ✅ Offline-tolerant architecture for critical workflows
- ✅ Multi-Language Support (i18n) - locale expansion in Phase 13
- ✅ Accessibility (WCAG AA/AAA with high-contrast mode)
- ✅ Security & Compliance (MFA, OAuth/SSO, encryption, audit trails)
- ✅ Performance optimization and responsiveness across devices
- ✅ Onboarding & Help System - role-aware onboarding and contextual help

All features follow the backend API structure and implement the complete functionality described in `hms-backend/write-up.md` and `hms-backend/dev-plan/`.

---

**Start with**: `P000_setup.md`

