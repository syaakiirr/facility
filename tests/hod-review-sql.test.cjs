// PGLITE_MODULE points to a temporary @electric-sql/pglite install; no live database is used.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');

test('complete installer repairs missing access tables, preserves applications and selects only the named HOD', async () => {
    const { PGlite } = require(process.env.PGLITE_MODULE || '@electric-sql/pglite');
    const db = new PGlite();
    const admin = '22222222-2222-4222-8222-222222222222';
    const staff = '11111111-1111-4111-8111-111111111111';
    try {
        await db.exec(`
            CREATE ROLE authenticated;
            CREATE SCHEMA auth;
            CREATE TABLE auth.users (id uuid PRIMARY KEY, email text);
            CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS
              $$ SELECT nullif(current_setting('test.uid', true), '')::uuid $$;
            CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql AS $$ SELECT '{}'::jsonb $$;
            CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql AS $$ SELECT 'authenticated'::text $$;
            GRANT USAGE ON SCHEMA public, auth TO authenticated;
        `);
        const setup = fs.readFileSync(path.join(root, 'setup_database.sql'), 'utf8');
        await db.exec(setup.match(/CREATE TABLE IF NOT EXISTS applications \([\s\S]*?\n\);/)[0]);
        await db.exec("INSERT INTO applications(category, company, status, notes) VALUES ('COMPANY', 'Existing company', 'IN FORCE', 'Preserve me')");
        const installer = fs.readFileSync(path.join(root, 'install_hod_audit.sql'), 'utf8');
        await assert.rejects(db.exec(installer), /registered Auth user/);
        await db.exec('ROLLBACK');
        assert.equal((await db.query("SELECT to_regclass('public.profiles') AS relation")).rows[0].relation, null);
        await db.query('INSERT INTO auth.users VALUES ($1, $2), ($3, $4)', [admin, 'muhdsyakir01@gmail.com', staff, 'staff@example.com']);
        await db.exec(installer);
        assert.deepEqual((await db.query('SELECT id, role FROM profiles ORDER BY id')).rows,
            [{ id: staff, role: 'staff' }, { id: admin, role: 'super_admin' }]);
        assert.equal((await db.query('SELECT notes FROM applications')).rows[0].notes, 'Preserve me');
        await db.query("SELECT set_config('test.uid', $1, false)", [staff]);
        await db.exec('SET ROLE authenticated');
        await db.query("UPDATE profiles SET role = 'super_admin' WHERE id = $1", [staff]);
        assert.equal((await db.query('SELECT role FROM profiles WHERE id = $1', [staff])).rows[0].role, 'staff');
        assert.equal((await db.query('SELECT * FROM audit_events')).rows.length, 0);
        await db.exec('RESET ROLE');
        await db.query("SELECT set_config('test.uid', $1, false)", [admin]);
        await db.exec('SET ROLE authenticated');
        assert.equal((await db.query('SELECT public.is_super_admin() AS allowed')).rows[0].allowed, true);
        await db.exec("UPDATE page_permissions SET is_allowed = true WHERE page_key = 'audit_trail'");
        assert.ok((await db.query('SELECT * FROM audit_events')).rows.length > 0);
        await db.exec('RESET ROLE');
        await db.exec(installer);
        assert.equal((await db.query('SELECT count(*)::int AS n FROM applications')).rows[0].n, 1);
        assert.equal((await db.query('SELECT count(*)::int AS n FROM profiles')).rows[0].n, 2);
        assert.equal((await db.query("SELECT is_allowed FROM page_permissions WHERE page_key = 'audit_trail'")).rows[0].is_allowed, true);
        assert.ok((await db.query("SELECT to_regprocedure('public.submit_application_edit(uuid,jsonb,jsonb,text)') AS fn")).rows[0].fn);
        assert.ok((await db.query("SELECT to_regprocedure('public.review_application_edit(uuid,text,text)') AS fn")).rows[0].fn);
    } finally { await db.close(); }
});

