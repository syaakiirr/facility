const App = {
    currentPage: 'dashboard',
    currentCompany: null,

    pages: {
        dashboard: { label: 'Dashboard', icon: 'grid' },
        applications: { label: 'Applications', icon: 'file-text' },
        attachments: { label: 'Attachments', icon: 'file-text' },
        companies: { label: 'Companies', icon: 'briefcase' },
        banks: { label: 'Banks & BFR', icon: 'building' },
        reports: { label: 'Reports', icon: 'bar-chart' },
        bos_review: { label: 'HOD Review', icon: 'clipboard' },
        review_history: { label: 'Review History', icon: 'activity' },
        audit_trail: { label: 'Audit Trail', icon: 'activity' },
        collateral: { label: 'Collateral', icon: 'shield' },
        users: { label: 'Users', icon: 'users' },
        settings: { label: 'Settings', icon: 'settings' }
    },

    icons: {
        grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
        'file-text': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
        briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
        building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><line x1="9" y1="18" x2="9" y2="18.01"/><line x1="15" y1="18" x2="15" y2="18.01"/><line x1="4" y1="22" x2="20" y2="22"/></svg>',
        'bar-chart': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
        clipboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>',
        logOut: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
        plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
        edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
        trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
        shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
        users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
        activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
        external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>'
    },

    async init() {
        const session = await Auth.init();
        if (!session) {
            window.location.href = 'landing.html';
            return;
        }
        this.renderShell();
        UI.initSidebar();
        // Use hash-based navigation exclusively to avoid double-navigation.
        // Setting the hash fires hashchange which calls navigate() once.
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1) || 'dashboard';
            const [page, param] = hash.split('|');
            const isSamePage = page === this.currentPage;
            const isSameParam = param === this._currentParam;
            if (!isSamePage || !isSameParam) {
                this.navigate(page, param);
            }
        });
        const initialHash = window.location.hash.slice(1) || 'dashboard';
        const [initialPage, initialParam] = initialHash.split('|');
        this.navigate(initialPage, initialParam);
    },

    renderShell() {
        const root = document.getElementById('app');
        root.innerHTML = `
            <div class="app-layout">
                <aside class="sidebar" id="sidebar">
                    <div class="sidebar-logo">
                        <div class="sidebar-logo-icon">FM</div>
                        <div class="sidebar-logo-text">FM Data<span>Facilities Dashboard</span></div>
                    </div>
                    <nav class="sidebar-nav" id="sidebar-nav">
                        <div class="sidebar-nav-label">Main Menu</div>
                        ${Object.entries(this.pages)
                            .filter(([key]) => key !== 'users' || Auth.isSuperAdmin())
                            .map(([key, p]) =>
                            `<div class="sidebar-nav-item" data-page="${key}">
                                ${this.icons[p.icon]}
                                <span>${p.label}</span>
                            </div>`
                        ).join('')}
                    </nav>
                    <div class="sidebar-footer">
                        <div class="sidebar-user">
                            <div class="sidebar-user-avatar" id="user-avatar">${(Auth.getEmail()[0] || '?').toUpperCase()}</div>
                            <div class="sidebar-user-info">
                                <div class="sidebar-user-name" id="user-name">${Auth.getEmail()}</div>
                                <div class="sidebar-user-role" id="sidebar-user-role">${Auth.isSuperAdmin() ? 'Super Admin' : 'Staff'}</div>
                            </div>
                        </div>
                    </div>
                </aside>
                <div class="main-content">
                    <header class="topbar">
                        <div class="topbar-left">
                            <button class="hamburger-btn" aria-label="Toggle sidebar">${this.icons.grid}</button>
                            <h1 class="topbar-title" id="topbar-title">Dashboard</h1>
                        </div>
                        <div class="topbar-right">
                            <button class="topbar-btn danger" id="btn-logout">${this.icons.logOut} Logout</button>
                        </div>
                    </header>
                    <div class="page-content" id="page-content"></div>
                </div>
            </div>`;
        document.getElementById('btn-logout').addEventListener('click', () => Auth.logout());
        document.querySelectorAll('.sidebar-nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                // Only set hash — hashchange listener calls navigate() to prevent double-navigation
                window.location.hash = page;
            });
        });
    },

    async navigate(page, param) {
        if (!this.pages[page]) page = 'dashboard';
        this.currentPage = page;
        this._currentParam = param || null;
        this.currentCompany = null;

        // Navigation token: increments with each navigate() call.
        // Render functions capture their token and bail out if it becomes stale
        // (i.e. a new navigation started before the previous render completed).
        this._navToken = (this._navToken || 0) + 1;
        const myToken = this._navToken;
        const isCurrent = () => this._navToken === myToken;

        document.querySelectorAll('.sidebar-nav-item').forEach(el => {
            el.classList.toggle('active', el.dataset.page === page);
        });
        document.getElementById('topbar-title').textContent = this.pages[page].label;

        const content = document.getElementById('page-content');
        content.onclick = null;
        content.innerHTML = '<div class="skeleton" style="height:320px;border-radius:12px;margin-bottom:24px"></div><div class="skeleton" style="height:200px;border-radius:12px"></div>';

        // RBAC: if not super admin, check page permission
        if (!Auth.isSuperAdmin()) {
            const allowed = await this.isPageAllowed(page);
            if (!isCurrent()) return; // stale — newer navigation started, abort
            if (!allowed) {
                this.renderUnfinishedPage(content, page);
                return;
            }
        }

        if (!isCurrent()) return; // stale — abort before render

        try {
            switch (page) {
                case 'dashboard': await this.renderDashboard(content, isCurrent); break;
                case 'applications': await this.renderApplications(content, param); break;
                case 'attachments': await this.renderAttachments(content, isCurrent); break;
                case 'companies': await this.renderCompanies(content); break;
                case 'banks': await this.renderBanks(content); break;
                case 'reports': await this.renderReports(content); break;
                case 'bos_review': await this.renderBosReview(content); break;
                case 'review_history': await this.renderReviewHistory(content); break;
                case 'audit_trail': await this.renderAuditTrail(content, isCurrent); break;
                case 'collateral': await this.renderCollaterals(content); break;
                case 'users': await this.renderUsers(content); break;
                case 'settings': await this.renderSettings(content); break;
            }
        } catch (err) {
            if (!isCurrent()) return;
            content.innerHTML = `<div class="empty-state"><h3>Error loading page</h3><p>${err.message}</p></div>`;
            console.error(err);
        }
    },

    async renderAttachments(el, isCurrent = () => true) {
        const esc = value => UI.escapeHtml(String(value ?? ''));
        el.innerHTML = '<p role="status">Loading attachments...</p>';
        let files;
        try {
            files = await DB.fetchAttachments();
        } catch (error) {
            if (!isCurrent()) return;
            el.innerHTML = `<div class="empty-state"><h3>Unable to load attachments</h3><p>${esc(error.message)}</p><button class="btn-secondary" id="attachments-retry">Retry</button></div>`;
            el.querySelector('button').onclick = () => this.renderAttachments(el, isCurrent);
            return;
        }
        if (!isCurrent()) return;
        el.innerHTML = `<section class="attachments-page">
            <h2>Attachments</h2>
            <p>Application files grouped by document type and application, including review submissions you can access.</p>
            <div class="filter-bar attachments-filters">
                <div><label for="attachments-search">Search</label><input id="attachments-search" type="search" placeholder="File, application, company or bank"></div>
                <div><label for="attachments-format">File type</label><select id="attachments-format"><option value="">All file types</option><option>PDF</option><option>Image</option><option>Other</option></select></div>
                <div><label for="attachments-company">Company</label><select id="attachments-company"><option value="">All companies</option>${[...new Set(files.map(f => f.company))].map(c => `<option>${esc(c)}</option>`).join('')}</select></div>
                <button class="btn-secondary" id="attachments-clear">Clear filters</button>
            </div>
            <p id="attachments-count" role="status"></p><div id="attachments-list"></div>
        </section>`;
        const search = el.querySelector('#attachments-search');
        const format = el.querySelector('#attachments-format');
        const company = el.querySelector('#attachments-company');
        const render = () => {
            const query = search.value.trim().toLowerCase();
            const visible = files.filter(f => (!format.value || f.format === format.value) && (!company.value || f.company === company.value) &&
                [f.name, f.application, f.company, f.bank, f.year, f.type, f.state].join(' ').toLowerCase().includes(query));
            el.querySelector('#attachments-count').textContent = `${visible.length} of ${files.length} attachments`;
            const groups = new Map();
            visible.forEach(file => {
                const key = JSON.stringify([file.type, file.applicationId, file.company, file.application]);
                if (!groups.has(key)) groups.set(key, []);
                groups.get(key).push(file);
            });
            el.querySelector('#attachments-list').innerHTML = visible.length ? [...groups.values()].map(group => {
                const f = group[0];
                return `<section class="card attachment-group"><div class="card-header"><div>
                    <p>${esc(f.type)}</p><h3>${esc(f.application)}</h3>
                    <p>${esc([f.company, f.bank, f.year].filter(Boolean).join(' · '))}</p>
                    <p class="attachment-reference">Application reference: ${esc(f.applicationId)}</p>
                </div></div><ul class="attachment-files">${group.map(file => `<li>
                    <div><strong>${esc(file.name)}</strong><p>${esc(file.format)} · ${esc(file.state)}</p></div>
                    <a class="btn-secondary" href="${esc(file.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc('Open ' + file.name + ' (new tab)')}">Open file</a>
                </li>`).join('')}</ul></section>`;
            }).join('') : `<div class="empty-state"><h3>${files.length ? 'No matching attachments' : 'No attachments yet'}</h3><p>${files.length ? 'Try another search or clear the filters.' : 'Files uploaded through application forms will appear here after the application or review request is saved.'}</p></div>`;
        };
        search.oninput = render;
        format.onchange = company.onchange = render;
        el.querySelector('#attachments-clear').onclick = () => { search.value = format.value = company.value = ''; render(); };
        render();
    },

    async isPageAllowed(page) {
        try {
            if (!this._pagePermissions) {
                const data = await DB.fetchPagePermissions();
                this._pagePermissions = {};
                data.forEach(p => { this._pagePermissions[p.page_key] = p.is_allowed; });
            }
            // Fail-closed: if page_key not found in permissions table, deny access
            // (prevents RLS failures from silently granting access to all pages)
            if (!(page in this._pagePermissions)) return false;
            return this._pagePermissions[page] === true;
        } catch (err) {
            console.warn('RBAC check failed, denying access:', err.message);
            return false; // fail-closed on error
        }
    },

    renderUnfinishedPage(el, page) {
        const info = this.pages[page] || { label: page, icon: 'grid' };
        el.innerHTML = `
            <div class="unfinished-page">
                <div class="unfinished-badge-top">
                    <span class="badge hold">UNDER DEVELOPMENT</span>
                </div>
                <div class="unfinished-body">
                    <div class="unfinished-icon-wrap">
                        ${this.icons[info.icon] || this.icons.grid}
                    </div>
                    <h2 class="unfinished-title">${info.label}</h2>
                    <p class="unfinished-desc">This module is currently in development and will be available in a future update.</p>
                    <div class="unfinished-sections">
                        <div class="card">
                            <div class="card-header"><div class="card-header-title">Overview</div></div>
                            <div class="card-body">
                                <div class="unfinished-placeholder">
                                    <div class="unfinished-line" style="width:65%"></div>
                                    <div class="unfinished-line" style="width:80%"></div>
                                    <div class="unfinished-line" style="width:40%"></div>
                                    <div class="unfinished-line" style="width:55%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="card" style="margin-top:16px">
                            <div class="card-header"><div class="card-header-title">Data & Reports</div></div>
                            <div class="card-body">
                                <div class="unfinished-placeholder">
                                    <div class="unfinished-line" style="width:90%"></div>
                                    <div class="unfinished-line" style="width:70%"></div>
                                    <div class="unfinished-line" style="width:85%"></div>
                                    <div class="unfinished-line" style="width:45%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="card" style="margin-top:16px">
                            <div class="card-header"><div class="card-header-title">Configuration</div></div>
                            <div class="card-body">
                                <div class="unfinished-placeholder">
                                    <div class="unfinished-row"></div>
                                    <div class="unfinished-row"></div>
                                    <div class="unfinished-row" style="width:60%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="unfinished-footer-text">Module Version 0.1 &mdash; estimation completion: TBD</div>
            </div>`;
    },

    async applyChartVisibility() {
        const charts = await DB.fetchChartVisibility();
        charts.forEach(c => {
            if (!c.is_visible) {
                const el = document.getElementById(c.chart_key);
                if (el) {
                    const card = el.closest('.card');
                    if (card) card.style.display = 'none';
                }
            }
        });
        document.querySelectorAll('.grid-2').forEach(grid => {
            const visible = grid.querySelectorAll('.card:not([style*="display: none"])');
            if (visible.length === 0) {
                grid.style.display = 'none';
            } else if (visible.length === 1) {
                grid.style.gridTemplateColumns = '1fr';
            }
        });
    },

    async renderDashboard(el, isCurrent) {
        clearAnimIntervals();
        const stats = await DB.getDashboardStats();
        // Bail out if a newer navigation started while we were fetching data
        if (isCurrent && !isCurrent()) return;

        const total = stats.total || 0;
        const done = stats.done || 0;
        const inProgress = stats.inProgress || 0;
        const hold = stats.statusCount?.['ON HOLD'] || 0;
        const declined = stats.declined || 0;
        const pending = stats.statusCount?.['PENDING'] || 0;

        const donePct = total > 0 ? ((done / total) * 100).toFixed(1) : '0.0';
        const inProgressPct = total > 0 ? ((inProgress / total) * 100).toFixed(1) : '0.0';
        const holdPct = total > 0 ? ((hold / total) * 100).toFixed(1) : '0.0';
        const declinedPct = total > 0 ? ((declined / total) * 100).toFixed(1) : '0.0';
        const pendingPct = total > 0 ? ((pending / total) * 100).toFixed(1) : '0.0';

        const approvedPercent = stats.totalRequested > 0 
            ? Math.round((stats.totalApproved / stats.totalRequested) * 100) 
            : (total > 0 ? Math.round((done / total) * 100) : 0);
        const unapprovedAmount = Math.max(0, stats.totalRequested - stats.totalApproved);

        const showInsightAlert = declined > done;

        // Custom Bank List (Screenshot 2 & 4)
        const bankEntries = Object.entries(stats.bankCounts || {}).sort((a, b) => b[1] - a[1]);
        let isBanksExpanded = false;
        const topBanks = bankEntries.slice(0, 4);
        const remainingBanksCount = Math.max(0, bankEntries.length - 4);
        const maxBankCount = bankEntries.length > 0 ? bankEntries[0][1] : 1;

        // Custom Top Companies (Screenshot 2)
        const companyEntries = Object.entries(stats.companyTotals || {})
            .map(([name, val]) => ({ name, requested: val.requested || 0, approved: val.approved || 0 }))
            .sort((a, b) => b.requested - a.requested)
            .slice(0, 3);

        // Custom Decline Reasons (Screenshot 3)
        const declineEntries = Object.entries(stats.declineReasons || {})
            .sort((a, b) => b[1] - a[1]);
        const maxDeclineCount = declineEntries.length > 0 ? declineEntries[0][1] : 1;

        el.innerHTML = `
            ${showInsightAlert ? `
            <div class="insight-alert-banner">
                <div class="insight-alert-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
                <div class="insight-alert-content">
                    <div class="insight-alert-title">Decline rate exceeds completion rate</div>
                    <div class="insight-alert-desc">
                        ${declinedPct}% of applications were declined against ${donePct}% done. Approval rate sits at ${approvedPercent}%, leaving ${UI.formatCurrency(unapprovedAmount)} in requested financing unapproved.
                    </div>
                </div>
            </div>
            ` : ''}

            <div class="pipeline-card">
                <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 20px 4px 20px">
                    <span class="pipeline-card-title" style="padding:0">Pipeline</span>
                </div>
                <div class="pipeline-grid">
                    <div class="pipeline-item" data-drill="">
                        <div class="pipeline-label">Total applications</div>
                        <div class="pipeline-val" id="kpi-total">0</div>
                    </div>
                    <div class="pipeline-item" data-drill="group:inforce">
                        <div class="pipeline-label">In force</div>
                        <div class="pipeline-val done" id="kpi-done">0</div>
                    </div>
                    <div class="pipeline-item" data-drill="group:progress">
                        <div class="pipeline-label">In progress</div>
                        <div class="pipeline-val progress" id="kpi-progress">0</div>
                    </div>
                    <div class="pipeline-item ${showInsightAlert ? 'active-declined' : ''}" data-drill="group:declined">
                        <div class="pipeline-label">Declined ↗</div>
                        <div class="pipeline-val declined" id="kpi-declined">0</div>
                    </div>
                </div>
            </div>

            <div class="funding-section">
                <div class="funding-section-title">Funding and approval</div>
                <div class="funding-card">
                    <div class="funding-gauge-col">
                        <div class="funding-gauge-wrap">
                            <svg class="funding-gauge-svg" viewBox="0 0 100 100">
                                <circle class="funding-gauge-bg" cx="50" cy="50" r="38" />
                                <circle class="funding-gauge-fill" id="funding-gauge-circle" cx="50" cy="50" r="38" />
                            </svg>
                            <div class="funding-gauge-center">
                                <div class="funding-gauge-percent" id="funding-gauge-percent">0%</div>
                                <div class="funding-gauge-sub">approved</div>
                            </div>
                        </div>
                    </div>
                    <div class="funding-bars-col">
                        <div class="funding-bar-group">
                            <div class="funding-bar-meta">
                                <span class="funding-bar-label">Requested</span>
                                <span class="funding-bar-val mono" id="kpi-requested">RM 0</span>
                            </div>
                            <div class="funding-bar-track">
                                <div class="funding-bar-fill requested-fill"></div>
                            </div>
                        </div>
                        <div class="funding-bar-group">
                            <div class="funding-bar-meta">
                                <span class="funding-bar-label">Approved</span>
                                <span class="funding-bar-val mono" id="kpi-approved">RM 0</span>
                            </div>
                            <div class="funding-bar-track">
                                <div class="funding-bar-fill approved-fill" id="funding-bar-approved-fill"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid-2" style="margin-bottom:24px">
                <div class="card">
                    <div class="card-header"><div class="card-header-title">Application status</div></div>
                    <div class="card-body"><div class="chart-container" id="chart-status-donut"></div></div>
                </div>
                <div class="card">
                    <div class="card-header"><div class="card-header-title">Application status distribution</div></div>
                    <div class="card-body">
                        <div class="segmented-bar-container">
                            <div class="segmented-bar">
                                <div class="segmented-part done" style="width:${donePct}%"></div>
                                <div class="segmented-part progress" style="width:${inProgressPct}%"></div>
                                <div class="segmented-part hold" style="width:${holdPct}%"></div>
                                <div class="segmented-part declined" style="width:${declinedPct}%"></div>
                                <div class="segmented-part pending" style="width:${pendingPct}%"></div>
                            </div>
                            <div class="legend-grid">
                                <div class="legend-item" data-drill="group:inforce">
                                    <div class="legend-head"><span class="legend-dot done"></span>In force</div>
                                    <div class="legend-pct">${donePct}%</div>
                                </div>
                                <div class="legend-item" data-drill="group:progress">
                                    <div class="legend-head"><span class="legend-dot progress"></span>In progress</div>
                                    <div class="legend-pct">${inProgressPct}%</div>
                                </div>
                                <div class="legend-item" data-drill="group:hold">
                                    <div class="legend-head"><span class="legend-dot hold"></span>Hold</div>
                                    <div class="legend-pct">${holdPct}%</div>
                                </div>
                                <div class="legend-item" data-drill="group:declined">
                                    <div class="legend-head"><span class="legend-dot declined"></span>Declined</div>
                                    <div class="legend-pct">${declinedPct}%</div>
                                </div>
                                <div class="legend-item" data-drill="group:pending">
                                    <div class="legend-head"><span class="legend-dot pending"></span>Pending</div>
                                    <div class="legend-pct">${pendingPct}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card" style="margin-bottom:24px">
                <div class="card-header"><div class="card-header-title">Applications by partner bank</div></div>
                <div class="card-body">
                    <div class="custom-bar-list" id="bank-bars-container">
                        ${topBanks.map(([name, count]) => {
                            const pct = Math.round((count / maxBankCount) * 100);
                            return `
                            <div class="bank-bar-row" data-drill="bank:${encodeURIComponent(name)}">
                                <div class="bank-bar-name">${name}</div>
                                <div class="bank-bar-track"><div class="bank-bar-fill" style="width:${pct}%"></div></div>
                                <div class="bank-bar-count">${count}</div>
                            </div>`;
                        }).join('')}
                    </div>
                    ${remainingBanksCount > 0 ? `
                        <button class="expand-banks-btn" id="btn-expand-banks">Show ${remainingBanksCount} more banks</button>
                    ` : ''}
                </div>
            </div>

            <div class="card" style="margin-bottom:24px">
                <div class="card-header">
                    <div class="card-header-title">Top companies — requested vs approved</div>
                    <div style="display:flex;gap:14px;font-size:12px;color:var(--text-3)">
                        <span style="display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;background:#cbd5e1;border-radius:50%"></span>Requested</span>
                        <span style="display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;background:#0f172a;border-radius:50%"></span>Approved</span>
                    </div>
                </div>
                <div class="card-body">
                    <div class="custom-bar-list">
                        ${companyEntries.map(c => {
                            const appPct = c.requested > 0 ? Math.min(100, Math.round((c.approved / c.requested) * 100)) : 0;
                            return `
                            <div class="company-bar-row" data-drill="company:${encodeURIComponent(c.name)}">
                                <div class="company-bar-name">${c.name}</div>
                                <div class="funding-bar-track">
                                    <div class="funding-bar-fill approved-fill" style="width:${appPct}%"></div>
                                </div>
                                <div class="company-bar-meta">
                                    <span>${UI.formatCurrency(c.requested)}</span>
                                    <span>${UI.formatCurrency(c.approved)}</span>
                                </div>
                            </div>`;
                        }).join('')}
                    </div>
                </div>
            </div>

            <div class="card" style="margin-bottom:24px">
                <div class="card-header"><div class="card-header-title">Decline reasons</div></div>
                <div class="card-body">
                    <div class="custom-bar-list">
                        ${declineEntries.map(([reason, count]) => {
                            const pct = Math.round((count / maxDeclineCount) * 100);
                            return `
                            <div class="decline-bar-row">
                                <div class="decline-bar-label">${reason}</div>
                                <div class="bank-bar-track"><div class="decline-bar-fill" style="width:${pct}%"></div></div>
                                <div class="bank-bar-count">${count}</div>
                            </div>`;
                        }).join('')}
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="card-header-title" style="color:var(--text-3);font-size:13px">Recent applications</div>
                    <a href="#applications" style="font-size:13px;font-weight:600;color:var(--accent);text-decoration:none">View all &rarr;</a>
                </div>
                <div class="card-body" id="recent-apps-table"></div>
            </div>`;

        animateCounter('kpi-total', stats.total);
        animateCounter('kpi-done', stats.done);
        animateCounter('kpi-progress', stats.inProgress);
        animateCounter('kpi-declined', stats.declined);
        animateCounterValue('kpi-requested', stats.totalRequested);
        animateCounterValue('kpi-approved', stats.totalApproved);

        // Status donut (exact per-status counts) — slices drill down to Applications
        const statusDist = {};
        (stats.apps || []).forEach(a => {
            const s = a.status || 'UNKNOWN';
            statusDist[s] = (statusDist[s] || 0) + 1;
        });
        Charts.donutStatus('chart-status-donut', statusDist, (p) => {
            if (p && p.name) window.location.hash = 'applications|status:' + encodeURIComponent(p.name);
        });

        // Update Funding Gauge & Fill Animation
        const clampedPercent = Math.min(100, Math.max(0, approvedPercent));
        animatePercentage('funding-gauge-percent', clampedPercent);

        const circleEl = document.getElementById('funding-gauge-circle');
        if (circleEl) {
            const circumference = 2 * Math.PI * 38;
            circleEl.style.strokeDasharray = `${circumference}`;
            circleEl.style.strokeDashoffset = `${circumference}`;
            setTimeout(() => {
                const offset = circumference - (circumference * clampedPercent / 100);
                circleEl.style.strokeDashoffset = `${offset}`;
            }, 50);
        }

        const barFillEl = document.getElementById('funding-bar-approved-fill');
        if (barFillEl) {
            setTimeout(() => {
                barFillEl.style.width = `${clampedPercent}%`;
            }, 50);
        }

        // Expand Banks Toggle Button
        document.getElementById('btn-expand-banks')?.addEventListener('click', (e) => {
            isBanksExpanded = !isBanksExpanded;
            const displayBanks = isBanksExpanded ? bankEntries : topBanks;
            const container = document.getElementById('bank-bars-container');
            if (container) {
                container.innerHTML = displayBanks.map(([name, count]) => {
                    const pct = Math.round((count / maxBankCount) * 100);
                    return `
                    <div class="bank-bar-row" data-drill="bank:${encodeURIComponent(name)}">
                        <div class="bank-bar-name">${name}</div>
                        <div class="bank-bar-track"><div class="bank-bar-fill" style="width:${pct}%"></div></div>
                        <div class="bank-bar-count">${count}</div>
                    </div>`;
                }).join('');
            }
            e.target.textContent = isBanksExpanded ? 'Show less' : `Show ${remainingBanksCount} more banks`;
        });

        // Drill-down: click any value to open Applications filtered to it.
        // Delegated via onclick property (idempotent) so expanded bank rows work too.
        el.onclick = (e) => {
            const node = e.target.closest('[data-drill]');
            if (!node) return;
            const drill = node.getAttribute('data-drill');
            window.location.hash = drill ? 'applications|' + drill : 'applications';
        };

        // Recent Apps Table
        const recent = stats.apps.slice(0, 5);
        const table = UI.renderTable(recent,
            [
                { label: 'Company', render: (v, r) => `<strong style="color:var(--text-1)">${r.company || '-'}</strong>` },
                { label: 'Bank', render: (v, r) => r.bank || '-' },
                { label: 'Facility', render: (v, r) => r.type_facility || '-' },
                { label: 'Requested', render: (v, r) => UI.formatCurrency(r.total_requested) },
                { label: 'Status', render: (v, r) => UI.statusBadge(r.status) },
                { label: 'Progress', render: (v, r) => `${r.progress || 0}%` }
            ]
        );
        document.getElementById('recent-apps-table').appendChild(table);
    },


    async renderApplications(el, companyFilter) {
        const banks = await DB.fetchBanks();
        const bankNames = banks.map(b => b.name);
        const stats = await DB.getDashboardStats();
        const dbCompanies = await DB.fetchCompanies();
        const companies = dbCompanies.map(c => c.name);
        const collaterals = await DB.fetchCollaterals();
        let collateralFilter = null;
        let linkParam = companyFilter || null;

        // Collateral drill-down: collateral:<uuid>
        if (linkParam && linkParam.startsWith('collateral:')) {
            const collId = linkParam.replace('collateral:', '');
            collateralFilter = collaterals.find(c => c.id === collId) || null;
            linkParam = null;
        }

        // Dashboard drill-downs: group:<key> / status:<value> / bank:<name> / company:<name>
        const statusGroups = {
            inforce: ['IN FORCE'],
            progress: ['IN PROGRESS', 'PREPARATION DOC BY FINANCE', 'SUBMISSION DOC TO BANK', 'REVIEW BY BANK'],
            hold: ['ON HOLD', 'PENDING', 'REVIEW BY HOD', 'REVIEW BY BOS'],
            pending: ['PENDING'],
            discharged: ['DISCHARGED', 'SETTLED'],
            done: ['DONE'],
            declined: ['DECLINED', 'DECLINED BY BANK', 'DECLINED BY COMPANY'],
            cancelled: ['CANCELLED BY BANK'],
        };
        const statusGroupLabels = {
            inforce: 'In force', progress: 'In progress', hold: 'Hold', pending: 'Pending',
            discharged: 'Discharged', done: 'Done', declined: 'Declined', cancelled: 'Cancelled by bank',
        };
        let statusGroupFilter = null;
        let statusGroupLabel = '';
        let facilityFilter = null;
        if (linkParam && linkParam.startsWith('group:')) {
            const key = decodeURIComponent(linkParam.slice(6));
            statusGroupFilter = statusGroups[key] || null;
            statusGroupLabel = statusGroupLabels[key] || key;
            linkParam = null;
        } else if (linkParam && linkParam.startsWith('status:')) {
            const val = decodeURIComponent(linkParam.slice(7));
            statusGroupFilter = [val];
            statusGroupLabel = val;
            linkParam = null;
        } else if (linkParam && linkParam.startsWith('facility:')) {
            facilityFilter = decodeURIComponent(linkParam.slice(9));
            linkParam = null;
        }

        el.innerHTML = `
            <p class="page-subtitle">Manage all financing applications</p>
            <div class="filter-bar">
                <input type="text" id="app-search" placeholder="Search company or bank..." />
                <select id="filter-status"><option value="">All Status</option>
                    <option>IN FORCE</option><option>DISCHARGED</option><option>DONE</option><option>IN PROGRESS</option><option>PENDING</option><option>ON HOLD</option><option>REVIEW BY HOD</option>
                    <option>PREPARATION DOC BY FINANCE</option><option>SUBMISSION DOC TO BANK</option>
                    <option>REVIEW BY BANK</option><option>DECLINED BY BANK</option><option>DECLINED BY COMPANY</option><option>CANCELLED BY BANK</option>
                </select>
                <select id="filter-bank"><option value="">All Banks</option>
                    ${bankNames.map(b => `<option>${b}</option>`).join('')}
                </select>
                <select id="filter-year"><option value="">All Years</option>
                    ${[2026,2025,2024,2023,2022].map(y => `<option>${y}</option>`).join('')}
                </select>
                <select id="filter-category"><option value="">All Categories</option>
                    <option>COMPANY</option><option>PROPERTY</option><option>ASSET</option>
                </select>
                <button class="btn-primary" id="btn-add-app">${this.icons.plus} Add Application</button>
                ${collateralFilter ? `
                <span class="badge done" style="margin-left:8px;cursor:pointer" id="btn-clear-collateral-filter">
                    Collateral: ${collateralFilter.name} &times;
                </span>` : ''}
                ${statusGroupFilter ? `
                <span class="badge done" style="margin-left:8px;cursor:pointer" id="btn-clear-status-filter">
                    ${statusGroupLabel} &times;
                </span>` : ''}
                ${facilityFilter ? `
                <span class="badge done" style="margin-left:8px;cursor:pointer" id="btn-clear-facility-filter">
                    Facility: ${facilityFilter} &times;
                </span>` : ''}
            </div>
            <div class="card">
                <div class="card-body" id="apps-table-container"></div>
            </div>
            <div class="modal-overlay" id="modal-app">
                <div class="modal">
                    <div class="modal-header">
                        <h2 id="modal-app-title">New Application</h2>
                        <button class="modal-close" onclick="UI.closeModal('modal-app')">&times;</button>
                    </div>
                    <form id="app-form" onsubmit="return false">
                        <div class="modal-body">
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Category</label>
                                    <select name="category" required>
                                        <option value="COMPANY">Company</option>
                                        <option value="PROPERTY">Property</option>
                                        <option value="ASSET">Asset</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Company</label>
                                    <select name="company" required>
                                        <option value="">Select company</option>
                                        ${companies.map(c => `<option value="${c}">${c}</option>`).join('')}
                                    </select>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group"><label>Year</label><input type="number" name="year_application" placeholder="2026" /></div>
                                <div class="form-group"><label>Bank</label>
                                    <select name="bank"><option value="">Select bank</option>${bankNames.map(b => `<option>${b}</option>`).join('')}</select>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group"><label>Type of Facility</label>
                                    <select name="type_facility"><option value="">Select type</option>
                                        <option>TERM LOAN</option><option>OVERDRAFT</option><option>LETTER OF CREDIT</option>
                                        <option>TRADE FINANCING</option><option>OVERDRAFT + TRADE FINANCING</option>
                                        <option>OVERDRAFT + CAPITAL FINANCING</option>
                                        <option>OTHERS</option>
                                        <option>CAPITAL FINANCING</option><option>ASSET FINANCING</option><option>COLLABORATIVE FINANCING</option>
                                        <option>TARGETED RELIEF & RECOVERY</option>
                                    </select>
                                </div>
                                <div class="form-group"><label>Name of Facility</label><input name="name_facility" placeholder="Product name" /></div>
                            </div>
                            <div class="form-row" id="type-facility-custom-group" style="display:none">
                                <div class="form-group"><label>Specify Custom Type of Facility</label><input name="type_facility_custom" placeholder="e.g. SPECIAL LOAN" /></div>
                                <div></div>
                            </div>
                            <div class="form-row">
                                <div class="form-group"><label>Profit Rate</label><input name="profit_rate" placeholder="e.g. BFR + 1%" /></div>
                                <div class="form-group"><label>BFR (%)</label><input name="bfr" placeholder="6.40" /></div>
                            </div>
                            <div class="form-row">
                                <div class="form-group"><label>Collateral</label>
                                    <select name="collateral_id">
                                        <option value="">Select collateral</option>
                                        ${collaterals.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="form-group"><label>Tenure</label><input name="rate_tenure" placeholder="e.g. 7 YEARS" /></div>
                            </div>
                            <div class="form-group"><label>Status</label>
                                <select name="status" required>
                                    <option>IN FORCE</option><option>DISCHARGED</option><option>IN PROGRESS</option><option>DONE</option><option>PENDING</option><option>ON HOLD</option>
                                    <option>REVIEW BY HOD</option>
                                    <option>PREPARATION DOC BY FINANCE</option><option>SUBMISSION DOC TO BANK</option>
                                    <option>REVIEW BY BANK</option><option>DECLINED BY BANK</option><option>DECLINED BY COMPANY</option><option>CANCELLED BY BANK</option>
                                </select>
                            </div>
                            <div class="form-group" id="discharge-note-group" style="display:none">
                                <label>Discharge Note</label>
                                <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text-2);font-weight:500">
                                    <input type="checkbox" name="discharge_note" id="discharge-note-check" style="width:auto" /> Yes — discharge note issued
                                </label>
                                <div id="discharge-note-text-group" style="display:none;margin-top:10px">
                                    <label>Discharge Note Details</label>
                                    <input name="discharge_note_text" id="discharge-note-text" placeholder="Enter discharge note details" />
                                </div>
                            </div>
                            <div class="form-group" id="bank-cancel-letter-group" style="display:none">
                                <label>Cancellation Letter from Bank</label>
                                <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text-2);font-weight:500">
                                    <input type="checkbox" id="bank-cancel-letter-check" style="width:auto" /> Yes — cancellation letter received from bank
                                </label>
                            </div>
                            <div class="form-group" id="bank-cancel-upload-group" style="display:none">
                                <label>Upload Cancellation Letter</label>
                                <input type="file" name="bank_cancellation_letter_file" accept=".pdf,application/pdf,image/*" />
                                <p class="form-hint">PDF or image, max 5MB.</p>
                                <div class="form-hint" id="bank-cancel-existing" style="display:none"></div>
                            </div>
                            <div class="form-group"><label>Application Details</label><textarea name="app_details" rows="2"></textarea></div>
                            <div class="form-row">
                                <div class="form-group"><label>Property Detail</label><input name="property_detail" placeholder="Only for Property category" /></div>
                            </div>
                            <div class="form-row">
                                <div class="form-group"><label>Date Doc Sent</label><input type="date" name="date_doc_sent" /></div>
                                <div class="form-group"><label>Last Follow-up Date</label><input type="date" name="date_followup" /></div>
                            </div>
                            <p class="date-history-help">Previous document sent and follow-up dates are kept in Date History after approval.</p>
                            <div class="form-row">
                                <div class="form-group"><label>Total Requested (RM)</label><input type="number" name="total_requested" step="0.01" /></div>
                                <div class="form-group"><label>Total Approved (RM)</label><input type="number" name="total_approved" step="0.01" /></div>
                            </div>
                            <div class="form-row">
                                <div class="form-group"><label>Annual Review (Bank)</label><input name="annual_review" placeholder="e.g. June (Annual Review)" /></div>
                                <div class="form-group"><label>Fixed Deposit (FD)</label><input name="fixed_deposit" placeholder="e.g. RM 100,000" /></div>
                            </div>
                            <div class="form-group" id="hold-reason-group" style="display:none">
                                <label>Hold Reason</label>
                                <input name="hold_reason" placeholder="Why is this on hold?" />
                            </div>
                            <div class="form-group" id="decline-reason-group" style="display:none">
                                <label>Decline Reason</label>
                                <input name="decline_reason" placeholder="Why was this declined?" />
                            </div>
                            <div class="form-group" id="cancel-reason-group" style="display:none">
                                <label>Cancellation Reason (Bank)</label>
                                <input name="cancel_reason" placeholder="Why did the bank cancel this facility?" />
                            </div>
                            <div class="officers-section" id="officers-section">
                                <div class="officers-head" id="officers-toggle">
                                    <div class="officers-head-left">
                                        <svg class="officers-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                                        Officers
                                        <span class="officers-count" id="officers-count">0</span>
                                    </div>
                                    <button type="button" class="btn-secondary btn-xs" id="btn-add-officer">Add Officer</button>
                                </div>
                                <div class="officers-body">
                                    <div id="officers-list"></div>
                                    <p class="officers-empty" id="officers-empty">No officers added yet.</p>
                                </div>
                            </div>
                            <div class="form-group"><label>Notes</label><textarea name="notes" rows="2"></textarea></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn-secondary" onclick="UI.closeModal('modal-app')">Cancel</button>
                            <button type="submit" class="btn-primary" id="btn-save-app">Save Application</button>
                        </div>
                    </form>
                </div>
            </div>

            `;

        const syncDischargeNote = () => {
            const cb = document.getElementById('discharge-note-check');
            const textGroup = document.getElementById('discharge-note-text-group');
            const textInput = document.getElementById('discharge-note-text');
            const hasNote = !!(cb && cb.checked);
            if (textGroup) textGroup.style.display = hasNote ? '' : 'none';
            if (textInput && !hasNote) textInput.value = '';
        };
        document.getElementById('discharge-note-check')?.addEventListener('change', syncDischargeNote);

        // Apply bank/company drill-down presets (after form fields exist)
        if (linkParam && linkParam.startsWith('bank:')) {
            const name = decodeURIComponent(linkParam.slice(5));
            const sel = document.getElementById('filter-bank');
            if (sel) sel.value = name;
            linkParam = null;
        } else if (linkParam && linkParam.startsWith('company:')) {
            const name = decodeURIComponent(linkParam.slice(8));
            const sf = document.getElementById('app-search');
            if (sf) sf.value = name;
            linkParam = null;
        }

        let editingId = null;
        let editingRow = null;
        const loadApps = async () => {
            const filters = {};
            const search = document.getElementById('app-search')?.value;
            if (search) filters.search = search;
            const status = document.getElementById('filter-status')?.value;
            if (status) filters.status = status;
            const bank = document.getElementById('filter-bank')?.value;
            if (bank) filters.bank = bank;
            const year = document.getElementById('filter-year')?.value;
            if (year) filters.year = year;
            const category = document.getElementById('filter-category')?.value;
            if (category) filters.category = category;
            if (collateralFilter) filters.collateral_id = collateralFilter.id;

            let apps = await DB.fetchApplications(filters);
            // Display order (top -> bottom): others, IN FORCE, hold, then declined last.
            const statusRank = (s) => {
                if (['DECLINED', 'DECLINED BY BANK', 'DECLINED BY COMPANY'].includes(s)) return 4;
                if (['ON HOLD', 'HOLD', 'PENDING', 'REVIEW BY HOD', 'REVIEW BY BOS'].includes(s)) return 3;
                if (s === 'IN FORCE') return 2;
                return 1;
            };
            apps.sort((a, b) => statusRank(a.status) - statusRank(b.status));
            if (statusGroupFilter) apps = apps.filter(a => statusGroupFilter.includes(a.status));
            if (facilityFilter) apps = apps.filter(a => (a.type_facility || '') === facilityFilter);
            const container = document.getElementById('apps-table-container');
            container.innerHTML = '';
            const table = UI.renderTable(apps,
                [
                    { label: 'Company', render: (v, r) => `<strong style="color:var(--text-1)">${r.company || '-'}</strong>` },
                    { label: 'Bank', render: (v, r) => r.bank || '-' },
                    { label: 'Type', render: (v, r) => `<span style="font-size:11px">${r.type_facility || '-'}</span>` },
                    { label: 'Facility', render: (v, r) => r.name_facility || '-' },
                    { label: 'Collateral', render: (v, r) => r.collateral ? `<span style="font-size:11px">${r.collateral}</span>` : '-' },
                    { label: 'Requested', render: (v, r) => `<span style="font-family:var(--font-mono);font-size:11.5px">${UI.formatCurrency(r.total_requested)}</span>` },
                    { label: 'Approved', render: (v, r) => `<span style="font-family:var(--font-mono);font-size:11.5px;color:var(--green);font-weight:600">${UI.formatCurrency(r.total_approved)}</span>` },
                    { label: 'Fixed Deposit', render: (v, r) => r.fixed_deposit ? `<span style="font-family:var(--font-mono);font-size:11px">${r.fixed_deposit}</span>` : '-' },
                    { label: 'Status', render: (v, r) => UI.statusBadge(r.status) },
                    { label: 'Reason', render: (v, r) => {
                        if (['ON HOLD','PENDING','PREPARATION DOC BY FINANCE','SUBMISSION DOC TO BANK'].includes(r.status)) return r.hold_reason || '-';
                        if (['DECLINED','DECLINED BY BANK','DECLINED BY COMPANY'].includes(r.status)) return r.decline_reason || '-';
                        if (r.status === 'CANCELLED BY BANK') return r.cancel_reason || '-';
                        if (r.status === 'DISCHARGED' || r.status === 'SETTLED') return (r.discharge_note === true || r.discharge_note === 'true') ? (r.discharge_note_text || 'Discharge note issued') : '-';
                        return '-';
                    }},
                    { label: 'Progress', render: (v, r) => UI.progressHtml(r.progress, r.status) }
                ],
                (row) => {
                    const div = document.createElement('div');
                    div.style.cssText = 'display:flex;gap:2px';
                    const viewBtn = document.createElement('button');
                    viewBtn.className = 'btn-secondary btn-xs';
                    viewBtn.textContent = 'View';
                    viewBtn.onclick = () => openDetailModal(row);
                    const editBtn = document.createElement('button');
                    editBtn.className = 'btn-secondary btn-xs';
                    editBtn.innerHTML = App.icons.edit;
                    editBtn.title = 'Edit';
                    editBtn.onclick = () => openEditModal(row);
                    const delBtn = document.createElement('button');
                    delBtn.className = 'btn-danger btn-xs';
                    delBtn.innerHTML = App.icons.trash;
                    delBtn.title = 'Delete';
                    delBtn.onclick = () => deleteApp(row);
                    div.appendChild(viewBtn);
                    div.appendChild(editBtn);
                    div.appendChild(delBtn);
                    return div;
                }
            );
        container.innerHTML = '';
        container.appendChild(table);
        };

        const openCancellationLetter = async (path) => {
            if (!path) return;
            try {
                const url = await DB.getCancellationLetterUrl(path);
                window.open(url, '_blank', 'noopener');
            } catch (err) {
                UI.showToast('Error opening letter: ' + err.message, 'error');
            }
        };

        const openDetailModal = (row) => {
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay open';
            overlay.innerHTML = `
                <div class="modal" style="max-width:700px">
                    <div class="modal-header">
                        <h2>${row.company || 'Application'} — ${row.type_facility || 'Facility'}</h2>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="detail-grid">
                            <div class="detail-group">
                                <div class="detail-label">Status</div>
                                <div>${UI.statusBadge(row.status)} ${UI.progressHtml(row.progress, row.status)}</div>
                            </div>
                            <div class="detail-group">
                                <div class="detail-label">Application Details</div>
                                <div class="detail-value">${row.app_details || '-'}</div>
                            </div>
                        </div>
                        <div class="detail-section">Bank & Facility</div>
                        <div class="detail-grid">
                            <div class="detail-group"><div class="detail-label">Bank</div><div class="detail-value">${row.bank || '-'}</div></div>
                            <div class="detail-group"><div class="detail-label">BFR</div><div class="detail-value">${row.bfr || '-'}</div></div>
                            <div class="detail-group"><div class="detail-label">Type of Facility</div><div class="detail-value">${row.type_facility || '-'}</div></div>
                            <div class="detail-group"><div class="detail-label">Name of Facility</div><div class="detail-value">${row.name_facility || '-'}</div></div>
                        </div>
                        <div class="detail-section">Financial Details</div>
                        <div class="detail-grid">
                            <div class="detail-group"><div class="detail-label">Total Requested</div><div class="detail-value">${UI.formatCurrency(row.total_requested)}</div></div>
                            <div class="detail-group"><div class="detail-label">Total Approved</div><div class="detail-value">${UI.formatCurrency(row.total_approved)}</div></div>
                            <div class="detail-group"><div class="detail-label">Collateral</div><div class="detail-value">${row.collateral || '-'}</div></div>
                            <div class="detail-group"><div class="detail-label">Fixed Deposit (FD)</div><div class="detail-value">${row.fixed_deposit || '-'}</div></div>
                            <div class="detail-group"><div class="detail-label">Profit Rate</div><div class="detail-value">${row.profit_rate || '-'}</div></div>
                            <div class="detail-group"><div class="detail-label">Tenure</div><div class="detail-value">${row.rate_tenure || '-'}</div></div>
                        </div>
                        <div class="detail-section">Dates & Reviews</div>
                        <div class="detail-grid">
                            <div class="detail-group"><div class="detail-label">Year</div><div class="detail-value">${row.year_application || '-'}</div></div>
                            <div class="detail-group"><div class="detail-label">Annual Review (Bank)</div><div class="detail-value">${row.annual_review || (row.date_updated ? new Date(row.date_updated).toLocaleDateString('en-GB', { month: 'long' }) + ' (Annual Review)' : '-')}</div></div>
                            <div class="detail-group"><div class="detail-label">Date Doc Sent</div><div class="detail-value">${row.date_doc_sent ? UI.formatDate(row.date_doc_sent) : '-'}</div></div>
                            <div class="detail-group"><div class="detail-label">Last Follow-up Date</div><div class="detail-value">${row.date_followup ? UI.formatDate(row.date_followup) : '-'}</div></div>
                            <div class="detail-group"><div class="detail-label">Last Updated</div><div class="detail-value">${row.date_updated ? UI.formatDate(row.date_updated) : '-'}</div></div>
                        </div>
                        <div class="detail-section">Date History</div>
                        <div class="application-date-history" data-date-history></div>
                        ${row.category === 'PROPERTY' ? `
                        <div class="detail-section">Property</div>
                        <div class="detail-grid">
                            <div class="detail-group"><div class="detail-label">Property Detail</div><div class="detail-value">${row.property_detail || '-'}</div></div>
                        </div>` : ''}
                        ${(() => {
                            const isDeclined = row.status === 'DECLINED' || row.status === 'DECLINED BY BANK' || row.status === 'DECLINED BY COMPANY';
                            const holdStatuses = ['ON HOLD','PENDING','PREPARATION DOC BY FINANCE','SUBMISSION DOC TO BANK'];
                            const isHold = holdStatuses.includes(row.status);
                            if (isDeclined && row.decline_reason) return `
                            <div class="detail-section" style="color:var(--red)">Decline Info</div>
                            <div class="detail-grid">
                                <div class="detail-group"><div class="detail-label">Decline Reason</div><div class="detail-value" style="color:var(--red)">${row.decline_reason}</div></div>
                            </div>`;
                            if (isHold && row.hold_reason) return `
                            <div class="detail-section" style="color:var(--amber)">Reason</div>
                            <div class="detail-grid">
                                <div class="detail-group"><div class="detail-label">${row.status}</div><div class="detail-value" style="color:var(--amber)">${row.hold_reason}</div></div>
                            </div>`;
                            if (row.status === 'CANCELLED BY BANK' && row.cancel_reason) return `
                            <div class="detail-section" style="color:var(--red)">Cancellation Info</div>
                            <div class="detail-grid">
                                <div class="detail-group"><div class="detail-label">Cancelled by Bank — Reason</div><div class="detail-value" style="color:var(--red)">${row.cancel_reason}</div></div>
                            </div>`;
                            if ((row.status === 'DISCHARGED' || row.status === 'SETTLED') && (row.discharge_note === true || row.discharge_note === 'true')) return `
                            <div class="detail-section">Discharge Info</div>
                            <div class="detail-grid">
                                <div class="detail-group"><div class="detail-label">Discharge Note</div><div class="detail-value">Issued</div></div>
                                ${row.discharge_note_text ? `<div class="detail-group"><div class="detail-label">Discharge Note Details</div><div class="detail-value">${UI.escapeHtml(row.discharge_note_text)}</div></div>` : ''}
                            </div>`;
                            return '';
                        })()}
                        ${row.status === 'DECLINED BY COMPANY' ? `
                        <div class="detail-section" style="color:var(--red)">Cancellation Letter from Bank</div>
                        <div class="detail-grid">
                            <div class="detail-group">
                                <div class="detail-label">Letter Received</div>
                                <div class="detail-value">${(row.bank_cancellation_letter === true || row.bank_cancellation_letter === 'true') ? 'Yes' : 'No'}</div>
                            </div>
                            ${(row.bank_cancellation_letter === true || row.bank_cancellation_letter === 'true') && row.bank_cancellation_letter_path ? `
                            <div class="detail-group">
                                <div class="detail-label">Uploaded Letter</div>
                                <div class="detail-value">
                                    <button type="button" class="btn-secondary btn-xs" data-view-bank-letter="${encodeURIComponent(row.bank_cancellation_letter_path)}">View letter</button>
                                    <span style="margin-left:6px;font-size:11px;color:var(--text-3)">${UI.escapeHtml(row.bank_cancellation_letter_name || '')}</span>
                                </div>
                            </div>` : ''}
                        </div>` : ''}
                        ${(() => {
                            let officers = row.officers;
                            if (typeof officers === 'string' && officers) { try { officers = JSON.parse(officers); } catch (_) { officers = []; } }
                            if (!Array.isArray(officers) || officers.length === 0) return '';
                            return `
                            <div class="detail-section">Officers</div>
                            <div class="detail-grid">
                                ${officers.map(o => `
                                <div class="detail-group">
                                    <div class="detail-label">${o.name || '-'}${o.office ? ' · ' + o.office : ''}</div>
                                    <div class="detail-value">${o.position || '-'}${o.contact ? ' · ' + o.contact : ''}</div>
                                </div>`).join('')}
                            </div>`;
                        })()}
                        ${row.notes ? `
                        <div class="detail-section">Notes</div>
                        <div class="detail-grid">
                            <div class="detail-group"><div class="detail-value">${row.notes}</div></div>
                        </div>` : ''}
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Close</button>
                </div>
            </div>`;
            document.body.appendChild(overlay);
            UI.renderApplicationDateHistory(overlay.querySelector('[data-date-history]'), row.id);
            overlay.querySelectorAll('[data-view-bank-letter]').forEach(btn => {
                btn.addEventListener('click', () => openCancellationLetter(decodeURIComponent(btn.dataset.viewBankLetter)));
            });
        };

        const openEditModal = async (row) => {
            editingId = row.id;
            editingRow = row;
            document.getElementById('modal-app-title').textContent = 'Edit Application';
            document.getElementById('btn-save-app').textContent = 'Update Application';
            
            const typeSelect = document.querySelector('#app-form [name="type_facility"]');
            const selectOptions = typeSelect ? Array.from(typeSelect.options).map(opt => opt.value || opt.textContent) : [];
            const isStandard = selectOptions.includes(row.type_facility);
            
            let rowData = { ...row };
            if (rowData.status === 'SETTLED') rowData.status = 'DISCHARGED';
            if (row.type_facility && !isStandard) {
                rowData.type_facility = 'OTHERS';
                rowData.type_facility_custom = row.type_facility;
            } else {
                rowData.type_facility_custom = '';
            }
            
            const legacyStatusSelect = document.querySelector('#app-form [name="status"]');
            legacyStatusSelect.querySelector('[data-legacy-status]')?.remove();
            if (rowData.status === 'DECLINED') {
                const legacyStatus = new Option('DECLINED (previous status)', 'DECLINED');
                legacyStatus.dataset.legacyStatus = 'true';
                legacyStatusSelect.add(legacyStatus);
            }
            UI.setFormData('app-form', rowData);
            
            if (typeSelect) {
                typeSelect.dispatchEvent(new Event('change'));
            }
            
            const statusSelect = document.querySelector('#app-form [name="status"]');
            statusSelect.dispatchEvent(new Event('change'));
            const dischargeCb = document.querySelector('#app-form [name="discharge_note"]');
            if (dischargeCb) dischargeCb.checked = rowData.discharge_note === true || rowData.discharge_note === 'true';
            const dischargeText = document.querySelector('#app-form [name="discharge_note_text"]');
            if (dischargeText) dischargeText.value = rowData.discharge_note_text || '';
            syncDischargeNote();

            const letterCb = document.getElementById('bank-cancel-letter-check');
            if (letterCb) letterCb.checked = row.bank_cancellation_letter === true || row.bank_cancellation_letter === 'true';
            syncBankCancelUpload();
            const existingLetter = document.getElementById('bank-cancel-existing');
            if (existingLetter) {
                existingLetter.innerHTML = '';
                if (row.bank_cancellation_letter_path) {
                    const label = document.createElement('span');
                    label.textContent = `Existing letter: ${row.bank_cancellation_letter_name || 'uploaded file'} — `;
                    const viewBtn = document.createElement('button');
                    viewBtn.type = 'button';
                    viewBtn.className = 'btn-secondary btn-xs';
                    viewBtn.textContent = 'View';
                    viewBtn.addEventListener('click', () => openCancellationLetter(row.bank_cancellation_letter_path));
                    existingLetter.appendChild(label);
                    existingLetter.appendChild(viewBtn);
                    existingLetter.style.display = '';
                } else {
                    existingLetter.style.display = 'none';
                }
            }

            setOfficers(parseOfficers(row.officers));
            UI.openModal('modal-app');
        };

        const deleteApp = async (row) => {
            const confirmed = await UI.confirmDialog('Are you sure you want to delete this application? This action cannot be undone.', 'Delete Application');
            if (!confirmed) return;
            try {
                const res = await DB.saveChange('application', 'DELETE', row.id, {},
                    `Delete application: ${row.company || '-'} — ${row.type_facility || '-'}`);
                UI.showToast(res.queued ? 'Deletion submitted for HOD review' : 'Application deleted successfully', 'success');
                loadApps();
            } catch (err) {
                UI.showToast('Error deleting: ' + err.message, 'error');
            }
        };

        const typeSelect = document.querySelector('#app-form [name="type_facility"]');
        const typeCustomGroup = document.getElementById('type-facility-custom-group');
        if (typeSelect) {
            typeSelect.addEventListener('change', (e) => {
                if (e.target.value === 'OTHERS') {
                    typeCustomGroup.style.display = '';
                    document.querySelector('#app-form [name="type_facility_custom"]').setAttribute('required', 'true');
                } else {
                    typeCustomGroup.style.display = 'none';
                    document.querySelector('#app-form [name="type_facility_custom"]').removeAttribute('required');
                }
            });
        }

        document.querySelector('#app-form [name="bank"]').addEventListener('change', (e) => {
            const selectedBank = banks.find(b => b.name === e.target.value);
            const bfrField = document.querySelector('#app-form [name="bfr"]');
            if (selectedBank && selectedBank.bfr_current) {
                bfrField.value = selectedBank.bfr_current;
            } else {
                bfrField.value = '';
            }
        });

        const progressMap = {
            'DONE': 100,
            'IN PROGRESS': 50,
            'PENDING': 0,
            'ON HOLD': 30,
            'REVIEW BY BOS': 80,
            'PREPARATION DOC BY FINANCE': 20,
            'SUBMISSION DOC TO BANK': 70,
            'REVIEW BY BANK': 70,
            'DECLINED': 0,
            'DECLINED BY BANK': 0,
            'DECLINED BY COMPANY': 0,
            'CANCELLED BY BANK': 0
        };
        const syncBankCancelUpload = () => {
            const cb = document.getElementById('bank-cancel-letter-check');
            const uploadGroup = document.getElementById('bank-cancel-upload-group');
            const received = !!(cb && cb.checked);
            if (uploadGroup) uploadGroup.style.display = received ? '' : 'none';
            if (!received) {
                const fileInput = document.querySelector('#app-form [name="bank_cancellation_letter_file"]');
                if (fileInput) fileInput.value = '';
            }
        };

        document.getElementById('bank-cancel-letter-check')?.addEventListener('change', syncBankCancelUpload);

        document.querySelector('#app-form [name="status"]').addEventListener('change', (e) => {
            const isHold = e.target.value === 'ON HOLD' || e.target.value === 'PENDING' || e.target.value === 'PREPARATION DOC BY FINANCE' || e.target.value === 'SUBMISSION DOC TO BANK';
            const isDeclined = e.target.value === 'DECLINED' || e.target.value === 'DECLINED BY BANK' || e.target.value === 'DECLINED BY COMPANY';
            const isDischarged = e.target.value === 'DISCHARGED' || e.target.value === 'SETTLED';
            const isCancelled = e.target.value === 'CANCELLED BY BANK';
            const isDeclinedByCompany = e.target.value === 'DECLINED BY COMPANY';
            document.getElementById('hold-reason-group').style.display = isHold ? '' : 'none';
            document.getElementById('decline-reason-group').style.display = isDeclined ? '' : 'none';
            document.getElementById('discharge-note-group').style.display = isDischarged ? '' : 'none';
            document.getElementById('cancel-reason-group').style.display = isCancelled ? '' : 'none';
            document.getElementById('bank-cancel-letter-group').style.display = isDeclinedByCompany ? '' : 'none';
            if (!isDeclinedByCompany) {
                const letterCb = document.getElementById('bank-cancel-letter-check');
                if (letterCb) letterCb.checked = false;
                const existingLetter = document.getElementById('bank-cancel-existing');
                if (existingLetter) { existingLetter.style.display = 'none'; existingLetter.innerHTML = ''; }
            }
            syncBankCancelUpload();
            syncDischargeNote();
        });

        // Officers (collapsible, many per application)
        const officersSection = document.getElementById('officers-section');
        const officersList = document.getElementById('officers-list');
        const officersCount = document.getElementById('officers-count');
        const officersEmpty = document.getElementById('officers-empty');

        const updateOfficerCount = () => {
            const n = officersList.querySelectorAll('[data-officer]').length;
            officersCount.textContent = n;
            officersEmpty.style.display = n ? 'none' : '';
        };

        const addOfficerRow = (officer = {}) => {
            const row = document.createElement('div');
            row.className = 'officer-row';
            row.setAttribute('data-officer', '');
            row.innerHTML = `
                <div class="officer-row-head">
                    <span class="officer-row-title">Officer</span>
                    <button type="button" class="btn-danger btn-xs" data-remove-officer>Remove</button>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Name</label><input data-field="name" placeholder="Officer name" /></div>
                    <div class="form-group"><label>Position</label><input data-field="position" placeholder="e.g. Branch Manager" /></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Contact Number</label><input data-field="contact" placeholder="e.g. 012-3456789" /></div>
                    <div class="form-group"><label>Office</label>
                        <select data-field="office">
                            <option value="">Select office</option>
                            <option>HQ</option>
                            <option>BRANCH</option>
                        </select>
                    </div>
                </div>`;
            row.querySelector('[data-field="name"]').value = officer.name || '';
            row.querySelector('[data-field="position"]').value = officer.position || '';
            row.querySelector('[data-field="contact"]').value = officer.contact || '';
            row.querySelector('[data-field="office"]').value = officer.office || '';
            row.querySelector('[data-remove-officer]').addEventListener('click', () => { row.remove(); updateOfficerCount(); });
            officersList.appendChild(row);
            updateOfficerCount();
        };

        const setOfficers = (arr) => {
            officersList.innerHTML = '';
            (Array.isArray(arr) ? arr : []).forEach(addOfficerRow);
            updateOfficerCount();
            officersSection.classList.toggle('open', officersList.children.length > 0);
        };

        const collectOfficers = () => {
            const out = [];
            officersList.querySelectorAll('[data-officer]').forEach(row => {
                const val = (f) => row.querySelector(`[data-field="${f}"]`)?.value.trim() || '';
                if (!val('name')) return;
                out.push({ name: val('name'), position: val('position'), contact: val('contact'), office: val('office') });
            });
            return out;
        };

        const parseOfficers = (raw) => {
            if (Array.isArray(raw)) return raw;
            if (typeof raw === 'string' && raw) {
                try { const p = JSON.parse(raw); return Array.isArray(p) ? p : []; } catch (_) { return []; }
            }
            return [];
        };

        document.getElementById('officers-toggle').addEventListener('click', () => officersSection.classList.toggle('open'));
        document.getElementById('btn-add-officer').addEventListener('click', (e) => {
            e.stopPropagation();
            officersSection.classList.add('open');
            addOfficerRow();
        });

        document.getElementById('btn-add-app').addEventListener('click', () => {
            editingId = null;
            editingRow = null;
            document.getElementById('modal-app-title').textContent = 'New Application';
            document.getElementById('btn-save-app').textContent = 'Save Application';
            UI.resetForm('app-form');
            document.querySelector('#app-form [data-legacy-status]')?.remove();
            const existingLetter = document.getElementById('bank-cancel-existing');
            if (existingLetter) { existingLetter.style.display = 'none'; existingLetter.innerHTML = ''; }
            setOfficers([]);
            if (typeSelect) {
                typeSelect.dispatchEvent(new Event('change'));
            }
            document.querySelector('#app-form [name="status"]')?.dispatchEvent(new Event('change'));
            UI.openModal('modal-app');
        });

        document.getElementById('app-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = UI.getFormData('app-form');
            if (data.type_facility === 'OTHERS') {
                data.type_facility = data.type_facility_custom || 'OTHERS';
            }
            delete data.type_facility_custom;
            // Set collateral text from selected option
            const collSelect = document.querySelector('#app-form [name="collateral_id"]');
            if (collSelect) {
                const selectedOpt = collSelect.options[collSelect.selectedIndex];
                if (selectedOpt && selectedOpt.value) {
                    data.collateral = selectedOpt.text;
                } else {
                    data.collateral = '';
                    data.collateral_id = null;
                }
            }
            data.progress = progressMap[data.status] !== undefined ? progressMap[data.status] : 0;
            const isDischarged = data.status === 'DISCHARGED' || data.status === 'SETTLED';
            const dischargeCb = document.querySelector('#app-form [name="discharge_note"]');
            data.discharge_note = isDischarged ? !!(dischargeCb && dischargeCb.checked) : false;
            const dischargeText = document.getElementById('discharge-note-text');
            data.discharge_note_text = data.discharge_note ? (dischargeText?.value.trim() || null) : null;
            data.officers = collectOfficers();

            delete data.bank_cancellation_letter_file;
            const isDeclinedByCompany = data.status === 'DECLINED BY COMPANY';
            const letterCb = document.getElementById('bank-cancel-letter-check');
            const letterReceived = !!(isDeclinedByCompany && letterCb && letterCb.checked);
            const letterFile = document.querySelector('#app-form [name="bank_cancellation_letter_file"]')?.files?.[0] || null;
            const existingLetterPath = editingRow?.bank_cancellation_letter_path || null;
            const existingLetterName = editingRow?.bank_cancellation_letter_name || null;

            if (letterReceived) {
                data.bank_cancellation_letter = true;
                if (letterFile) {
                    data.bank_cancellation_letter_name = letterFile.name;
                } else if (existingLetterPath) {
                    data.bank_cancellation_letter_path = existingLetterPath;
                    data.bank_cancellation_letter_name = existingLetterName;
                } else {
                    UI.showToast('Please upload the cancellation letter from the bank.', 'error');
                    return;
                }
            } else {
                data.bank_cancellation_letter = false;
                data.bank_cancellation_letter_path = null;
                data.bank_cancellation_letter_name = null;
            }

            const btn = document.getElementById('btn-save-app');
            btn.disabled = true;
            btn.textContent = 'Saving...';
            try {
                if (isDeclinedByCompany && data.bank_cancellation_letter && letterFile) {
                    if (letterFile.size > 5 * 1024 * 1024) throw new Error('Cancellation letter must be 5MB or smaller');
                    data.bank_cancellation_letter_path = await DB.uploadCancellationLetter(letterFile);
                }
                const isEdit = !!editingId;
                const summary = `${isEdit ? 'Edit' : 'New'} application: ${data.company || '-'} — ${data.type_facility || '-'}${data.bank ? ' (' + data.bank + ')' : ''}`;
                const res = await DB.saveChange('application', isEdit ? 'UPDATE' : 'CREATE', editingId, data, summary, editingRow);
                UI.showToast(res.unchanged ? 'No changes to submit' : res.queued ? 'Submitted for HOD review. Original data stays unchanged until approved.' : (isEdit ? 'Application updated successfully' : 'Application added successfully'), 'success');
                UI.closeModal('modal-app');
                loadApps();
            } catch (err) {
                UI.showToast('Error: ' + err.message, 'error');
            }
            btn.disabled = false;
            btn.textContent = editingId ? 'Update Application' : 'Save Application';
        });

        ['app-search', 'filter-status', 'filter-bank', 'filter-year', 'filter-category'].forEach(id => {
            document.getElementById(id)?.addEventListener('input', loadApps);
            document.getElementById(id)?.addEventListener('change', loadApps);
        });

        // Navigated from companies page: raw company name → search field
        if (linkParam) {
            const searchField = document.getElementById('app-search');
            if (searchField) {
                searchField.value = decodeURIComponent(linkParam);
            }
        }

        // Clear collateral filter badge
        document.getElementById('btn-clear-collateral-filter')?.addEventListener('click', () => {
            collateralFilter = null;
            window.location.hash = 'applications';
        });

        // Clear dashboard status drill-down badge
        document.getElementById('btn-clear-status-filter')?.addEventListener('click', () => {
            window.location.hash = 'applications';
        });

        // Clear facility drill-down badge
        document.getElementById('btn-clear-facility-filter')?.addEventListener('click', () => {
            window.location.hash = 'applications';
        });

        loadApps();
    },

    async renderCompanies(el) {
        const stats = await DB.getDashboardStats();
        let dbCompanies = await DB.fetchCompanies();
        const dbNames = new Set(dbCompanies.map(c => c.name.toLowerCase()));

        // Auto-insert any company from application data that isn't in companies table yet
        for (const name of Object.keys(stats.companyTotals || {})) {
            if (!dbNames.has(name.toLowerCase())) {
                try {
                    const inserted = await DB.insertCompany(name);
                    dbCompanies.push(inserted);
                    dbNames.add(name.toLowerCase());
                } catch (err) {
                    // ignore duplicate conflicts
                }
            }
        }

        const renderPage = () => {
            const companyMap = {};
            dbCompanies.forEach(c => { companyMap[c.name] = { ...c, requested: 0, approved: 0, done: 0, pending: 0, declined: 0 }; });
            Object.entries(stats.companyTotals || {}).forEach(([name, d]) => {
                if (companyMap[name]) {
                    companyMap[name].requested = d.requested;
                    companyMap[name].approved = d.approved;
                    companyMap[name].done = d.done;
                    companyMap[name].pending = d.pending;
                    companyMap[name].declined = d.declined;
                }
            });
            const entries = Object.values(companyMap).sort((a, b) => a.name.localeCompare(b.name));
            const totalRequested = entries.reduce((s, d) => s + d.requested, 0);
            const totalApproved = entries.reduce((s, d) => s + d.approved, 0);

            el.innerHTML = `
                <div class="module-header-bar">
                    <div class="module-title-wrap">
                        <h2>Companies</h2>
                        <p>All client companies and their financing performance statistics</p>
                    </div>
                    <div class="summary-pills-bar">
                        <div class="pill-stat">
                            <span class="pill-stat-label">Total Companies</span>
                            <span class="pill-stat-val">${entries.length}</span>
                        </div>
                        <div class="pill-stat">
                            <span class="pill-stat-label">Total Requested</span>
                            <span class="pill-stat-val">${UI.formatCurrency(totalRequested)}</span>
                        </div>
                        <div class="pill-stat">
                            <span class="pill-stat-label">Total Approved</span>
                            <span class="pill-stat-val">${UI.formatCurrency(totalApproved)}</span>
                        </div>
                    </div>
                </div>

                <div class="filter-bar" style="margin-bottom:20px">
                    <input type="text" id="company-search" placeholder="Search company name..." />
                    <button class="btn-primary" id="btn-add-company-page">${this.icons.plus} Add Company</button>
                </div>

                <div class="company-card-grid" id="company-grid">
                    ${entries.map(d => {
                        const initials = d.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'CO';
                        const successRate = d.requested > 0 ? Math.round((d.approved / d.requested) * 100) : (d.done > 0 ? 100 : 0);
                        const appCount = d.done + d.pending + d.declined;
                        return `
                        <div class="company-card" data-company="${d.name}" data-id="${d.id || ''}">
                            <div class="company-card-top">
                                <div class="avatar-badge">${initials}</div>
                                <div class="company-card-meta">
                                    <div class="company-card-title">${d.name}</div>
                                    <div class="company-card-sub">${d.done} Approved / ${appCount} Apps</div>
                                </div>
                                <span class="badge ${successRate >= 50 ? 'done' : 'progress'}">${successRate}%</span>
                                <button class="btn-danger btn-xs" data-delete-company="${d.id}" title="Delete Company" style="margin-left:6px">${this.icons.trash}</button>
                            </div>
                            <div class="company-card-stats">
                                <div class="company-stat-item">
                                    <span class="company-stat-label">Requested</span>
                                    <span class="company-stat-val">${UI.formatCurrency(d.requested)}</span>
                                </div>
                                <div class="company-stat-item" style="text-align:right">
                                    <span class="company-stat-label">Approved</span>
                                    <span class="company-stat-val" style="color:var(--green)">${UI.formatCurrency(d.approved)}</span>
                                </div>
                            </div>
                        </div>`;
                    }).join('')}
                </div>

                <div class="modal-overlay" id="modal-add-company-page">
                    <div class="modal" style="max-width:400px">
                        <div class="modal-header">
                            <h2>Add Company</h2>
                            <button class="modal-close" onclick="UI.closeModal('modal-add-company-page')">&times;</button>
                        </div>
                        <form id="add-company-page-form" onsubmit="return false">
                            <div class="modal-body">
                                <div class="form-group">
                                    <label>Company Name</label>
                                    <input name="new_company_name" placeholder="Enter company name" required />
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn-secondary" onclick="UI.closeModal('modal-add-company-page')">Cancel</button>
                                <button type="submit" class="btn-primary" id="btn-save-company-page">Add Company</button>
                            </div>
                        </form>
                    </div>
                </div>`;

            document.getElementById('company-search')?.addEventListener('input', (e) => {
                const q = e.target.value.toLowerCase();
                document.querySelectorAll('.company-card').forEach(card => {
                    const name = card.dataset.company.toLowerCase();
                    card.style.display = name.includes(q) ? '' : 'none';
                });
            });

            document.querySelectorAll('.company-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    if (e.target.closest('[data-delete-company]')) return;
                    const company = card.dataset.company;
                    window.location.hash = 'applications|' + encodeURIComponent(company);
                });
            });

            document.querySelectorAll('[data-delete-company]').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const id = btn.dataset.deleteCompany;
                    if (!id) return;
                    const company = dbCompanies.find(c => c.id === id);
                    if (!company) return;
                    const terminalStatuses = ['IN FORCE', 'DONE', 'DISCHARGED', 'SETTLED', 'DECLINED', 'DECLINED BY BANK', 'DECLINED BY COMPANY', 'DECLINED BY BOSS', 'CANCELLED BY BANK'];
                    const companyApps = (stats.apps || []).filter(a => a.company?.toLowerCase() === company.name.toLowerCase());
                    const hasNonTerminal = companyApps.some(a => !terminalStatuses.includes(a.status));
                    if (hasNonTerminal) {
                        UI.showToast('Cannot delete: company has active or pending applications', 'error');
                        return;
                    }
                    const confirmed = await UI.confirmDialog(`Delete "${company.name}"?`, 'Delete Company');
                    if (!confirmed) return;
                    try {
                        const res = await DB.saveChange('company', 'DELETE', id, {}, `Delete company: ${company.name}`);
                        UI.showToast(res.queued ? 'Company deletion submitted for HOD review' : 'Company deleted', 'success');
                        App.renderCompanies(el);
                    } catch (err) {
                        UI.showToast('Error deleting company: ' + err.message, 'error');
                    }
                });
            });

            document.getElementById('btn-add-company-page').addEventListener('click', () => {
                document.getElementById('add-company-page-form').reset();
                UI.openModal('modal-add-company-page');
            });

            document.getElementById('add-company-page-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const nameInput = document.querySelector('#add-company-page-form [name="new_company_name"]');
                const companyName = nameInput.value.trim();
                if (!companyName) return;
                const exists = dbCompanies.some(c => c.name.toLowerCase() === companyName.toLowerCase());
                if (exists) {
                    UI.showToast('Company already exists', 'error');
                    return;
                }
                try {
                    const res = await DB.saveChange('company', 'CREATE', null, { name: companyName }, `New company: ${companyName}`);
                    UI.closeModal('modal-add-company-page');
                    UI.showToast(res.queued ? `Company "${companyName}" submitted for HOD review` : `Company "${companyName}" added`, 'success');
                    App.renderCompanies(el);
                } catch (err) {
                    UI.showToast('Error adding company: ' + err.message, 'error');
                }
            });
        };

        renderPage();
    },

    async renderBanks(el) {
        const { bankStats, banks } = await DB.getBankStats();
        const entries = Object.entries(bankStats || {}).sort((a, b) => (a[1].bfr_current || 0) - (b[1].bfr_current || 0));

        el.innerHTML = `
            <p class="page-subtitle">Bank BFR rates and performance</p>
            <div class="grid-2" style="margin-bottom:24px">
                <div class="card"><div class="card-header"><div class="card-header-title">BFR Comparison</div></div><div class="card-body"><div class="chart-container" id="chart-bfr"></div></div></div>
                <div class="card"><div class="card-header"><div class="card-header-title">Bank Success Rate</div></div><div class="card-body"><div class="chart-container" id="chart-bank-success"></div></div></div>
            </div>
            <div class="card">
                <div class="card-header">
                    <div class="card-header-title">All Banks</div>
                    <button class="btn-primary btn-sm" id="btn-add-bank">${this.icons.plus} Add Bank</button>
                </div>
                <div class="card-body" id="banks-table-container"></div>
            </div>
            <div class="modal-overlay" id="modal-bank">
                <div class="modal" style="max-width:480px">
                    <div class="modal-header">
                        <h2 id="modal-bank-title">New Bank</h2>
                        <button class="modal-close" onclick="UI.closeModal('modal-bank')">&times;</button>
                    </div>
                    <form id="bank-form" onsubmit="return false">
                        <div class="modal-body">
                            <div class="form-group"><label>Bank Name</label><input name="name" required /></div>
                            <div class="form-row">
                                <div class="form-group"><label>BFR Current (%)</label><input name="bfr_current" type="number" step="0.01" /></div>
                                <div class="form-group"><label>BFR Previous (%)</label><input name="bfr_previous" type="number" step="0.01" /></div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn-secondary" onclick="UI.closeModal('modal-bank')">Cancel</button>
                            <button type="submit" class="btn-primary" id="btn-save-bank">Save Bank</button>
                        </div>
                    </form>
                </div>
            </div>`;

        Charts.barBankBfr('chart-bfr', banks);
        Charts.barBankSuccessRate('chart-bank-success', bankStats);

        const renderBankTable = () => {
            const container = document.getElementById('banks-table-container');
            container.innerHTML = '';
            const table = UI.renderTable(entries.map(([name, s]) => {
                const bank = banks.find(b => b.name === name);
                return { ...s, name, id: bank?.id };
            }),
                [
                    { label: 'Bank', render: (v, r) => `<strong style="color:var(--text-1)">${r.name || '-'}</strong>` },
                    { label: 'BFR Current', render: (v, r) => r.bfr_current ? `<span style="font-family:var(--font-mono);font-weight:700">${r.bfr_current.toFixed(2)}%</span>` : '-' },
                    { label: 'BFR Previous', render: (v, r) => r.bfr_previous ? `<span style="font-family:var(--font-mono);color:var(--text-3)">${r.bfr_previous.toFixed(2)}%</span>` : '-' },
                    { label: 'Applications', render: (v, r) => `<span style="font-family:var(--font-mono)">${r.count || 0}</span>` },
                    { label: 'Done', render: (v, r) => `<span style="font-family:var(--font-mono);color:var(--green)">${r.done || 0}</span>` },
                    { label: 'Declined', render: (v, r) => `<span style="font-family:var(--font-mono);color:var(--red)">${r.declined || 0}</span>` },
                    { label: 'Requested', render: (v, r) => UI.formatCurrency(r.requested) },
                    { label: 'Approved', render: (v, r) => `<span style="color:var(--green);font-weight:600">${UI.formatCurrency(r.approved)}</span>` }
                ],
                (row) => {
                    const div = document.createElement('div');
                    div.style.cssText = 'display:flex;gap:4px;justify-content:flex-end';
                    const editBtn = document.createElement('button');
                    editBtn.className = 'btn-secondary btn-xs';
                    editBtn.innerHTML = App.icons.edit;
                    editBtn.title = 'Edit Bank';
                    editBtn.onclick = () => openBankModal(row);
                    const delBtn = document.createElement('button');
                    delBtn.className = 'btn-danger btn-xs';
                    delBtn.innerHTML = App.icons.trash;
                    delBtn.title = 'Delete Bank';
                    delBtn.onclick = () => deleteBank(row);
                    div.appendChild(editBtn);
                    div.appendChild(delBtn);
                    return div;
                }
            );
            container.appendChild(table);
        };

        let editingBankId = null;

        const openBankModal = (row) => {
            editingBankId = row?.id || null;
            document.getElementById('modal-bank-title').textContent = editingBankId ? 'Edit Bank' : 'New Bank';
            document.getElementById('btn-save-bank').textContent = editingBankId ? 'Update Bank' : 'Save Bank';
            if (editingBankId) {
                UI.setFormData('bank-form', { name: row.name, bfr_current: row.bfr_current, bfr_previous: row.bfr_previous });
            } else {
                UI.resetForm('bank-form');
            }
            UI.openModal('modal-bank');
        };

        const deleteBank = async (row) => {
            const confirmed = await UI.confirmDialog(`Delete bank "${row.name}"? This action cannot be undone.`, 'Delete Bank');
            if (!confirmed) return;
            try {
                const res = await DB.saveChange('bank', 'DELETE', row.id, {}, `Delete bank: ${row.name}`);
                UI.showToast(res.queued ? 'Bank deletion submitted for HOD review' : 'Bank deleted successfully', 'success');
                App.renderBanks(el);
            } catch (err) {
                UI.showToast('Error deleting bank: ' + err.message, 'error');
            }
        };

        document.getElementById('btn-add-bank').addEventListener('click', () => openBankModal({}));

        document.getElementById('bank-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = UI.getFormData('bank-form');
            const btn = document.getElementById('btn-save-bank');
            btn.disabled = true;
            btn.textContent = 'Saving...';
            try {
                const res = await DB.saveChange('bank', editingBankId ? 'UPDATE' : 'CREATE', editingBankId, data,
                    `${editingBankId ? 'Edit' : 'New'} bank: ${data.name || '-'}${data.bfr_current ? ' (BFR ' + data.bfr_current + '%)' : ''}`);
                UI.showToast(res.queued ? 'Bank change submitted for HOD review' : (editingBankId ? 'Bank updated successfully' : 'Bank added successfully'), 'success');
                UI.closeModal('modal-bank');
                App.renderBanks(el);
            } catch (err) {
                UI.showToast('Error: ' + err.message, 'error');
            }
            btn.disabled = false;
            btn.textContent = editingBankId ? 'Update Bank' : 'Save Bank';
        });

        renderBankTable();
    },

    buildReportInsights(stats) {
        const holdStatuses = ['ON HOLD', 'PENDING', 'REVIEW BY HOD', 'REVIEW BY BOS'];
        const insights = [];

        const declineEntries = Object.entries(stats.declineReasons || {}).sort((a, b) => b[1] - a[1]);
        const declineTotal = declineEntries.reduce((s, [, c]) => s + c, 0);
        const declinedApps = (stats.apps || [])
            .filter(a => ['DECLINED', 'DECLINED BY BANK', 'DECLINED BY COMPANY'].includes(a.status) ||
                (a.decline_reason && a.decline_reason.trim()))
            .map(a => ({ ...a, _note: a.decline_reason || a.cancel_reason || 'No reason recorded' }))
            .sort((a, b) => String(a.company || '').localeCompare(String(b.company || '')));
        insights.push({
            tag: 'Factor 01',
            title: 'Declined Applications',
            value: declineTotal > 0 ? `${declineTotal} Declined` : 'No Declines',
            reason: declineEntries.length
                ? declineEntries.map(([r, c]) => `${r} (${c})`).join(' · ')
                : 'No decline reason recorded',
            apps: declinedApps
        });

        const holdMap = {};
        const holdApps = [];
        (stats.apps || []).forEach(a => {
            if (holdStatuses.includes(a.status)) {
                const r = (a.hold_reason || 'No reason stated').trim();
                holdMap[r] = (holdMap[r] || 0) + 1;
                holdApps.push({ ...a, _note: r });
            }
        });
        holdApps.sort((a, b) => String(a.company || '').localeCompare(String(b.company || '')));
        const holdEntries = Object.entries(holdMap).sort((a, b) => b[1] - a[1]);
        const holdTotal = holdEntries.reduce((s, [, c]) => s + c, 0);
        insights.push({
            tag: 'Factor 02',
            title: 'On-Hold & Pending',
            value: holdTotal > 0 ? `${holdTotal} On Hold` : 'None On Hold',
            reason: holdEntries.length
                ? holdEntries.map(([r, c]) => `${r} (${c})`).join(' · ')
                : 'No hold reason recorded',
            apps: holdApps
        });

        const stuck = [...(stats.stuckApps || [])].sort((a, b) => b.days_stuck - a.days_stuck);
        const topStuck = stuck[0];
        const stuckApps = stuck.map(a => ({
            ...a,
            _note: `${a.days_stuck} days — ${a.hold_reason || a.decline_reason || a.app_details || a.status || 'No reason stated'}`
        }));
        insights.push({
            tag: 'Factor 03',
            title: 'SLA Bottleneck (>14 Days)',
            value: stuck.length > 0 ? `${stuck.length} Stuck` : 'No Bottleneck',
            reason: topStuck
                ? `${topStuck.company || '-'} — ${topStuck.days_stuck} days — ${topStuck.hold_reason || topStuck.decline_reason || topStuck.app_details || topStuck.status || 'No reason stated'}`
                : `Average SLA ${stats.avgSlaDays} days`,
            apps: stuckApps
        });

        const risk = stats.topCompanyRisk || { name: '-', percent: 0, requested: 0 };
        const riskApps = risk.name && risk.name !== '-'
            ? (stats.apps || [])
                .filter(a => a.company === risk.name)
                .map(a => ({ ...a, _note: `${risk.percent}% of portfolio exposure` }))
                .sort((a, b) => (Number(b.total_requested) || 0) - (Number(a.total_requested) || 0))
            : [];
        insights.push({
            tag: 'Factor 04',
            title: 'Concentration Risk',
            value: risk.percent ? `${risk.percent}% Exposure` : 'Low',
            reason: risk.percent >= 30
                ? `Single-client exposure above 30% threshold — ${risk.name} (${UI.formatCurrency(risk.requested)})`
                : (risk.name && risk.name !== '-' ? `Largest client exposure — ${risk.name} (${risk.percent}%)` : 'No dominant client exposure'),
            apps: riskApps
        });

        return insights;
    },

    async renderReports(el) {
        const stats = await DB.getDashboardStats();
        const { bankStats } = await DB.getBankStats(stats.apps);
        const insights = this.buildReportInsights(stats);
        const stuckCount = stats.stuckApps ? stats.stuckApps.length : 0;
        const hasRiskConcentration = stats.topCompanyRisk && stats.topCompanyRisk.percent > 30;

        el.innerHTML = `
            <div class="report-wrap" style="text-transform:uppercase">
            <div class="module-header-bar">
                <div class="module-title-wrap">
                    <h2>Reports & Executive Analytics</h2>
                    <p>SLA turnaround duration, portfolio exposure, bank rankings & board-ready reporting</p>
                </div>
                <div class="summary-pills-bar" style="display:flex;gap:10px">
                    <button class="btn-secondary" id="btn-export-pdf">${this.icons['file-text']} Export Board-Ready PDF</button>
                    <button class="btn-primary" id="btn-export-csv">${this.icons['file-text']} Export CSV</button>
                </div>
            </div>

            ${stuckCount > 0 ? `
            <div class="insight-alert-banner" style="background:#fffbeb;border-color:#fde68a;margin-bottom:16px">
                <div class="insight-alert-icon" style="color:#d97706">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
                <div class="insight-alert-content">
                    <div class="insight-alert-title" style="color:#92400e">Operational SLA Alert: ${stuckCount} Stuck Applications (>14 Days)</div>
                    <div class="insight-alert-desc" style="color:#78350f">
                        There are ${stuckCount} financing applications under active processing for over 14 days without decision updates.
                    </div>
                </div>
            </div>
            ` : ''}

            ${hasRiskConcentration ? `
            <div class="insight-alert-banner" style="margin-bottom:20px">
                <div class="insight-alert-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <div class="insight-alert-content">
                    <div class="insight-alert-title">Portfolio Concentration Risk (>30% Exposure)</div>
                    <div class="insight-alert-desc">
                        <strong>${stats.topCompanyRisk.name}</strong> holds <strong>${stats.topCompanyRisk.percent}%</strong> (${UI.formatCurrency(stats.topCompanyRisk.requested)}) of total requested financing portfolio exposure.
                    </div>
                </div>
            </div>
            ` : ''}

            <div class="grid-2" style="margin-bottom:24px">
                <div class="card"><div class="card-header"><div class="card-header-title">Applications Trend by Year</div></div><div class="card-body"><div class="chart-container" id="chart-year"></div></div></div>
                <div class="card"><div class="card-header"><div class="card-header-title">Facility Type Distribution</div></div><div class="card-body"><div class="chart-container" id="chart-facility"></div></div></div>
            </div>

            <div class="card" style="margin-bottom:24px">
                <div class="card-header"><div class="card-header-title">Collateral Distribution</div></div>
                <div class="card-body">
                    <div class="custom-bar-list" id="collateral-report-bars">
                        ${(() => {
                            const collCounts = {};
                            stats.apps.forEach(a => {
                                const c = a.collateral || 'No collateral';
                                collCounts[c] = (collCounts[c] || 0) + 1;
                            });
                            const sorted = Object.entries(collCounts).sort((a, b) => b[1] - a[1]);
                            const maxCount = sorted.length > 0 ? sorted[0][1] : 1;
                            return sorted.map(([name, count]) => {
                                const pct = Math.round((count / maxCount) * 100);
                                return `
                                <div class="bank-bar-row">
                                    <div class="bank-bar-name" style="font-size:12px">${name}</div>
                                    <div class="bank-bar-track"><div class="bank-bar-fill" style="width:${pct}%;background:var(--primary)"></div></div>
                                    <div class="bank-bar-count">${count}</div>
                                </div>`;
                            }).join('');
                        })()}
                    </div>
                </div>
            </div>

            <div class="card" style="margin-bottom:24px">
                <div class="card-header"><div class="card-header-title">Bank SLA & Performance Ranking</div></div>
                <div class="card-body" id="bank-summary-table"></div>
            </div>

            ${stuckCount > 0 ? `
            <div class="card">
                <div class="card-header">
                    <div class="card-header-title" style="color:var(--amber)">Bottleneck Applications (>14 Days Stuck)</div>
                </div>
                <div class="card-body" id="stuck-apps-table"></div>
            </div>
            ` : ''}
            </div>`;

        Charts.barYearTrend('chart-year', stats.yearCounts);
        Charts.donutFacility('chart-facility', stats.facilityCounts, (p) => {
            if (p && p.name) window.location.hash = 'applications|facility:' + encodeURIComponent(p.name);
        });

        const entries = Object.entries(bankStats || {}).filter(([, v]) => v.count > 0).sort((a, b) => b[1].requested - a[1].requested);
        const container = document.getElementById('bank-summary-table');
        const table = UI.renderTable(entries.map(([name, s]) => ({ name, ...s })),
            [
                { label: 'Bank Name', render: (v, r) => `<strong style="color:var(--text-1)">${r.name}</strong>` },
                { label: 'Apps', render: (v, r) => `<span style="font-family:var(--font-mono)">${r.count}</span>` },
                { label: 'Done', render: (v, r) => `<span style="font-family:var(--font-mono);color:var(--green)">${r.done}</span>` },
                { label: 'Declined', render: (v, r) => `<span style="font-family:var(--font-mono);color:var(--red)">${r.declined}</span>` },
                { label: 'Avg SLA', render: (v, r) => `<span style="font-family:var(--font-mono);font-weight:600">${r.avgSla || 10} days</span>` },
                { label: 'Success Rate', render: (v, r) => {
                    const rate = r.count > 0 ? Math.round((r.done / r.count) * 100) : 0;
                    return `<span class="badge ${rate >= 50 ? 'done' : 'progress'}">${rate}%</span>`;
                }},
                { label: 'Total Requested', render: (v, r) => UI.formatCurrency(r.requested) },
                { label: 'Total Approved', render: (v, r) => `<span style="color:var(--green);font-weight:600">${UI.formatCurrency(r.approved)}</span>` },
                { label: 'Approval Rate', render: (v, r) => {
                    const rate = r.requested > 0 ? Math.round((r.approved / r.requested) * 100) : 0;
                    return `<span style="font-family:var(--font-mono);font-weight:600">${rate}%</span>`;
                }}
            ]
        );
        container.appendChild(table);

        // Stuck Apps Table (>14 days)
        if (stuckCount > 0 && document.getElementById('stuck-apps-table')) {
            const stuckTable = UI.renderTable(stats.stuckApps, [
                { label: 'Company', render: (v, r) => `<strong style="color:var(--text-1)">${r.company || '-'}</strong>` },
                { label: 'Bank', render: (v, r) => r.bank || '-' },
                { label: 'Facility', render: (v, r) => r.name_facility || r.type_facility || '-' },
                { label: 'Status', render: (v, r) => UI.statusBadge(r.status) },
                { label: 'Days Stuck', render: (v, r) => `<span class="badge hold">${r.days_stuck} days</span>` },
                { label: 'Requested', render: (v, r) => UI.formatCurrency(r.total_requested) }
            ]);
            document.getElementById('stuck-apps-table').appendChild(stuckTable);
        }

        // Export Board-Ready Report as PDF (using html2canvas + jsPDF)
        document.getElementById('btn-export-pdf').addEventListener('click', async () => {
            const btn = document.getElementById('btn-export-pdf');
            const origText = btn.textContent;
            btn.disabled = true;
            btn.textContent = 'Generating PDF...';
            try {
                if (typeof html2canvas !== 'function' || typeof jspdf === 'undefined') {
                    UI.showToast('PDF libraries not loaded. Refresh and try again.', 'error');
                    return;
                }

                const dateFile = new Date().toISOString().slice(0, 10);
                const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
                const U = (s) => String(s ?? '').toUpperCase();

                const cell = 'padding:6px 8px;border:1px solid #e2e8f0;font-size:8.5px;vertical-align:top;';
                const cellCenter = cell + 'text-align:center;';
                const cellRight = cell + 'text-align:right;';
                const zebra = (i) => (i % 2 === 0 ? '#ffffff' : '#f8fafc');

                const top5Banks = entries.slice(0, 5);
                const bankRows = top5Banks.map(([name, s], i) => {
                    const r = s.count > 0 ? Math.round((s.done / s.count) * 100) : 0;
                    const a = s.requested > 0 ? Math.round((s.approved / s.requested) * 100) : 0;
                    return `<tr style="background:${zebra(i)}">` +
                        `<td style="${cell}font-weight:700">${name}</td>` +
                        `<td style="${cellCenter}">${s.count}</td>` +
                        `<td style="${cellCenter}color:#15803d;font-weight:700">${s.done}</td>` +
                        `<td style="${cellCenter}color:#b91c1c">${s.declined}</td>` +
                        `<td style="${cellCenter}">${s.avgSla || 10}d</td>` +
                        `<td style="${cellCenter}">${r}%</td>` +
                        `<td style="${cellRight}">${UI.formatCurrency(s.requested)}</td>` +
                        `<td style="${cellRight}color:#15803d">${UI.formatCurrency(s.approved)}</td>` +
                        `<td style="${cellRight}font-weight:700">${a}%</td>` +
                        `</tr>`;
                }).join('');

                const monthlyRows = Object.entries(stats.monthlyCounts || {}).map(([m, d], i) => {
                    const r = d.requested > 0 ? Math.round((d.approved / d.requested) * 100) : 0;
                    return `<tr style="background:${zebra(i)}">` +
                        `<td style="${cell}font-weight:700">${m}</td>` +
                        `<td style="${cellCenter}">${d.total}</td>` +
                        `<td style="${cellCenter}color:#15803d">${d.done}</td>` +
                        `<td style="${cellCenter}color:#b91c1c">${d.declined}</td>` +
                        `<td style="${cellRight}">${UI.formatCurrency(d.requested)}</td>` +
                        `<td style="${cellRight}color:#15803d">${UI.formatCurrency(d.approved)}</td>` +
                        `<td style="${cellRight}font-weight:700">${r}%</td>` +
                        `</tr>`;
                }).join('');

                const collMap = {};
                stats.apps.forEach(a => { const c = a.collateral || 'None'; collMap[c] = (collMap[c] || 0) + 1; });
                const collRows = Object.entries(collMap).sort((a, b) => b[1] - a[1]).map(([n, c], i) =>
                    `<tr style="background:${zebra(i)}"><td style="${cell}font-weight:700">${n}</td><td style="${cellCenter}">${c}</td></tr>`
                ).join('');

                const insightRows = insights.map((ins, i) =>
                    `<tr style="background:${zebra(i)}">` +
                    `<td style="${cellCenter}font-weight:800;color:#64748b">0${i + 1}</td>` +
                    `<td style="${cell}font-weight:700">${ins.title}</td>` +
                    `<td style="${cellCenter}font-weight:800;color:#2563eb">${ins.value}</td>` +
                    `<td style="${cell}color:#334155">${ins.reason}</td>` +
                    `</tr>`).join('');

                const insightAppRows = insights.flatMap((ins) =>
                    (ins.apps || []).map(a => ({ ins, a }))
                );
                const appRowsHtml = (rows) => rows.map(({ ins, a }, i) =>
                    `<tr style="background:${zebra(i)}">` +
                    `<td style="${cellCenter}font-weight:700;color:#64748b">${ins.tag}</td>` +
                    `<td style="${cell}font-weight:700">${U(a.company || '-')}</td>` +
                    `<td style="${cell}">${U(a.name_facility || a.type_facility || '-')}</td>` +
                    `<td style="${cellCenter}">${U(a.status || '-')}</td>` +
                    `<td style="${cell}color:#334155">${U(a._note || '-')}</td>` +
                    `<td style="${cellRight}">${UI.formatCurrency(a.total_requested)}</td>` +
                    `</tr>`).join('') ||
                    `<tr><td style="${cellCenter}color:#64748b" colspan="6">No applications recorded</td></tr>`;

                const appRowsCapped = insightAppRows.slice(0, 40);
                const appChunks = [];
                for (let i = 0; i < appRowsCapped.length; i += 20) appChunks.push(appRowsCapped.slice(i, i + 20));
                if (appChunks.length === 0) appChunks.push([]);
                const appOverflow = insightAppRows.length > 40
                    ? '<div style="font-size:8px;color:#64748b;margin:-10px 0 12px">Showing first 40 of ' + insightAppRows.length + ' applications.</div>'
                    : '';

                const declineDetailRows = Object.entries(stats.declineReasons || {}).sort((a, b) => b[1] - a[1])
                    .map(([reason, count], i) => `<tr style="background:${zebra(i)}"><td style="${cell}">${reason}</td><td style="${cellCenter}font-weight:700">${count}</td></tr>`).join('')
                    || `<tr><td style="${cellCenter}color:#64748b" colspan="2">No decline reason recorded</td></tr>`;

                const th = 'padding:6px 8px;border:1px solid #cbd5e1;font-size:8px;font-weight:700;color:#334155;background:#f1f5f9;letter-spacing:.03em;';
                const thCenter = th + 'text-align:center;';
                const thRight = th + 'text-align:right;';
                const sectionTitle = (t) => '<div style="font-size:10px;font-weight:800;letter-spacing:.05em;margin:0 0 6px;color:#0f172a">' + t + '</div>';
                const tableWrap = (html) => '<table style="width:100%;border-collapse:collapse;margin-bottom:16px">' + html + '</table>';

                const metricCards = '<table style="width:100%;border-collapse:collapse;margin-bottom:18px"><tr>' + [
                    ['Total Applications', stats.total, '#0f172a'],
                    ['Average SLA', stats.avgSlaDays + ' days', '#0f172a'],
                    ['Total Approved', UI.formatCurrency(stats.totalApproved), '#15803d'],
                    ['Total Requested', UI.formatCurrency(stats.totalRequested), '#0f172a']
                ].map(([label, value, color]) =>
                    '<td style="width:25%;padding:12px 14px;border:1px solid #e2e8f0;background:#f8fafc">' +
                    '<div style="font-size:8px;font-weight:700;color:#64748b;letter-spacing:.06em">' + label + '</div>' +
                    '<div style="font-size:18px;font-weight:800;margin-top:4px;color:' + color + '">' + value + '</div>' +
                    '</td>'
                ).join('') + '</tr></table>';

                const buildPage = (spec, pageNo, totalPages) => `
                    <div style="width:760px;box-sizing:border-box;min-height:1075px;padding:30px 34px;display:flex;flex-direction:column;background:#fff;font-family:Arial,Helvetica,sans-serif;color:#0f172a;font-size:10px;line-height:1.45;text-transform:uppercase">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:12px;border-bottom:2px solid #0f172a;margin-bottom:18px">
                            <div>
                                <div style="font-size:20px;font-weight:800;letter-spacing:-.02em">FM DATA</div>
                                <div style="font-size:9px;font-weight:700;color:#2563eb;letter-spacing:.08em;margin-top:3px">Board-Ready Executive Summary</div>
                            </div>
                            <div style="text-align:right;font-size:9px;color:#475569;line-height:1.6">
                                <div><span style="color:#94a3b8">Date</span> <b>${dateStr}</b></div>
                                <div><span style="color:#94a3b8">Classification</span> <b>Board Confidential</b></div>
                            </div>
                        </div>
                        <div style="flex:1 1 auto">
                            <div style="font-size:14px;font-weight:800;letter-spacing:.02em">${spec.title}</div>
                            ${spec.subtitle ? `<div style="font-size:9px;color:#64748b;margin:3px 0 14px">${spec.subtitle}</div>` : '<div style="height:14px"></div>'}
                            ${spec.body}
                        </div>
                        <div style="padding-top:9px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;font-size:8px;color:#94a3b8;letter-spacing:.05em">
                            <span>FM Data — Board Report</span>
                            <span>Page ${pageNo} of ${totalPages}</span>
                        </div>
                    </div>`;

                const specs = [];
                specs.push({
                    title: 'Executive Summary',
                    subtitle: 'Portfolio overview, key factors and highlighted issues',
                    body: metricCards + sectionTitle('Key Factors & Highlighted Issues') +
                        tableWrap('<thead><tr>' +
                            '<th style="' + thCenter + 'width:34px">#</th>' +
                            '<th style="' + th + 'width:150px">Factor / Issue</th>' +
                            '<th style="' + thCenter + 'width:96px">Observation</th>' +
                            '<th style="' + th + '">Reason</th>' +
                            '</tr></thead><tbody>' + insightRows + '</tbody>')
                });

                appChunks.forEach((chunk, idx) => {
                    specs.push({
                        title: 'Applications Involved by Factor / Issue',
                        subtitle: idx === 0
                            ? 'Applications contributing to each highlighted factor, issue or reason'
                            : 'Continued',
                        body: tableWrap('<thead><tr>' +
                            '<th style="' + thCenter + 'width:54px">Factor</th>' +
                            '<th style="' + th + '">Company</th>' +
                            '<th style="' + th + '">Facility</th>' +
                            '<th style="' + thCenter + 'width:84px">Status</th>' +
                            '<th style="' + th + '">Reason / Note</th>' +
                            '<th style="' + thRight + 'width:74px">Requested</th>' +
                            '</tr></thead><tbody>' + appRowsHtml(chunk) + '</tbody>') +
                            (idx === appChunks.length - 1 ? appOverflow : '')
                    });
                });

                specs.push({
                    title: 'Partner Bank Performance & Collateral',
                    subtitle: 'Top partner bank SLA performance and collateral distribution',
                    body: sectionTitle('Top Partner Bank SLA & Performance Ranking') +
                        tableWrap('<thead><tr>' +
                            '<th style="' + th + '">Bank</th>' +
                            '<th style="' + thCenter + '">Apps</th>' +
                            '<th style="' + thCenter + '">Done</th>' +
                            '<th style="' + thCenter + '">Declined</th>' +
                            '<th style="' + thCenter + '">SLA</th>' +
                            '<th style="' + thCenter + '">Success</th>' +
                            '<th style="' + thRight + '">Requested</th>' +
                            '<th style="' + thRight + '">Approved</th>' +
                            '<th style="' + thRight + '">Approval %</th>' +
                            '</tr></thead><tbody>' + bankRows + '</tbody>') +
                        sectionTitle('Collateral Distribution') +
                        tableWrap('<thead><tr>' +
                            '<th style="' + th + '">Collateral Type</th>' +
                            '<th style="' + thCenter + 'width:100px">Applications</th>' +
                            '</tr></thead><tbody>' + collRows + '</tbody>')
                });

                specs.push({
                    title: 'Monthly Trajectory & Decline Analysis',
                    subtitle: 'Monthly performance trend and decline reasons breakdown',
                    body: sectionTitle('Monthly Performance Trajectory') +
                        tableWrap('<thead><tr>' +
                            '<th style="' + th + '">Month</th>' +
                            '<th style="' + thCenter + '">Apps</th>' +
                            '<th style="' + thCenter + '">Done</th>' +
                            '<th style="' + thCenter + '">Declined</th>' +
                            '<th style="' + thRight + '">Requested (RM)</th>' +
                            '<th style="' + thRight + '">Approved (RM)</th>' +
                            '<th style="' + thRight + '">Approval %</th>' +
                            '</tr></thead><tbody>' + monthlyRows + '</tbody>') +
                        sectionTitle('Decline Reasons Breakdown') +
                        tableWrap('<thead><tr>' +
                            '<th style="' + th + '">Reason</th>' +
                            '<th style="' + thCenter + 'width:80px">Count</th>' +
                            '</tr></thead><tbody>' + declineDetailRows + '</tbody>')
                });

                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfW = pdf.internal.pageSize.getWidth();
                const pdfH = pdf.internal.pageSize.getHeight();
                const margin = 8;
                const contentW = pdfW - margin * 2;
                const contentH = pdfH - margin * 2;

                for (let i = 0; i < specs.length; i++) {
                    const wrapper = document.createElement('div');
                    wrapper.style.cssText = 'position:fixed;left:0;top:0;background:#fff;z-index:9999';
                    wrapper.innerHTML = buildPage(specs[i], i + 1, specs.length);
                    document.body.appendChild(wrapper);
                    await new Promise(r => setTimeout(r, 120));
                    const canvas = await html2canvas(wrapper.firstElementChild, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' });
                    document.body.removeChild(wrapper);
                    if (i > 0) pdf.addPage();
                    const scale = Math.min(contentW / canvas.width, contentH / canvas.height);
                    const drawW = canvas.width * scale;
                    const drawH = canvas.height * scale;
                    const y = margin + (contentH - drawH) / 2;
                    pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', (pdfW - drawW) / 2, y, drawW, drawH);
                }

                pdf.save('FMData_Report_' + dateFile + '.pdf');
                UI.showToast('PDF report downloaded', 'success');
            } catch (err) {
                UI.showToast('PDF error: ' + err.message, 'error');
            }
            btn.disabled = false;
            btn.textContent = origText;
        });

        document.getElementById('btn-export-csv').addEventListener('click', async () => {
            try {
                const apps = await DB.fetchApplications();
                const headers = ['Company', 'Year', 'Bank', 'BFR', 'Type', 'Facility', 'Collateral', 'Status', 'Requested', 'Approved', 'Progress', 'Decline Reason'];
                const rows = apps.map(a => [
                    a.company, a.year_application, a.bank, a.bfr, a.type_facility, a.name_facility,
                    a.collateral || '', a.status, a.total_requested, a.total_approved, a.progress, a.decline_reason
                ]);
                const csv = [headers.join(','), ...rows.map(r => r.map(v => UI.csvEscape(v)).join(','))].join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `fmdata_export_${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                URL.revokeObjectURL(url);
                UI.showToast('Data exported successfully', 'success');
            } catch (err) {
                UI.showToast('Export error: ' + err.message, 'error');
            }
        });
    },

    async renderCollaterals(el) {
        const collaterals = await DB.fetchCollaterals();

        const renderPage = () => {
            el.innerHTML = `
                <div class="module-header-bar">
                    <div class="module-title-wrap">
                        <h2>Collateral Types</h2>
                        <p>Manage collateral types used across financing applications</p>
                    </div>
                    <div class="summary-pills-bar">
                        <div class="pill-stat">
                            <span class="pill-stat-label">Total Collateral Types</span>
                            <span class="pill-stat-val">${collaterals.length}</span>
                        </div>
                        <button class="btn-secondary" id="btn-export-collateral-csv" style="margin-right:6px">${this.icons['file-text']} Download CSV</button>
                        <button class="btn-primary" id="btn-add-collateral">${this.icons.plus} Add Collateral</button>
                    </div>
                </div>

                <div class="filter-bar" style="margin-bottom:20px">
                    <input type="text" id="collateral-search" placeholder="Search collateral name..." />
                </div>

                <div class="company-card-grid" id="collateral-grid">
                    ${collaterals.map(c => {
                        const initials = c.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'CO';
                        return `
                        <div class="company-card" data-collateral-id="${c.id}" data-collateral-name="${c.name}">
                            <div class="company-card-top">
                                <div class="avatar-badge" style="background:var(--primary-light);color:var(--primary)">${initials}</div>
                                <div class="company-card-meta">
                                    <div class="company-card-title">${c.name}</div>
                                    <div class="company-card-sub">${c.description || 'No description'}</div>
                                </div>
                                <button class="btn-danger btn-xs" data-delete-collateral="${c.id}" title="Delete Collateral" style="margin-left:6px">${this.icons.trash}</button>
                            </div>
                            <div class="company-card-footer" style="padding-top:8px;display:flex;gap:8px;border-top:1px solid var(--border);margin-top:8px">
                                <button class="btn-secondary btn-xs" data-edit-collateral="${c.id}" style="flex:1">${this.icons.edit} Edit</button>
                                <button class="btn-primary btn-xs" data-view-apps="${c.id}" style="flex:1">View Applications</button>
                            </div>
                        </div>`;
                    }).join('')}
                </div>

                <div class="modal-overlay" id="modal-collateral">
                    <div class="modal" style="max-width:480px">
                        <div class="modal-header">
                            <h2 id="modal-collateral-title">Add Collateral</h2>
                            <button class="modal-close" onclick="UI.closeModal('modal-collateral')">&times;</button>
                        </div>
                        <form id="collateral-form" onsubmit="return false">
                            <div class="modal-body">
                                <div class="form-group">
                                    <label>Collateral Name</label>
                                    <input name="name" placeholder="e.g. 80% SJPP, 20% FD" required />
                                </div>
                                <div class="form-group">
                                    <label>Description (optional)</label>
                                    <input name="description" placeholder="e.g. SJPP guarantee with FD top-up" />
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn-secondary" onclick="UI.closeModal('modal-collateral')">Cancel</button>
                                <button type="submit" class="btn-primary" id="btn-save-collateral">Save</button>
                            </div>
                        </form>
                    </div>
                </div>`;

            let editingCollateralId = null;

            document.getElementById('collateral-search')?.addEventListener('input', (e) => {
                const q = e.target.value.toLowerCase();
                document.querySelectorAll('#collateral-grid .company-card').forEach(card => {
                    const name = card.dataset.collateralName.toLowerCase();
                    card.style.display = name.includes(q) ? '' : 'none';
                });
            });

            document.querySelectorAll('[data-view-apps]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.dataset.viewApps;
                    window.location.hash = 'applications|collateral:' + id;
                });
            });

            document.querySelectorAll('[data-edit-collateral]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.dataset.editCollateral;
                    const c = collaterals.find(x => x.id === id);
                    if (!c) return;
                    editingCollateralId = id;
                    document.getElementById('modal-collateral-title').textContent = 'Edit Collateral';
                    document.getElementById('btn-save-collateral').textContent = 'Update';
                    UI.setFormData('collateral-form', { name: c.name, description: c.description || '' });
                    UI.openModal('modal-collateral');
                });
            });

            document.querySelectorAll('[data-delete-collateral]').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const id = btn.dataset.deleteCollateral;
                    const c = collaterals.find(x => x.id === id);
                    if (!c) return;
                    const confirmed = await UI.confirmDialog(`Delete collateral "${c.name}"? Applications using this collateral will be unlinked.`, 'Delete Collateral');
                    if (!confirmed) return;
                    try {
                        const res = await DB.saveChange('collateral', 'DELETE', id, {}, `Delete collateral: ${c.name}`);
                        UI.showToast(res.queued ? 'Collateral deletion submitted for HOD review' : 'Collateral deleted', 'success');
                        App.renderCollaterals(el);
                    } catch (err) {
                        UI.showToast('Error: ' + err.message, 'error');
                    }
                });
            });

            document.getElementById('btn-export-collateral-csv').addEventListener('click', async () => {
                const headers = ['Name', 'Description', 'Created At'];
                const rows = collaterals.map(c => [c.name, c.description || '', c.created_at ? new Date(c.created_at).toLocaleDateString('en-GB') : '']);
                const csv = [headers.join(','), ...rows.map(r => r.map(v => UI.csvEscape(String(v))).join(','))].join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `collateral_export_${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                URL.revokeObjectURL(url);
                UI.showToast('Collateral data exported', 'success');
            });

            document.getElementById('btn-add-collateral').addEventListener('click', () => {
                editingCollateralId = null;
                document.getElementById('modal-collateral-title').textContent = 'Add Collateral';
                document.getElementById('btn-save-collateral').textContent = 'Save';
                document.getElementById('collateral-form').reset();
                UI.openModal('modal-collateral');
            });

            document.getElementById('collateral-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const data = UI.getFormData('collateral-form');
                const btn = document.getElementById('btn-save-collateral');
                btn.disabled = true;
                btn.textContent = 'Saving...';
                try {
                    const res = await DB.saveChange('collateral', editingCollateralId ? 'UPDATE' : 'CREATE', editingCollateralId, data,
                        `${editingCollateralId ? 'Edit' : 'New'} collateral: ${data.name || '-'}`);
                    UI.showToast(res.queued ? 'Collateral change submitted for HOD review' : (editingCollateralId ? 'Collateral updated' : 'Collateral added'), 'success');
                    UI.closeModal('modal-collateral');
                    App.renderCollaterals(el);
                } catch (err) {
                    UI.showToast('Error: ' + err.message, 'error');
                }
                btn.disabled = false;
                btn.textContent = editingCollateralId ? 'Update' : 'Save';
            });
        };

        renderPage();
    },

    async renderSettings(el) {
        const isSuperAdmin = Auth.isSuperAdmin();
        const email = Auth.getEmail();
        const initial = (email[0] || '?').toUpperCase();

        el.innerHTML = `
            <div class="module-header-bar">
                <div class="module-title-wrap">
                    <h2>Settings & Administration</h2>
                    <p>Manage account, user access roles, data backups, and dashboard preferences</p>
                </div>
            </div>

            <div class="settings-profile-card">
                <div class="avatar-badge user-avatar-xl">${initial}</div>
                <div class="settings-profile-info">
                    <div class="settings-profile-name">${email}</div>
                    <div class="settings-profile-email" id="settings-role-label">${isSuperAdmin ? 'Super Administrator' : 'Staff Member'}</div>
                </div>
                <button class="btn-secondary" onclick="Auth.logout()">Sign Out</button>
            </div>

            <div class="grid-2" style="margin-bottom:24px">
                <div class="card">
                    <div class="card-header"><div class="card-header-title">Data Backup & Export</div></div>
                    <div class="card-body">
                        <p style="font-size:13px;color:var(--text-2);margin-bottom:14px">Export all facility financing applications in CSV format for analysis or archiving.</p>
                        <button class="btn-primary" id="btn-settings-export">${this.icons['file-text']} Export All Data (CSV)</button>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header"><div class="card-header-title">System Overview</div></div>
                    <div class="card-body">
                        <p style="font-size:13px;color:var(--text-2);margin-bottom:14px">Active workspace version: <strong>1.0.0</strong> (White Corporate Theme)</p>
                        <span class="badge done"><span class="badge-dot"></span>System Operational</span>
                    </div>
                </div>
            </div>

            ${isSuperAdmin ? `
            <div class="card" style="margin-bottom:16px">
                <div class="card-header"><div class="card-header-title">Page Access Permissions</div>
                    <span style="font-size:11px;color:var(--text-muted)">Staff Role Visibility</span>
                </div>
                <div class="card-body" id="admin-page-permissions"></div>
            </div>
            <div class="card" style="margin-bottom:16px">
                <div class="card-header"><div class="card-header-title">Dashboard Chart Visibility</div>
                    <span style="font-size:11px;color:var(--text-muted)">Staff Role Visibility</span>
                </div>
                <div class="card-body" id="admin-chart-visibility"></div>
            </div>
            ` : ''}

            <div class="card">
                <div class="card-header"><div class="card-header-title">System Quick Metrics</div></div>
                <div class="card-body" id="settings-stats">
                    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px">
                        <div style="padding:16px;background:var(--surface);border-radius:8px;border:1px solid var(--border)">
                            <div style="font-size:11px;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:0.04em">Total Apps</div>
                            <div style="font-size:22px;font-weight:700;color:var(--text-1);font-family:var(--font-mono);margin-top:4px" id="stat-total">-</div>
                        </div>
                        <div style="padding:16px;background:var(--surface);border-radius:8px;border:1px solid var(--border)">
                            <div style="font-size:11px;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:0.04em">Companies</div>
                            <div style="font-size:22px;font-weight:700;color:var(--text-1);font-family:var(--font-mono);margin-top:4px" id="stat-companies">-</div>
                        </div>
                        <div style="padding:16px;background:var(--surface);border-radius:8px;border:1px solid var(--border)">
                            <div style="font-size:11px;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:0.04em">Partner Banks</div>
                            <div style="font-size:22px;font-weight:700;color:var(--text-1);font-family:var(--font-mono);margin-top:4px" id="stat-banks">-</div>
                        </div>
                        <div style="padding:16px;background:var(--surface);border-radius:8px;border:1px solid var(--border)">
                            <div style="font-size:11px;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:0.04em">Total Requested</div>
                            <div style="font-size:22px;font-weight:700;color:var(--text-1);font-family:var(--font-mono);margin-top:4px" id="stat-requested">-</div>
                        </div>
                    </div>
                </div>
            </div>`;

        try {
            const stats = await DB.getDashboardStats();
            const banks = await DB.fetchBanks();
            const companies = Object.keys(stats.companyTotals);
            document.getElementById('stat-total').textContent = stats.total;
            document.getElementById('stat-companies').textContent = companies.length;
            document.getElementById('stat-banks').textContent = banks.length;
            document.getElementById('stat-requested').textContent = UI.formatCurrency(stats.totalRequested);
        } catch (err) { UI.showToast('Could not load stats: ' + err.message, 'error'); }

        if (isSuperAdmin) {
            this.loadAdminPagePermissions();
            this.loadAdminChartVisibility();
        }

        document.getElementById('btn-settings-export')?.addEventListener('click', async () => {
            try {
                const apps = await DB.fetchApplications();
                const headers = ['Company','Year','Bank','BFR','Type','Facility','Status','Requested','Approved','Progress','Decline Reason'];
                const rows = apps.map(a => [a.company, a.year_application, a.bank, a.bfr, a.type_facility, a.name_facility, a.status, a.total_requested, a.total_approved, a.progress, a.decline_reason]);
                const csv = [headers.join(','), ...rows.map(r => r.map(v => UI.csvEscape(v)).join(','))].join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `fmdata_export_${new Date().toISOString().slice(0,10)}.csv`;
                a.click();
                URL.revokeObjectURL(url);
                UI.showToast('Data exported successfully','success');
            } catch(err) { UI.showToast('Export error: ' + err.message, 'error'); }
        });
    },

    async renderUsers(el) {
        if (!Auth.isSuperAdmin()) {
            this.renderUnfinishedPage(el, 'users');
            return;
        }

        el.innerHTML = `
            <div class="module-header-bar">
                <div class="module-title-wrap">
                    <h2>User Management</h2>
                    <p>Manage user accounts and assign access roles</p>
                </div>
            </div>

            <div class="card" style="margin-bottom:16px">
                <div class="card-header">
                    <div class="card-header-title">Add User</div>
                    <span style="font-size:11px;color:var(--text-muted)">Create a new account</span>
                </div>
                <div class="card-body">
                    <form id="add-user-form" autocomplete="off">
                        <div class="grid-2">
                            <div class="form-group">
                                <label for="new-user-email">Email</label>
                                <input type="email" id="new-user-email" placeholder="name@company.com" required>
                            </div>
                            <div class="form-group">
                                <label for="new-user-password">Temporary password</label>
                                <input type="password" id="new-user-password" placeholder="At least 6 characters" minlength="6" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="new-user-role">Role</label>
                            <select id="new-user-role">
                                <option value="staff">Staff</option>
                                <option value="super_admin">Super Admin</option>
                            </select>
                        </div>
                        <button class="btn-primary" type="submit" id="btn-add-user">${this.icons.plus} Add User</button>
                    </form>
                </div>
            </div>

            <div class="card" style="margin-bottom:16px">
                <div class="card-header">
                    <div class="card-header-title">User Accounts</div>
                    <span style="font-size:11px;color:var(--text-muted)">Super Admin only</span>
                </div>
                <div class="card-body" id="admin-user-list">
                    <div class="skeleton" style="height:44px;border-radius:8px;margin-bottom:8px"></div>
                    <div class="skeleton" style="height:44px;border-radius:8px"></div>
                </div>
            </div>`;

        document.getElementById('add-user-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('new-user-email').value.trim();
            const password = document.getElementById('new-user-password').value;
            const role = document.getElementById('new-user-role').value;
            const btn = document.getElementById('btn-add-user');
            btn.disabled = true;
            btn.textContent = 'Adding...';
            try {
                const result = await DB.createUser(email, password, role);
                UI.showToast(result.needsConfirmation
                    ? `User ${email} created. Confirmation email sent.`
                    : `User ${email} created as ${role === 'super_admin' ? 'Super Admin' : 'Staff'}`, 'success');
                e.target.reset();
                await this.loadAdminUsers();
            } catch (err) {
                UI.showToast('Error adding user: ' + err.message, 'error');
            }
            btn.disabled = false;
            btn.innerHTML = `${this.icons.plus} Add User`;
        });

        await this.loadAdminUsers();
    },

    async loadAdminUsers() {
        try {
            const profiles = await DB.fetchProfiles();
            const container = document.getElementById('admin-user-list');
            container.innerHTML = profiles.map(p => `
                <div class="admin-row">
                    <div class="admin-row-info">
                        <div class="admin-row-name">${p.email || 'Unknown'}</div>
                        <div class="admin-row-detail">ID: ${p.id.slice(0,8)}...</div>
                    </div>
                    <select class="admin-role-select" data-user-id="${p.id}" ${p.id === Auth.getUser()?.id ? 'disabled' : ''}>
                        <option value="staff" ${p.role === 'staff' ? 'selected' : ''}>Staff</option>
                        <option value="super_admin" ${p.role === 'super_admin' ? 'selected' : ''}>Super Admin</option>
                    </select>
                </div>
            `).join('');
            container.querySelectorAll('.admin-role-select:not([disabled])').forEach(sel => {
                sel.addEventListener('change', async (e) => {
                    const userId = e.target.dataset.userId;
                    const role = e.target.value;
                    try {
                        await DB.updateProfileRole(userId, role);
                        UI.showToast('User role updated to ' + role, 'success');
                    } catch (err) {
                        UI.showToast('Error: ' + err.message, 'error');
                    }
                });
            });
        } catch (err) {
            document.getElementById('admin-user-list').innerHTML =
                `<p style="font-size:13px;color:var(--text-muted)">Could not load users: ${err.message}</p>`;
        }
    },

    async loadAdminPagePermissions() {
        try {
            const perms = await DB.fetchPagePermissions();
            const container = document.getElementById('admin-page-permissions');
            container.innerHTML = perms.map(p => {
                const pageInfo = this.pages[p.page_key] || { label: p.page_key, icon: 'grid' };
                return `
                <div class="admin-row">
                    <div class="admin-row-info">
                        <div class="admin-row-name">${pageInfo.label}</div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" class="toggle-input" data-perm-id="${p.id}" ${p.is_allowed ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                        <span class="toggle-label">${p.is_allowed ? 'Allowed' : 'Blocked'}</span>
                    </label>
                </div>`;
            }).join('');
            container.querySelectorAll('.toggle-input').forEach(cb => {
                cb.addEventListener('change', async (e) => {
                    const permId = e.target.dataset.permId;
                    const isAllowed = e.target.checked;
                    const label = e.target.closest('.toggle-switch').querySelector('.toggle-label');
                    label.textContent = isAllowed ? 'Allowed' : 'Blocked';
                    try {
                        await DB.updatePagePermission(permId, isAllowed);
                        this._pagePermissions = null;
                    } catch (err) {
                        UI.showToast('Error: ' + err.message, 'error');
                        e.target.checked = !isAllowed;
                        label.textContent = !isAllowed ? 'Allowed' : 'Blocked';
                    }
                });
            });
        } catch (err) {
            document.getElementById('admin-page-permissions').innerHTML =
                `<p style="font-size:13px;color:var(--text-muted)">Could not load permissions: ${err.message}</p>`;
        }
    },

    async loadAdminChartVisibility() {
        try {
            const charts = await DB.fetchChartVisibility();
            const container = document.getElementById('admin-chart-visibility');
            container.innerHTML = charts.map(c => `
                <div class="admin-row">
                    <div class="admin-row-info">
                        <div class="admin-row-name">${c.chart_label}</div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" class="toggle-input" data-chart-id="${c.id}" ${c.is_visible ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                        <span class="toggle-label">${c.is_visible ? 'Visible' : 'Hidden'}</span>
                    </label>
                </div>
            `).join('');
            container.querySelectorAll('.toggle-input').forEach(cb => {
                cb.addEventListener('change', async (e) => {
                    const chartId = e.target.dataset.chartId;
                    const isVisible = e.target.checked;
                    const label = e.target.closest('.toggle-switch').querySelector('.toggle-label');
                    label.textContent = isVisible ? 'Visible' : 'Hidden';
                    try {
                        await DB.updateChartVisibility(chartId, isVisible);
                    } catch (err) {
                        UI.showToast('Error: ' + err.message, 'error');
                        e.target.checked = !isVisible;
                        label.textContent = !isVisible ? 'Visible' : 'Hidden';
                    }
                });
            });
        } catch (err) {
            document.getElementById('admin-chart-visibility').innerHTML =
                `<p style="font-size:13px;color:var(--text-muted)">Could not load chart settings: ${err.message}</p>`;
        }
    },

    async renderBosReview(el) {
        App.approveChangeRequest = async (id) => {
            try {
                await DB.approveChangeRequest(id, document.getElementById(`review-note-${id}`)?.value.trim());
                UI.showToast('Change approved and applied', 'success');
                await loadBos();
            } catch (err) { UI.showToast('Error approving: ' + err.message, 'error'); }
        };

        App.rejectChangeRequest = async (id) => {
            try {
                await DB.rejectChangeRequest(id, document.getElementById(`review-note-${id}`)?.value.trim());
                UI.showToast('Change rejected', 'success');
                await loadBos();
            } catch (err) { UI.showToast('Error rejecting: ' + err.message, 'error'); }
        };

        const loadBos = async () => {
            const canReview = await Auth.canReviewChanges();
            const changes = await DB.fetchChangeRequests();
            const pendingChanges = changes.filter(cr =>
                cr.entity === 'application' && ['CREATE', 'UPDATE'].includes(cr.action) &&
                cr.status === 'PENDING' && (cr.action === 'CREATE' || cr.record_id) &&
                Object.entries(cr.payload || {}).some(([key, value]) =>
                    !['id', 'created_at', 'updated_at', 'type_facility_custom'].includes(key) &&
                    (cr.action === 'CREATE' || !cr.before_payload || JSON.stringify(value) !== JSON.stringify(cr.before_payload[key])))
            );

            const esc = (s) => String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
            const fieldLabels = {
                company: 'Company', bank: 'Bank', type_facility: 'Type of Facility', name_facility: 'Name of Facility',
                category: 'Category', year_application: 'Year', bfr: 'BFR', profit_rate: 'Profit Rate', rate_tenure: 'Tenure',
                status: 'Status', collateral: 'Collateral', total_requested: 'Total Requested', total_approved: 'Total Approved',
                app_details: 'Details', hold_reason: 'Hold Reason', decline_reason: 'Decline Reason', cancel_reason: 'Cancellation Reason', discharge_note: 'Discharged Note', discharge_note_text: 'Discharge Note Details', officers: 'Officers', annual_review: 'Annual Review',
                bank_cancellation_letter: 'Bank Cancellation Letter', bank_cancellation_letter_path: 'Bank Letter File', bank_cancellation_letter_name: 'Bank Letter Name',
                name: 'Name', description: 'Description', bfr_current: 'BFR Current', bfr_previous: 'BFR Previous',
                property_detail: 'Property Detail', date_doc_sent: 'Doc Sent', date_updated: 'Date Updated', notes: 'Notes', collateral_id: 'Collateral ID'
            };
            const actionClass = { CREATE: 'done', UPDATE: 'progress', DELETE: 'declined' };
            const currencyKeys = ['total_requested', 'total_approved', 'total_offered'];
            const renderChangeFields = (cr) => {
                if (cr.action === 'DELETE') return `<div class="bos-notes-box">This record will be permanently deleted.</div>`;
                const fmtVal = (k, v) => {
                    if (v === null || v === undefined || v === '') return '(empty)';
                    if (typeof v === 'boolean') return v ? 'Yes' : 'No';
                    if (Array.isArray(v)) return v.map(item => fmtVal(k, item)).join('; ') || '(empty)';
                    if (typeof v === 'object') return Object.entries(v).map(([key, value]) => `${key}: ${fmtVal(key, value)}`).join(', ');
                    return currencyKeys.includes(k) ? UI.formatCurrency(v) : v;
                };
                const entries = Object.entries(cr.payload || {})
                    .filter(([k]) => !['id', 'created_at', 'updated_at', 'type_facility_custom'].includes(k));
                if (!entries.length) return '';
                const sections = [
                    ['Application', ['company', 'category', 'status', 'app_details', 'progress']],
                    ['Bank & Facility', ['bank', 'bfr', 'type_facility', 'name_facility']],
                    ['Financial Details', ['total_requested', 'total_approved', 'total_offered', 'collateral', 'collateral_id', 'fixed_deposit', 'profit_rate', 'rate_tenure']],
                    ['Dates & Reviews', ['year_application', 'annual_review', 'date_doc_sent', 'date_followup', 'date_updated']],
                    ['Additional Details', []]
                ];
                const assigned = new Set(sections.flatMap(([, keys]) => keys));
                return `<div class="review-change-fields">${sections.map(([title, keys]) => {
                    const fields = entries.filter(([key]) => keys.length ? keys.includes(key) : !assigned.has(key));
                    if (!fields.length) return '';
                    return `<div><div class="detail-section">${title}</div><div class="detail-grid">${fields.map(([k, v]) => `
                        <div class="review-change-field detail-group"><div class="detail-label">${esc(fieldLabels[k] || k.replace(/_/g, ' '))}</div>
                        ${cr.action === 'UPDATE' ? `<div class="detail-value"><span>Original:</span> ${cr.before_payload ? esc(fmtVal(k, cr.before_payload[k])) : 'Not recorded; reject and resubmit this edit'}</div>` : ''}
                        <div class="detail-value">${cr.action === 'UPDATE' ? '<span>Proposed:</span> ' : ''}${esc(fmtVal(k, v))}</div></div>`).join('')}</div></div>`;
                }).join('')}</div>`;
            };

            el.innerHTML = `
            <div class="module-header-bar">
                <div class="module-title-wrap">
                    <h2>HOD Review</h2>
                    <p>New applications and edits awaiting approval. New applications appear in Applications after approval; existing data stays unchanged until approved.</p>
                </div>
                <div class="summary-pills-bar">
                    <div class="pill-stat">
                        <span class="pill-stat-label">Pending Changes</span>
                        <span class="pill-stat-val" style="color:var(--amber)">${pendingChanges.length}</span>
                    </div>
                    <button class="btn-secondary" id="btn-review-history">${this.icons.activity} Review History</button>
                </div>
            </div>

            <div class="card" style="margin-bottom:24px">
                <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
                    <div class="card-header-title">Pending Applications and Edits</div>
                    ${pendingChanges.length ? `<span class="badge hold"><span class="badge-dot"></span>${pendingChanges.length} awaiting approval</span>` : ''}
                </div>
                <div class="card-body">
                    ${pendingChanges.length === 0 ? `
                        <p style="color:var(--text-3);font-size:13px;margin:0">No pending changes. New applications and edits will appear here after submission.</p>
                    ` : `
                        <div class="bos-card-grid">
                            ${pendingChanges.map(cr => `
                                <div class="bos-card">
                                    <div class="bos-card-header">
                                        <div>
                                            <div class="bos-card-title">${esc(cr.summary || (cr.entity + ' ' + cr.action))}</div>
                                            <div class="bos-card-company">${esc(cr.requested_by_email || 'unknown')} · ${UI.formatDate(cr.created_at)}</div>
                                        </div>
                                        <span class="badge ${actionClass[cr.action] || 'pending'}"><span class="badge-dot"></span>${cr.action} ${esc(cr.entity)}</span>
                                    </div>
                                    <div class="review-card-summary">${esc([
                                        cr.payload?.company ?? cr.before_payload?.company,
                                        cr.payload?.name_facility ?? cr.before_payload?.name_facility,
                                        cr.payload?.bank ?? cr.before_payload?.bank
                                    ].filter(Boolean).join(' · '))}</div>
                                    <div class="bos-card-actions">
                                        <button type="button" class="btn-secondary btn-sm" data-review-view aria-haspopup="dialog" aria-controls="review-details-${esc(cr.id)}">View</button>
                                        ${canReview && cr.requested_by !== Auth.getUser()?.id ? `
                                            <button class="btn-primary btn-sm" onclick="App.approveChangeRequest('${cr.id}')">Approve</button>
                                            <button class="btn-danger btn-sm" onclick="App.rejectChangeRequest('${cr.id}')">Reject</button>
                                        ` : `<span style="font-size:12px;color:var(--text-3)">Awaiting HOD approval</span>`}
                                    </div>
                                    <dialog id="review-details-${esc(cr.id)}" class="modal review-detail-modal" aria-labelledby="review-title-${esc(cr.id)}">
                                        <div class="modal-header"><h2 id="review-title-${esc(cr.id)}">${esc(cr.payload?.company ?? cr.before_payload?.company ?? 'Application')} · ${esc(cr.payload?.type_facility ?? cr.before_payload?.type_facility ?? 'Facility')}</h2><button type="button" class="modal-close" data-review-close aria-label="Close application details">&times;</button></div>
                                        <div class="modal-body">
                                        ${renderChangeFields(cr)}
                                        ${cr.record_id ? `<div class="detail-section">Date History</div><div class="application-date-history" data-date-history data-application-id="${esc(cr.record_id)}"></div>` : ''}
                                        ${canReview && cr.requested_by !== Auth.getUser()?.id ? `<div class="form-group"><label for="review-note-${esc(cr.id)}">Review note (optional)</label><textarea id="review-note-${esc(cr.id)}" rows="2" placeholder="Reason or context for this decision"></textarea></div>` : ''}
                                        </div>
                                        <div class="modal-footer"><button type="button" class="btn-secondary" data-review-close>Close</button></div>
                                    </dialog>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
            </div>

            `;

            document.getElementById('btn-review-history')?.addEventListener('click', () => { window.location.hash = 'review_history'; });
            el.querySelectorAll('[data-review-view]').forEach(button => {
                button.addEventListener('click', () => {
                    const details = document.getElementById(button.getAttribute('aria-controls'));
                    details.showModal();
                    const history = details.querySelector('[data-date-history]');
                    if (history) UI.renderApplicationDateHistory(history, history.dataset.applicationId);
                });
            });
            el.querySelectorAll('.review-detail-modal').forEach(dialog => {
                dialog.querySelectorAll('[data-review-close]').forEach(button => {
                    button.onclick = () => dialog.close();
                });
                dialog.addEventListener('click', event => {
                    const bounds = dialog.getBoundingClientRect();
                    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
                });
            });
        };

        await loadBos();
    },

    async renderAuditTrail(el, isCurrent = () => true) {
        let page = 0;
        let filters = {};
        let version = 0;
        const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
        const label = value => String(value).replace(/_/g, ' ').toLowerCase().replace(/^./, char => char.toUpperCase());
        const value = (item, present = true) => {
            if (!present) return '(not present)';
            if (item === null || item === undefined) return '(empty)';
            if (item === '') return '(blank text)';
            if (typeof item === 'boolean') return item ? 'Yes' : 'No';
            if (Array.isArray(item)) return item.map(entry => value(entry)).join('\n\n') || '(empty)';
            if (typeof item === 'object') return Object.entries(item).map(([key, entry]) => `${label(key)}: ${value(entry)}`).join('\n');
            return String(item);
        };
        const options = values => values.map(item => `<option value="${item}">${label(item)}</option>`).join('');
        el.innerHTML = `
            <div class="module-header-bar"><div class="module-title-wrap"><h2>Audit Trail</h2>
                <p>A record of changes, decisions and the people behind them.</p></div><span class="audit-timezone">Singapore time · UTC+08:00</span></div>
            <form id="audit-filters" class="audit-filters">
                <div class="audit-primary-filters">
                <label>User email<input name="actor_email" type="search" placeholder="Search by email..."></label>
                <label>Entity<select name="entity"><option value="">All entities</option>${options(['application', 'company', 'bank', 'collateral', 'user_profile', 'page_permission', 'chart_setting', 'legacy_proposal'])}</select></label>
                <label>Action<select name="action"><option value="">All actions</option>${options(['SUBMITTED', 'APPROVED', 'REJECTED', 'RESTORED', 'CREATED', 'UPDATED', 'DELETED', 'REQUEST_UPDATED', 'REQUEST_DELETED'])}</select></label>
                <div class="audit-filter-actions"><button class="btn-primary" type="submit">Search audit</button><button class="btn-secondary" type="reset">Clear filters</button></div>
                </div>
                <details class="audit-advanced"><summary>Date &amp; reference filters</summary><div class="audit-advanced-fields">
                <label>From date<input name="from" type="date"></label><label>To date<input name="to" type="date"></label>
                <label>Record / application ID<input name="record_id" placeholder="Full record UUID"></label>
                <label>Request ID<input name="request_id" placeholder="Full request UUID"></label>
                <label>Transaction ID<input name="transaction_id" placeholder="Transaction ID"></label>
                </div></details>
            </form>
            <section class="audit-ledger" aria-label="Audit activity">
                <div class="audit-ledger-title"><div><h3>Activity history</h3><p id="audit-message" role="status" aria-live="polite"></p></div><span>Latest first</span></div>
                <div class="audit-columns" aria-hidden="true"><span>Action</span><span>Record</span><span>Handled by</span><span>Date &amp; time</span><span></span></div>
                <div id="audit-events"></div>
                <div class="audit-pagination"><span id="audit-page"></span><div><button id="audit-prev" class="btn-secondary" type="button">Previous</button><button id="audit-next" class="btn-secondary" type="button">Next</button></div></div>
            </section>`;
        const form = el.querySelector('#audit-filters');
        const message = el.querySelector('#audit-message');
        const events = el.querySelector('#audit-events');
        const previous = el.querySelector('#audit-prev');
        const next = el.querySelector('#audit-next');
        const renderDiff = differences => `<div class="audit-diff-head" aria-hidden="true"><span>Field</span><span>Before</span><span>After</span></div><dl class="audit-diff">${Object.entries(differences || {}).map(([key, diff]) => `
            <div><dt>${esc(label(key))}</dt><dd class="audit-before"><b>Before</b><pre>${esc(value(diff.before, diff.before_present))}</pre></dd><dd class="audit-after"><b>After</b><pre>${esc(value(diff.after, diff.after_present))}</pre></dd></div>`).join('')}</dl>`;
        const load = async () => {
            const ticket = ++version;
            previous.disabled = next.disabled = true;
            events.setAttribute('aria-busy', 'true');
            message.textContent = 'Loading audit events...';
            try {
                const result = await DB.fetchAuditEvents(filters, page);
                if (!isCurrent() || ticket !== version) return;
                message.textContent = `${result.count.toLocaleString()} matching events`;
                events.innerHTML = result.events.length ? result.events.map(event => {
                    const snapshot = event.after_snapshot || event.before_snapshot || {};
                    const proposed = event.source_table === 'change_requests' ? Object.fromEntries(Object.entries(snapshot.payload || {}).map(([key, item]) => [key, {
                        before: snapshot.before_payload?.[key], after: item,
                        before_present: !!snapshot.before_payload && Object.hasOwn(snapshot.before_payload, key), after_present: true
                    }])) : null;
                    const timestamp = new Intl.DateTimeFormat('en-SG', { timeZone: 'Asia/Singapore', dateStyle: 'medium', timeStyle: 'long' }).format(new Date(event.occurred_at));
                    const actionTone = ['APPROVED', 'CREATED'].includes(event.action) ? 'positive' : ['REJECTED', 'DELETED', 'REQUEST_DELETED'].includes(event.action) ? 'negative' : event.action === 'SUBMITTED' ? 'pending' : 'neutral';
                    const recordTitle = event.summary || snapshot.name_facility || snapshot.company || snapshot.name || snapshot.email || label(event.entity);
                    return `<details class="audit-event">
                        <summary class="audit-event-summary" aria-label="View changes and handling details">
                            <span class="audit-action audit-action-${actionTone}">${esc(label(event.action))}</span>
                            <span class="audit-record"><strong>${esc(recordTitle)}</strong><span>${esc(label(event.entity))}</span></span>
                            <span class="audit-actor"><strong>${esc(event.actor_name || event.actor_email || (event.actor_id ? 'Unknown user' : 'Database / system'))}</strong><span>${esc(event.actor_name && event.actor_email ? event.actor_email : label(event.actor_role || 'unknown role'))}</span></span>
                            <time datetime="${esc(event.occurred_at)}">${esc(timestamp)}</time><span class="audit-chevron" aria-hidden="true">›</span>
                        </summary>
                        <div class="audit-event-body">
                            ${event.source_table === 'change_requests' ? `<div class="audit-handling"><div><span>Requested by</span><strong>${esc(snapshot.requested_by_email || snapshot.requested_by || 'Not recorded')}</strong></div><div><span>Reviewed by</span><strong>${esc(snapshot.reviewed_by_email || snapshot.reviewed_by || 'Not yet reviewed')}</strong></div><div class="audit-review-note"><span>Review note</span><p>${esc(snapshot.review_notes || 'None recorded')}</p></div></div>` : ''}
                            ${proposed ? `<div class="audit-section-title"><h4>Proposed changes</h4><p>Requested values take effect only after approval.</p></div>${renderDiff(proposed)}` : `<div class="audit-section-title"><h4>Changes made</h4><p>Values saved by this action.</p></div>${renderDiff(event.field_changes)}`}
                            ${proposed ? `<details class="audit-supporting"><summary>Workflow changes</summary>${renderDiff(event.field_changes)}</details>` : ''}
                            <details class="audit-supporting"><summary>Event references</summary><dl class="audit-meta">
                            <div><dt>Event ID</dt><dd>${esc(event.id)}</dd></div><div><dt>User ID</dt><dd>${esc(event.actor_id || 'No authenticated user')}</dd></div>
                            <div><dt>Entity / source</dt><dd>${esc(event.entity)} / ${esc(event.source_table)}</dd></div>
                            <div><dt>Record ID</dt><dd>${esc(event.record_id || 'Not yet assigned')}</dd></div><div><dt>Request ID</dt><dd>${esc(event.request_id || 'No request')}</dd></div>
                            <div><dt>Transaction ID</dt><dd>${esc(event.transaction_id)}</dd></div>
                            <div><dt>Server timestamp (UTC)</dt><dd>${esc(event.occurred_at)}</dd></div>
                            </dl></details>
                            <details class="audit-supporting"><summary>Full before / after snapshots</summary><div class="audit-snapshots"><div><h4>Before</h4><pre>${esc(JSON.stringify(event.before_snapshot, null, 2))}</pre></div><div><h4>After</h4><pre>${esc(JSON.stringify(event.after_snapshot, null, 2))}</pre></div></div></details>
                        </div>
                    </details>`;
                }).join('') : '<div class="empty-state"><h3>No matching audit events</h3><p>Try different filters. Events appear after changes are saved with audit logging enabled.</p></div>';
                el.querySelector('#audit-page').textContent = `Page ${page + 1} of ${Math.max(1, Math.ceil(result.count / 50))}`;
                previous.disabled = page === 0;
                next.disabled = (page + 1) * 50 >= result.count;
            } catch (error) {
                if (!isCurrent() || ticket !== version) return;
                events.innerHTML = '';
                el.querySelector('#audit-page').textContent = '';
                message.textContent = `Unable to load audit events: ${error.message}. Use Search audit to retry.`;
            } finally {
                if (ticket === version) events.setAttribute('aria-busy', 'false');
            }
        };
        form.addEventListener('submit', event => {
            event.preventDefault();
            const selected = Object.fromEntries(new FormData(form));
            for (const key of Object.keys(selected)) selected[key] = selected[key].trim();
            if (['record_id', 'request_id'].some(key => selected[key] && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(selected[key]))) {
                form.querySelector('.audit-advanced').open = true;
                message.textContent = 'Enter a complete UUID for the record or request ID.'; return;
            }
            if (selected.from && selected.to && selected.from > selected.to) { message.textContent = 'From date must be before or equal to To date.'; return; }
            filters = selected; page = 0; load();
        });
        form.addEventListener('reset', () => { filters = {}; page = 0; load(); });
        previous.addEventListener('click', () => { if (page > 0) { page--; load(); } });
        next.addEventListener('click', () => { page++; load(); });
        await load();
    },

    async renderReviewHistory(el) {
        const isSuperAdmin = Auth.isSuperAdmin();
        let filter = 'ALL';

        const esc = (s) => String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
        const fieldLabels = {
            company: 'Company', bank: 'Bank', type_facility: 'Type of Facility', name_facility: 'Name of Facility',
            category: 'Category', year_application: 'Year', bfr: 'BFR', profit_rate: 'Profit Rate', rate_tenure: 'Tenure',
            status: 'Status', collateral: 'Collateral', total_requested: 'Total Requested', total_approved: 'Total Approved',
            app_details: 'Details', hold_reason: 'Hold Reason', decline_reason: 'Decline Reason', cancel_reason: 'Cancellation Reason', discharge_note: 'Discharged Note', discharge_note_text: 'Discharge Note Details', officers: 'Officers', annual_review: 'Annual Review',
            bank_cancellation_letter: 'Bank Cancellation Letter', bank_cancellation_letter_path: 'Bank Letter File', bank_cancellation_letter_name: 'Bank Letter Name',
            name: 'Name', description: 'Description', bfr_current: 'BFR Current', bfr_previous: 'BFR Previous',
            property_detail: 'Property Detail', date_doc_sent: 'Doc Sent', date_updated: 'Date Updated'
        };
        const currencyKeys = ['total_requested', 'total_approved', 'total_offered'];
        const renderFields = (cr) => {
            if (cr.action === 'DELETE') return `<div class="bos-notes-box">Record deletion was ${cr.status.toLowerCase()}.</div>`;
            const fmtVal = (k, v) => Array.isArray(v) ? v.map(x => (x && typeof x === 'object') ? (x.name || '') : String(x)).filter(Boolean).join(', ') : (currencyKeys.includes(k) ? UI.formatCurrency(v) : v);
            const entries = Object.entries(cr.payload || {})
                .filter(([k, v]) => v !== null && v !== '' && !['id', 'created_at', 'updated_at', 'progress', 'collateral_id', 'type_facility_custom'].includes(k))
                .slice(0, 8);
            if (!entries.length) return '';
            return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px 16px;font-size:12px;padding:8px 0">
                ${entries.map(([k, v]) => `<div><span style="color:var(--text-3);display:block;font-size:10px;text-transform:uppercase;letter-spacing:.03em">${esc(fieldLabels[k] || k.replace(/_/g, ' '))}</span><span>${esc(fmtVal(k, v))}</span></div>`).join('')}
            </div>`;
        };

        App.restoreChangeRequest = async (id) => {
            if (!Auth.isSuperAdmin()) { UI.showToast('Only HOD can restore', 'error'); return; }
            const confirmed = await UI.confirmDialog('Restore this decision? The applied change (if any) will be reversed and the request returns to Pending for re-review.', 'Restore Decision');
            if (!confirmed) return;
            try {
                await DB.restoreChangeRequest(id);
                UI.showToast('Decision restored — request is pending again', 'success');
                load();
            } catch (err) { UI.showToast('Error restoring: ' + err.message, 'error'); }
        };

        const load = async () => {
            const all = await DB.fetchChangeRequests();
            const decided = all.filter(c => c.status === 'APPROVED' || c.status === 'REJECTED');
            const shown = filter === 'ALL' ? decided : decided.filter(c => c.status === filter);
            const approvedCount = decided.filter(c => c.status === 'APPROVED').length;
            const rejectedCount = decided.filter(c => c.status === 'REJECTED').length;

            el.innerHTML = `
            <div class="module-header-bar">
                <div class="module-title-wrap">
                    <h2>Review History</h2>
                    <p>Record of approved and rejected change requests, with the ability to restore a wrong decision</p>
                </div>
                <div class="summary-pills-bar">
                    <div class="pill-stat"><span class="pill-stat-label">Approved</span><span class="pill-stat-val" style="color:var(--green)">${approvedCount}</span></div>
                    <div class="pill-stat"><span class="pill-stat-label">Rejected</span><span class="pill-stat-val" style="color:var(--red)">${rejectedCount}</span></div>
                </div>
            </div>

            <div class="filter-bar" style="margin-bottom:20px">
                <select id="history-filter">
                    <option value="ALL" ${filter === 'ALL' ? 'selected' : ''}>All Decisions</option>
                    <option value="APPROVED" ${filter === 'APPROVED' ? 'selected' : ''}>Approved Only</option>
                    <option value="REJECTED" ${filter === 'REJECTED' ? 'selected' : ''}>Rejected Only</option>
                </select>
            </div>

            ${shown.length === 0 ? `
                <div class="empty-state">
                    <div class="empty-state-icon">${this.icons.activity}</div>
                    <h3>No decisions yet</h3>
                    <p>Approved and rejected requests will be listed here.</p>
                </div>
            ` : `
                <div class="bos-card-grid">
                    ${shown.map(cr => `
                        <div class="bos-card">
                            <div class="bos-card-header">
                                <div>
                                    <div class="bos-card-title">${esc(cr.summary || (cr.entity + ' ' + cr.action))}</div>
                                    <div class="bos-card-company">${cr.action} ${esc(cr.entity)} · by ${esc(cr.requested_by_email || 'unknown')}</div>
                                </div>
                                <span class="badge ${cr.status === 'APPROVED' ? 'done' : 'declined'}"><span class="badge-dot"></span>${cr.status}</span>
                            </div>

                            ${renderFields(cr)}

                            <div class="bos-notes-box" style="margin-top:6px">
                                Reviewed by <b>${esc(cr.reviewed_by_email || 'unknown')}</b> on ${UI.formatDate(cr.reviewed_at)}${cr.restored_at ? `<br>Restored on ${UI.formatDate(cr.restored_at)}` : ''}
                                ${cr.review_notes ? `<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border)">
                                    <span style="display:block;font-size:10px;text-transform:uppercase;letter-spacing:.03em;color:var(--text-3);margin-bottom:2px">Review note</span>
                                    <span>${esc(cr.review_notes)}</span>
                                </div>` : ''}
                            </div>

                            <div class="bos-card-actions">
                                ${isSuperAdmin ? `<button class="btn-secondary btn-sm" onclick="App.restoreChangeRequest('${cr.id}')">Restore</button>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `}`;

            document.getElementById('history-filter')?.addEventListener('change', (e) => { filter = e.target.value; load(); });
        };

        load();
    }
};

const __animIntervals = [];

function animateCounter(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const interval = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(interval); }
        el.textContent = current;
    }, 20);
    __animIntervals.push(interval);
}

function animateCounterValue(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    let current = 0;
    const step = Math.max(1000, Math.floor(target / 40));
    const interval = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(interval); }
        el.textContent = UI.formatCurrency(current);
    }, 20);
    __animIntervals.push(interval);
}

function animatePercentage(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const interval = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(interval); }
        el.textContent = `${current}%`;
    }, 20);
    __animIntervals.push(interval);
}

function clearAnimIntervals() {
    __animIntervals.forEach(clearInterval);
    __animIntervals.length = 0;
}

document.addEventListener('DOMContentLoaded', () => App.init());
