const UI = {
    showToast(message, type = 'info', duration = 3000) {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icons = { success: '✓', error: '✕', info: 'ℹ' };
        toast.innerHTML = `<span style="font-weight:700;font-size:16px">${icons[type] || 'ℹ'}</span> ${message}`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'toastOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    openModal(id) {
        const el = document.getElementById(id);
        if (el) el.classList.add('open');
    },

    closeModal(id) {
        const el = document.getElementById(id);
        if (el) el.classList.remove('open');
    },

    closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(el => el.classList.remove('open'));
    },

    confirmDialog(message, title = 'Confirm') {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay open';
            overlay.innerHTML = `
                <div class="modal" style="max-width:400px">
                    <div class="modal-header"><h2>${title}</h2></div>
                    <div class="modal-body"><p style="font-size:14px;color:var(--text-2)">${message}</p></div>
                    <div class="modal-footer">
                        <button class="btn-secondary" id="confirm-no">Cancel</button>
                        <button class="btn-primary" id="confirm-yes">${title}</button>
                    </div>
                </div>`;
            document.body.appendChild(overlay);
            overlay.querySelector('#confirm-yes').onclick = () => { overlay.remove(); resolve(true); };
            overlay.querySelector('#confirm-no').onclick = () => { overlay.remove(); resolve(false); };
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) { overlay.remove(); resolve(false); }
            });
        });
    },

    formatCurrency(n) {
        if (!n || isNaN(n)) return 'RM 0';
        return 'RM ' + Number(n).toLocaleString('en-MY', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    },

    formatDate(d) {
        if (!d) return '-';
        const date = new Date(d);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    },

    statusBadge(status) {
        const map = {
            'IN FORCE': 'in-force',
            'DONE': 'done',
            'SETTLED': 'settled',
            'IN PROGRESS': 'progress',
            'ON HOLD': 'hold',
            'HOLD': 'hold',
            'PENDING': 'pending',
            'REVIEW BY HOD': 'hold',
            'REVIEW BY BOS': 'hold',
            'PREPARATION DOC BY FINANCE': 'progress',
            'SUBMISSION DOC TO BANK': 'progress',
            'DECLINED': 'declined',
            'DECLINED BY BANK': 'declined',
            'DECLINED BY COMPANY': 'declined'
        };
        const cls = map[status] || 'pending';
        return `<span class="badge ${cls}"><span class="badge-dot"></span>${status}</span>`;
    },

    progressHtml(value, status) {
        const progressMap = {
            'IN FORCE': 100, 'DONE': 100, 'SETTLED': 100, 'IN PROGRESS': 50, 'PENDING': 10,
            'ON HOLD': 30, 'HOLD': 30, 'REVIEW BY HOD': 80, 'REVIEW BY BOS': 80,
            'PREPARATION DOC BY FINANCE': 20, 'SUBMISSION DOC TO BANK': 70,
            'DECLINED': 100, 'DECLINED BY BANK': 100, 'DECLINED BY COMPANY': 100
        };
        const statusColors = {
            'IN FORCE': '#16a34a',     // Emerald Green
            'DONE': '#0d9488',         // Forest Teal
            'SETTLED': '#64748b',      // Cool Slate Gray
            'IN PROGRESS': '#2563eb',  // Royal Blue
            'PENDING': '#d97706',      // Amber
            'ON HOLD': '#d97706',      // Amber
            'HOLD': '#d97706',         // Amber
            'REVIEW BY HOD': '#8b5cf6',// Violet
            'REVIEW BY BOS': '#8b5cf6',
            'PREPARATION DOC BY FINANCE': '#3b82f6', // Light Blue
            'SUBMISSION DOC TO BANK': '#0284c7',     // Sky Blue
            'DECLINED': '#dc2626',      // Red
            'DECLINED BY BANK': '#dc2626',
            'DECLINED BY COMPANY': '#dc2626'
        };
        let v = (value !== undefined && value !== null && value !== 0) ? value : (progressMap[status] !== undefined ? progressMap[status] : 0);
        let color = statusColors[status] || '#2563eb';
        return `<span style="display:inline-flex;align-items:center;gap:8px;font-size:12px">
            <span class="progress-bar-track-mini"><span class="progress-bar-fill-mini" style="width:${v}%;background:${color}"></span></span>
            <span style="font-weight:600;color:${color};font-variant-numeric:tabular-nums">${v}%</span>
        </span>`;
    },

    renderTable(data, columns, actionsFn) {
        const table = document.createElement('table');
        table.className = 'data-table';
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        columns.forEach(col => {
            const th = document.createElement('th');
            th.textContent = col.label;
            headerRow.appendChild(th);
        });
        if (actionsFn) {
            const th = document.createElement('th');
            th.textContent = 'Actions';
            th.style.textAlign = 'right';
            headerRow.appendChild(th);
        }
        thead.appendChild(headerRow);
        table.appendChild(thead);
        const tbody = document.createElement('tbody');
        if (!data || data.length === 0) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = columns.length + (actionsFn ? 1 : 0);
            td.style.textAlign = 'center';
            td.style.padding = '48px 20px';
            td.style.color = 'var(--text-muted)';
            td.innerHTML = `
                <div class="empty-state-wrap">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin:0 auto 8px;opacity:0.4;display:block">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                    </svg>
                    <div style="font-weight:500;font-size:13px;color:var(--text-2)">No records found</div>
                </div>`;
            tr.appendChild(td);
            tbody.appendChild(tr);
        } else {
            data.forEach((row, i) => {
                const tr = document.createElement('tr');
                columns.forEach(col => {
                    const td = document.createElement('td');
                    const val = col.key ? row[col.key] : '';
                    td.innerHTML = col.render ? col.render(val, row, i) : (val ?? '-');
                    tr.appendChild(td);
                });
                if (actionsFn) {
                    const td = document.createElement('td');
                    td.style.textAlign = 'right';
                    td.appendChild(actionsFn(row, i));
                    tr.appendChild(td);
                }
                tbody.appendChild(tr);
            });
        }
        table.appendChild(tbody);
        return table;
    },

    toggleSidebar() {
        document.querySelector('.sidebar')?.classList.toggle('open');
        document.querySelector('.sidebar-overlay')?.classList.toggle('open');
    },

    initSidebar() {
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.onclick = this.toggleSidebar;
        document.body.appendChild(overlay);
        document.querySelectorAll('.hamburger-btn').forEach(btn => {
            btn.addEventListener('click', this.toggleSidebar);
        });
    },

    populateSelect(selectId, options, valueKey, labelKey, placeholder) {
        const sel = document.getElementById(selectId);
        if (!sel) return;
        sel.innerHTML = '';
        if (placeholder) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = placeholder;
            sel.appendChild(opt);
        }
        options.forEach(item => {
            const opt = document.createElement('option');
            opt.value = valueKey ? item[valueKey] : item;
            opt.textContent = labelKey ? item[labelKey] : item;
            sel.appendChild(opt);
        });
    },

    getFormData(formId) {
        const form = document.getElementById(formId);
        if (!form) return {};
        const data = {};
        const fields = form.querySelectorAll('[name]');
        fields.forEach(f => {
            const val = f.value.trim();
            if (f.type === 'number' || f.getAttribute('type') === 'number') {
                data[f.name] = val ? parseFloat(val) : null;
            } else {
                data[f.name] = val || null;
            }
        });
        return data;
    },

    setFormData(formId, data) {
        const form = document.getElementById(formId);
        if (!form) return;
        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) field.value = data[key] ?? '';
        });
    },

    resetForm(formId) {
        const form = document.getElementById(formId);
        if (form) form.reset();
    },

    csvEscape(v) {
        const s = String(v ?? '');
        if (s.includes('"') || s.includes(',') || s.includes('\n') || s.includes('\r')) {
            return '"' + s.replace(/"/g, '""') + '"';
        }
        return s;
    }
};
