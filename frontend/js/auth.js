/* ============================================================
   auth.js — Frontend Auth Logic (Stage 6)
   ============================================================
   This file handles logging in and registering via the API.
   It uses the apiFetch wrapper from main.js.
   ============================================================ */

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const emailInput = document.getElementById('loginEmail');
        const passInput = document.getElementById('loginPassword');
        const email = emailInput.value.trim();
        const password = passInput.value;

        // Basic validation matching the old HTML logic
        let valid = true;
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            document.getElementById('emailError').style.display = 'block';
            valid = false;
        } else {
            document.getElementById('emailError').style.display = 'none';
        }

        if (!password) {
            document.getElementById('passwordError').style.display = 'block';
            valid = false;
        } else {
            document.getElementById('passwordError').style.display = 'none';
        }

        if (!valid) return;

        const btn = document.getElementById('loginBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-arrow-repeat" style="animation:spin 1s linear infinite;"></i> Logging in...';
        btn.disabled = true;

        try {
            // POST to backend API (without apiFetch because we don't have/need a token yet)
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Login failed');

            // Save token & user to localStorage
            setToken(data.token);
            localStorage.setItem('sh_user', JSON.stringify({ email }));
            showToast('Login successful!');

            // Redirect to dashboard
            window.location.href = 'dashboard.html';

        } catch (err) {
            console.error(err);
            showToast(err.message, 'error');
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    });
}

const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const pass = document.getElementById('regPassword').value;
        const confirm = document.getElementById('regConfirm').value;
        const agreed = document.getElementById('agreeTerms').checked;

        let valid = true;

        if (!name) { document.getElementById('nameError').style.display = 'block'; valid = false; } else { document.getElementById('nameError').style.display = 'none'; }
        if (!email || !/\S+@\S+\.\S+/.test(email)) { document.getElementById('regEmailError').style.display = 'block'; valid = false; } else { document.getElementById('regEmailError').style.display = 'none'; }

        const passErr = document.getElementById('passError');
        if (pass.length < 8) { passErr.textContent = 'Password must be at least 8 characters.'; passErr.style.display = 'block'; valid = false; } else { passErr.style.display = 'none'; }

        if (pass !== confirm) { document.getElementById('confirmError').style.display = 'block'; valid = false; } else { document.getElementById('confirmError').style.display = 'none'; }
        if (!agreed) { document.getElementById('termsError').style.display = 'block'; valid = false; } else { document.getElementById('termsError').style.display = 'none'; }

        if (!valid) return;

        const btn = document.getElementById('registerBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-arrow-repeat" style="animation:spin 1s linear infinite;"></i> Creating account...';
        btn.disabled = true;

        try {
            const res = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password: pass })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Registration failed');

            setToken(data.token);
            localStorage.setItem('sh_user', JSON.stringify({ name, email }));
            showToast('Account created!');

            window.location.href = 'dashboard.html';

        } catch (err) {
            console.error(err);
            showToast(err.message, 'error');
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    });
}
