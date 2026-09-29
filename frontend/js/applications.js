/* ============================================================
   applications.js — Applications page logic
   ============================================================
   Handles:
   - Rendering applications as a TABLE or CARD grid
   - Search (filter by company or job title)
   - Status filter dropdown
   - Add / Edit / Delete application (modal + localStorage)
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {

  let currentView = 'table';
  let currentFilter = 'All';
  let searchQuery = '';
  let editingId = null;   // null = adding new, string (ObjectId) = editing

  let apps = [];

  // Stage 6: Load from API
  async function fetchApps() {
    try {
      const res = await apiFetch('/applications');
      if (res) {
        apps = res.data;
        render();
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Initial load
  await fetchApps();


  // ── FILTER APPS ──────────────────────────────────────────
  // Returns the subset of apps matching the current search + filter

  function getFilteredApps() {
    return apps.filter(app => {
      const matchesSearch =
        app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        currentFilter === 'All' || app.status === currentFilter;

      return matchesSearch && matchesFilter;
    });
  }

  // ── RENDER TABLE VIEW ─────────────────────────────────────

  function renderTable(filteredApps) {
    const tbody = document.getElementById('appsTableBody');
    if (!tbody) return;

    if (filteredApps.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7">
            <div class="empty-state">
              <i class="bi bi-inbox"></i>
              <h3>No applications found</h3>
              <p>Try a different search or filter, or add a new application.</p>
              <button class="btn-primary" onclick="openAddModal()">
                <i class="bi bi-plus-lg"></i> Add Application
              </button>
            </div>
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = filteredApps.map(app => `
      <tr>
        <td>
          <div class="company-cell">
            <div class="company-logo">${app.company[0]}</div>
            <div>
              <div class="company-name">${app.company}</div>
              <div class="job-title">${app.location}</div>
            </div>
          </div>
        </td>
        <td>${app.jobTitle}</td>
        <td><span style="font-size:12px;background:#f1f5f9;color:#475569;padding:4px 8px;border-radius:6px;">${app.jobType}</span></td>
        <td>${getStatusBadge(app.status)}</td>
        <td style="color:var(--color-muted);font-size:13px;">${formatDate(app.applicationDate)}</td>
        <td style="color:var(--color-muted);font-size:13px;">${app.salary || '—'}</td>
        <td>
          <div style="display:flex;gap:6px;">
            <button class="btn-secondary" style="padding:6px 10px;font-size:13px;"
              onclick="openDetailPage('${app._id}')">
              <i class="bi bi-eye"></i>
            </button>
            <button class="btn-secondary" style="padding:6px 10px;font-size:13px;"
              onclick="openEditModal('${app._id}')">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn-danger" style="padding:6px 10px;font-size:13px;"
              onclick="deleteApp('${app._id}')">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // ── RENDER CARD VIEW ──────────────────────────────────────

  function renderCards(filteredApps) {
    const grid = document.getElementById('appsCardGrid');
    if (!grid) return;

    if (filteredApps.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <i class="bi bi-inbox"></i>
          <h3>No applications found</h3>
          <p>Try a different search or filter.</p>
        </div>`;
      return;
    }

    grid.innerHTML = filteredApps.map(app => `
      <div class="app-card" onclick="openDetailPage('${app._id}')">
        <div class="app-card-header">
          <div style="display:flex;align-items:center;gap:12px;">
            <div class="company-logo">${app.company[0]}</div>
            <div>
              <div style="font-weight:700;font-size:15px;">${app.company}</div>
              <div style="font-size:13px;color:var(--color-muted);">${app.jobTitle}</div>
            </div>
          </div>
          ${getStatusBadge(app.status)}
        </div>
        <div class="app-card-meta">
          <span><i class="bi bi-geo-alt"></i>${app.location}</span>
          <span><i class="bi bi-briefcase"></i>${app.jobType}</span>
          ${app.salary ? `<span><i class="bi bi-currency-rupee"></i>${app.salary}</span>` : ''}
          <span><i class="bi bi-calendar3"></i>${formatDate(app.applicationDate)}</span>
        </div>
        ${app.notes ? `<div style="margin-top:10px;font-size:12.5px;color:var(--color-muted);border-top:1px solid var(--color-border);padding-top:10px;">${app.notes}</div>` : ''}
        <div class="app-card-actions" onclick="event.stopPropagation()">
          <button class="btn-secondary" style="flex:1;justify-content:center;font-size:13px;"
            onclick="openEditModal('${app._id}')">
            <i class="bi bi-pencil"></i> Edit
          </button>
          <button class="btn-danger" style="font-size:13px;"
            onclick="deleteApp('${app._id}')">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  // ── MAIN RENDER ───────────────────────────────────────────
  // Switches between table and card view, updates count badge

  function render() {
    const filtered = getFilteredApps();
    const tableWrap = document.getElementById('tableView');
    const cardWrap = document.getElementById('cardView');
    const countEl = document.getElementById('appCount');

    if (countEl) countEl.textContent = `${filtered.length} application${filtered.length !== 1 ? 's' : ''}`;

    if (currentView === 'table') {
      if (tableWrap) tableWrap.style.display = 'block';
      if (cardWrap) cardWrap.style.display = 'none';
      renderTable(filtered);
    } else {
      if (tableWrap) tableWrap.style.display = 'none';
      if (cardWrap) cardWrap.style.display = 'grid';
      renderCards(filtered);
    }
  }

  // ── SEARCH ───────────────────────────────────────────────

  const searchInput = document.getElementById('appSearch');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      searchQuery = e.target.value;
      render();
    });
  }

  // ── STATUS FILTER ─────────────────────────────────────────

  const filterSelect = document.getElementById('statusFilter');
  if (filterSelect) {
    filterSelect.addEventListener('change', e => {
      currentFilter = e.target.value;
      render();
    });
  }

  // ── VIEW TOGGLE (Table ↔ Card) ───────────────────────────

  const btnTableView = document.getElementById('btnTableView');
  const btnCardView = document.getElementById('btnCardView');

  if (btnTableView) {
    btnTableView.addEventListener('click', () => {
      currentView = 'table';
      btnTableView.classList.add('active');
      btnCardView.classList.remove('active');
      render();
    });
  }

  if (btnCardView) {
    btnCardView.addEventListener('click', () => {
      currentView = 'card';
      btnCardView.classList.add('active');
      btnTableView.classList.remove('active');
      render();
    });
  }

  // ── ADD / EDIT MODAL ──────────────────────────────────────

  window.openAddModal = function () {
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Add Application';
    document.getElementById('appForm').reset();
    // Set today's date as default
    document.getElementById('fieldDate').value = new Date().toISOString().split('T')[0];
    openModal('appModal');
  };

  window.openEditModal = function (id) {
    editingId = id;
    const app = apps.find(a => a._id === id); // ObjectId match
    if (!app) return;

    document.getElementById('modalTitle').textContent = 'Edit Application';
    document.getElementById('fieldCompany').value = app.company;
    document.getElementById('fieldTitle').value = app.jobTitle;
    document.getElementById('fieldLocation').value = app.location;
    document.getElementById('fieldJobType').value = app.jobType;
    document.getElementById('fieldSalary').value = app.salary;

    // Parse Dates correctly for date inputs
    document.getElementById('fieldDate').value = app.applicationDate ? app.applicationDate.split('T')[0] : '';
    document.getElementById('fieldStatus').value = app.status;
    document.getElementById('fieldInterview').value = app.interviewDate ? app.interviewDate.split('T')[0] : '';

    document.getElementById('fieldUrl').value = app.jobUrl;
    document.getElementById('fieldNotes').value = app.notes;
    openModal('appModal');
  };

  // ── SAVE (Add or Update) ──────────────────────────────────

  const appForm = document.getElementById('appForm');
  if (appForm) {
    appForm.addEventListener('submit', async e => {
      e.preventDefault();

      const data = {
        company: document.getElementById('fieldCompany').value.trim(),
        jobTitle: document.getElementById('fieldTitle').value.trim(),
        location: document.getElementById('fieldLocation').value.trim(),
        jobType: document.getElementById('fieldJobType').value,
        salary: document.getElementById('fieldSalary').value.trim(),
        applicationDate: document.getElementById('fieldDate').value,
        status: document.getElementById('fieldStatus').value,
        interviewDate: document.getElementById('fieldInterview').value || null,
        jobUrl: document.getElementById('fieldUrl').value.trim(),
        notes: document.getElementById('fieldNotes').value.trim(),
      };

      const btn = appForm.querySelector('.btn-primary');
      const originalHtml = btn.innerHTML;
      btn.innerHTML = 'Saving...';
      btn.disabled = true;

      try {
        if (editingId) {
          // Update via PUT to API
          await apiFetch(`/applications/${editingId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
          });
          showToast('Application updated!', 'success');
        } else {
          // Add via POST to API
          await apiFetch('/applications', {
            method: 'POST',
            body: JSON.stringify(data)
          });
          showToast('Application added!', 'success');
        }

        closeModal('appModal');
        await fetchApps(); // Refresh view directly from Server
      } catch (err) {
        // Error already toasted by apiFetch
      } finally {
        btn.innerHTML = originalHtml;
        btn.disabled = false;
      }
    });
  }

  // ── DELETE ────────────────────────────────────────────────
  // Stage 2: now uses showConfirm() from main.js instead of
  // the ugly browser confirm() dialog.

  window.deleteApp = function (id) {
    const app = apps.find(a => a._id === id);
    showConfirm(
      'Delete Application',
      `Are you sure you want to delete <strong>${app?.company || 'this application'}</strong>? This cannot be undone.`,
      async () => {
        try {
          await apiFetch(`/applications/${id}`, { method: 'DELETE' });
          showToast('Application deleted.', 'error');
          await fetchApps(); // Refresh directly from db
        } catch (err) {
          // handled in apiFetch
        }
      }
    );
  };

  // ── NAVIGATE TO DETAIL PAGE ──────────────────────────────

  window.openDetailPage = function (id) {
    window.location.href = `application-detail.html?id=${id}`;
  };

  // Rendering is now triggered by fetchApps() instead of at the end of script
});
