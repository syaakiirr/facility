const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { chromium } = require('playwright');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('date history imports audit, preserves baselines, follows review transactions and enforces access', async () => {
    const { PGlite } = require(process.env.PGLITE_MODULE || '@electric-sql/pglite');
    const db = new PGlite();
    const staff = '11111111-1111-4111-8111-111111111111';
    const hod = '22222222-2222-4222-8222-222222222222';
    const app = '33333333-3333-4333-8333-333333333333';
    try {
        await db.exec(`CREATE ROLE authenticated; CREATE SCHEMA auth;
            CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT nullif(current_setting('test.uid', true), '')::uuid $$;
            CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql AS $$ SELECT '{"email":"hod@example.com"}'::jsonb $$;
            CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql AS $$ SELECT 'authenticated'::text $$;
            CREATE TABLE profiles (id uuid PRIMARY KEY, role text);
            CREATE TABLE page_permissions (role text, page_key text, is_allowed boolean);
            INSERT INTO profiles VALUES ('${staff}', 'staff'), ('${hod}', 'super_admin');
            INSERT INTO page_permissions VALUES ('staff', 'applications', true), ('staff', 'bos_review', false);`);
        await db.exec(read('setup_database.sql').match(/CREATE TABLE IF NOT EXISTS applications \([\s\S]*?\n\);/)[0]);
        await db.exec(read('add_change_requests_table.sql'));
        await db.exec(`ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
            CREATE POLICY app_access ON applications FOR ALL USING (id = '${app}');
            GRANT USAGE ON SCHEMA public, auth TO authenticated;
            GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
            INSERT INTO applications(id, category, company, status, date_followup, date_doc_sent)
            VALUES ('${app}', 'COMPANY', 'Company', 'IN PROGRESS', '2026-11-22', '2026-11-20');`);
        await db.exec(read('add_application_edit_review.sql'));
        await db.exec(read('add_audit_trail.sql'));
        await db.exec(`UPDATE applications SET date_doc_sent = '2026-11-21' WHERE id = '${app}'`);
        const migration = read('add_application_date_history.sql');
        await db.exec(migration);
        await db.exec(migration);
        const history = async () => (await db.query('SELECT *, previous_date::text AS previous_date, new_date::text AS new_date FROM application_date_history ORDER BY id')).rows;
        assert.equal((await history()).length, 2);
        assert.equal((await history()).find(r => r.source === 'audit').previous_date, '2026-11-20');
        assert.equal((await history()).find(r => r.source === 'baseline').new_date, '2026-11-22');
        const login = async id => {
            await db.exec('RESET ROLE');
            await db.query("SELECT set_config('test.uid', $1, false)", [id]);
            await db.exec('SET ROLE authenticated');
        };
        const submit = async date => (await db.query(`SELECT to_jsonb(submit_application_edit($1,
            jsonb_build_object('date_followup', $2::text), (SELECT to_jsonb(a) FROM applications a WHERE id=$1), 'Follow-up')) AS request`, [app, date])).rows[0].request;
        const review = (id, decision) => db.query('SELECT review_application_edit($1, $2)', [id, decision]);
        await login(staff);
        const rejected = await submit('2026-11-25');
        assert.equal((await history()).length, 2);
        await login(hod);
        await review(rejected.id, 'REJECTED');
        assert.equal((await history()).length, 2);
        await login(staff);
        const pending = await submit('2026-11-26');
        await login(hod);
        await review(pending.id, 'APPROVED');
        let latest = (await history()).at(-1);
        assert.equal(latest.previous_date, '2026-11-22');
        assert.equal(latest.new_date, '2026-11-26');
        assert.equal(latest.recorded_by, hod);
        await review(pending.id, 'RESTORE');
        latest = (await history()).at(-1);
        assert.equal(latest.previous_date, '2026-11-26');
        assert.equal(latest.new_date, '2026-11-22');
        await db.exec('RESET ROLE');
        await db.exec(`UPDATE applications SET date_followup = NULL WHERE id = '${app}';
            UPDATE applications SET notes = 'Unrelated' WHERE id = '${app}';`);
        assert.equal((await history()).length, 5);
        assert.equal((await history()).at(-1).new_date, null);
        await db.exec('BEGIN');
        await db.exec(`UPDATE applications SET date_followup = '2026-11-30' WHERE id = '${app}'`);
        await db.exec('ROLLBACK');
        assert.equal((await history()).length, 5);
        await db.exec(migration);
        assert.equal((await history()).length, 5, 'rerun must not duplicate audit rows captured by the date trigger');
        await db.exec(`INSERT INTO applications(category, company, status, date_followup) VALUES ('COMPANY', 'Hidden', 'PENDING', '2026-12-01')`);
        assert.equal((await history()).length, 6);
        await login(staff);
        assert.equal((await history()).length, 5, 'history must obey application RLS');
        await assert.rejects(db.exec(`INSERT INTO application_date_history(application_id,field_name,source) VALUES ('${app}','date_followup','change')`), /permission denied/);
        await assert.rejects(db.exec('DELETE FROM application_date_history'), /permission denied/);
        await assert.rejects(db.exec("UPDATE application_date_history SET new_date = '2000-01-01'"), /permission denied/);
    } finally { await db.close(); }
});