test('audit migration creates its missing admin helper and can be rerun', async () => {
    const { PGlite } = require(process.env.PGLITE_MODULE || '@electric-sql/pglite');
    const db = new PGlite();
    try {
        await db.exec(`
            CREATE ROLE authenticated;
            CREATE SCHEMA auth;
            CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT NULL::uuid $$;
            CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql AS $$ SELECT '{}'::jsonb $$;
            CREATE TABLE profiles (id uuid PRIMARY KEY, role text);
            CREATE TABLE page_permissions (id uuid DEFAULT gen_random_uuid(), role text, page_key text, is_allowed boolean);
        `);
        assert.equal((await db.query("SELECT to_regprocedure('public.is_super_admin()') AS helper")).rows[0].helper, null);
        const migration = fs.readFileSync(path.join(root, 'add_audit_trail.sql'), 'utf8');
        await db.exec(migration);
        await db.exec(migration);
        assert.equal((await db.query('SELECT public.is_super_admin() AS admin')).rows[0].admin, false);
        assert.equal((await db.query("SELECT count(*)::int AS n FROM page_permissions WHERE page_key = 'audit_trail'")).rows[0].n, 1);
    } finally { await db.close(); }
});

test('application review transactions and database permissions', async () => {
    const { PGlite } = require(process.env.PGLITE_MODULE || '@electric-sql/pglite');
    const db = new PGlite();
    const staff = '11111111-1111-4111-8111-111111111111';
    const hod = '22222222-2222-4222-8222-222222222222';
    const app = '33333333-3333-4333-8333-333333333333';
    try {
        await db.exec(`
            CREATE ROLE authenticated;
            CREATE SCHEMA auth;
            CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS
              $$ SELECT nullif(current_setting('test.uid', true), '')::uuid $$;
            CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql AS $$ SELECT '{"email":"test@example.com"}'::jsonb $$;
            CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql AS $$ SELECT 'authenticated'::text $$;
            CREATE TABLE profiles (id uuid PRIMARY KEY, role text);
            ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
            CREATE POLICY profile_read ON profiles FOR SELECT USING (true);
            CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (id = auth.uid());
            CREATE TABLE page_permissions (role text, page_key text, is_allowed boolean);
            INSERT INTO profiles VALUES ('${staff}', 'staff'), ('${hod}', 'super_admin');
            INSERT INTO page_permissions VALUES ('staff', 'applications', true), ('staff', 'bos_review', false);
        `);
        const setup = fs.readFileSync(path.join(root, 'setup_database.sql'), 'utf8');
        await db.exec(setup.match(/CREATE TABLE IF NOT EXISTS applications \([\s\S]*?\n\);/)[0]);
        await db.exec(fs.readFileSync(path.join(root, 'add_change_requests_table.sql'), 'utf8'));
        await db.exec(`
            ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
            CREATE POLICY original_access ON applications FOR ALL USING (true);
            GRANT USAGE ON SCHEMA public, auth TO authenticated;
            GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
            INSERT INTO applications(id, category, company, status, notes) VALUES
              ('${app}', 'COMPANY', 'Test company', 'IN FORCE', 'Original note');
        `);
        const migration = fs.readFileSync(path.join(root, 'add_application_edit_review.sql'), 'utf8');
        await db.exec(migration);
        await db.exec(migration); // Deployment is safe to rerun.
        const auditMigration = fs.readFileSync(path.join(root, 'add_audit_trail.sql'), 'utf8');
        await db.exec(auditMigration);
        await db.exec(auditMigration);
        const login = async id => {
            await db.exec('RESET ROLE');
            await db.query("SELECT set_config('test.uid', $1, false)", [id]);
            await db.exec('SET ROLE authenticated');
        };
        const current = async () => (await db.query('SELECT * FROM applications WHERE id = $1', [app])).rows[0];
        const submit = async (payload, original) => (await db.query(
            'SELECT to_jsonb(submit_application_edit($1, $2, $3, $4)) AS request',
            [app, JSON.stringify(payload), JSON.stringify(original), 'Test edit'])).rows[0].request;
        const review = async (id, decision, notes = null) => (await db.query(
            'SELECT to_jsonb(review_application_edit($1, $2, $3)) AS request', [id, decision, notes])).rows[0].request;
        await login(staff);
        const original = await current();
        await db.query("UPDATE profiles SET role = 'super_admin' WHERE id = $1", [staff]);
        assert.equal((await db.query('SELECT role FROM profiles WHERE id = $1', [staff])).rows[0].role, 'staff');
        assert.equal(await submit({ notes: original.notes }, original), null);
        const pending = await submit({ notes: '', status: 'ON HOLD' }, original);
        assert.equal((await db.query('SELECT * FROM audit_events')).rows.length, 0, 'staff cannot read audit without permission');
        await assert.rejects(db.query("INSERT INTO audit_events(source_table, entity, action) VALUES ('applications', 'application', 'FAKE')"), /permission denied/);
        assert.equal(pending.status, 'PENDING');
        assert.equal((await current()).notes, 'Original note');
        await assert.rejects(review(pending.id, 'APPROVED'), /HOD Review access/);
        await db.query("UPDATE applications SET notes = 'Bypass' WHERE id = $1", [app]);
        assert.equal((await current()).notes, 'Original note');
        await db.query("UPDATE change_requests SET status = 'APPROVED' WHERE id = $1", [pending.id]);
        assert.equal((await db.query('SELECT status FROM change_requests WHERE id = $1', [pending.id])).rows[0].status, 'PENDING');
        await login(hod);
        await review(pending.id, 'REJECTED', 'Please check with finance');
        const submittedEvent = (await db.query("SELECT * FROM audit_events WHERE request_id = $1 AND action = 'SUBMITTED'", [pending.id])).rows[0];
        assert.equal(submittedEvent.actor_id, staff);
        assert.equal(submittedEvent.actor_role, 'staff');
        assert.equal(submittedEvent.after_snapshot.payload.notes, '');
        assert.equal(submittedEvent.after_snapshot.before_payload.notes, 'Original note');
        assert.equal((await db.query("SELECT actor_id FROM audit_events WHERE request_id = $1 AND action = 'REJECTED'", [pending.id])).rows[0].actor_id, hod);
        assert.equal((await current()).notes, 'Original note');
        await assert.rejects(review(pending.id, 'APPROVED'), /already been reviewed/);
        await review(pending.id, 'RESTORE');
        const restoreEvent = (await db.query("SELECT * FROM audit_events WHERE request_id = $1 AND action = 'RESTORED'", [pending.id])).rows[0];
        assert.equal(restoreEvent.before_snapshot.review_notes, 'Please check with finance');
        await review(pending.id, 'APPROVED');
        assert.equal((await current()).notes, '');
        assert.equal((await current()).status, 'ON HOLD');
        await review(pending.id, 'RESTORE');
        assert.equal((await current()).notes, 'Original note');
        await review(pending.id, 'REJECTED');
        assert.deepEqual((await db.query('SELECT action FROM audit_events WHERE request_id = $1 ORDER BY id', [pending.id])).rows.map(r => r.action),
            ['SUBMITTED', 'REJECTED', 'RESTORED', 'APPROVED', 'RESTORED', 'REJECTED']);
        const approvedEvent = (await db.query("SELECT * FROM audit_events WHERE request_id = $1 AND action = 'APPROVED'", [pending.id])).rows[0];
        const dataEvent = (await db.query("SELECT * FROM audit_events WHERE transaction_id = $1 AND source_table = 'applications'", [approvedEvent.transaction_id])).rows[0];
        assert.equal(dataEvent.field_changes.notes.before, 'Original note');
        assert.equal(dataEvent.field_changes.notes.after, '');
        assert.equal(dataEvent.actor_id, hod);
        await assert.rejects(db.query('DELETE FROM audit_events'), /permission denied/);
        await assert.rejects(db.query("UPDATE audit_events SET action = 'FAKE'"), /permission denied/);

        const adminEdit = await submit({ notes: 'Admin edit' }, await current());
        assert.equal((await current()).notes, 'Original note');
        await assert.rejects(review(adminEdit.id, 'APPROVED'), /Another reviewer/);
        await db.exec('RESET ROLE');
        await db.exec("UPDATE page_permissions SET is_allowed = true WHERE page_key = 'bos_review'");
        await login(staff);
        await review(adminEdit.id, 'APPROVED'); // A staff account with tab access can review.
        assert.equal((await current()).notes, 'Admin edit');

        const base = await current();
        const first = await submit({ notes: 'First' }, base);
        const stale = await submit({ notes: 'Second' }, base);
        const independent = await submit({ status: 'DISCHARGED' }, base);
        await assert.rejects(review(first.id, 'REJECTED'), /Another reviewer/);
        await login(hod);
        await review(first.id, 'APPROVED');
        await assert.rejects(review(stale.id, 'APPROVED'), /reviewed field has changed/);
        assert.equal((await db.query('SELECT status FROM change_requests WHERE id = $1', [stale.id])).rows[0].status, 'PENDING');
        await review(independent.id, 'APPROVED');
        assert.equal((await current()).notes, 'First');
        assert.equal((await current()).status, 'DISCHARGED');
        await assert.rejects(submit({ notes: 'Stale form' }, base), /Reload/);
        await assert.rejects(submit({ id: hod }, await current()), /Invalid application field/);

        // If the request update fails, the application update must roll back too.
        const atomic = await submit({ notes: 'Atomic' }, await current());
        const auditCount = (await db.query('SELECT count(*)::int AS n FROM audit_events')).rows[0].n;
        await db.exec('RESET ROLE');
        await db.exec(`CREATE FUNCTION fail_review() RETURNS trigger LANGUAGE plpgsql AS
          $$ BEGIN RAISE EXCEPTION 'Simulated history failure'; END $$;
          CREATE TRIGGER fail_review BEFORE UPDATE ON change_requests FOR EACH ROW EXECUTE FUNCTION fail_review();`);
        await login(staff);
        await assert.rejects(review(atomic.id, 'APPROVED'), /Simulated history failure/);
        assert.equal((await current()).notes, 'First');
        await login(hod);
        assert.equal((await db.query('SELECT count(*)::int AS n FROM audit_events')).rows[0].n, auditCount, 'rolled-back operations leave no success audit');
        await db.exec('RESET ROLE');
        await assert.rejects(db.exec('DELETE FROM audit_events'), /cannot be edited/);
        await assert.rejects(db.exec('TRUNCATE audit_events'), /cannot be edited/);
        await db.exec('DROP TRIGGER fail_review ON change_requests');
        await db.exec(`CREATE FUNCTION fail_audit() RETURNS trigger LANGUAGE plpgsql AS
          $$ BEGIN RAISE EXCEPTION 'Simulated audit failure'; END $$;
          CREATE TRIGGER fail_audit BEFORE INSERT ON audit_events FOR EACH ROW EXECUTE FUNCTION fail_audit();`);
        await login(staff);
        await assert.rejects(review(atomic.id, 'APPROVED'), /Simulated audit failure/);
        assert.equal((await current()).notes, 'First', 'failed audit blocks the business write');
        await db.exec('RESET ROLE');
        await db.exec('DROP TRIGGER fail_audit ON audit_events');
        await db.exec("UPDATE page_permissions SET is_allowed = true WHERE page_key = 'audit_trail'");
        await login(staff);
        assert.ok((await db.query('SELECT * FROM audit_events')).rows.length > 0);
        await db.query('DELETE FROM applications WHERE id = $1', [app]);
        const deletion = (await db.query("SELECT * FROM audit_events WHERE record_id = $1 AND action = 'DELETED'", [app])).rows[0];
        assert.equal(deletion.before_snapshot.notes, 'First');
        assert.equal(deletion.after_snapshot, null);
        assert.ok((await db.query('SELECT * FROM audit_events WHERE request_id = $1', [pending.id])).rows.length > 0);
    } finally {
        await db.close();
    }
});
