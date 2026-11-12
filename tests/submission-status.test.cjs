const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');

test('review by bank is selectable and counted as active, with legacy declines preserved', async () => {
    const app = fs.readFileSync(path.join(root, 'js/app.js'), 'utf8');
    assert.equal((app.match(/<option>REVIEW BY BANK<\/option>/g) || []).length, 2);
    assert.ok(!app.includes('<option>DECLINED</option>'));
    const context = vm.createContext({});
    vm.runInContext(fs.readFileSync(path.join(root, 'js/data.js'), 'utf8') + '\nglobalThis.DB = DB;', context);
    context.DB.fetchApplications = async () => [
        { status: 'REVIEW BY BANK', company: 'Example', total_requested: 100 },
        { status: 'DECLINED', company: 'Example', total_requested: 100 }
    ];
    const stats = await context.DB.getDashboardStats();
    assert.equal(stats.inProgress, 1);
    assert.equal(stats.declined, 1);
    assert.equal(stats.statusCount['REVIEW BY BANK'], 1);
    vm.runInContext(fs.readFileSync(path.join(root, 'js/ui.js'), 'utf8') + '\nglobalThis.UI = UI;', context);
    assert.match(context.UI.statusBadge('REVIEW BY BANK'), /badge progress/);
    assert.match(context.UI.progressHtml(0, 'REVIEW BY BANK'), /70%/);
});
