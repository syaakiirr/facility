const DB = {
    _n(v) { return Number(v) || 0; },
    _cache: null,

    _clearCache() { this._cache = null; },

    async fetchApplications(filters = {}) {
        const hasFilters = Object.keys(filters).length > 0;
        if (!hasFilters && this._cache) return this._cache;

        let query = supabaseClient
            .from('applications')
            .select('*')
            .order('created_at', { ascending: false });

        if (filters.status) query = query.eq('status', filters.status);
        if (filters.bank) query = query.eq('bank', filters.bank);
        if (filters.year) query = query.eq('year_application', parseInt(filters.year));
        if (filters.category) query = query.eq('category', filters.category);
        if (filters.search) {
            query = query.or(`company.ilike.%${filters.search}%,bank.ilike.%${filters.search}%`);
        }
        if (filters.company) query = query.eq('company', filters.company);

        const { data, error } = await query;
        if (error) throw error;
        const result = data || [];

        if (!hasFilters) this._cache = result;
        return result;
    },

    async getApplication(id) {
        const { data, error } = await supabaseClient
            .from('applications')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    async insertApplication(app) {
        this._clearCache();
        const { data, error } = await supabaseClient
            .from('applications')
            .insert([app])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async updateApplication(id, updates) {
        this._clearCache();
        updates.updated_at = new Date().toISOString();
        const { data, error } = await supabaseClient
            .from('applications')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async deleteApplication(id) {
        this._clearCache();
        const { error } = await supabaseClient
            .from('applications')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    },

    async fetchCompanies() {
        const { data, error } = await supabaseClient
            .from('companies')
            .select('*')
            .order('name', { ascending: true });
        if (error) throw error;
        return data || [];
    },

    async insertCompany(name) {
        const { data, error } = await supabaseClient
            .from('companies')
            .insert([{ name }])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async deleteCompany(id) {
        const { error } = await supabaseClient
            .from('companies')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    },

    async fetchBanks() {
        const { data, error } = await supabaseClient
            .from('banks')
            .select('*')
            .order('bfr_current', { ascending: true });
        if (error) throw error;
        return data || [];
    },

    async insertBank(bank) {
        const { data, error } = await supabaseClient
            .from('banks')
            .insert([bank])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async updateBankBfr(id, bfrCurrent) {
        this._clearCache();
        const { data, error } = await supabaseClient
            .from('banks')
            .update({ bfr_current: bfrCurrent, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async updateBank(id, updates) {
        this._clearCache();
        updates.updated_at = new Date().toISOString();
        const { data, error } = await supabaseClient
            .from('banks')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async deleteBank(id) {
        this._clearCache();
        const { error } = await supabaseClient
            .from('banks')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    },

    async fetchBosReviews() {
        const { data, error } = await supabaseClient
            .from('bos_review')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async insertBosReview(review) {
        const { data, error } = await supabaseClient
            .from('bos_review')
            .insert([review])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async updateBosReview(id, updates) {
        const { data, error } = await supabaseClient
            .from('bos_review')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async deleteBosReview(id) {
        const { error } = await supabaseClient
            .from('bos_review')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    },

    async getDashboardStats() {
        const apps = await this.fetchApplications();
        const total = apps.length;
        const done = apps.filter(a => a.status === 'IN FORCE' || a.status === 'DONE');
        const settled = apps.filter(a => a.status === 'SETTLED');
        const inProgress = apps.filter(a => a.status === 'IN PROGRESS' || a.status === 'PREPARATION DOC BY FINANCE' || a.status === 'SUBMISSION DOC TO BANK');
        const declined = apps.filter(a => a.status === 'DECLINED' || a.status === 'DECLINED BY BANK' || a.status === 'DECLINED BY COMPANY');
        const hold = apps.filter(a => ['ON HOLD','HOLD','REVIEW BY BOS','REVIEW BY HOD','PENDING'].includes(a.status));
        const totalRequested = apps.reduce((s, a) => s + this._n(a.total_requested), 0);
        const totalApproved = apps.reduce((s, a) => s + (['IN FORCE', 'DONE', 'SETTLED'].includes(a.status) ? this._n(a.total_approved) : 0), 0);

        // SLA & Stuck Applications (> 14 days)
        const now = new Date();
        let slaTotalDays = 0;
        let slaCount = 0;
        const stuckApps = [];

        apps.forEach(a => {
            const startDate = a.date_doc_sent ? new Date(a.date_doc_sent) : (a.created_at ? new Date(a.created_at) : null);
            const endDate = a.date_updated ? new Date(a.date_updated) : now;
            
            if (startDate) {
                const days = Math.max(1, Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)));
                if (['IN FORCE', 'DONE', 'SETTLED', 'DECLINED', 'DECLINED BY BANK', 'DECLINED BY COMPANY'].includes(a.status)) {
                    slaTotalDays += days;
                    slaCount++;
                } else if (days > 14) {
                    stuckApps.push({ ...a, days_stuck: days });
                }
            }
        });
        
        const avgSlaDays = slaCount > 0 ? Math.round(slaTotalDays / slaCount) : 12;

        const statusCount = { 'IN FORCE': done.length, DONE: done.length, SETTLED: settled.length, 'IN PROGRESS': inProgress.length, HOLD: hold.length, 'REVIEW BY HOD': apps.filter(a => a.status === 'REVIEW BY HOD').length, DECLINED: declined.length, PENDING: apps.filter(a => a.status === 'PENDING').length, 'PREPARATION DOC BY FINANCE': apps.filter(a => a.status === 'PREPARATION DOC BY FINANCE').length, 'SUBMISSION DOC TO BANK': apps.filter(a => a.status === 'SUBMISSION DOC TO BANK').length };

        const bankCounts = {};
        apps.forEach(a => {
            if (a.bank) bankCounts[a.bank] = (bankCounts[a.bank] || 0) + 1;
        });

        const companyTotals = {};
        apps.forEach(a => {
            if (!a.company) return;
            if (!companyTotals[a.company]) companyTotals[a.company] = { requested: 0, approved: 0, done: 0, pending: 0, declined: 0 };
            companyTotals[a.company].requested += this._n(a.total_requested);
            companyTotals[a.company].approved += ['IN FORCE', 'DONE', 'SETTLED'].includes(a.status) ? this._n(a.total_approved) : 0;
            if (['IN FORCE', 'DONE', 'SETTLED'].includes(a.status)) companyTotals[a.company].done++;
            else if (a.status === 'IN PROGRESS' || a.status === 'PENDING' || a.status === 'ON HOLD' || a.status === 'HOLD' || a.status === 'REVIEW BY HOD' || a.status === 'REVIEW BY BOS') companyTotals[a.company].pending++;
            else companyTotals[a.company].declined++;
        });

        // Risk Concentration (> 30% exposure)
        let topCompanyRisk = { name: '-', requested: 0, percent: 0 };
        Object.entries(companyTotals).forEach(([name, val]) => {
            const pct = totalRequested > 0 ? Math.round((val.requested / totalRequested) * 100) : 0;
            if (pct > topCompanyRisk.percent) {
                topCompanyRisk = { name, requested: val.requested, percent: pct };
            }
        });

        const declineReasons = {};
        apps.forEach(a => {
            if (a.decline_reason) {
                const reason = a.decline_reason.trim();
                declineReasons[reason] = (declineReasons[reason] || 0) + 1;
            }
        });



        const yearCounts = {};
        apps.forEach(a => {
            if (a.year_application) {
                const y = String(a.year_application);
                yearCounts[y] = (yearCounts[y] || 0) + 1;
            }
        });

        // Monthly Trajectory Breakdown (Jan–Dec)
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyCounts = {};
        monthNames.forEach(m => { monthlyCounts[m] = { total: 0, done: 0, declined: 0, requested: 0, approved: 0 }; });

        apps.forEach(a => {
            const d = a.date_doc_sent ? new Date(a.date_doc_sent) : (a.date_updated ? new Date(a.date_updated) : null);
            if (d && !isNaN(d)) {
                const mName = monthNames[d.getMonth()];
                if (monthlyCounts[mName]) {
                    monthlyCounts[mName].total++;
                    monthlyCounts[mName].requested += this._n(a.total_requested);
                    if (['IN FORCE', 'DONE', 'SETTLED'].includes(a.status)) {
                        monthlyCounts[mName].done++;
                        monthlyCounts[mName].approved += this._n(a.total_approved);
                    } else if (['DECLINED', 'DECLINED BY BANK', 'DECLINED BY COMPANY'].includes(a.status)) {
                        monthlyCounts[mName].declined++;
                    }
                }
            }
        });

        const facilityCounts = {};
        apps.forEach(a => {
            if (a.type_facility) {
                facilityCounts[a.type_facility] = (facilityCounts[a.type_facility] || 0) + 1;
            }
        });

        return { total, done: done.length, settled: settled.length, inProgress: inProgress.length, declined: declined.length, hold: hold.length, totalRequested, totalApproved, statusCount, bankCounts, companyTotals, declineReasons, yearCounts, monthlyCounts, facilityCounts, avgSlaDays, stuckApps, topCompanyRisk, apps };
    },

    async getBankStats(apps) {
        if (!apps) apps = await this.fetchApplications();
        const banks = await this.fetchBanks();
        const bankStats = {};
        banks.forEach(b => {
            bankStats[b.name] = { bfr_current: b.bfr_current, bfr_previous: b.bfr_previous, requested: 0, approved: 0, count: 0, done: 0, declined: 0, slaDaysTotal: 0, slaCount: 0 };
        });
        const now = new Date();
        apps.forEach(a => {
            if (!a.bank || !bankStats[a.bank]) return;
            bankStats[a.bank].requested += this._n(a.total_requested);
            bankStats[a.bank].approved += ['IN FORCE', 'DONE', 'SETTLED'].includes(a.status) ? this._n(a.total_approved) : 0;
            bankStats[a.bank].count++;
            if (['IN FORCE', 'DONE', 'SETTLED'].includes(a.status)) bankStats[a.bank].done++;
            else if (a.status === 'DECLINED' || a.status === 'DECLINED BY BANK' || a.status === 'DECLINED BY COMPANY') bankStats[a.bank].declined++;

            const startDate = a.date_doc_sent ? new Date(a.date_doc_sent) : (a.created_at ? new Date(a.created_at) : null);
            const endDate = a.date_updated ? new Date(a.date_updated) : now;
            if (startDate) {
                const days = Math.max(1, Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)));
                bankStats[a.bank].slaDaysTotal += days;
                bankStats[a.bank].slaCount++;
            }
        });

        Object.keys(bankStats).forEach(name => {
            const b = bankStats[name];
            b.avgSla = b.slaCount > 0 ? Math.round(b.slaDaysTotal / b.slaCount) : 10;
        });

        return { bankStats, banks };
    },

    // ========== RBAC & ADMIN METHODS ==========

    async fetchProfiles() {
        const { data, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async updateProfileRole(id, role) {
        const { data, error } = await supabaseClient
            .from('profiles')
            .update({ role, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async fetchPagePermissions() {
        const { data, error } = await supabaseClient
            .from('page_permissions')
            .select('*')
            .eq('role', 'staff');
        if (error) throw error;
        return data || [];
    },

    async updatePagePermission(id, isAllowed) {
        const { data, error } = await supabaseClient
            .from('page_permissions')
            .update({ is_allowed: isAllowed, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async fetchChartVisibility() {
        const { data, error } = await supabaseClient
            .from('chart_visibility')
            .select('*')
            .order('chart_key', { ascending: true });
        if (error) throw error;
        return data || [];
    },

    async updateChartVisibility(id, isVisible) {
        const { data, error } = await supabaseClient
            .from('chart_visibility')
            .update({ is_visible: isVisible, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    }
};
