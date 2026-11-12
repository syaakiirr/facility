const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { chromium } = require('playwright');
const root = path.join(__dirname, '..');

test('staff and admin edits use the pending RPC without writing applications', async () => {
    const calls = [];
    const context = vm.createContext({
        Auth: { isSuperAdmin: () => true },
        supabaseClient: {
            rpc: async (name, args) => { calls.push({ name, args }); return { data: { id: 'pending' } }; },
            from: () => { throw new Error('Unexpected direct database write'); }
        }
    });
    vm.runInContext(fs.readFileSync(path.join(root, 'js/data.js'), 'utf8') + '\nglobalThis.DB = DB;', context);
    for (const admin of [true, false]) {
        context.Auth.isSuperAdmin = () => admin;
        const result = await context.DB.saveChange('application', 'UPDATE', 'app', { notes: null }, 'Clear note', { notes: 'Old' });
        assert.equal(result.queued, true);
    }
    assert.equal(calls.length, 2);
    assert.equal(calls[0].name, 'submit_application_edit');
    assert.equal(calls[0].args.p_original.notes, 'Old');
    context.supabaseClient.rpc = async () => ({ data: null });
    assert.equal((await context.DB.saveChange('application', 'UPDATE', 'app', {}, '', {})).unchanged, true);
    context.supabaseClient.rpc = async () => ({ error: new Error('Unavailable') });
    await assert.rejects(context.DB.saveChange('application', 'UPDATE', 'app', {}, '', {}), /Unavailable/);
});

test('new applications from staff and admin remain pending, appear in HOD review, and apply only on approval', async () => {
    const browser = await chromium.launch();
    try {
        const page = await browser.newPage();
        await page.setContent('<main id="page-content"></main>');
        await page.addStyleTag({ path: path.join(root, 'css/style.css') });
        await page.addScriptTag({ path: path.join(root, 'js/ui.js') });
        await page.addScriptTag({ content: `
            let userId = 'submitter';
            let admin = false;
            const requests = [];
            const applications = [];
            const Auth = { isSuperAdmin: () => admin, canReviewChanges: async () => userId === 'reviewer',
                getUser: () => ({ id: userId }), getEmail: () => userId + '@example.com' };
            const supabaseClient = { from: table => {
                if (table !== 'change_requests') throw new Error('Unexpected table: ' + table);
                return { select() { return this; }, eq(key, value) { this.id = value; return this; },
                    async single() { return { data: requests.find(r => r.id === this.id) }; } };
            } };
        ` });
        await page.addScriptTag({ path: path.join(root, 'js/data.js') });
        await page.addScriptTag({ path: path.join(root, 'js/app.js') });
        const results = await page.evaluate(async () => {
            DB.insertChangeRequest = async cr => { const saved = { ...cr, id: 'request-' + requests.length }; requests.push(saved); return saved; };
            DB.fetchChangeRequests = async () => requests;
            DB.insertCompany = async () => ({});
            DB.insertApplication = async data => { const saved = { ...data, id: 'app-' + applications.length }; applications.push(saved); return saved; };
            DB.updateChangeRequest = async (id, values) => Object.assign(requests.find(r => r.id === id), values);
            const results = [];
            for (const isAdmin of [false, true]) {
                admin = isAdmin;
                results.push(await DB.saveChange('application', 'CREATE', null,
                    { company: 'New company', name_facility: 'New facility', status: 'REVIEW BY BANK' }, 'New application'));
            }
            await App.renderBosReview(document.querySelector('main'));
            return { queued: results.map(r => r.queued), count: applications.length, recordIds: requests.map(r => r.record_id) };
        });
        assert.deepEqual(results, { queued: [true, true], count: 0, recordIds: [null, null] });
        assert.equal(await page.locator('.bos-card').count(), 2);
        assert.equal(await page.getByRole('button', { name: 'Approve', exact: true }).count(), 0);
        assert.match(await page.locator('.bos-card').first().innerText(), /New facility/);
        await page.evaluate(async () => { userId = 'reviewer'; await App.renderBosReview(document.querySelector('main')); });
        await page.getByRole('button', { name: 'Approve', exact: true }).first().click();
        await page.waitForFunction(() => applications.length === 1 && requests[0].status === 'APPROVED');
        assert.equal(await page.evaluate(() => applications[0].name_facility), 'New facility');
        await page.getByRole('button', { name: 'Reject', exact: true }).click();
        await page.waitForFunction(() => requests[1].status === 'REJECTED');
        assert.equal(await page.evaluate(() => applications.length), 1);
        await page.getByText('No pending changes.', { exact: false }).waitFor();
    } finally { await browser.close(); }
});

