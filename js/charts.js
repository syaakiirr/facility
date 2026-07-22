const Charts = {
    instances: {},
    resizeHandler: null,

    tooltip: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
        textStyle: { fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13, color: '#0F172A' }
    },

    baseOption() {
        return {
            textStyle: { fontFamily: "'Inter', system-ui, sans-serif", fontSize: 12, color: '#475569' },
            backgroundColor: 'transparent',
            animationDuration: 800,
            animationEasing: 'cubicOut'
        };
    },

    dispose(id) {
        if (this.instances[id]) {
            this.instances[id].dispose();
            delete this.instances[id];
        }
    },

    render(id, option) {
        this.dispose(id);
        const el = document.getElementById(id);
        if (!el) return;
        const chart = echarts.init(el, null, { renderer: 'canvas' });
        chart.setOption({ ...this.baseOption(), ...option });
        this.instances[id] = chart;
        if (!this.resizeHandler) {
            this.resizeHandler = () => {
                Object.values(this.instances).forEach(c => c.resize());
            };
            window.addEventListener('resize', this.resizeHandler);
        }
        return chart;
    },

    donutStatus(containerId, statusCount) {
        const data = Object.entries(statusCount || {})
            .filter(([, v]) => v > 0)
            .map(([k, v]) => ({
                name: k,
                value: v,
                itemStyle: { color: { 'DONE': '#16A34A', 'IN PROGRESS': '#2563EB', 'HOLD': '#D97706', 'ON HOLD': '#D97706', 'REVIEW BY BOS': '#8B5CF6', 'DECLINED': '#DC2626', 'DECLINED BY BANK': '#DC2626', 'DECLINED BY COMPANY': '#DC2626', 'PENDING': '#D97706' }[k] || '#94A3B8' }
            }));
        if (data.length === 0) return this.render(containerId, { title: { text: 'No data', left: 'center', textStyle: { color: '#94A3B8', fontSize: 14, fontWeight: 400 } } });
        return this.render(containerId, {
            tooltip: { ...this.tooltip, trigger: 'item', formatter: '{b}: {c} ({d}%)' },
            legend: { bottom: 0, itemWidth: 12, itemGap: 16, textStyle: { fontSize: 12, color: '#475569' } },
            series: [{
                type: 'pie',
                radius: ['55%', '78%'],
                avoidLabelOverlap: true,
                itemStyle: { borderRadius: 4, borderColor: '#FFF', borderWidth: 2 },
                label: { show: true, position: 'outside', formatter: '{b}\n{d}%', fontSize: 11, color: '#475569' },
                emphasis: { label: { show: true, fontWeight: 'bold' } },
                data
            }]
        });
    },

    barBanks(containerId, bankCounts) {
        const entries = Object.entries(bankCounts || {}).sort((a, b) => b[1] - a[1]);
        if (entries.length === 0) return this.render(containerId, { title: { text: 'No data', left: 'center', textStyle: { color: '#94A3B8', fontSize: 14, fontWeight: 400 } } });
        return this.render(containerId, {
            tooltip: { ...this.tooltip, trigger: 'axis', axisPointer: { type: 'shadow' } },
            grid: { left: 12, right: 16, top: 16, bottom: 8, containLabel: true },
            xAxis: { type: 'category', data: entries.map(e => e[0]), axisLine: { lineStyle: { color: '#E2E8F0' } }, axisLabel: { color: '#475569', rotate: 35, fontSize: 10 } },
            yAxis: { type: 'value', splitLine: { lineStyle: { color: '#F1F5F9', type: 'dashed' } }, axisLabel: { color: '#475569' } },
            series: [{
                type: 'bar',
                data: entries.map(e => e[1]),
                itemStyle: { color: '#2563EB', borderRadius: [4, 4, 0, 0] },
                barWidth: '60%'
            }]
        });
    },

    horizontalBarCompany(containerId, companyTotals, topN = 10) {
        const entries = Object.entries(companyTotals || {})
            .sort((a, b) => b[1].requested - a[1].requested)
            .slice(0, topN);
        if (entries.length === 0) return this.render(containerId, { title: { text: 'No data', left: 'center', textStyle: { color: '#94A3B8', fontSize: 14, fontWeight: 400 } } });
        return this.render(containerId, {
            tooltip: {
                ...this.tooltip, trigger: 'axis', axisPointer: { type: 'shadow' },
                formatter: (params) => {
                    const idx = entries.length - 1 - params[0].dataIndex;
                    const item = entries[idx];
                    return `${item[0]}<br/>Requested: ${UI.formatCurrency(item[1].requested)}<br/>Approved: ${UI.formatCurrency(item[1].approved)}`;
                }
            },
            grid: { left: 12, right: 30, bottom: 10, top: 10, containLabel: true },
            xAxis: { type: 'value', axisLabel: { formatter: (v) => UI.formatCurrency(v), color: '#475569' }, splitLine: { lineStyle: { color: '#F1F5F9', type: 'dashed' } } },
            yAxis: { type: 'category', data: entries.map(e => e[0]).reverse(), axisLabel: { fontSize: 10, width: 80, overflow: 'truncate', color: '#475569' }, axisLine: { lineStyle: { color: '#E2E8F0' } } },
            series: [
                { name: 'Requested', type: 'bar', data: entries.map(e => e[1].requested).reverse(), itemStyle: { color: '#93C5FD', borderRadius: [0, 4, 4, 0] }, barWidth: '40%' },
                { name: 'Approved', type: 'bar', data: entries.map(e => e[1].approved).reverse(), itemStyle: { color: '#2563EB', borderRadius: [0, 4, 4, 0] }, barWidth: '40%' }
            ]
        });
    },

    barDeclineReasons(containerId, declineReasons) {
        const entries = Object.entries(declineReasons || {}).sort((a, b) => b[1] - a[1]);
        if (entries.length === 0) return this.render(containerId, { title: { text: 'No data', left: 'center', textStyle: { color: '#94A3B8', fontSize: 14, fontWeight: 400 } } });
        return this.render(containerId, {
            tooltip: { ...this.tooltip, trigger: 'axis', axisPointer: { type: 'shadow' } },
            grid: { left: 12, right: 30, bottom: 8, top: 10, containLabel: true },
            xAxis: { type: 'value', splitLine: { lineStyle: { color: '#F1F5F9', type: 'dashed' } } },
            yAxis: { type: 'category', data: entries.map(e => e[0]), axisLabel: { fontSize: 10, width: 120, overflow: 'truncate', color: '#475569' }, axisLine: { lineStyle: { color: '#E2E8F0' } } },
            series: [{
                type: 'bar',
                data: entries.map(e => ({ value: e[1], itemStyle: { color: '#DC2626' } })),
                barWidth: '60%'
            }]
        });
    },

    barYearTrend(containerId, yearCounts) {
        const years = Object.keys(yearCounts || {}).sort();
        if (years.length === 0) return this.render(containerId, { title: { text: 'No data', left: 'center', textStyle: { color: '#94A3B8', fontSize: 14, fontWeight: 400 } } });
        return this.render(containerId, {
            tooltip: { ...this.tooltip, trigger: 'axis', axisPointer: { type: 'shadow' } },
            grid: { left: 12, right: 16, top: 16, bottom: 8, containLabel: true },
            xAxis: { type: 'category', data: years, axisLine: { lineStyle: { color: '#E2E8F0' } }, axisLabel: { color: '#475569' } },
            yAxis: { type: 'value', splitLine: { lineStyle: { color: '#F1F5F9', type: 'dashed' } }, axisLabel: { color: '#475569' } },
            series: [{
                type: 'bar',
                data: years.map(y => yearCounts[y]),
                itemStyle: { color: '#2563EB', borderRadius: [4, 4, 0, 0] },
                barWidth: '60%'
            }]
        });
    },

    donutFacility(containerId, facilityCounts) {
        const palette = ['#2563EB', '#16A34A', '#D97706', '#DC2626', '#8B5CF6', '#06B6D4', '#F59E0B', '#6366F1'];
        const data = Object.entries(facilityCounts || {})
            .filter(([, v]) => v > 0)
            .map(([k, v], i) => ({
                name: k,
                value: v,
                itemStyle: { color: palette[i % palette.length] }
            }));
        if (data.length === 0) return this.render(containerId, { title: { text: 'No data', left: 'center', textStyle: { color: '#94A3B8', fontSize: 14, fontWeight: 400 } } });
        return this.render(containerId, {
            tooltip: { ...this.tooltip, trigger: 'item', formatter: '{b}: {c} ({d}%)' },
            legend: { bottom: 0, itemWidth: 12, itemGap: 16, textStyle: { fontSize: 12, color: '#475569' } },
            series: [{
                type: 'pie',
                radius: ['45%', '70%'],
                avoidLabelOverlap: true,
                itemStyle: { borderRadius: 4, borderColor: '#FFF', borderWidth: 2 },
                label: { show: true, formatter: '{b}\n{d}%', fontSize: 11, color: '#475569' },
                data
            }]
        });
    },

    barBankSuccessRate(containerId, bankStats) {
        const entries = Object.entries(bankStats || {})
            .filter(([, v]) => v.count > 0)
            .map(([k, v]) => [k, v.count > 0 ? Math.round((v.done / v.count) * 100) : 0, v.done, v.count])
            .sort((a, b) => b[1] - a[1]);
        if (entries.length === 0) return this.render(containerId, { title: { text: 'No data', left: 'center', textStyle: { color: '#94A3B8', fontSize: 14, fontWeight: 400 } } });
        return this.render(containerId, {
            tooltip: {
                ...this.tooltip, trigger: 'axis', axisPointer: { type: 'shadow' },
                formatter: (params) => {
                    const item = entries[params[0].dataIndex];
                    return `${item[0]}<br/>Success: ${item[2]}/${item[3]} (${item[1]}%)`;
                }
            },
            grid: { left: 12, right: 16, top: 16, bottom: 8, containLabel: true },
            xAxis: { type: 'category', data: entries.map(e => e[0]), axisLine: { lineStyle: { color: '#E2E8F0' } }, axisLabel: { color: '#475569', rotate: 35, fontSize: 10 } },
            yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%', color: '#475569' }, splitLine: { lineStyle: { color: '#F1F5F9', type: 'dashed' } } },
            series: [{
                type: 'bar',
                data: entries.map(e => ({ value: e[1], itemStyle: { color: e[1] >= 50 ? '#16A34A' : e[1] >= 25 ? '#D97706' : '#DC2626' } })),
                barWidth: '60%'
            }]
        });
    },

    barBankBfr(containerId, banks) {
        const sorted = (banks || []).filter(b => b.bfr_current != null).sort((a, b) => b.bfr_current - a.bfr_current);
        if (sorted.length === 0) return this.render(containerId, { title: { text: 'No data', left: 'center', textStyle: { color: '#94A3B8', fontSize: 14, fontWeight: 400 } } });
        return this.render(containerId, {
            tooltip: { ...this.tooltip, trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (params) => {
                const item = sorted[params[0].dataIndex];
                return `${item.name}<br/>Current: ${item.bfr_current}%<br/>Previous: ${item.bfr_previous || '-'}%`;
            }},
            grid: { left: 12, right: 16, top: 16, bottom: 8, containLabel: true },
            xAxis: { type: 'category', data: sorted.map(b => b.name), axisLine: { lineStyle: { color: '#E2E8F0' } }, axisLabel: { color: '#475569', rotate: 35, fontSize: 10 } },
            yAxis: { type: 'value', axisLabel: { formatter: '{value}%', color: '#475569' }, splitLine: { lineStyle: { color: '#F1F5F9', type: 'dashed' } } },
            series: [{
                name: 'BFR Current',
                type: 'bar',
                data: sorted.map(b => b.bfr_current),
                itemStyle: { color: '#2563EB', borderRadius: [4, 4, 0, 0] },
                barWidth: '60%'
            }]
        });
    }
};
