# Audit Trail

For installation or repair, run the entire `install_hod_audit.sql` in the Supabase SQL editor before deploying the UI. It creates missing access and change-request tables, assigns the explicitly selected account `muhdsyakir01@gmail.com` as super admin, and installs both the HOD and audit migrations in one transaction. It checks that this Auth user and the existing applications table are present, preserves application data and existing permission choices, and can be rerun. New staff HOD/audit access defaults to blocked. The live database has not been migrated by this change.

The installer is assembled, in order, from `prepare_review_audit.sql`, `add_change_requests_table.sql`, `add_application_edit_review.sql` and `add_audit_trail.sql`, with one outer transaction and authenticated grants for change requests. Keep the installer in sync when changing these sources. Once prerequisites exist, individual workflow/audit migrations can still be applied separately. Sign out and back in after the role repair so the app reloads the profile.

The Audit Trail tab is available to super admins. Staff access is disabled by default and can be granted through Settings > page permissions > Audit Trail. The database enforces the same access rule.

## What is recorded

Database triggers record committed inserts, updates and deletes for applications, change requests, companies, banks, collaterals, profiles, page permissions, chart visibility and legacy proposals. Optional tables absent during installation are skipped; rerun the migration after adding them.

Each event contains:

- Event ID, server timestamp, transaction ID and source table.
- Authenticated actor ID, email, available display name and role at the time of the action. SQL/service operations without a user session are labelled database/system.
- Entity, record/application ID, request ID when applicable and a record summary.
- Every changed field, including cleared values, zero, false and nested officer/contact data, with before/after values and field-presence flags.
- Full before/after snapshots, including requester, reviewer, review notes and restore metadata for workflow events.

Reviewers can add an optional review note before approving or rejecting. SUBMITTED, APPROVED, REJECTED and RESTORED are separate retained events. Restoring a decision does not erase earlier decisions or notes. Application updates and workflow events from one approval share a transaction ID, allowing both to be found together with that filter.

## Finding an event

Filter by email, entity, action, date, record/application UUID, request UUID or transaction ID. Dates and displayed times use Asia/Singapore (UTC+08:00); each event also shows its exact UTC timestamp. Results are loaded 50 at a time, newest first. Expand an event for field comparisons, handling details and complete snapshots. Request proposals are explicitly distinguished from changes to live application data.

## Integrity and boundaries

Authenticated application users have read-only access to audit records and cannot insert fake records, edit them or delete them. A database trigger also rejects update, delete and truncate on the audit table. Business writes and their audit events commit together; an audit failure aborts the write. No foreign keys remove audit history when the original application or user is deleted.

Logging starts at installation. There is no fabricated backfill. Rollbacks, denied/failed attempts, logins, logouts, page views, read/download activity and Cloudinary upload attempts are not captured by these business-table triggers. An attached file URL/name change is captured when saved in an audited record. This is an application audit log, not cryptographic tamper-proof storage: a privileged database owner can alter/disable database triggers.

## Validation

Run `node --test tests/audit-trail.test.cjs tests/hod-review.test.cjs` for data-query and browser checks. Run the PGlite SQL regression command in `HOD-REVIEW.md` for workflow history, identity, role permissions, immutable records, deletion retention and transactional rollback checks. Tests use isolated data, not live accounts.

UI design follows the existing white corporate dashboard: ENERGY 1 / RHYTHM 1 / MOTION 1. Search controls lead into chronological event cards. Existing typography, borders and blue action buttons are reused for continuity; no new visual assets or animation are introduced.

Scoped UI delivery checks:

- Hard gate PASS: browser checks cover working filters/pagination, expandable details by keyboard, empty/error/retry states, escaped record content and no horizontal overflow at 390px.
- Purpose gate PASS: existing corporate typography, neutral surfaces and blue action buttons are reused; no decorative assets, effects or unsupported content were added.
- Liveliness PASS: low-motion audit layout gives search controls and chronological event headings clear priority, with spacing separating identity, changes and full snapshots.
- Craftsmanship PASS: browser tests verify handling notes, null/false/zero values, Singapore timestamps, complete snapshots and mobile layout; database tests verify history retention and audit permissions.
