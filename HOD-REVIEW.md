# Application edit review

For retained, detailed event history, also apply `add_audit_trail.sql`; see `AUDIT-TRAIL.md`.
For document-sent and follow-up date history inside application popups, apply `add_application_date_history.sql`; see `DATE-HISTORY.md`.

Run `install_hod_audit.sql` in the Supabase SQL editor **before deploying the updated JavaScript**. This complete installer repairs missing profiles, page permissions and change requests, assigns the selected HOD account, and installs workflow and audit support. It preserves existing application data and can be rerun. For databases with all prerequisites already installed, `add_application_edit_review.sql` remains the standalone workflow migration. No live migration was applied during development.

Application edits from every role enter `change_requests` as `PENDING`. Only changed fields are stored alongside the original snapshot. The application remains unchanged until another user with HOD Review access approves. Rejection only closes the request.

New applications from every role also enter `change_requests` as `PENDING` and appear in Applications only after approval by another reviewer. HOD Review displays pending application CREATE requests and UPDATE requests with a record ID and proposed data changes. Previously hidden pending CREATE requests appear automatically, without resubmitting. Legacy bank proposals, delete requests, other entities, completed decisions, and empty or unchanged edits remain excluded. Their database records are retained. The old Add Proposal control is removed from this tab.

Review access follows `page_permissions` for `bos_review`; super admins always have access. The existing setup grants that tab to staff by default. Turn off that permission if staff must not review other users' edits. The current permission system is role-based, not per-account.

Approval checks for conflicting changes and applies the edit and review decision atomically. Edits to unrelated fields can be approved separately. Old pending edits without an original snapshot must be rejected and resubmitted. Restore remains available to super admins and refuses to overwrite later changes to the same fields.

The migration prevents direct application updates and direct modification/deletion of application edit requests by authenticated clients. It also removes self-service profile updates, which previously allowed users to change their own role; super admin profile management remains available.

Local regression checks (no live credentials or data):

```powershell
node --test tests/hod-review.test.cjs
npm install --prefix "$env:TEMP/facility-review-sql-check" --no-save --package-lock=false @electric-sql/pglite
$env:PGLITE_MODULE = "$env:TEMP/facility-review-sql-check/node_modules/@electric-sql/pglite"
node --test tests/hod-review-sql.test.cjs
```

The SQL checks use PostgreSQL through PGlite with local stand-ins for Supabase auth functions. They do not validate the deployed Supabase schema or configuration. After migration, verify two real accounts: submit an edit, confirm original data remains, approve/reject from the other account, and confirm the final application data.
