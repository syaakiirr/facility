const App = {
    currentPage: 'dashboard',
    currentCompany: null,

    pages: {
        dashboard: { label: 'Dashboard', icon: 'grid' },
        applications: { label: 'Applications', icon: 'file-text' },
        companies: { label: 'Companies', icon: 'briefcase' },
        banks: { label: 'Banks & BFR', icon: 'building' },
        reports: { label: 'Reports', icon: 'bar-chart' },
        bos_review: { label: 'Bos Review', icon: 'clipboard' },
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
        settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
        users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
        activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
        external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>'
    },

    async init() {
        const session = await Auth.init();
        if (!session) {
            window.location.href = 'pages/login.html';
            return;
        }
        this.renderShell();
        UI.initSidebar();
        // Use hash-based navigation exclusively to avoid double-navigation.
        // Setting the hash fires hashchange which calls navigate() once.
        window.addEventListener('hashchange', () => {
            const page = window.location.hash.slice(1) || 'dashboard';
            if (page !== this.currentPage || !this._navigating) {
                this.navigate(page);
            }
        });
        const initialPage = window.location.hash.slice(1) || 'dashboard';
        this.navigate(initialPage);
    },

    renderShell() {
        const root = document.getElementById('app');
        root.innerHTML = `
            <div class="app-layout">
                <aside class="sidebar" id="sidebar">
                    <div class="sidebar-logo">
                        <div class="sidebar-logo-icon">KF</div>
                        <div class="sidebar-logo-text">Kak Efa<span>Facilities Dashboard</span></div>
                    </div>
                    <nav class="sidebar-nav" id="sidebar-nav">
                        <div class="sidebar-nav-label">Main Menu</div>
                        ${Object.entries(this.pages).map(([key, p]) =>
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

    async navigate(page) {
        if (!this.pages[page]) page = 'dashboard';
        this.currentPage = page;
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
                case 'applications': await this.renderApplications(content); break;
                case 'companies': await this.renderCompanies(content); break;
                case 'banks': await this.renderBanks(content); break;
                case 'reports': await this.renderReports(content); break;
                case 'bos_review': await this.renderBosReview(content); break;
                case 'settings': await this.renderSettings(content); break;
            }
        } catch (err) {
            if (!isCurrent()) return;
            content.innerHTML = `<div class="empty-state"><h3>Error loading page</h3><p>${err.message}</p></div>`;
            console.error(err);
        }
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
                    <div class="pipeline-item">
                        <div class="pipeline-label">Total applications</div>
                        <div class="pipeline-val" id="kpi-total">0</div>
                    </div>
                    <div class="pipeline-item">
                        <div class="pipeline-label">Done</div>
                        <div class="pipeline-val done" id="kpi-done">0</div>
                    </div>
                    <div class="pipeline-item">
                        <div class="pipeline-label">In progress</div>
                        <div class="pipeline-val progress" id="kpi-progress">0</div>
                    </div>
                    <div class="pipeline-item ${showInsightAlert ? 'active-declined' : ''}">
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

            <div class="card" style="margin-bottom:24px">
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
                            <div class="legend-item">
                                <div class="legend-head"><span class="legend-dot done"></span>Done</div>
                                <div class="legend-pct">${donePct}%</div>
                            </div>
                            <div class="legend-item">
                                <div class="legend-head"><span class="legend-dot progress"></span>In progress</div>
                                <div class="legend-pct">${inProgressPct}%</div>
                            </div>
                            <div class="legend-item">
                                <div class="legend-head"><span class="legend-dot hold"></span>Hold</div>
                                <div class="legend-pct">${holdPct}%</div>
                            </div>
                            <div class="legend-item">
                                <div class="legend-head"><span class="legend-dot declined"></span>Declined</div>
                                <div class="legend-pct">${declinedPct}%</div>
                            </div>
                            <div class="legend-item">
                                <div class="legend-head"><span class="legend-dot pending"></span>Pending</div>
                                <div class="legend-pct">${pendingPct}%</div>
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
                            <div class="bank-bar-row">
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
                            <div class="company-bar-row">
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
                    <div class="bank-bar-row">
                        <div class="bank-bar-name">${name}</div>
                        <div class="bank-bar-track"><div class="bank-bar-fill" style="width:${pct}%"></div></div>
                        <div class="bank-bar-count">${count}</div>
                    </div>`;
                }).join('');
            }
            e.target.textContent = isBanksExpanded ? 'Show less' : `Show ${remainingBanksCount} more banks`;
        });

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


    async renderApplications(el) {
        const banks = await DB.fetchBanks();
        const bankNames = banks.map(b => b.name);
        const stats = await DB.getDashboardStats();
        const companies = Object.keys(stats.companyTotals).sort();

        el.innerHTML = `
            <p class="page-subtitle">Manage all financing applications</p>
            <div class="filter-bar">
                <input type="text" id="app-search" placeholder="Search company or bank..." />
                <select id="filter-status"><option value="">All Status</option>
                    <option>DONE</option><option>IN PROGRESS</option><option>PENDING</option><option>ON HOLD</option><option>HOLD</option><option>REVIEW BY BOS</option>
                    <option>PREPARATION DOC BY FINANCE</option><option>SUBMISSION DOC TO BANK</option>
                    <option>DECLINED</option><option>DECLINED BY BANK</option><option>DECLINED BY COMPANY</option>
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
                                    <input list="company-list" name="company" placeholder="Company name" required />
                                    <datalist id="company-list">${companies.map(c => `<option value="${c}"></option>`).join('')}</datalist>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group"><label>Year</label><input type="number" name="year_application" placeholder="2026" /></div>
                                <div class="form-group"><label>Bank</label>
                                    <select name="bank"><option value="">Select bank</option>${bankNames.map(b => `<option>${b}</option>`).join('')}</select>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group"><label>BFR (%)</label><input name="bfr" placeholder="6.40" /></div>
                                <div class="form-group"><label>Type of Facility</label>
                                    <select name="type_facility"><option value="">Select type</option>
                                        <option>TERM LOAN</option><option>OVERDRAFT</option><option>LETTER OF CREDIT</option>
                                        <option>CAPITAL FINANCING</option><option>ASSET FINANCING</option><option>COLLABORATIVE FINANCING</option>
                                        <option>TARGETED RELIEF & RECOVERY</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group"><label>Name of Facility</label><input name="name_facility" placeholder="Product name" /></div>
                            <div class="form-row">
                                <div class="form-group"><label>Collateral</label><input name="collateral" placeholder="e.g. 80% SJPP" /></div>
                                <div class="form-group"><label>Profit Rate</label><input name="profit_rate" placeholder="e.g. BFR + 1%" /></div>
                            </div>
                            <div class="form-row">
                                <div class="form-group"><label>Rate / Tenure</label><input name="rate_tenure" placeholder="e.g. 7 YEARS" /></div>
                                <div class="form-group"><label>Status</label>
                                    <select name="status" required>
                                        <option>IN PROGRESS</option><option>DONE</option><option>PENDING</option><option>ON HOLD</option><option>HOLD</option>
                                        <option>REVIEW BY BOS</option>
                                        <option>PREPARATION DOC BY FINANCE</option><option>SUBMISSION DOC TO BANK</option>
                                        <option>DECLINED</option><option>DECLINED BY BANK</option><option>DECLINED BY COMPANY</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group"><label>Application Details</label><textarea name="app_details" rows="2"></textarea></div>
                            <div class="form-row">
                                <div class="form-group"><label>Property Detail</label><input name="property_detail" placeholder="Only for Property category" /></div>
                            </div>
                            <div class="form-row">
                                <div class="form-group"><label>Date Doc Sent</label><input type="date" name="date_doc_sent" /></div>
                                <div class="form-group"><label>Date Follow Up</label><input type="date" name="date_followup" /></div>
                            </div>
                            <div class="form-row">
                                <div class="form-group"><label>Total Requested (RM)</label><input type="number" name="total_requested" step="0.01" /></div>
                                <div class="form-group"><label>Total Approved (RM)</label><input type="number" name="total_approved" step="0.01" /></div>
                            </div>
                            <div class="form-group"><label>Fixed Deposit (FD)</label><input name="fixed_deposit" placeholder="e.g. RM 100,000" /></div>
                            <div class="form-group" id="hold-reason-group" style="display:none">
                                <label>Hold Reason</label>
                                <input name="hold_reason" placeholder="Why is this on hold?" />
                            </div>
                            <div class="form-group" id="decline-reason-group" style="display:none">
                                <label>Decline Reason</label>
                                <input name="decline_reason" placeholder="Why was this declined?" />
                            </div>
                            <div class="form-group"><label>Notes</label><textarea name="notes" rows="2"></textarea></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn-secondary" onclick="UI.closeModal('modal-app')">Cancel</button>
                            <button type="submit" class="btn-primary" id="btn-save-app">Save Application</button>
                        </div>
                    </form>
                </div>
            </div>`;

        let editingId = null;
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

            const apps = await DB.fetchApplications(filters);
            const container = document.getElementById('apps-table-container');
            container.innerHTML = '';
            const table = UI.renderTable(apps,
                [
                    { label: 'Company', render: (v, r) => `<strong style="color:var(--text-1)">${r.company || '-'}</strong>` },
                    { label: 'Bank', render: (v, r) => r.bank || '-' },
                    { label: 'Type', render: (v, r) => `<span style="font-size:11px">${r.type_facility || '-'}</span>` },
                    { label: 'Facility', render: (v, r) => r.name_facility || '-' },
                    { label: 'Requested', render: (v, r) => `<span style="font-family:var(--font-mono);font-size:11.5px">${UI.formatCurrency(r.total_requested)}</span>` },
                    { label: 'Approved', render: (v, r) => `<span style="font-family:var(--font-mono);font-size:11.5px;color:var(--green);font-weight:600">${UI.formatCurrency(r.total_approved)}</span>` },
                    { label: 'FD Deposit', render: (v, r) => r.fixed_deposit ? `<span style="font-family:var(--font-mono);font-size:11px">${r.fixed_deposit}</span>` : '-' },
                    { label: 'Status', render: (v, r) => UI.statusBadge(r.status) },
                    { label: 'Reason', render: (v, r) => {
                        if (['ON HOLD','HOLD','PENDING','PREPARATION DOC BY FINANCE','SUBMISSION DOC TO BANK'].includes(r.status)) return r.hold_reason || '-';
                        if (['DECLINED','DECLINED BY BANK','DECLINED BY COMPANY'].includes(r.status)) return r.decline_reason || '-';
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
                    delBtn.onclick = () => deleteApp(row.id);
                    div.appendChild(viewBtn);
                    div.appendChild(editBtn);
                    if (row.status === 'HOLD' || row.status === 'PENDING') {
                        const bosBtn = document.createElement('button');
                        bosBtn.className = 'btn-primary btn-xs';
                        bosBtn.textContent = 'Bos';
                        bosBtn.title = 'Send to Bos Review';
                        bosBtn.onclick = () => sendToBos(row);
                        div.appendChild(bosBtn);
                    }
                    div.appendChild(delBtn);
                    return div;
                }
            );
        container.innerHTML = '';
        container.appendChild(table);
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
                            <div class="detail-group"><div class="detail-label">Rate / Tenure</div><div class="detail-value">${row.rate_tenure || '-'}</div></div>
                        </div>
                        <div class="detail-section">Dates</div>
                        <div class="detail-grid">
                            <div class="detail-group"><div class="detail-label">Year</div><div class="detail-value">${row.year_application || '-'}</div></div>
                            <div class="detail-group"><div class="detail-label">Date Doc Sent</div><div class="detail-value">${row.date_doc_sent ? UI.formatDate(row.date_doc_sent) : '-'}</div></div>
                            <div class="detail-group"><div class="detail-label">Date Follow Up</div><div class="detail-value">${row.date_followup ? UI.formatDate(row.date_followup) : '-'}</div></div>
                            <div class="detail-group"><div class="detail-label">Last Updated</div><div class="detail-value">${row.date_updated ? UI.formatDate(row.date_updated) : '-'}</div></div>
                        </div>
                        ${row.category === 'PROPERTY' ? `
                        <div class="detail-section">Property</div>
                        <div class="detail-grid">
                            <div class="detail-group"><div class="detail-label">Property Detail</div><div class="detail-value">${row.property_detail || '-'}</div></div>
                        </div>` : ''}
                        ${(() => {
                            const isDeclined = row.status === 'DECLINED' || row.status === 'DECLINED BY BANK' || row.status === 'DECLINED BY COMPANY';
                            const holdStatuses = ['ON HOLD','HOLD','PENDING','PREPARATION DOC BY FINANCE','SUBMISSION DOC TO BANK'];
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
                            return '';
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
        };

        const openEditModal = async (row) => {
            editingId = row.id;
            document.getElementById('modal-app-title').textContent = 'Edit Application';
            document.getElementById('btn-save-app').textContent = 'Update Application';
            UI.setFormData('app-form', row);
            const statusSelect = document.querySelector('#app-form [name="status"]');
            statusSelect.dispatchEvent(new Event('change'));
            UI.openModal('modal-app');
        };

        const deleteApp = async (id) => {
            const confirmed = await UI.confirmDialog('Are you sure you want to delete this application? This action cannot be undone.', 'Delete Application');
            if (!confirmed) return;
            try {
                await DB.deleteApplication(id);
                UI.showToast('Application deleted successfully', 'success');
                loadApps();
            } catch (err) {
                UI.showToast('Error deleting: ' + err.message, 'error');
            }
        };

        const sendToBos = async (row) => {
            const confirmed = await UI.confirmDialog(`Send "${row.company} - ${row.type_facility}" to Bos Review? This will navigate to the Bos Review page.`, 'Send to Bos');
            if (!confirmed) return;
            const banks = await DB.fetchBanks();
            const bankNames = banks.map(b => b.name);
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay open';
            overlay.innerHTML = `
                <div class="modal" style="max-width:480px">
                    <div class="modal-header">
                        <h2>Send to Bos Review</h2>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                    </div>
                    <form id="bos-send-form" onsubmit="return false">
                        <div class="modal-body">
                            <div class="form-group"><label>Bank</label>
                                <select name="bank_name" required>
                                    <option value="">Select bank</option>
                                    ${bankNames.map(b => `<option ${b === row.bank ? 'selected' : ''}>${b}</option>`).join('')}
                                </select>
                            </div>
                            <div class="form-row">
                                <div class="form-group"><label>Type of Facility</label><input name="type_facility" value="${row.type_facility || ''}" required /></div>
                                <div class="form-group"><label>Name of Facility</label><input name="name_facility" value="${row.name_facility || ''}" /></div>
                            </div>
                            <div class="form-row">
                                <div class="form-group"><label>Profit Rate</label><input name="profit_rate" value="${row.profit_rate || ''}" /></div>
                                <div class="form-group"><label>Tenure</label><input name="tenure" value="${row.rate_tenure || ''}" /></div>
                            </div>
                            <div class="form-row">
                                <div class="form-group"><label>Collateral</label><input name="collateral" value="${row.collateral || ''}" /></div>
                                <div class="form-group"><label>Total Offered (RM)</label><input type="number" name="total_offered" step="0.01" /></div>
                            </div>
                            <div class="form-group"><label>Notes</label><textarea name="notes" rows="2">From application: ${row.app_details || ''}</textarea></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                            <button type="submit" class="btn-primary" id="btn-send-bos">Send to Bos</button>
                        </div>
                    </form>
                </div>`;
            document.body.appendChild(overlay);
            document.getElementById('bos-send-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const data = UI.getFormData('bos-send-form');
                const btn = document.getElementById('btn-send-bos');
                btn.disabled = true;
                btn.textContent = 'Sending...';
                try {
                    data.status = 'PENDING REVIEW';
                    await DB.insertBosReview(data);
                    await DB.updateApplication(row.id, { status: 'REVIEW BY BOS' });
                    UI.showToast('Sent to Bos Review', 'success');
                    overlay.remove();
                    window.location.hash = 'bos_review';
                } catch (err) { UI.showToast('Error: ' + err.message, 'error'); }
                btn.disabled = false;
                btn.textContent = 'Send to Bos';
            });
        };

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
            'HOLD': 30,
            'REVIEW BY BOS': 80,
            'PREPARATION DOC BY FINANCE': 20,
            'SUBMISSION DOC TO BANK': 70,
            'DECLINED': 0,
            'DECLINED BY BANK': 0,
            'DECLINED BY COMPANY': 0
        };
        document.querySelector('#app-form [name="status"]').addEventListener('change', (e) => {
            const isHold = e.target.value === 'ON HOLD' || e.target.value === 'HOLD' || e.target.value === 'PENDING' || e.target.value === 'PREPARATION DOC BY FINANCE' || e.target.value === 'SUBMISSION DOC TO BANK';
            const isDeclined = e.target.value === 'DECLINED' || e.target.value === 'DECLINED BY BANK' || e.target.value === 'DECLINED BY COMPANY';
            document.getElementById('hold-reason-group').style.display = isHold ? '' : 'none';
            document.getElementById('decline-reason-group').style.display = isDeclined ? '' : 'none';
        });

        document.getElementById('btn-add-app').addEventListener('click', () => {
            editingId = null;
            document.getElementById('modal-app-title').textContent = 'New Application';
            document.getElementById('btn-save-app').textContent = 'Save Application';
            UI.resetForm('app-form');
            UI.openModal('modal-app');
        });

        document.getElementById('app-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = UI.getFormData('app-form');
            data.progress = progressMap[data.status] !== undefined ? progressMap[data.status] : 0;
            const btn = document.getElementById('btn-save-app');
            btn.disabled = true;
            btn.textContent = 'Saving...';
            try {
                if (editingId) {
                    await DB.updateApplication(editingId, data);
                    UI.showToast('Application updated successfully', 'success');
                } else {
                    await DB.insertApplication(data);
                    UI.showToast('Application added successfully', 'success');
                }
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

        loadApps();
    },

    async renderCompanies(el) {
        const stats = await DB.getDashboardStats();
        const entries = Object.entries(stats.companyTotals || {}).sort((a, b) => a[0].localeCompare(b[0]));
        const totalRequested = entries.reduce((s, [, d]) => s + d.requested, 0);
        const totalApproved = entries.reduce((s, [, d]) => s + d.approved, 0);

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
            </div>

            <div class="company-card-grid" id="company-grid">
                ${entries.map(([name, data]) => {
                    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'CO';
                    const successRate = data.requested > 0 ? Math.round((data.approved / data.requested) * 100) : (data.done > 0 ? 100 : 0);
                    return `
                    <div class="company-card" data-company="${name}">
                        <div class="company-card-top">
                            <div class="avatar-badge">${initials}</div>
                            <div class="company-card-meta">
                                <div class="company-card-title">${name}</div>
                                <div class="company-card-sub">${data.done} Approved / ${(data.done + data.pending + data.declined)} Apps</div>
                            </div>
                            <span class="badge ${successRate >= 50 ? 'done' : 'progress'}">${successRate}%</span>
                        </div>
                        <div class="company-card-stats">
                            <div class="company-stat-item">
                                <span class="company-stat-label">Requested</span>
                                <span class="company-stat-val">${UI.formatCurrency(data.requested)}</span>
                            </div>
                            <div class="company-stat-item" style="text-align:right">
                                <span class="company-stat-label">Approved</span>
                                <span class="company-stat-val" style="color:var(--green)">${UI.formatCurrency(data.approved)}</span>
                            </div>
                        </div>
                    </div>`;
                }).join('')}
            </div>`;

        document.getElementById('company-search')?.addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase();
            document.querySelectorAll('.company-card').forEach(card => {
                const name = card.dataset.company.toLowerCase();
                card.style.display = name.includes(q) ? '' : 'none';
            });
        });

        document.querySelectorAll('.company-card').forEach(card => {
            card.addEventListener('click', () => {
                const company = card.dataset.company;
                window.location.hash = 'applications';
                setTimeout(() => {
                    const searchField = document.getElementById('app-search');
                    if (searchField) {
                        searchField.value = company;
                        searchField.dispatchEvent(new Event('input'));
                    }
                }, 100);
            });
        });
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
                await DB.deleteBank(row.id);
                UI.showToast('Bank deleted successfully', 'success');
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
                if (editingBankId) {
                    await DB.updateBank(editingBankId, data);
                    UI.showToast('Bank updated successfully', 'success');
                } else {
                    await DB.insertBank(data);
                    UI.showToast('Bank added successfully', 'success');
                }
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

    async renderReports(el) {
        const stats = await DB.getDashboardStats();
        const { bankStats } = await DB.getBankStats(stats.apps);
        const overallRate = stats.totalRequested > 0 ? Math.round((stats.totalApproved / stats.totalRequested) * 100) : 0;
        const stuckCount = stats.stuckApps ? stats.stuckApps.length : 0;
        const hasRiskConcentration = stats.topCompanyRisk && stats.topCompanyRisk.percent > 30;

        el.innerHTML = `
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
                        There are ${stuckCount} financing applications under active processing for over 14 days without decision updates. Review bottleneck items below.
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

            <div class="report-summary-grid" style="grid-template-columns:repeat(5,1fr)">
                <div class="report-summary-card">
                    <div class="report-summary-label">Total Applications</div>
                    <div class="report-summary-val">${stats.total}</div>
                </div>
                <div class="report-summary-card">
                    <div class="report-summary-label">Average SLA Turnaround</div>
                    <div class="report-summary-val">${stats.avgSlaDays} <span style="font-size:12px;font-weight:500;color:var(--text-3)">days</span></div>
                </div>
                <div class="report-summary-card">
                    <div class="report-summary-label">Total Requested</div>
                    <div class="report-summary-val">${UI.formatCurrency(stats.totalRequested)}</div>
                </div>
                <div class="report-summary-card">
                    <div class="report-summary-label">Total Approved</div>
                    <div class="report-summary-val" style="color:var(--green)">${UI.formatCurrency(stats.totalApproved)}</div>
                </div>
                <div class="report-summary-card">
                    <div class="report-summary-label">Overall Approval Rate</div>
                    <div class="report-summary-val">${overallRate}%</div>
                </div>
            </div>

            <div class="grid-2" style="margin-bottom:24px">
                <div class="card"><div class="card-header"><div class="card-header-title">Applications Trend by Year</div></div><div class="card-body"><div class="chart-container" id="chart-year"></div></div></div>
                <div class="card"><div class="card-header"><div class="card-header-title">Facility Type Distribution</div></div><div class="card-body"><div class="chart-container" id="chart-facility"></div></div></div>
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
            ` : ''}`;

        Charts.barYearTrend('chart-year', stats.yearCounts);
        Charts.donutFacility('chart-facility', stats.facilityCounts);

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

        // Export Board-Ready One-Pager PDF Handler (tasteskill.dev White Corporate PDF Format)
        document.getElementById('btn-export-pdf').addEventListener('click', async () => {
            try {
                const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
                const printWin = window.open('', '_blank');
                
                const top5Banks = entries.slice(0, 5);
                const bankRowsHtml = top5Banks.map(([name, s]) => {
                    const succRate = s.count > 0 ? Math.round((s.done / s.count) * 100) : 0;
                    const apprRate = s.requested > 0 ? Math.round((s.approved / s.requested) * 100) : 0;
                    return `
                    <tr>
                        <td><strong>${name}</strong></td>
                        <td class="mono" style="text-align:center">${s.count}</td>
                        <td class="mono" style="text-align:center;color:#16a34a">${s.done}</td>
                        <td class="mono" style="text-align:center;color:#dc2626">${s.declined}</td>
                        <td class="mono" style="text-align:center;font-weight:600">${s.avgSla || 10}d</td>
                        <td style="text-align:center"><span class="badge ${succRate >= 50 ? 'badge-green' : 'badge-blue'}">${succRate}%</span></td>
                        <td class="mono" style="text-align:right">${UI.formatCurrency(s.requested)}</td>
                        <td class="mono" style="text-align:right;color:#16a34a;font-weight:600">${UI.formatCurrency(s.approved)}</td>
                        <td class="mono" style="text-align:right;font-weight:600">${apprRate}%</td>
                    </tr>`;
                }).join('');

                const monthlyEntries = Object.entries(stats.monthlyCounts || {});
                const monthlyRowsHtml = monthlyEntries.map(([mName, m]) => {
                    const rate = m.requested > 0 ? Math.round((m.approved / m.requested) * 100) : 0;
                    return `
                    <tr>
                        <td><strong>${mName}</strong></td>
                        <td class="mono" style="text-align:center">${m.total}</td>
                        <td class="mono" style="text-align:center;color:#16a34a">${m.done}</td>
                        <td class="mono" style="text-align:center;color:#dc2626">${m.declined}</td>
                        <td class="mono" style="text-align:right">${UI.formatCurrency(m.requested)}</td>
                        <td class="mono" style="text-align:right;color:#16a34a">${UI.formatCurrency(m.approved)}</td>
                        <td class="mono" style="text-align:right;font-weight:600">${rate}%</td>
                    </tr>`;
                }).join('');

                printWin.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Executive_Board_Report_${new Date().toISOString().slice(0, 10)}</title>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap');
                        * { box-sizing: border-box; margin: 0; padding: 0; }
                        body {
                            font-family: 'Inter', system-ui, sans-serif;
                            color: #0f172a;
                            background: #ffffff;
                            padding: 28px 32px;
                            font-size: 11.5px;
                            line-height: 1.45;
                        }
                        .page-break { page-break-after: always; }
                        .report-header {
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-start;
                            padding-bottom: 14px;
                            border-bottom: 2px solid #0f172a;
                            margin-bottom: 18px;
                        }
                        .brand-title {
                            font-size: 20px;
                            font-weight: 800;
                            color: #0f172a;
                            letter-spacing: -0.02em;
                        }
                        .report-subtitle {
                            font-size: 10.5px;
                            font-weight: 700;
                            color: #2563eb;
                            text-transform: uppercase;
                            letter-spacing: 0.08em;
                            margin-top: 2px;
                        }
                        .meta-box {
                            text-align: right;
                            font-size: 11px;
                            color: #475569;
                        }
                        .meta-date {
                            font-family: 'JetBrains Mono', monospace;
                            font-weight: 600;
                            color: #0f172a;
                        }
                        .board-alert-banner {
                            background: #fef2f2;
                            border: 1px solid #fecaca;
                            border-radius: 6px;
                            padding: 10px 14px;
                            margin-bottom: 16px;
                            font-size: 11.5px;
                            color: #991b1b;
                        }
                        .board-alert-title {
                            font-weight: 700;
                            margin-bottom: 2px;
                        }
                        .section-title {
                            font-size: 12px;
                            font-weight: 800;
                            color: #0f172a;
                            text-transform: uppercase;
                            letter-spacing: 0.05em;
                            margin-bottom: 10px;
                            margin-top: 16px;
                        }
                        .metrics-grid {
                            display: grid;
                            grid-template-columns: repeat(4, 1fr);
                            gap: 10px;
                            margin-bottom: 18px;
                        }
                        .metric-card {
                            border: 1px solid #e2e8f0;
                            border-radius: 6px;
                            padding: 12px 14px;
                            background: #f8fafc;
                        }
                        .metric-label {
                            font-size: 10px;
                            font-weight: 700;
                            color: #64748b;
                            text-transform: uppercase;
                            letter-spacing: 0.05em;
                        }
                        .metric-val {
                            font-size: 18px;
                            font-weight: 800;
                            color: #0f172a;
                            font-family: 'JetBrains Mono', monospace;
                            margin-top: 2px;
                        }
                        .metric-delta {
                            font-size: 10px;
                            color: #16a34a;
                            font-weight: 600;
                            margin-top: 2px;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            font-size: 11px;
                            margin-bottom: 18px;
                        }
                        th {
                            background: #f1f5f9;
                            color: #334155;
                            font-weight: 700;
                            font-size: 10px;
                            text-transform: uppercase;
                            letter-spacing: 0.05em;
                            padding: 7px 9px;
                            text-align: left;
                            border-bottom: 1px solid #cbd5e1;
                        }
                        td {
                            padding: 7px 9px;
                            border-bottom: 1px solid #e2e8f0;
                            color: #1e293b;
                        }
                        tr:nth-child(even) td {
                            background: #fafbfc;
                        }
                        .mono {
                            font-family: 'JetBrains Mono', monospace;
                        }
                        .badge {
                            display: inline-block;
                            padding: 2px 7px;
                            border-radius: 10px;
                            font-size: 10px;
                            font-weight: 700;
                            font-family: 'JetBrains Mono', monospace;
                        }
                        .badge-green { background: #dcfce7; color: #15803d; }
                        .badge-blue { background: #dbeafe; color: #1e40af; }
                        .footer {
                            margin-top: 24px;
                            padding-top: 10px;
                            border-top: 1px solid #e2e8f0;
                            display: flex;
                            justify-content: space-between;
                            font-size: 10px;
                            color: #94a3b8;
                        }
                        @media print {
                            body { padding: 10px; }
                        }
                    </style>
                </head>
                <body>
                    <!-- PAGE 1: BOARD-READY ONE-PAGER -->
                    <div class="report-header">
                        <div>
                            <div class="brand-title">KAK EFA FACILITIES MANAGEMENT</div>
                            <div class="report-subtitle">Board-Ready Executive Summary (One-Pager)</div>
                        </div>
                        <div class="meta-box">
                            <div>Date Generated: <span class="meta-date">${dateStr}</span></div>
                            <div>Classification: <strong>Board Confidential</strong></div>
                        </div>
                    </div>

                    ${hasRiskConcentration ? `
                    <div class="board-alert-banner">
                        <div class="board-alert-title">🚨 Portfolio Risk Concentration Warning (>30% Exposure)</div>
                        <div><strong>${stats.topCompanyRisk.name}</strong> accounts for <strong>${stats.topCompanyRisk.percent}%</strong> (${UI.formatCurrency(stats.topCompanyRisk.requested)}) of total requested financing portfolio exposure.</div>
                    </div>
                    ` : ''}

                    <div class="section-title">Key Executive Metrics</div>
                    <div class="metrics-grid">
                        <div class="metric-card">
                            <div class="metric-label">Total Applications</div>
                            <div class="metric-val">${stats.total}</div>
                            <div class="metric-delta">All active entries</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-label">Average SLA Turnaround</div>
                            <div class="metric-val">${stats.avgSlaDays} <span style="font-size:11px">days</span></div>
                            <div class="metric-delta" style="color:#2563eb">● Processing duration</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-label">Total Approved</div>
                            <div class="metric-val" style="color:#16a34a">${UI.formatCurrency(stats.totalApproved)}</div>
                            <div class="metric-delta">● ${overallRate}% approval ratio</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-label">Total Requested</div>
                            <div class="metric-val">${UI.formatCurrency(stats.totalRequested)}</div>
                            <div class="metric-delta" style="color:#64748b">Portfolio Exposure</div>
                        </div>
                    </div>

                    <div class="section-title">Top Partner Bank SLA & Performance Ranking</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Bank Name</th>
                                <th style="text-align:center">Apps</th>
                                <th style="text-align:center">Done</th>
                                <th style="text-align:center">Declined</th>
                                <th style="text-align:center">SLA</th>
                                <th style="text-align:center">Success</th>
                                <th style="text-align:right">Total Requested</th>
                                <th style="text-align:right">Total Approved</th>
                                <th style="text-align:right">Approval %</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${bankRowsHtml}
                        </tbody>
                    </table>

                    <div class="footer">
                        <div>Kak Efa Facilities Management — Board Executive Summary</div>
                        <div>Page 1 of 2 (Board One-Pager)</div>
                    </div>

                    <div class="page-break"></div>

                    <!-- PAGE 2: DETAILED MONTHLY TRAJECTORY & BOTTLENECK ANALYSIS -->
                    <div class="report-header">
                        <div>
                            <div class="brand-title">KAK EFA FACILITIES MANAGEMENT</div>
                            <div class="report-subtitle">Monthly Trajectory & Bottleneck Analysis</div>
                        </div>
                        <div class="meta-box">
                            <div>Date Generated: <span class="meta-date">${dateStr}</span></div>
                            <div>Classification: <strong>Board Confidential</strong></div>
                        </div>
                    </div>

                    <div class="section-title">Monthly Performance Trajectory</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th style="text-align:center">Applications</th>
                                <th style="text-align:center">Done</th>
                                <th style="text-align:center">Declined</th>
                                <th style="text-align:right">Requested (RM)</th>
                                <th style="text-align:right">Approved (RM)</th>
                                <th style="text-align:right">Approval %</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${monthlyRowsHtml}
                        </tbody>
                    </table>

                    ${stuckCount > 0 ? `
                    <div class="section-title" style="color:#d97706">Bottleneck Applications (>14 Days Stuck Without Updates)</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Bank</th>
                                <th>Facility</th>
                                <th>Status</th>
                                <th style="text-align:center">Days Stuck</th>
                                <th style="text-align:right">Requested (RM)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${stats.stuckApps.map(a => `
                            <tr>
                                <td><strong>${a.company || '-'}</strong></td>
                                <td>${a.bank || '-'}</td>
                                <td>${a.name_facility || a.type_facility || '-'}</td>
                                <td><span class="badge badge-blue">${a.status}</span></td>
                                <td class="mono" style="text-align:center;color:#d97706;font-weight:700">${a.days_stuck}d</td>
                                <td class="mono" style="text-align:right">${UI.formatCurrency(a.total_requested)}</td>
                            </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    ` : ''}

                    <div class="footer">
                        <div>Kak Efa Facilities Management — Detailed Monthly Report</div>
                        <div>Page 2 of 2</div>
                    </div>
                </body>
                </html>
                `);
                printWin.document.close();
                setTimeout(() => {
                    printWin.print();
                }, 400);
                UI.showToast('Board-ready PDF report generated', 'success');
            } catch (err) {
                UI.showToast('PDF error: ' + err.message, 'error');
            }
        });

        document.getElementById('btn-export-csv').addEventListener('click', async () => {
            try {
                const apps = await DB.fetchApplications();
                const headers = ['Company', 'Year', 'Bank', 'BFR', 'Type', 'Facility', 'Status', 'Requested', 'Approved', 'Progress', 'Decline Reason'];
                const rows = apps.map(a => [
                    a.company, a.year_application, a.bank, a.bfr, a.type_facility, a.name_facility,
                    a.status, a.total_requested, a.total_approved, a.progress, a.decline_reason
                ]);
                const csv = [headers.join(','), ...rows.map(r => r.map(v => UI.csvEscape(v)).join(','))].join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `kakefa_export_${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                URL.revokeObjectURL(url);
                UI.showToast('Data exported successfully', 'success');
            } catch (err) {
                UI.showToast('Export error: ' + err.message, 'error');
            }
        });
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
                <div class="card-header"><div class="card-header-title">User Account Management</div></div>
                <div class="card-body" id="admin-user-list">
                    <div class="skeleton" style="height:44px;border-radius:8px;margin-bottom:8px"></div>
                    <div class="skeleton" style="height:44px;border-radius:8px"></div>
                </div>
            </div>
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
            this.loadAdminUsers();
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
                a.download = `kakefa_export_${new Date().toISOString().slice(0,10)}.csv`;
                a.click();
                URL.revokeObjectURL(url);
                UI.showToast('Data exported successfully','success');
            } catch(err) { UI.showToast('Export error: ' + err.message, 'error'); }
        });
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
        let bosEditingId = null;

        const openBosModal = (row) => {
            bosEditingId = row?.id || null;
            document.getElementById('modal-bos-title').textContent = row ? 'Edit Proposal' : 'New Proposal';
            document.getElementById('btn-save-bos').textContent = row ? 'Update Proposal' : 'Save Proposal';
            if (row) UI.setFormData('bos-form', row);
            else UI.resetForm('bos-form');
            UI.openModal('modal-bos');
        };

        App.updateBosStatus = async (id, status) => {
            try {
                await DB.updateBosReview(id, { status });
                UI.showToast(`Proposal ${status}`, 'success');
                loadBos();
            } catch (err) { UI.showToast('Error: ' + err.message, 'error'); }
        };

        App.editBosReview = async (id) => {
            const reviews = await DB.fetchBosReviews();
            const row = reviews.find(r => r.id === id);
            if (row) openBosModal(row);
        };

        App.deleteBosReview = async (id) => {
            const confirmed = await UI.confirmDialog('Delete this proposal?', 'Delete Proposal');
            if (!confirmed) return;
            try {
                await DB.deleteBosReview(id);
                UI.showToast('Proposal deleted', 'success');
                loadBos();
            } catch (err) { UI.showToast('Error: ' + err.message, 'error'); }
        };

        const loadBos = async () => {
            const reviews = await DB.fetchBosReviews();
            const pendingCount = reviews.filter(r => (r.status || 'PENDING REVIEW') === 'PENDING REVIEW').length;

            el.innerHTML = `
            <div class="module-header-bar">
                <div class="module-title-wrap">
                    <h2>Boss Review Proposals</h2>
                    <p>Bank facility proposals awaiting management evaluation and approval decision</p>
                </div>
                <div class="summary-pills-bar">
                    <div class="pill-stat">
                        <span class="pill-stat-label">Total Proposals</span>
                        <span class="pill-stat-val">${reviews.length}</span>
                    </div>
                    <div class="pill-stat">
                        <span class="pill-stat-label">Pending Review</span>
                        <span class="pill-stat-val" style="color:var(--amber)">${pendingCount}</span>
                    </div>
                    <button class="btn-primary" id="btn-add-bos">${this.icons.plus} Add Proposal</button>
                </div>
            </div>

            ${reviews.length === 0 ? `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <h3>No proposals to review</h3>
                    <p>All financing proposals have been reviewed and decided.</p>
                </div>
            ` : `
                <div class="bos-card-grid">
                    ${reviews.map(r => `
                        <div class="bos-card">
                            <div class="bos-card-header">
                                <div>
                                    <div class="bos-card-title">${r.bank_name || 'Bank'} — ${r.type_facility || 'Facility'}</div>
                                    <div class="bos-card-company">${r.name_facility || 'Standard Facility'}</div>
                                </div>
                                <span class="badge ${(r.status || 'PENDING REVIEW') === 'APPROVED' ? 'done' : (r.status || 'PENDING REVIEW') === 'REJECTED' ? 'declined' : 'hold'}">
                                    <span class="badge-dot"></span>${r.status || 'PENDING REVIEW'}
                                </span>
                            </div>

                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px;padding:8px 0">
                                <div><span style="color:var(--text-3);display:block;font-size:11px;text-transform:uppercase">Offered Amount</span><strong style="color:var(--green);font-family:var(--font-mono);font-size:13px">${UI.formatCurrency(r.total_offered)}</strong></div>
                                <div><span style="color:var(--text-3);display:block;font-size:11px;text-transform:uppercase">Loan Limit</span><strong style="font-family:var(--font-mono);font-size:13px">${r.loan_limit || '-'}</strong></div>
                                <div><span style="color:var(--text-3);display:block;font-size:11px;text-transform:uppercase">Profit Rate</span><span>${r.profit_rate || '-'}</span></div>
                                <div><span style="color:var(--text-3);display:block;font-size:11px;text-transform:uppercase">Tenure</span><span>${r.tenure || '-'}</span></div>
                            </div>

                            ${r.notes ? `<div class="bos-notes-box">${r.notes}</div>` : ''}

                            <div class="bos-card-actions">
                                ${(r.status || 'PENDING REVIEW') === 'PENDING REVIEW' ? `
                                    <button class="btn-primary btn-sm" onclick="App.updateBosStatus('${r.id}','APPROVED')">Approve</button>
                                    <button class="btn-danger btn-sm" onclick="App.updateBosStatus('${r.id}','REJECTED')">Reject</button>
                                ` : ''}
                                <button class="btn-secondary btn-sm" onclick="App.editBosReview('${r.id}')">${this.icons.edit} Edit</button>
                                <button class="btn-danger btn-sm" onclick="App.deleteBosReview('${r.id}')">${this.icons.trash}</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `}

            <div class="modal-overlay" id="modal-bos">
                <div class="modal">
                    <div class="modal-header">
                        <h2 id="modal-bos-title">New Proposal</h2>
                        <button class="modal-close" onclick="UI.closeModal('modal-bos')">&times;</button>
                    </div>
                    <form id="bos-form" onsubmit="return false">
                        <div class="modal-body">
                            <div class="form-row">
                                <div class="form-group"><label>Bank Name</label><input name="bank_name" required /></div>
                                <div class="form-group"><label>Type of Facility</label><input name="type_facility" required /></div>
                            </div>
                            <div class="form-row">
                                <div class="form-group"><label>Name of Facility</label><input name="name_facility" /></div>
                                <div class="form-group"><label>Loan Limit</label><input name="loan_limit" /></div>
                            </div>
                            <div class="form-row">
                                <div class="form-group"><label>Profit Rate</label><input name="profit_rate" /></div>
                                <div class="form-group"><label>Tenure</label><input name="tenure" /></div>
                            </div>
                            <div class="form-row">
                                <div class="form-group"><label>Collateral</label><input name="collateral" /></div>
                                <div class="form-group"><label>Takaful</label><input name="takaful" /></div>
                            </div>
                            <div class="form-row">
                                <div class="form-group"><label>Legal Fee</label><input name="legal_fee" /></div>
                                <div class="form-group"><label>Total Offered (RM)</label><input type="number" name="total_offered" step="0.01" /></div>
                            </div>
                            <div class="form-group"><label>Status</label>
                                <select name="status">
                                    <option>PENDING REVIEW</option>
                                    <option>APPROVED</option>
                                    <option>REJECTED</option>
                                </select>
                            </div>
                            <div class="form-group"><label>Notes</label><textarea name="notes" rows="3"></textarea></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn-secondary" onclick="UI.closeModal('modal-bos')">Cancel</button>
                            <button type="submit" class="btn-primary" id="btn-save-bos">Save Proposal</button>
                        </div>
                    </form>
                </div>
            </div>`;

            document.getElementById('btn-add-bos')?.addEventListener('click', () => openBosModal());
            document.getElementById('bos-form')?.addEventListener('submit', async (e) => {
                e.preventDefault();
                const data = UI.getFormData('bos-form');
                const btn = document.getElementById('btn-save-bos');
                btn.disabled = true;
                btn.textContent = 'Saving...';
                try {
                    if (bosEditingId) {
                        await DB.updateBosReview(bosEditingId, data);
                        UI.showToast('Proposal updated', 'success');
                    } else {
                        await DB.insertBosReview(data);
                        UI.showToast('Proposal added', 'success');
                    }
                    UI.closeModal('modal-bos');
                    loadBos();
                } catch (err) { UI.showToast('Error: ' + err.message, 'error'); }
                btn.disabled = false;
                btn.textContent = bosEditingId ? 'Update Proposal' : 'Save Proposal';
            });
        };

        loadBos();
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