test('history queries scope every page to one application and propagate failures', async () => {
    const calls = [];
    const query = {};
    for (const name of ['select', 'eq', 'order']) query[name] = (...args) => { calls.push([name, ...args]); return query; };
    query.range = async start => ({ data: start === 0 ? Array.from({ length: 500 }, (_, id) => ({ id })) : [{ id: 501 }] });
    const context = vm.createContext({ supabaseClient: { from: table => { assert.equal(table, 'application_date_history'); return query; } } });
    vm.runInContext(read('js/data.js') + '\nglobalThis.DB = DB;', context);
    assert.equal((await context.DB.fetchApplicationDateHistory('application-1')).length, 501);
    assert.equal(calls.filter(call => call[0] === 'eq' && call[1] === 'application_id' && call[2] === 'application-1').length, 2);
    query.range = async () => ({ error: new Error('Unavailable') });
    await assert.rejects(context.DB.fetchApplicationDateHistory('application-1'), /Unavailable/);
});

test('date history displays old and latest dates, escapes data, and supports empty/error/retry states', async () => {
    const browser = await chromium.launch();
    try {
        const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
        await page.setContent('<main style="padding:16px"><h3>Date History</h3><div id="history"></div></main>');
        await page.addStyleTag({ path: path.join(root, 'css/style.css') });
        await page.addScriptTag({ content: `const DB = { fetchApplicationDateHistory: async () => [
            { field_name:'date_followup', previous_date:'2026-11-22', new_date:'2026-11-26', source:'change', recorded_at:'2026-11-26T02:00:00Z', recorded_by_email:'<img src=x onerror=alert(1)>' },
            { field_name:'date_doc_sent', previous_date:null, new_date:'2026-11-20', source:'baseline', recorded_at:'2026-11-20T02:00:00Z' }
        ] };` });
        await page.addScriptTag({ path: path.join(root, 'js/ui.js') });
        await page.evaluate(() => UI.renderApplicationDateHistory(document.querySelector('#history'), 'app'));
        assert.match(await page.locator('#history').innerText(), /22 Nov 2026 → 26 Nov 2026/);
        assert.match(await page.locator('#history').innerText(), /History tracking started/);
        assert.equal(await page.locator('img').count(), 0);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        await page.screenshot({ path: path.join(require('node:os').tmpdir(), 'facility-date-history-mobile.png'), fullPage: true });
        await page.evaluate(async () => { DB.fetchApplicationDateHistory = async () => { throw new Error('Missing table'); }; await UI.renderApplicationDateHistory(document.querySelector('#history'), 'app'); });
        await page.getByRole('alert').waitFor();
        await page.evaluate(() => { DB.fetchApplicationDateHistory = async () => []; });
        await page.getByRole('button', { name: 'Retry' }).click();
        await page.getByText('No recorded date changes.').first().waitFor();
        assert.equal(await page.getByText('No recorded date changes.').count(), 2);
        await page.setContent('<main id="page-content"></main>');
        await page.addStyleTag({ path: path.join(root, 'css/style.css') });
        await page.evaluate(() => {
            const app = { id: 'application-1', company: 'Company', status: 'REVIEW BY BANK', date_followup: '2026-11-26' };
            DB.fetchBanks = DB.fetchCompanies = DB.fetchCollaterals = async () => [];
            DB.getDashboardStats = async () => ({});
            DB.fetchApplications = async () => [app];
            DB.fetchApplicationDateHistory = async id => {
                window.historyApplicationId = id;
                return [{ field_name: 'date_followup', previous_date: '2026-11-22', new_date: '2026-11-26', source: 'change', recorded_at: '2026-11-26T02:00:00Z' }];
            };
        });
        await page.addScriptTag({ path: path.join(root, 'js/app.js') });
        await page.evaluate(() => App.renderApplications(document.querySelector('main')));
        await page.getByRole('button', { name: 'View', exact: true }).click();
        await page.getByText('Follow-up history', { exact: true }).waitFor();
        assert.equal(await page.evaluate(() => window.historyApplicationId), 'application-1');
        assert.match(await page.locator('[data-date-history]').innerText(), /22 Nov 2026 → 26 Nov 2026/);
        await page.locator('[data-date-history]').scrollIntoViewIfNeeded();
        await page.screenshot({ path: path.join(require('node:os').tmpdir(), 'facility-date-history-popup.png') });
        await page.getByRole('button', { name: 'Close', exact: true }).click();
    } finally { await browser.close(); }
});
