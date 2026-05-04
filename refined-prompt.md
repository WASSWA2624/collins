Improve the IPD module/screen in the `hms` monorepo.

Before editing, inspect the relevant `hms-backend` and `hms-frontend` app-rules, architecture, routes, APIs, Prisma models, services, repositories, shared UI components, hooks, dependencies, permissions, tenancy/facility scope, entitlements, and folder structure. Apply minimal, focused changes; modify existing files where possible; create/delete files only when necessary. Do not change Prisma schema, migrations, seed data, tables, columns, enums, relations, indexes, or persisted contracts unless unavoidable.

Backend requirements:

* Verify and fix, if needed, the Start Admission flow so clicking **Start Admission** correctly creates/updates the patient admission using existing `/api/v1` patterns.
* Preserve route → controller → service → repository → Prisma layering.
* Preserve Zod validation, `snake_case` payloads, response helpers, RBAC/ABAC, entitlements, tenancy/facility scoping, audit, and security rules.
* Ensure ward support requests persist correctly for both `housekeeping` and `equipment_issue`.
* Ensure facility, ward, room, bed, equipment, manual equipment, problem/description, and request type data are saved using existing contracts where possible.
* Add or adjust only the minimal APIs needed for IPD tables, actions, nested modals, reports, and request flows.

Frontend requirements:

* Follow Expo Router, JSX, styled-components, Redux, feature/service hooks, theme tokens, entitlement-aware navigation, and existing IPD patterns.
* Prefer reusable `src/platform/*` components, especially the existing reusable data table and modal patterns.
* Keep UI responsive across iOS, Android, web, mobile, tablet, and desktop; support light, dark, and high-contrast themes.
* Handle loading, empty, error, offline, and permission-denied states.
* Avoid full UI reloads; update data locally/incrementally where safe.

Implement these IPD UI fixes and improvements:

1. **Start Admission modal**

   * Keep the existing patient search/select, ward select, room select, and available bed select flow.
   * Fix duplicated rooms when selecting a ward such as `IPD2`; room options must be unique and scoped to the selected ward.
   * Beds must only show available beds for the selected facility/ward/room.

2. **Ward Support Request modal**

   * Keep request types `housekeeping` and `equipment_issue`; searchable select is fine.
   * Show the facility select only when the logged-in user has access to multiple facilities.
   * Ward options must load only for the selected facility.
   * Disable ward select until a facility is selected when facility selection is required.
   * Disable room select until a ward is selected.
   * For equipment issues, support existing equipment selection or manual equipment entry plus problem description.
   * For housekeeping, require only the relevant location and issue description.
   * Submit must persist the request and update the UI without unnecessary reloads.

3. **Remove unused section**

   * Remove the **IPD Workspace** section entirely to save space.

4. **Summary cards**

   * Keep the cards for Active Admissions, Pending Admission Requests, Wards, Transfer Queue, Discharge Queue, Critical Alerts, and ICU/Theater Requests.
   * Remove the small description text from each card.
   * Make cards more compact, visually distinct, bordered, intuitive, and clickable.
   * Add a clear hover/pressed card state, not just cursor changes.

5. **Card drill-downs**

   * Each summary card must open a modal using the reusable data table component:

     * Active Admissions
     * Pending Admission Requests
     * Wards
     * Transfer Queue
     * Discharge Queue
     * Critical Alerts
     * ICU/Theater Requests
   * Tables should be searchable, cleanly formatted, and use existing reusable table conventions.
   * For Active Admissions, include columns: row number, patient number, patient ID, patient name, ward, room, bed, status/admission state.
   * Apply similar appropriate table layouts for the other cards.

6. **Nested patient/action modal**

   * Clicking an admission/patient row should open a nested modal with patient/admission details and actions.
   * Replace the current two-column layout with a single-column layout.
   * Move **Inpatient History** below the action buttons.
   * Action buttons should open nested modals following existing conventions:

     * Patient details
     * Admit/assign bed
     * Transfer patient
     * Discharge patient
     * Ward round
     * Doctor stock management
     * Medication administration
     * Meal tracking
     * Request service
     * ICU/Theater request
     * Critical alerts
     * Print report
   * Ensure each action works on both UI and backend using existing endpoints or minimal new ones.

7. **Printable IPD report**

   * Print only report content, never surrounding UI controls.
   * Use a clear title, patient information, admission information, medications, ward events/history, relevant clinical/IPD activity, and summary.
   * Borrow layout ideas from the existing OPD report.
   * Support multiple pages when content exceeds one page.
   * Ensure the report is clean, professional, and printable on web.

8. **IPD Patients section**

   * Replace the current IPD Patients section/list with the reusable data table component.
   * Keep the existing information but display it in a cleaner, compact, searchable table.

Avoid unrelated refactors, duplicate utilities, circular imports, unsafe logs, hardcoded secrets, hardcoded permissions, and broad database changes. Validate all IPD flows end-to-end: start admission, support request, card drill-down tables, nested modal actions, report printing, and local UI updates.
