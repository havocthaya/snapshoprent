/* ---- shared API & auth helpers ---- */
// Use relative URL so it always matches the server port automatically
const API = '/api';

function getToken() { return localStorage.getItem('thayaToken'); }
function getUser() {
    const u = localStorage.getItem('thayaUser');
    return u ? JSON.parse(u) : null;
}
function logout() {
    localStorage.removeItem('thayaToken');
    localStorage.removeItem('thayaUser');
    window.location.href = 'login.html';
}

/* ---- Cart helpers (unified: sale + rental) ---- */
function getCart() {
    const c = localStorage.getItem('thayaCart');
    return c ? JSON.parse(c) : [];
}
function saveCart(cart) {
    localStorage.setItem('thayaCart', JSON.stringify(cart));
    updateCartBadge();
}
function updateCartBadge() {
    const total = getCart().reduce((s, i) => s + i.qty, 0);
    document.querySelectorAll('.cart-count-badge').forEach(el => {
        el.textContent = total;
        el.style.display = total > 0 ? 'inline' : 'none';
    });
}

/* ---- Toast ---- */
function showToast(msg, type = 'info') {
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    const container = document.getElementById('toast-container') || (() => {
        const d = document.createElement('div');
        d.id = 'toast-container';
        d.className = 'toast-container';
        document.body.appendChild(d);
        return d;
    })();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
}

/* ---- Navbar render ---- */
function renderNavbar() {
    const user = getUser();
    const userEl = document.getElementById('nav-user');
    const amazonUserEl = document.getElementById('nav-user-amazon');

    if (userEl) {
        if (user) {
            userEl.innerHTML = `
              <span style="font-size:.85rem;font-weight:600;color:var(--text-muted)">👋 ${user.name}</span>
              ${user.isAdmin ? `<a href="admin.html" class="nav-link"><span>⚙️</span> Admin</a>` : ''}
              <button class="btn-nav-user btn" onclick="logout()">Log Out</button>
            `;
        } else {
            userEl.innerHTML = `
              <a href="login.html" class="nav-link">Log In</a>
              <a href="register.html" class="btn-nav-user btn">Sign Up</a>
            `;
        }
    }

    if (amazonUserEl) {
        if (user) {
            amazonUserEl.innerHTML = `
              <div style="display:flex; flex-direction:column; cursor:pointer;" onclick="${user.isAdmin ? "window.location.href='admin.html'" : "logout()"}">
                <span class="top">Hello, ${user.name.split(' ')[0]} ${user.isAdmin ? '(Admin)' : ''}</span>
                <span class="bottom">${user.isAdmin ? 'Dashboard' : 'Sign Out'} ▾</span>
              </div>
            `;
        } else {
            amazonUserEl.innerHTML = `
              <div style="display:flex; flex-direction:column; cursor:pointer;" onclick="window.location.href='login.html'">
                <span class="top">Hello, sign in</span>
                <span class="bottom">Account & Lists ▾</span>
              </div>
            `;
        }
    }
    const loginCard = document.getElementById('nav-login-card-anchor');
    if (loginCard) {
        if (user) {
            loginCard.innerHTML = `
                <h3 style="text-align:center">Welcome back, ${user.name.split(' ')[0]}!</h3>
                <p style="font-size:0.85rem; text-align:center; margin-bottom:15px;">Check your latest orders and manage rentals.</p>
                <button class="btn btn-shop" style="width: 100%;" onclick="window.location.href='cart.html'">Go to Your Cart</button>
            `;
        } else {
            loginCard.innerHTML = `
                <h3 style="text-align:center">Sign in for your best experience</h3>
                <button class="btn btn-shop" style="width: 100%;" onclick="window.location.href='login.html'">Sign in securely</button>
                <div style="margin-top: 20px; font-size: 0.8rem; text-align: center;">
                    New customer? <a href="register.html" style="color:#007185">Start here.</a>
                </div>
            `;
        }
    }
    updateCartBadge();
}

document.addEventListener('DOMContentLoaded', renderNavbar);
