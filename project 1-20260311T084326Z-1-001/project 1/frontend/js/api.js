// API Configuration
const API_URL = '/api';

// Helper to get headers
const getAuthHeaders = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
        };
    } else {
        return {
            'Content-Type': 'application/json',
        };
    }
};

// Update UI based on auth state
const updateNav = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const authLinksList = document.getElementById('auth-links');

    if (!authLinksList) return;

    if (userInfo) {
        let adminLink = userInfo.isAdmin ?
            `<li class="nav-item"><a class="nav-link" href="admin.html">Admin</a></li>` : '';

        authLinksList.innerHTML = `
            ${adminLink}
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle fw-bold" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                    <i class="fas fa-user me-1"></i> ${userInfo.name}
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item cursor-pointer" id="logoutBtn">Logout</a></li>
                </ul>
            </li>
        `;

        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('userInfo');
            window.location.href = 'index.html';
        });
    } else {
        authLinksList.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="login.html"><i class="fas fa-sign-in-alt me-1"></i> Login</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="register.html"><i class="fas fa-user-plus me-1"></i> Register</a>
            </li>
        `;
    }

    updateCartCount();
};

const updateCartCount = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        const count = cartItems.reduce((acc, item) => acc + item.qty, 0);
        cartCountEl.textContent = count;
        cartCountEl.style.display = count > 0 ? 'inline-block' : 'none';
    }
};

// Show Toast Notification
const showToast = (message, type = 'success') => {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const bgClass = type === 'success' ? 'bg-success' : 'bg-danger';

    const toastHtml = `
        <div class="toast align-items-center text-white ${bgClass} border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;

    toastContainer.innerHTML = toastHtml;

    setTimeout(() => {
        toastContainer.innerHTML = '';
    }, 3000);
};

// Export to window for global access
window.API_URL = API_URL;
window.getAuthHeaders = getAuthHeaders;
window.updateNav = updateNav;
window.updateCartCount = updateCartCount;
window.showToast = showToast;
