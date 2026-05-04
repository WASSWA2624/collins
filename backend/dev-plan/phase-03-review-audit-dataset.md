# Phase 3 — Review, Audit, Dataset Capture, and Governance

## Goal

Create accountable clinical review and safe dataset preparation.

## Scope

- Implement specialist review queue.
- Add approve, request-correction, exclude, and conflict-resolution actions.
- Add reviewer comments and correction reasons.
- Expand audit logs across every clinical write and review action.
- Implement dataset note import endpoint with structured extraction boundary.
- Save raw note only if policy allows.
- Add editable structured preview and review status backend support.
- Implement de-identification service.
- Require ethics/facility/data-sharing metadata before approved dataset export.
- Add reference rule create/approve/activate/retire workflow.

## Done when

- Unreviewed records cannot enter training datasets.
- Dataset export requires proper role, de-identification, governance metadata, and audit log.
- Reviewer actions preserve original and corrected values.
- Reference rules are versioned and auditable.
