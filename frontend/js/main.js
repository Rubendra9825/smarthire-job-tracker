/* ============================================================
   main.js — Shared utilities  (Stage 2: data sync + confirm modal)
   ============================================================
   STAGE 2 ADDITIONS:
   1. loadApps() / saveApps() — shared functions used by dashboard,
      applications, analytics, and detail pages so they all see
      the same data from localStorage.
   2. showConfirm() — a pretty custom modal to replace the ugly
      browser confirm() dialog used by delete buttons.
   3. Topbar search — wires the topbar search box to filter apps
      on the Applications page if we're on that page.
   4. Escape key — pressing Escape closes any open modal.
   ============================================================ */

// ── SIDEBAR TOGGLE (Mobile) ──────────────────────────────────
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');
const toggleBtn = document.getElementById('sidebarToggle');

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.add('open');
    overlay.classList.add('visible');
  });
}

if (overlay) {
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
  });
}

// ── ACTIVE NAV LINK ──────────────────────────────────────────
function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-nav a').forEach(link => {
    if (link.getAttribute('href')?.includes(currentPage)) {
      link.classList.add('active');
    }
  });
}
setActiveNav();

// ── AUTH GUARD ───────────────────────────────────────────────
// Stage 5 (JWT): Check localStorage for real token.
function getToken() {
  return localStorage.getItem('sh_token');
}

function setToken(token) {
  localStorage.setItem('sh_token', token);
}

function logout() {
  localStorage.removeItem('sh_token');
  localStorage.removeItem('sh_user');
  window.location.href = 'login.html';
}

function requireAuth() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const isAuthPage = currentPage === 'login.html' || currentPage === 'register.html';

  // If not on an auth page and token is missing, redirect to login
  if (!isAuthPage && !getToken()) {
    window.location.href = 'login.html';
  }

  // If on an auth page and token exists, redirect to dashboard
  if (isAuthPage && getToken()) {
    window.location.href = 'dashboard.html';
  }
}
requireAuth();

// ── USER DISPLAY ─────────────────────────────────────────────
const MOCK_USER = { name: 'Alex Johnson', email: 'alex@example.com', initials: 'AJ' };

const storedUser = JSON.parse(localStorage.getItem('sh_user') || 'null');
const displayUser = storedUser || MOCK_USER;
const safeName = displayUser.name || 'Demo User';
const displayInitials = safeName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

document.getElementById('topbarUserName')?.setAttribute('textContent', safeName);
const nameEl = document.getElementById('topbarUserName');
const avatarEl = document.getElementById('topbarUserAvatar');
if (nameEl) nameEl.textContent = safeName;
if (avatarEl) avatarEl.textContent = displayInitials;

// ── API INTEGRATION LAYER (STAGE 6) ──────────────────────────
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * apiFetch()
 * Central wrapper for all fetch calls.
 * Automatically injects the JWT token and handles 401 Unauthorized errors.
 */
async function apiFetch(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    // If token is invalid or expired, force logout
    if (response.status === 401) {
      logout();
      return null;
    }

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data; // Returns the parsed JSON body { success: true, data: ... }
  } catch (error) {
    console.error('API Error:', error);
    showToast(error.message, 'error');
    throw error;
  }
}

// ── STATUS BADGE HELPER ──────────────────────────────────────
function getStatusBadge(status) {
  const map = {
    Applied: { cls: 'badge-applied', icon: 'bi-send' },
    Assessment: { cls: 'badge-assessment', icon: 'bi-clipboard-check' },
    Interview: { cls: 'badge-interview', icon: 'bi-person-video2' },
    Offer: { cls: 'badge-offer', icon: 'bi-trophy' },
    Rejected: { cls: 'badge-rejected', icon: 'bi-x-circle' },
  };
  const s = map[status] || { cls: 'badge-applied', icon: 'bi-circle' };
  return `<span class="badge-status ${s.cls}"><i class="bi ${s.icon}"></i>${status}</span>`;
}

// ── FORMAT DATE ──────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

// ── TOAST NOTIFICATION ───────────────────────────────────────
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icon = type === 'success' ? 'bi-check-circle-fill' : 'bi-x-circle-fill';
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="bi ${icon}"></i><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ── CUSTOM CONFIRM DIALOG ────────────────────────────────────
// ⭐ STAGE 2 ADDITION ⭐
// Replaces the ugly browser confirm() with a styled modal.
//
// Usage:
//   showConfirm('Delete this application?', 'This cannot be undone.', () => {
//     // runs when user clicks "Confirm"
//     deleteApp(id);
//   });

function showConfirm(title, message, onConfirm) {
  // Build the modal HTML and insert it into the page
  const id = 'confirmModal_' + Date.now();
  const html = `
    <div class="modal-overlay" id="${id}" style="z-index:3000;">
      <div class="modal-box" style="max-width:420px;">
        <div class="modal-header">
          <h3 style="display:flex;align-items:center;gap:8px;">
            <i class="bi bi-exclamation-triangle-fill" style="color:#ef4444;font-size:18px;"></i>
            ${title}
          </h3>
          <button class="modal-close" onclick="closeModal('${id}')">&times;</button>
        </div>
        <div class="modal-body">
          <p style="font-size:14px;color:var(--color-muted);">${message}</p>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" onclick="closeModal('${id}')">Cancel</button>
          <button class="btn-danger" id="confirmOk_${id}" style="background:#ef4444;color:#fff;border:none;padding:10px 20px;">
            <i class="bi bi-trash"></i> Delete
          </button>
        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', html);
  openModal(id);

  document.getElementById(`confirmOk_${id}`).addEventListener('click', () => {
    closeModal(id);
    setTimeout(() => document.getElementById(id)?.remove(), 300);
    onConfirm();
  });

  // Clean up when cancelled
  document.getElementById(id).addEventListener('click', e => {
    if (e.target.id === id) {
      closeModal(id);
      setTimeout(() => document.getElementById(id)?.remove(), 300);
    }
  });
}

// ── MODAL HELPERS ────────────────────────────────────────────
function openModal(overlayId) {
  document.getElementById(overlayId)?.classList.add('open');
}

function closeModal(overlayId) {
  document.getElementById(overlayId)?.classList.remove('open');
}

// ── PRESS ESCAPE TO CLOSE MODALS ────────────────────────────
// ⭐ STAGE 2 ADDITION ⭐  — makes modals feel polished
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open');
    });
  }
});

// Auto-close on clicking outside
document.querySelectorAll('.modal-overlay').forEach(mo => {
  mo.addEventListener('click', e => {
    if (e.target === mo) mo.classList.remove('open');
  });
});

// ── TOPBAR SEARCH (Applications page wiring) ─────────────────
// ⭐ STAGE 2 ADDITION ⭐
// On the Applications page, the topbar search box also triggers
// the same filter that the main filter bar uses.
// We do this by syncing the topbar input value to #appSearch.

const topbarInput = document.querySelector('.topbar-search input');
const mainSearch = document.getElementById('appSearch');

if (topbarInput && mainSearch) {
  topbarInput.addEventListener('input', () => {
    mainSearch.value = topbarInput.value;
    // Dispatch an 'input' event so applications.js picks it up
    mainSearch.dispatchEvent(new Event('input'));
  });

  // Keep them in sync the other way too
  mainSearch.addEventListener('input', () => {
    topbarInput.value = mainSearch.value;
  });
}
