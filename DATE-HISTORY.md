# Application date history

Run `add_application_date_history.sql` in Supabase SQL Editor before deploying this UI change, after the existing application/review setup. The script is transactional and safe to rerun; it does not change application dates.

View Application and the HOD edit review popup show separate Document sent and Follow-up histories. Updating either date records its previous value, new value, recording time and the account that committed the change. For reviewed updates that account is the approving HOD. Pending and rejected proposals do not change this history. Clearing a date and restoring a previous date are recorded too.

The database trigger saves history in the same transaction as the application change. Clients cannot insert, alter or delete history. History reads follow the application's row access. Deleted applications retain their history in the database, but it is not exposed to clients while the application is absent.

At installation, existing committed date changes are imported from `audit_events` if available. Otherwise the current date is saved as an explicitly labelled baseline; its recording time is installation time, not a claimed meeting date. Dates overwritten before auditing started cannot be recovered by this migration.

Verify with two accounts: submit a follow-up change from 22 to 26, confirm the old date remains pending review, approve from the other account, then open Date History to see 22 → 26. Rejection must leave history unchanged.