test('HOD review shows all changed values and supports reviewer decisions on desktop and mobile', async () => {
    const browser = await chromium.launch();
    try {
        const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.setContent('<main id="page-content" style="padding:16px"></main>');
        await page.addStyleTag({ path: path.join(root, 'css/style.css') });
        await page.addScriptTag({ path: path.join(root, 'js/ui.js') });
        await page.addScriptTag({ content: `
            const Auth = { isSuperAdmin: () => false, canReviewChanges: async () => true, getUser: () => ({ id: 'reviewer' }) };
            const payload = { notes: null, status: 'ON HOLD', discharge_note: false, total_approved: 0,
                company: 'Company', bank: 'Bank', type_facility: 'Loan', name_facility: 'Facility',
                profit_rate: '5%', rate_tenure: '10 years', collateral: '', app_details: '<img src=x onerror=alert(1)>',
                officers: [{ name: 'Officer', contact: '0123456789' }] };
            const requests = [{ id: 'edit', record_id: 'application-1', entity: 'application', action: 'UPDATE', status: 'PENDING',
                requested_by: 'staff', requested_by_email: 'staff@example.com', summary: 'Edit application',
                created_at: '2026-11-10', before_payload: { notes: 'Original note', status: 'IN FORCE' }, payload },
                { id: 'own', record_id: 'application-2', entity: 'application', action: 'UPDATE', status: 'PENDING', requested_by: 'reviewer',
                  summary: 'Own edit', payload: { notes: 'Own note' }, before_payload: { notes: 'Old' } },
                ...[
                    { entity: 'bank' }, { action: 'DELETE' },
                    { status: 'APPROVED' }, { status: 'REJECTED' }, { record_id: null },
                    { payload: {} }, { payload: { notes: 'Same' }, before_payload: { notes: 'Same' } }
                ].map((override, index) => ({ id: 'unrelated-' + index, record_id: 'application-3',
                    entity: 'application', action: 'UPDATE', status: 'PENDING', summary: 'Unrelated request',
                    payload: { notes: 'New' }, before_payload: { notes: 'Old' }, ...override }))];
            const DB = { fetchBosReviews: async () => { throw new Error('Legacy proposals must not be loaded'); }, fetchChangeRequests: async () => requests,
                approveChangeRequest: async (id, notes) => { requests.find(r => r.id === id).status = 'APPROVED'; window.reviewNote = notes; },
                rejectChangeRequest: async (id, notes) => { requests.find(r => r.id === id).status = 'REJECTED'; window.reviewNote = notes; } };
            UI.showToast = message => { window.lastToast = message; };
        ` });
        await page.addScriptTag({ path: path.join(root, 'js/app.js') });
        await page.evaluate(() => App.renderBosReview(document.getElementById('page-content')));
        assert.equal(await page.locator('.review-change-field').count(), 14);
        assert.equal(await page.getByText('Unrelated request', { exact: true }).count(), 0);
        assert.equal(await page.getByRole('button', { name: 'Add Proposal' }).count(), 0);
        assert.equal(await page.getByText('Total Proposals', { exact: true }).count(), 0);
        assert.equal(await page.locator('.pill-stat-val').innerText(), '2');
        assert.equal(await page.locator('.review-change-fields:visible').count(), 0);
        assert.equal(await page.getByLabel('Review note (optional)').isVisible(), false);
        const view = page.locator('[data-review-view]').first();
        await view.focus();
        await page.keyboard.press('Enter');
        assert.equal(await page.getByRole('dialog').isVisible(), true);
        assert.equal(await view.innerText(), 'View');
        assert.equal(await page.locator('.review-change-fields:visible').count(), 1);
        assert.match(await page.locator('.review-change-fields').first().innerText(), /Original note/);
        assert.match(await page.locator('.review-change-fields').first().innerText(), /Proposed:.*\(empty\)/);
        assert.match(await page.locator('.review-change-fields').first().innerText(), /0123456789/);
        assert.equal(await page.locator('.review-change-fields img').count(), 0);
        assert.equal(await page.getByRole('button', { name: 'Approve', exact: true }).count(), 1);
        await page.getByLabel('Review note (optional)').fill('Verified with finance');
        await page.keyboard.press('Escape');
        assert.equal(await page.getByRole('dialog').count(), 0);
        assert.equal(await view.evaluate(button => button === document.activeElement), true);
        assert.equal(await page.locator('.review-change-fields:visible').count(), 0);
        await page.getByRole('button', { name: 'Approve', exact: true }).focus();
        await page.keyboard.press('Enter');
        await page.waitForFunction(() => window.lastToast === 'Change approved and applied');
        assert.equal(await page.evaluate(() => window.reviewNote), 'Verified with finance');
        await page.waitForFunction(() => !document.querySelector('[onclick="App.approveChangeRequest(\'edit\')"]'));
        await page.evaluate(() => { requests[0].status = 'PENDING'; return App.renderBosReview(document.getElementById('page-content')); });
        await page.locator('[data-review-view]').first().click();
        await page.getByLabel('Review note (optional)').fill('Please correct the amount');
        await page.getByRole('button', { name: 'Close', exact: true }).click();
        await page.getByRole('button', { name: 'Reject', exact: true }).click();
        await page.waitForFunction(() => window.lastToast === 'Change rejected');
        assert.equal(await page.evaluate(() => window.reviewNote), 'Please correct the amount');
        await page.evaluate(() => { requests[0].status = 'PENDING'; return App.renderBosReview(document.getElementById('page-content')); });
        await page.setViewportSize({ width: 390, height: 844 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        await page.screenshot({ path: path.join(require('node:os').tmpdir(), 'facility-hod-review-compact-mobile.png'), fullPage: true });
        await page.locator('[data-review-view]').first().click();
        assert.equal(await page.locator('.review-change-fields').first().isVisible(), true);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        await page.screenshot({ path: path.join(require('node:os').tmpdir(), 'facility-hod-review-mobile.png'), fullPage: true });
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.screenshot({ path: path.join(require('node:os').tmpdir(), 'facility-hod-review-dialog-desktop.png'), fullPage: true });
        await page.getByRole('button', { name: 'Close application details' }).click();
        await page.evaluate(() => { DB.approveChangeRequest = async () => { throw new Error('Review unavailable'); }; });
        await page.getByRole('button', { name: 'Approve', exact: true }).click();
        await page.waitForFunction(() => window.lastToast === 'Error approving: Review unavailable');
        assert.equal(await page.getByRole('button', { name: 'Approve', exact: true }).count(), 1);
        await page.evaluate(() => { requests.forEach(r => r.status = 'REJECTED'); return App.renderBosReview(document.getElementById('page-content')); });
        assert.match(await page.locator('#page-content').innerText(), /No pending changes/);
        assert.deepEqual(errors, []);
    } finally {
        await browser.close();
    }
});
