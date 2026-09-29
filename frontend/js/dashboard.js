

document.addEventListener('DOMContentLoaded', async () => {

    let apps = [];
  try {
    const res = await apiFetch('/applications');
    if (res) apps = res.data;
  } catch (err) {
    return; // Stop if failed
  }

  // ── CALCULATE STATS ────────────────────────────────────────
  const total = apps.length;
  const interviews = apps.filter(a => a.status === 'Interview').length;
  const offers = apps.filter(a => a.status === 'Offer').length;
  const rejections = apps.filter(a => a.status === 'Rejected').length;
  const assessments = apps.filter(a => a.status === 'Assessment').length;
  const responseRate = total > 0
    ? Math.round(((interviews + offers + rejections) / total) * 100)
    : 0;

  // ── POPULATE STAT CARDS ────────────────────────────────────
  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-interviews').textContent = interviews;
  document.getElementById('stat-offers').textContent = offers;
  document.getElementById('stat-rejections').textContent = rejections;
  document.getElementById('stat-rate').textContent = responseRate + '%';

  // ── RECENT APPLICATIONS TABLE ──────────────────────────────
  const recentBody = document.getElementById('recentAppsBody');
  if (recentBody) {
    const recent = [...apps]
      .sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate))
      .slice(0, 5);

    if (recent.length === 0) {
      recentBody.innerHTML = `
        <tr>
          <td colspan="4">
            <div style="text-align:center;padding:32px;color:var(--color-muted);font-size:14px;">
              <i class="bi bi-inbox" style="font-size:28px;display:block;margin-bottom:8px;color:#cbd5e1;"></i>
              No applications yet —
              <a href="applications.html" style="color:var(--color-primary);">Add your first one!</a>
            </div>
          </td>
        </tr>`;
    } else {
      recentBody.innerHTML = recent.map(app => `
        <tr style="cursor:pointer" onclick="window.location.href='application-detail.html?id=${app.id}'">
          <td>
            <div class="company-cell">
              <div class="company-logo">${app.company[0]}</div>
              <div>
                <div class="company-name">${app.company}</div>
                <div class="job-title">${app.jobTitle}</div>
              </div>
            </div>
          </td>
          <td><span style="font-size:12px;background:#f1f5f9;color:#475569;padding:4px 8px;border-radius:6px;">${app.jobType}</span></td>
          <td>${getStatusBadge(app.status)}</td>
          <td style="color:var(--color-muted);font-size:13px;">${formatDate(app.applicationDate)}</td>
        </tr>
      `).join('');
    }
  }

  // ── UPCOMING INTERVIEWS ────────────────────────────────────
  const upcomingContainer = document.getElementById('upcomingInterviews');
  if (upcomingContainer) {
    const today = new Date();
    const upcoming = apps
      .filter(a => a.interviewDate && new Date(a.interviewDate) >= today)
      .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate))
      .slice(0, 4);

    if (upcoming.length === 0) {
      upcomingContainer.innerHTML = `
        <div style="text-align:center;padding:32px;color:var(--color-muted);font-size:14px;">
          <i class="bi bi-calendar-check" style="font-size:32px;display:block;margin-bottom:10px;color:#cbd5e1;"></i>
          No upcoming interviews
        </div>`;
    } else {
      upcomingContainer.innerHTML = upcoming.map(app => {
        const d = new Date(app.interviewDate);
        const month = d.toLocaleString('en-IN', { month: 'short' }).toUpperCase();
        const day = d.getDate();
        return `
          <div class="interview-item">
            <div class="interview-date-box">
              <span>${month}</span>
              <span class="day">${day}</span>
            </div>
            <div style="flex:1">
              <div style="font-weight:600;font-size:14px;">${app.company}</div>
              <div style="font-size:12.5px;color:var(--color-muted);">${app.jobTitle}</div>
            </div>
            ${getStatusBadge(app.status)}
          </div>`;
      }).join('');
    }
  }

  // ── STATUS CHART (Doughnut) ────────────────────────────────
  const chartCanvas = document.getElementById('statusChart');
  if (chartCanvas) {
    new Chart(chartCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Applied', 'Assessment', 'Interview', 'Offer', 'Rejected'],
        datasets: [{
          data: [
            apps.filter(a => a.status === 'Applied').length,
            assessments,
            interviews,
            offers,
            rejections,
          ],
          backgroundColor: ['#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#ef4444'],
          borderWidth: 0,
          hoverOffset: 6,
        }],
      },
      options: {
        cutout: '72%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { font: { size: 12 }, padding: 14, boxWidth: 12 },
          },
        },
        responsive: true,
        maintainAspectRatio: true,
      },
    });
  }

});
