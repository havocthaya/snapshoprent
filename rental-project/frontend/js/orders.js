document.addEventListener('DOMContentLoaded', () => {
    updateNav();
    loadOrders();
});

const loadOrders = async () => {
    const list = document.getElementById('orders-list');
    const countBadge = document.getElementById('order-count');
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const res = await fetch(`${API_URL}/bookings/mybookings`, {
            headers: getAuthHeaders()
        });
        const orders = await res.json();
        
        if (!orders || orders.length === 0) {
            list.innerHTML = `
                <div class="text-center py-5 text-muted">
                    <i class="fas fa-calendar-times fa-3x mb-3 opacity-25"></i>
                    <h4>No bookings found yet</h4>
                    <a href="index.html" class="btn btn-primary mt-3">Browse Rental Gear</a>
                </div>`;
            return;
        }

        countBadge.textContent = `${orders.length} Order(s)`;
        
        list.innerHTML = orders.map((order, idx) => `
            <div class="card mb-4 border-0 shadow-sm rounded-4 overflow-hidden fade-in" style="animation-delay: ${idx * 0.1}s">
                <div class="card-header bg-light border-0 py-3 px-4 d-flex justify-content-between align-items-center">
                    <div>
                        <span class="text-muted small">Booking ID:</span>
                        <span class="fw-bold ms-1">#${order._id.substring(0, 8).toUpperCase()}</span>
                    </div>
                    <span class="badge ${order.status.includes('Confirmed') ? 'bg-success' : 'bg-warning'} px-3 py-2">${order.status}</span>
                </div>
                <div class="card-body p-4">
                    <div class="row align-items-center">
                        <div class="col-md-8">
                            ${order.rentalItems.map(item => `
                                <div class="d-flex align-items-center mb-3">
                                    <img src="${item.image}" class="rounded-3 shadow-sm me-3" style="width: 60px; height: 60px; object-fit: cover;">
                                    <div>
                                        <h6 class="mb-0 fw-bold">${item.name}</h6>
                                        <span class="text-muted small">${item.days} Day(s) @ ₹${item.price.toLocaleString()}/day</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="col-md-4 text-md-end">
                            <p class="text-muted small mb-1">Total Bill</p>
                            <h4 class="fw-bold text-primary mb-0">₹${order.totalPrice.toLocaleString()}</h4>
                            <p class="text-success small fw-600 mb-0 mt-1">Paid Successfully</p>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        list.innerHTML = `
            <div class="alert alert-info">
                 <i class="fas fa-info-circle me-2"></i> Using demo session. Please log in to see your real history.
            </div>`;
    }
};
