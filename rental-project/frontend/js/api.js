const API_URL = '/api';

// Auth Headers Helper
const getAuthHeaders = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
        };
    }
    return { 'Content-Type': 'application/json' };
};

// Toast Notifications
const showToast = (message, type = 'success') => {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const bgClass = type === 'success' ? 'bg-success' : 'bg-danger';
    const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle';

    const toastHtml = `
        <div class="toast align-items-center text-white ${bgClass} border-0 show fade-in" role="alert">
            <div class="d-flex p-3">
                <div class="me-2"><i class="${icon}"></i></div>
                <div class="toast-body fw-600">${message}</div>
                <button type="button" class="btn-close btn-close-white ms-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>`;

    toastContainer.innerHTML = toastHtml;
    // Auto remove after 3s
    setTimeout(() => { toastContainer.innerHTML = ''; }, 3000);
};

// Navbar Update Logic
const updateNav = () => {
    const authLinks = document.getElementById('auth-links');
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (userInfo) {
        authLinks.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-outline-primary dropdown-toggle fw-bold" type="button" data-bs-toggle="dropdown">
                    <i class="fas fa-user-circle me-1"></i> ${userInfo.name}
                </button>
                <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2">
                    ${userInfo.isAdmin ? '<li><a class="dropdown-item" href="admin.html"><i class="fas fa-tools me-2"></i>Admin Panel</a></li>' : ''}
                    <li><a class="dropdown-item" href="orders.html"><i class="fas fa-history me-2"></i>My Rentals</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger cursor-pointer" id="logoutBtn"><i class="fas fa-sign-out-alt me-2"></i>Sign Out</a></li>
                </ul>
            </div>`;

        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('userInfo');
            window.location.href = 'index.html';
        });
    } else {
        authLinks.innerHTML = `
            <div class="d-flex gap-2">
                <a href="login.html" class="btn btn-outline-primary fw-600">Sign In</a>
                <a href="register.html" class="btn btn-primary fw-600">Register</a>
            </div>`;
    }
    updateRentalCount();
};

const updateRentalCount = () => {
    const cart = JSON.parse(localStorage.getItem('rentalCart')) || [];
    const badge = document.getElementById('rental-count');
    if (badge) {
        const count = cart.length;
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
    }
};

// Export functions to window
window.API_URL = API_URL;
window.getAuthHeaders = getAuthHeaders;
window.showToast = showToast;
window.updateNav = updateNav;
window.updateRentalCount = updateRentalCount;
