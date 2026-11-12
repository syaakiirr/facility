const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const vm = require('node:vm');
const { chromium } = require('playwright');
const root = path.join(__dirname, '..');

test('audit data queries apply server-side filters, Singapore date bounds and pagination', async () => {
    const calls = [];
    const query = {};
    for (const name of ['select', 'order', 'eq', 'ilike', 'gte', 'lte']) {
        query[name] = (...args) => { calls.push([name, ...args]); return query; };
    }
    query.range = async (...args) => { calls.push(['range', ...args]); return { data: [], count: 120 }; };
    const context = vm.createContext({ supabaseClient: { from: table => { assert.equal(table, 'audit_events'); return query; } } });
    vm.runInContext(fs.readFileSync(path.join(root, 'js/data.js'), 'utf8') + '\nglobalThis.DB = DB;', context);
    const result = await context.DB.fetchAuditEvents({ actor_email: 'a_%', entity: 'application', action: 'APPROVED', from: '2026-11-10', to: '2026-11-10', request_id: 'req', record_id: 'app', transaction_id: '123' }, 2);
    assert.equal(result.count, 120);
    assert.deepEqual(calls.find(call => call[0] === 'range'), ['range', 100, 149]);
    assert.deepEqual(calls.find(call => call[0] === 'gte'), ['gte', 'occurred_at', '2026-11-10T00:00:00+08:00']);
    assert.deepEqual(calls.find(call => call[0] === 'lte'), ['lte', 'occurred_at', '2026-11-10T23:59:59.999999+08:00']);
    assert.deepEqual(calls.find(call => call[0] === 'ilike'), ['ilike', 'actor_email', '%a\\_\\%%']);
    assert.equal(calls.filter(call => call[0] === 'eq').length, 5);
    query.range = async () => ({ error: new Error('Audit unavailable') });
    await assert.rejects(context.DB.fetchAuditEvents(), /Audit unavailable/);
});

test('audit UI filters, pages, opens full details, escapes data and handles errors', async () => {
    const browser = await chromium.launch();
    try {
        const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.setContent('<main id="page-content" style="padding:16px"></main>');
        await page.addStyleTag({ path: path.join(root, 'css/style.css') });
        await page.addScriptTag({ content: `
            const calls = [];
            let fail = false;
            const DB = { fetchAuditEvents: async (filters, page) => {
                calls.push({ filters, page });
                if (fail) throw new Error('Connection interrupted');
                const event = { id: 100 - page, action: 'APPROVED', actor_email: 'hod@example.com', actor_role: 'super_admin',
                    actor_id: '22222222-2222-4222-8222-222222222222', entity: 'application', source_table: 'change_requests',
                    record_id: '33333333-3333-4333-8333-333333333333', request_id: '44444444-4444-4444-8444-444444444444',
                    transaction_id: '555', summary: '<img src=x onerror=alert(1)>', occurred_at: '2026-11-10T01:02:03.123456Z',
                    field_changes: { status: { before: 'PENDING', after: 'APPROVED', before_present: true, after_present: true } },
                    before_snapshot: { status: 'PENDING' }, after_snapshot: { status: 'APPROVED', requested_by_email: 'staff@example.com',
                        reviewed_by_email: 'hod@example.com', review_notes: 'Checked with finance', payload: { notes: null, total_approved: 0, discharge_note: false },
                        before_payload: { notes: 'Original note', total_approved: 100, discharge_note: true } } };
                return filters.actor_email === 'nobody' ? { events: [], count: 0 } : { events: [event], count: 51 };
            } };
        ` });
        await page.addScriptTag({ path: path.join(root, 'js/app.js') });
        await page.evaluate(() => App.renderAuditTrail(document.getElementById('page-content')));
        assert.equal(await page.locator('.audit-event img').count(), 0);
        assert.match(await page.locator('time').innerText(), /9:02:03 am/);
        assert.equal(await page.locator('#audit-prev').isDisabled(), true);
        assert.equal(await page.locator('.audit-meta').isVisible(), false);
        assert.equal(await page.getByLabel('Request ID', { exact: true }).isVisible(), false);
        await page.screenshot({ path: path.join(require('node:os').tmpdir(), 'facility-audit-desktop.png'), fullPage: true });
        await page.locator('.audit-event-summary').focus();
        await page.keyboard.press('Enter');
        assert.match(await page.locator('.audit-event').innerText(), /Checked with finance/);
        assert.match(await page.locator('.audit-event').innerText(), /Original note/);
        assert.match(await page.locator('.audit-event').innerText(), /\(empty\)/);
        await page.getByText('Full before / after snapshots', { exact: true }).click();
        assert.match(await page.locator('.audit-event').innerText(), /"discharge_note": false/);
        await page.locator('#audit-next').click();
        await page.waitForFunction(() => document.querySelector('#audit-page').textContent === 'Page 2 of 2');
        assert.equal(await page.locator('#audit-next').isDisabled(), true);
        await page.locator('#audit-prev').click();
        await page.waitForFunction(() => document.querySelector('#audit-page').textContent === 'Page 1 of 2');
        await page.getByLabel('User email').fill('nobody');
        await page.getByRole('button', { name: 'Search audit' }).click();
        await page.getByRole('heading', { name: 'No matching audit events' }).waitFor();
        await page.getByRole('button', { name: 'Clear filters' }).click();
        await page.locator('.audit-event').waitFor();
        await page.getByText('Date & reference filters', { exact: true }).click();
        await page.getByLabel('Request ID', { exact: true }).fill('invalid');
        await page.getByRole('button', { name: 'Search audit' }).click();
        assert.match(await page.locator('#audit-message').innerText(), /complete UUID/);
        await page.getByRole('button', { name: 'Clear filters' }).click();
        await page.evaluate(() => { fail = true; });
        await page.getByRole('button', { name: 'Search audit' }).click();
        await page.waitForFunction(() => document.querySelector('#audit-message').textContent.includes('Connection interrupted'));
        await page.evaluate(() => { fail = false; });
        await page.getByRole('button', { name: 'Search audit' }).click();
        await page.locator('.audit-event').waitFor();
        await page.setViewportSize({ width: 390, height: 844 });
        await page.locator('.audit-event-summary').click();
        await page.getByText('Full before / after snapshots', { exact: true }).click();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        await page.screenshot({ path: path.join(require('node:os').tmpdir(), 'facility-audit-mobile.png'), fullPage: true });
        assert.deepEqual(errors, []);
    } finally { await browser.close(); }
});
