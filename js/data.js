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
        if (filters.collateral_id) query = query.eq('collateral_id', filters.collateral_id);

        const { data, error } = await query;
        if (error) throw error;
        const result = data || [];

        if (!hasFilters) this._cache = result;
        return result;
    },

    async fetchApplicationDateHistory(id) {
        const rows = [];
        for (let offset = 0; ; offset += 500) {
            const { data, error } = await supabaseClient.from('application_date_history')
                .select('id,field_name,previous_date,new_date,recorded_at,recorded_by_email,source,note')
                .eq('application_id', id).order('recorded_at', { ascending: false })
                .order('id', { ascending: false }).range(offset, offset + 499);
            if (error) throw error;
            rows.push(...(data || []));
            if (!data || data.length < 500) return rows;
        }
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

    async _applicationTemplate() {
        if (this._appTemplate !== undefined) return this._appTemplate;
        let apps = this._cache;
        if (!apps) {
            const { data, error } = await supabaseClient
                .from('applications')
                .select('*')
                .limit(1);
            if (error) throw error;
            apps = data;
        }
        this._appTemplate = (apps && apps[0]) ? apps[0] : null;
        return this._appTemplate;
    },

    _filterApplicationPayload(payload, template) {
        if (!template) return payload || {};
        const allowed = new Set(Object.keys(template));
        for (const field of ['date_doc_sent_note', 'date_followup_note']) {
            if (payload?.[field] && !allowed.has(field)) {
                throw new Error('Date notes are not enabled yet. Run add_application_date_history.sql and reload before saving.');
            }
        }
        const filtered = {};
        Object.entries(payload || {}).forEach(([key, value]) => {
            if (allowed.has(key) && !['id', 'created_at', 'updated_at'].includes(key)) {
                filtered[key] = value;
            }
        });
        return filtered;
    },

    async insertApplication(app) {
        const template = await this._applicationTemplate();
        this._clearCache();
        const { data, error } = await supabaseClient
            .from('applications')
            .insert([this._filterApplicationPayload(app, template)])
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

    async uploadCancellationLetter(file) {
        const cfg = typeof CLOUDINARY !== 'undefined' ? CLOUDINARY : {};
        if (!cfg.cloudName || !cfg.uploadPreset ||
            cfg.cloudName === 'YOUR_CLOUD_NAME' || cfg.uploadPreset === 'YOUR_UNSIGNED_PRESET') {
            throw new Error('Cloudinary belum dikonfigurasi. Isi cloudName dan uploadPreset dalam js/cloudinary.js');
        }
        const form = new FormData();
        form.append('file', file);
        form.append('upload_preset', cfg.uploadPreset);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cfg.cloudName}/auto/upload`, {
            method: 'POST',
            body: form
        });
        const result = await res.json().catch(() => ({}));
        if (!res.ok) {
            throw new Error(result.error?.message || 'Cloudinary upload failed');
        }
        return result.secure_url;
    },

    async fetchAttachments() {
        const readAll = async (table) => {
            const rows = [];
            for (let offset = 0; ; offset += 500) {
                const { data, error } = await supabaseClient.from(table).select('*')
                    .order('id', { ascending: true }).range(offset, offset + 499);
                if (error) throw error;
                rows.push(...(data || []));
                if (!data || data.length < 500) return rows;
            }
        };
        const [applications, requests] = await Promise.all([readAll('applications'), readAll('change_requests')]);
        const files = new Map();
        const add = (app, state, id) => {
            const url = app?.bank_cancellation_letter_path;
            if (!url || files.has(url)) return;
            let safeUrl;
            try { safeUrl = new URL(url); } catch { return; }
            if (safeUrl.protocol !== 'https:' && safeUrl.protocol !== 'http:') return;
            const name = app.bank_cancellation_letter_name || 'Bank cancellation letter';
            const extension = (name.includes('.') ? name : safeUrl.pathname).split('.').pop().toLowerCase();
            const format = extension === 'pdf' ? 'PDF' : ['png', 'jpg', 'jpeg', 'gif', 'webp', 'heic', 'avif'].includes(extension) ? 'Image' : 'Other';
            files.set(url, { url: safeUrl.href, name, format, type: 'Bank cancellation letter',
                application: app.name_facility || app.type_facility || 'Unnamed application',
                company: app.company || 'Unknown company', bank: app.bank || '',
                year: app.year_application || '', state, applicationId: id || '' });
        };
        applications.forEach(app => add(app, 'Current', app.id));
        requests.filter(r => r.entity === 'application').sort((a, b) => String(b.created_at).localeCompare(String(a.created_at))).forEach(r => {
            add({ ...r.before_payload, ...r.payload }, r.status || 'PENDING', r.record_id || r.applied_record_id || r.id);
            add(r.before_payload, 'Previous version', r.record_id || r.id);
        });
        return [...files.values()].sort((a, b) => a.company.localeCompare(b.company) || a.application.localeCompare(b.application));
    },

    async getCancellationLetterUrl(url) {
        return url || null;
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

    // ========== CHANGE REQUESTS (approval workflow) ==========

    async fetchAuditEvents(filters = {}, page = 0) {
        let query = supabaseClient.from('audit_events').select('*', { count: 'exact' })
            .order('occurred_at', { ascending: false }).order('id', { ascending: false });
        for (const key of ['entity', 'action', 'record_id', 'request_id', 'transaction_id']) {
            if (filters[key]) query = query.eq(key, filters[key]);
        }
        if (filters.actor_email) query = query.ilike('actor_email', `%${filters.actor_email.replace(/[\\%_]/g, '\\$&')}%`);
        if (filters.from) query = query.gte('occurred_at', `${filters.from}T00:00:00+08:00`);
        if (filters.to) query = query.lte('occurred_at', `${filters.to}T23:59:59.999999+08:00`);
        const { data, count, error } = await query.range(page * 50, page * 50 + 49);
        if (error) throw error;
        return { events: data || [], count: count || 0 };
    },

    async fetchChangeRequests() {
        const { data, error } = await supabaseClient
            .from('change_requests')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async insertChangeRequest(cr) {
        const { data, error } = await supabaseClient
            .from('change_requests')
            .insert([cr])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async updateChangeRequest(id, updates) {
        const { data, error } = await supabaseClient
            .from('change_requests')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async deleteChangeRequest(id) {
        const { error } = await supabaseClient
            .from('change_requests')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    },

    // Application edits always wait for a different user's HOD review.
    async saveChange(entity, action, recordId, payload, summary, original) {
        if (entity === 'application' && action === 'UPDATE') {
            const originalRecord = original || await this.getApplication(recordId);
            const { data, error } = await supabaseClient.rpc('submit_application_edit', {
                p_record_id: recordId,
                p_payload: this._filterApplicationPayload(payload, originalRecord),
                p_original: originalRecord,
                p_summary: summary || ''
            });
            if (error) throw error;
            return { queued: !!data, unchanged: !data, data };
        }
        if (Auth.isSuperAdmin() && !(entity === 'application' && action === 'CREATE')) {
            const data = await this._applyChange(entity, action, recordId, payload || {});
            return { queued: false, data };
        }
        const data = await this.insertChangeRequest({
            entity,
            action,
            record_id: action === 'CREATE' ? null : (recordId || null),
            payload: payload || {},
            summary: summary || '',
            status: 'PENDING',
            requested_by: Auth.getUser()?.id || null,
            requested_by_email: Auth.getEmail() || null
        });
        return { queued: true, data };
    },

    async _applyChange(entity, action, recordId, payload) {
        switch (entity) {
            case 'application':
                if (action === 'CREATE') {
                    if (payload.company) {
                        try { await this.insertCompany(payload.company); } catch (_) { /* company already exists */ }
                    }
                    return this.insertApplication(payload);
                }
                if (action === 'UPDATE') return this.updateApplication(recordId, payload);
                if (action === 'DELETE') return this.deleteApplication(recordId);
                break;
            case 'company':
                if (action === 'CREATE') return this.insertCompany(payload.name);
                if (action === 'DELETE') return this.deleteCompany(recordId);
                break;
            case 'bank':
                if (action === 'CREATE') return this.insertBank(payload);
                if (action === 'UPDATE') return this.updateBank(recordId, payload);
                if (action === 'DELETE') return this.deleteBank(recordId);
                break;
            case 'collateral':
                if (action === 'CREATE') return this.insertCollateral(payload);
                if (action === 'UPDATE') return this.updateCollateral(recordId, payload);
                if (action === 'DELETE') return this.deleteCollateral(recordId);
                break;
        }
        throw new Error(`Unsupported change: ${entity} ${action}`);
    },

    async approveChangeRequest(id, notes) {
        if (!await Auth.canReviewChanges()) throw new Error('HOD Review access is required');
        const { data: cr, error } = await supabaseClient
            .from('change_requests')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        if (cr.status !== 'PENDING') throw new Error('This request has already been reviewed');
        if (cr.requested_by === Auth.getUser()?.id) throw new Error('Another reviewer must review your changes');
        if (cr.entity === 'application' && cr.action === 'UPDATE') {
            return this.reviewApplicationEdit(id, 'APPROVED', notes);
        }

        // Snapshot the current record so a wrong approval can be reversed later.
        let before = null;
        if ((cr.action === 'UPDATE' || cr.action === 'DELETE') && cr.record_id) {
            before = await this._fetchRecord(cr.entity, cr.record_id);
        }

        const result = await this._applyChange(cr.entity, cr.action, cr.record_id, cr.payload || {});
        const appliedId = (result && result.id) ? result.id : (cr.record_id || null);

        return this.updateChangeRequest(id, {
            status: 'APPROVED',
            review_notes: notes || null,
            before_payload: before || null,
            applied_record_id: appliedId,
            reviewed_by: Auth.getUser()?.id || null,
            reviewed_by_email: Auth.getEmail() || null,
            reviewed_at: new Date().toISOString()
        });
    },

    async rejectChangeRequest(id, notes) {
        if (!await Auth.canReviewChanges()) throw new Error('HOD Review access is required');
        const { data: cr, error } = await supabaseClient.from('change_requests').select('*').eq('id', id).single();
        if (error) throw error;
        if (cr.status !== 'PENDING') throw new Error('This request has already been reviewed');
        if (cr.requested_by === Auth.getUser()?.id) throw new Error('Another reviewer must review your changes');
        if (cr.entity === 'application' && cr.action === 'UPDATE') {
            return this.reviewApplicationEdit(id, 'REJECTED', notes);
        }
        return this.updateChangeRequest(id, {
            status: 'REJECTED',
            review_notes: notes || null,
            reviewed_by: Auth.getUser()?.id || null,
            reviewed_by_email: Auth.getEmail() || null,
            reviewed_at: new Date().toISOString()
        });
    },

    // Undo a wrong approve/reject. For an approved request the applied change
    // is reverted; for both cases the request returns to PENDING for re-review.
    async restoreChangeRequest(id) {
        if (!Auth.isSuperAdmin()) throw new Error('Only HOD can restore');
        const { data: cr, error } = await supabaseClient
            .from('change_requests')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        if (cr.status === 'PENDING') throw new Error('This request is already pending');
        if (cr.entity === 'application' && cr.action === 'UPDATE') {
            return this.reviewApplicationEdit(id, 'RESTORE');
        }

        if (cr.status === 'APPROVED') {
            await this._revertChange(cr);
        }

        return this.updateChangeRequest(id, {
            status: 'PENDING',
            applied_record_id: null,
            restored_by: Auth.getUser()?.id || null,
            restored_by_email: Auth.getEmail() || null,
            restored_at: new Date().toISOString()
        });
    },

    async reviewApplicationEdit(id, decision, notes) {
        const { data, error } = await supabaseClient.rpc('review_application_edit', {
            p_request_id: id, p_decision: decision, p_notes: notes || null
        });
        if (error) throw error;
        this._clearCache();
        return data;
    },

    _entityTable(entity) {
        return { application: 'applications', company: 'companies', bank: 'banks', collateral: 'collaterals' }[entity] || null;
    },

    async _fetchRecord(entity, id) {
        const table = this._entityTable(entity);
        if (!table || !id) return null;
        const { data } = await supabaseClient.from(table).select('*').eq('id', id).maybeSingle();
        return data || null;
    },

    _stripMeta(record) {
        if (!record) return record;
        const clean = { ...record };
        delete clean.created_at;
        delete clean.updated_at;
        return clean;
    },

    async _revertChange(cr) {
        const before = this._stripMeta(cr.before_payload);
        switch (cr.entity) {
            case 'application':
                if (cr.action === 'CREATE') { if (cr.applied_record_id) await this.deleteApplication(cr.applied_record_id); }
                else if (cr.action === 'UPDATE') { if (cr.record_id && cr.before_payload) await this.updateApplication(cr.record_id, this._stripMeta(cr.before_payload)); }
                else if (cr.action === 'DELETE') { if (cr.before_payload) await this.insertApplication(before); }
                break;
            case 'company':
                if (cr.action === 'CREATE') { if (cr.applied_record_id) await this.deleteCompany(cr.applied_record_id); }
                else if (cr.action === 'DELETE') { if (cr.before_payload) await this.insertCompany(cr.before_payload.name); }
                break;
            case 'bank':
                if (cr.action === 'CREATE') { if (cr.applied_record_id) await this.deleteBank(cr.applied_record_id); }
                else if (cr.action === 'UPDATE') { if (cr.record_id && cr.before_payload) await this.updateBank(cr.record_id, this._stripMeta(cr.before_payload)); }
                else if (cr.action === 'DELETE') { if (cr.before_payload) await this.insertBank(before); }
                break;
            case 'collateral':
                if (cr.action === 'CREATE') { if (cr.applied_record_id) await this.deleteCollateral(cr.applied_record_id); }
                else if (cr.action === 'UPDATE') { if (cr.record_id && cr.before_payload) await this.updateCollateral(cr.record_id, this._stripMeta(cr.before_payload)); }
                else if (cr.action === 'DELETE') { if (cr.before_payload) await this.insertCollateral(before); }
                break;
        }
    },

    async getDashboardStats() {
        const apps = await this.fetchApplications();
        const total = apps.length;
        const done = apps.filter(a => a.status === 'IN FORCE' || a.status === 'DONE');
        const settled = apps.filter(a => a.status === 'DISCHARGED' || a.status === 'SETTLED');
        const inProgress = apps.filter(a => ['IN PROGRESS', 'PREPARATION DOC BY FINANCE', 'SUBMISSION DOC TO BANK', 'REVIEW BY BANK'].includes(a.status));
        const declined = apps.filter(a => a.status === 'DECLINED' || a.status === 'DECLINED BY BANK' || a.status === 'DECLINED BY COMPANY');
        const cancelled = apps.filter(a => a.status === 'CANCELLED BY BANK');
        const hold = apps.filter(a => ['ON HOLD','REVIEW BY BOS','REVIEW BY HOD','PENDING'].includes(a.status));
        const totalRequested = apps.reduce((s, a) => s + this._n(a.total_requested), 0);
        const totalApproved = apps.reduce((s, a) => s + (['IN FORCE', 'DONE', 'DISCHARGED', 'SETTLED'].includes(a.status) ? this._n(a.total_approved) : 0), 0);

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
                if (['IN FORCE', 'DONE', 'DISCHARGED', 'SETTLED', 'DECLINED', 'DECLINED BY BANK', 'DECLINED BY COMPANY', 'CANCELLED BY BANK'].includes(a.status)) {
                    slaTotalDays += days;
                    slaCount++;
                } else if (days > 14) {
                    stuckApps.push({ ...a, days_stuck: days });
                }
            }
        });
        
        const avgSlaDays = slaCount > 0 ? Math.round(slaTotalDays / slaCount) : 12;

        const statusCount = { 'IN FORCE': done.length, DONE: done.length, DISCHARGED: settled.length, 'IN PROGRESS': inProgress.length, 'ON HOLD': hold.length, 'REVIEW BY HOD': apps.filter(a => a.status === 'REVIEW BY HOD').length, DECLINED: declined.length, 'CANCELLED BY BANK': cancelled.length, PENDING: apps.filter(a => a.status === 'PENDING').length, 'PREPARATION DOC BY FINANCE': apps.filter(a => a.status === 'PREPARATION DOC BY FINANCE').length, 'SUBMISSION DOC TO BANK': apps.filter(a => a.status === 'SUBMISSION DOC TO BANK').length };

        const bankCounts = {};
        apps.forEach(a => {
            if (a.bank) bankCounts[a.bank] = (bankCounts[a.bank] || 0) + 1;
        });

        statusCount['REVIEW BY BANK'] = apps.filter(a => a.status === 'REVIEW BY BANK').length;
        const companyTotals = {};
        apps.forEach(a => {
            if (!a.company) return;
            if (!companyTotals[a.company]) companyTotals[a.company] = { requested: 0, approved: 0, done: 0, pending: 0, declined: 0 };
            companyTotals[a.company].requested += this._n(a.total_requested);
            companyTotals[a.company].approved += ['IN FORCE', 'DONE', 'DISCHARGED', 'SETTLED'].includes(a.status) ? this._n(a.total_approved) : 0;
            if (['IN FORCE', 'DONE', 'DISCHARGED', 'SETTLED'].includes(a.status)) companyTotals[a.company].done++;
            else if (a.status === 'IN PROGRESS' || a.status === 'PENDING' || a.status === 'ON HOLD' || a.status === 'REVIEW BY HOD' || a.status === 'REVIEW BY BOS') companyTotals[a.company].pending++;
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
                    if (['IN FORCE', 'DONE', 'DISCHARGED', 'SETTLED'].includes(a.status)) {
                        monthlyCounts[mName].done++;
                        monthlyCounts[mName].approved += this._n(a.total_approved);
                    } else if (['DECLINED', 'DECLINED BY BANK', 'DECLINED BY COMPANY', 'CANCELLED BY BANK'].includes(a.status)) {
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

        return { total, done: done.length, settled: settled.length, cancelled: cancelled.length, inProgress: inProgress.length, declined: declined.length, hold: hold.length, totalRequested, totalApproved, statusCount, bankCounts, companyTotals, declineReasons, yearCounts, monthlyCounts, facilityCounts, avgSlaDays, stuckApps, topCompanyRisk, apps };
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
            bankStats[a.bank].approved += ['IN FORCE', 'DONE', 'DISCHARGED', 'SETTLED'].includes(a.status) ? this._n(a.total_approved) : 0;
            bankStats[a.bank].count++;
            if (['IN FORCE', 'DONE', 'DISCHARGED', 'SETTLED'].includes(a.status)) bankStats[a.bank].done++;
            else if (a.status === 'DECLINED' || a.status === 'DECLINED BY BANK' || a.status === 'DECLINED BY COMPANY' || a.status === 'CANCELLED BY BANK') bankStats[a.bank].declined++;

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

    async createUser(email, password, role) {
        const tempClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false,
                storageKey: 'sb-create-user-temp'
            }
        });

        const { data, error } = await tempClient.auth.signUp({ email, password });
        if (error) throw error;

        const user = data?.user;
        if (!user?.id) throw new Error('Could not create user account');
        if (Array.isArray(user.identities) && user.identities.length === 0) {
            throw new Error('This email is already registered');
        }

        const { error: profileError } = await supabaseClient
            .from('profiles')
            .upsert({
                id: user.id,
                email,
                role,
                updated_at: new Date().toISOString()
            }, { onConflict: 'id' });
        if (profileError) throw profileError;

        try { await tempClient.auth.signOut(); } catch (_) { }

        return { id: user.id, email, role, needsConfirmation: !data.session };
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
    },

    // ========== COLLATERALS ==========

    async fetchCollaterals() {
        const { data, error } = await supabaseClient
            .from('collaterals')
            .select('*')
            .order('name', { ascending: true });
        if (error) throw error;
        return data || [];
    },

    async insertCollateral(collateral) {
        const { data, error } = await supabaseClient
            .from('collaterals')
            .insert([collateral])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async updateCollateral(id, updates) {
        updates.updated_at = new Date().toISOString();
        const { data, error } = await supabaseClient
            .from('collaterals')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async deleteCollateral(id) {
        const { error } = await supabaseClient
            .from('collaterals')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    }
};
