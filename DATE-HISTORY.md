# Application date history

Run `add_application_date_history.sql` in Supabase SQL Editor before deploying this UI change, after the existing application/review setup. The script is transactional and safe to rerun; it does not change application dates.

Run the updated script again to enable dated notes, even if date history was installed previously. It adds `date_doc_sent_note` and `date_followup_note` to applications and `note` to history, and updates the submission function so a date and its note are reviewed together. This prevents a pending note correction from being applied to a different date if another update is approved first.

Each date has its own optional note in the application form. Changing a date clears that note input for the new event; existing notes remain in history. A same-date note correction also creates a history entry after approval. HOD sees notes in the Dates & Reviews section. Notes entered before this feature in the general Notes box are not automatically assigned to dates, and older history entries remain without notes.

View Application and the HOD edit review popup show separate Document sent and Follow-up histories. Updating either date records its previous value, new value, recording time and the account that committed the change. For reviewed updates that account is the approving HOD. Pending and rejected proposals do not change this history. Clearing a date and restoring a previous date are recorded too.

The database trigger saves history in the same transaction as the application change. Clients cannot insert, alter or delete history. History reads follow the application's row access. Deleted applications retain their history in the database, but it is not exposed to clients while the application is absent.

At installation, existing committed date changes are imported from `audit_events` if available. Otherwise the current date is saved as an explicitly labelled baseline; its recording time is installation time, not a claimed meeting date. Dates overwritten before auditing started cannot be recovered by this migration.

Verify with two accounts: submit a follow-up change from 22 to 26, confirm the old date remains pending review, approve from the other account, then open Date History to see 22 → 26. Rejection must leave history unchanged.
