/* ============================================================
   analytics.js — Analytics page charts  (Stage 2: localStorage sync)
   ============================================================
   STAGE 2 CHANGE: Now uses loadApps() (same localStorage source
   as the Applications page) instead of hardcoded SAMPLE_APPS.
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {

    // ── LOAD APPS (Stage 6: API) ─────────────────────────────
    let apps = [];
    try {
        const res = await apiFetch('/applications');
        if (res) apps = res.data;
    } catch (err) {
        return;
    }

    if (apps.length === 0) {
        document.querySelector('.page-content').insertAdjacentHTML('beforeend', `
      <div class="empty-state">
        <i class="bi bi-bar-chart"></i>
        <h3>No data yet</h3>
        <p>Add some applications first to see your analytics.</p>
        <a class="btn-primary" href="applications.html">
          <i class="bi bi-plus-lg"></i> Add Application
        </a>
      </div>`);
        return;
    }

    const STATUS_COLORS = {
        Applied: '#3b82f6',
        Assessment: '#f59e0b',
        Interview: '#8b5cf6',
        Offer: '#10b981',
        Rejected: '#ef4444',
    };

    // ── CHART 1: Applications by Status (Doughnut) ────────────
    const statusCounts = {};
    apps.forEach(app => {
        statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
    });

    const statusChart = document.getElementById('analyticsStatusChart');
    if (statusChart) {
        new Chart(statusChart, {
            type: 'doughnut',
            data: {
                labels: Object.keys(statusCounts),
                datasets: [{
                    data: Object.values(statusCounts),
                    backgroundColor: Object.keys(statusCounts).map(s => STATUS_COLORS[s]),
                    borderWidth: 0,
                    hoverOffset: 8,
                }],
            },
            options: {
                cutout: '68%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { font: { size: 12, family: 'Inter' }, padding: 16, boxWidth: 12 },
                    },
                    tooltip: {
                        callbacks: {
                            label: ctx => ` ${ctx.label}: ${ctx.raw} (${Math.round(ctx.raw / apps.length * 100)}%)`,
                        },
                    },
                },
                responsive: true,
                maintainAspectRatio: false,
            },
        });
    }

    // ── CHART 2: Applications by Month (Bar) ──────────────────
    const monthCounts = {};
    apps.forEach(app => {
        const d = new Date(app.applicationDate);
        const key = d.toLocaleString('en-IN', { month: 'short', year: '2-digit' });
        monthCounts[key] = (monthCounts[key] || 0) + 1;
    });

    const sortedMonths = Object.keys(monthCounts).sort(
        (a, b) => new Date('1 ' + a) - new Date('1 ' + b)
    );

    const monthChart = document.getElementById('analyticsMonthChart');
    if (monthChart) {
        new Chart(monthChart, {
            type: 'bar',
            data: {
                labels: sortedMonths,
                datasets: [{
                    label: 'Applications',
                    data: sortedMonths.map(m => monthCounts[m]),
                    backgroundColor: '#6366f1',
                    borderRadius: 6,
                    borderSkipped: false,
                }],
            },
            options: {
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 12 } } },
                    y: { beginAtZero: true, ticks: { stepSize: 1, font: { family: 'Inter', size: 12 } }, grid: { color: '#f1f5f9' } },
                },
                responsive: true,
                maintainAspectRatio: false,
            },
        });
    }

    // ── CHART 3: Conversion Rates (Horizontal Bar) ────────────
    const total = apps.length;
    const interviews = apps.filter(a => a.status === 'Interview').length;
    const offers = apps.filter(a => a.status === 'Offer').length;
    const rejected = apps.filter(a => a.status === 'Rejected').length;
    const assessed = apps.filter(a => a.status === 'Assessment').length;

    const ratesChart = document.getElementById('analyticsRatesChart');
    if (ratesChart) {
        new Chart(ratesChart, {
            type: 'bar',
            data: {
                labels: ['Response Rate', 'Interview Rate', 'Offer Rate', 'Rejection Rate', 'Assessment Rate'],
                datasets: [{
                    label: 'Rate (%)',
                    data: [
                        total ? Math.round(((interviews + offers + rejected) / total) * 100) : 0,
                        total ? Math.round((interviews / total) * 100) : 0,
                        total ? Math.round((offers / total) * 100) : 0,
                        total ? Math.round((rejected / total) * 100) : 0,
                        total ? Math.round((assessed / total) * 100) : 0,
                    ],
                    backgroundColor: ['#6366f1', '#8b5cf6', '#10b981', '#ef4444', '#f59e0b'],
                    borderRadius: 6,
                    borderSkipped: false,
                }],
            },
            options: {
                indexAxis: 'y',
                plugins: {
                    legend: { display: false },
                    tooltip: { callbacks: { label: ctx => ` ${ctx.raw}%` } },
                },
                scales: {
                    x: {
                        beginAtZero: true, max: 100,
                        ticks: { callback: val => val + '%', font: { family: 'Inter', size: 12 } },
                        grid: { color: '#f1f5f9' },
                    },
                    y: { ticks: { font: { family: 'Inter', size: 12 } }, grid: { display: false } },
                },
                responsive: true,
                maintainAspectRatio: false,
            },
        });
    }

    // ── CHART 4: Cumulative Trend (Line) ──────────────────────
    const sortedApps = [...apps].sort(
        (a, b) => new Date(a.applicationDate) - new Date(b.applicationDate)
    );
    const trendLabels = sortedApps.map(a =>
        new Date(a.applicationDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    );
    let cum = 0;
    const trendData = sortedApps.map(() => ++cum);

    const trendChart = document.getElementById('analyticsTrendChart');
    if (trendChart) {
        new Chart(trendChart, {
            type: 'line',
            data: {
                labels: trendLabels,
                datasets: [{
                    label: 'Total Applications',
                    data: trendData,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99,102,241,0.08)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointBackgroundColor: '#6366f1',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                }],
            },
            options: {
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { font: { family: 'Inter', size: 11 }, maxRotation: 45 }, grid: { display: false } },
                    y: { beginAtZero: true, ticks: { stepSize: 1, font: { family: 'Inter', size: 12 } }, grid: { color: '#f1f5f9' } },
                },
                responsive: true,
                maintainAspectRatio: false,
            },
        });
    }

    // ── stat PILLS ────────────────────────────────────────────
    const map = {
        'analytics-total': total, 'analytics-interviews': interviews,
        'analytics-offers': offers, 'analytics-rejected': rejected,
    };
    Object.entries(map).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    });

});
