const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { chromium } = require('playwright');
const root = path.join(__dirname, '..');

test('attachments include current and review files, deduplicate URLs, reject unsafe links and paginate', async () => {
    const application = { id: 'app1', company: 'Company', name_facility: 'Facility', bank_cancellation_letter_path: 'https://example.com/current.pdf' };
    const tables = {
        applications: [application, ...Array.from({ length: 499 }, (_, i) => ({ id: String(i) }))],
        change_requests: [{ entity: 'application', status: 'PENDING', record_id: 'app1', before_payload: application,
            payload: { bank_cancellation_letter_path: 'https://example.com/new.png', bank_cancellation_letter_name: 'new.png' } },
            { entity: 'application', payload: { bank_cancellation_letter_path: 'javascript:alert(1)' } }]
    };
    const calls = [];
    const context = vm.createContext({ URL, supabaseClient: { from(table) {
        return { select() { return this; }, order() { return this; }, async range(start, end) {
            calls.push([table, start]); return { data: tables[table].slice(start, end + 1) };
        } };
    } } });
    vm.runInContext(fs.readFileSync(path.join(root, 'js/data.js'), 'utf8') + '\nglobalThis.DB = DB;', context);
    const files = await context.DB.fetchAttachments();
    assert.equal(files.length, 2);
    assert.equal(files[0].state, 'Current');
    assert.equal(files[1].state, 'PENDING');
    assert.equal(files[1].company, 'Company');
    assert.equal(files[1].format, 'Image');
    assert.ok(calls.some(([table, start]) => table === 'applications' && start === 500));
});

test('attachment page filters, clear, links, empty/error states, keyboard and mobile', async () => {
    const browser = await chromium.launch();
    try {
        const page = await browser.newPage();
        await page.setContent('<main id="page-content"></main>');
        await page.addStyleTag({ path: path.join(root, 'css/style.css') });
        await page.addScriptTag({ path: path.join(root, 'js/ui.js') });
        await page.addScriptTag({ content: `const DB = { async fetchAttachments() { return [
            { url:'https://example.com/a.pdf', name:'<img src=x onerror=alert(1)>.pdf', format:'PDF', type:'Bank cancellation letter', application:'Facility A', company:'Company A', bank:'Bank A', year:2026, state:'Current', applicationId:'1' },
            { url:'https://example.com/b.png', name:'letter.png', format:'Image', type:'Bank cancellation letter', application:'Facility B', company:'Company B', bank:'Bank B', state:'PENDING', applicationId:'2' }
        ]; } };` });
        await page.addScriptTag({ path: path.join(root, 'js/app.js') });
        await page.evaluate(() => App.renderAttachments(document.querySelector('main')));
        assert.equal(await page.locator('.attachment-group').count(), 2);
        assert.equal(await page.locator('img').count(), 0);
        await page.getByLabel('File type').selectOption('Image');
        assert.equal(await page.locator('.attachment-group').count(), 1);
        await page.getByRole('button', { name: 'Clear filters' }).click();
        await page.getByLabel('Company', { exact: true }).selectOption('Company A');
        assert.equal(await page.locator('.attachment-group').count(), 1);
        assert.equal(await page.getByRole('link').getAttribute('href'), 'https://example.com/a.pdf');
        await page.getByLabel('Search').fill('missing');
        assert.equal(await page.getByText('No matching attachments').count(), 1);
        await page.getByRole('button', { name: 'Clear filters' }).focus();
        await page.keyboard.press('Enter');
        assert.equal(await page.locator('.attachment-group').count(), 2);
        await page.route('https://example.com/**', route => route.fulfill({ body: 'Test file' }));
        const popupEvent = page.waitForEvent('popup');
        await page.getByRole('link').first().click();
        const popup = await popupEvent;
        await popup.close();
        await page.setViewportSize({ width: 375, height: 812 });
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        await page.screenshot({ path: path.join(require('node:os').tmpdir(), 'facility-attachments-mobile.png'), fullPage: true });
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.screenshot({ path: path.join(require('node:os').tmpdir(), 'facility-attachments-desktop.png'), fullPage: true });
        await page.evaluate(async () => { DB.fetchAttachments = async () => { throw new Error('Unavailable'); }; await App.renderAttachments(document.querySelector('main')); });
        assert.equal(await page.getByText('Unable to load attachments').count(), 1);
        await page.evaluate(() => { DB.fetchAttachments = async () => []; });
        await page.getByRole('button', { name: 'Retry' }).click();
        await page.getByText('No attachments yet').waitFor();
    } finally { await browser.close(); }
});
