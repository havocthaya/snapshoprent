document.addEventListener('DOMContentLoaded', () => {
    updateNav();
    renderCart();

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', placeBooking);
    }
});

const renderCart = () => {
    const list = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('rentalCart')) || [];

    if (cart.length === 0) {
        list.innerHTML = `
            <div class="text-center py-5 text-muted">
                <i class="fas fa-shopping-basket fa-3x mb-3 opacity-25"></i>
                <h4>Your bag is empty...</h4>
                <a href="index.html" class="btn btn-primary mt-3 px-4">Start Browsing</a>
            </div>`;
        updateTotals(0);
        return;
    }

    list.innerHTML = cart.map((item, idx) => `
        <div class="card mb-3 border-0 bg-light rounded-4 overflow-hidden fade-in" style="animation-delay: ${idx * 0.1}s">
            <div class="row g-0 align-items-center">
                <div class="col-md-3">
                    <img src="${item.image}" class="img-fluid rounded-start h-100 object-fit-cover" style="max-height: 150px; width: 100%" alt="${item.name}">
                </div>
                <div class="col-md-6">
                    <div class="card-body">
                        <h5 class="card-title fw-bold mb-1">${item.name}</h5>
                        <p class="text-muted small mb-0">₹${item.price.toLocaleString()} / day</p>
                        <div class="mt-2 text-primary fw-600">
                            Duration: <span class="badge bg-white text-primary border ms-1">${item.days} Day(s)</span>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 text-end px-4">
                    <div class="d-flex align-items-center justify-content-end mb-3">
                        <button class="btn btn-sm btn-outline-secondary rounded-circle px-2" onclick="updateDuration('${item.id}', -1)">-</button>
                        <span class="mx-3 fw-bold">${item.days}</span>
                        <button class="btn btn-sm btn-outline-secondary rounded-circle px-2" onclick="updateDuration('${item.id}', 1)">+</button>
                    </div>
                    <button class="btn btn-sm text-danger border-0 p-0" onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-trash-alt me-1"></i> Remove
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.days), 0);
    updateTotals(subtotal);
};

const updateDuration = (id, change) => {
    let cart = JSON.parse(localStorage.getItem('rentalCart')) || [];
    const item = cart.find(i => i.id === id);
    if (item) {
        item.days = Math.max(1, item.days + change);
        localStorage.setItem('rentalCart', JSON.stringify(cart));
        renderCart();
    }
};

const removeFromCart = (id) => {
    let cart = JSON.parse(localStorage.getItem('rentalCart')) || [];
    cart = cart.filter(i => i.id !== id);
    localStorage.setItem('rentalCart', JSON.stringify(cart));
    renderCart();
    updateRentalCount();
    showToast('Item removed from your bag', 'info');
};

const updateTotals = (subtotal) => {
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total-cost');
    
    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString()}`;
    if (totalEl) totalEl.textContent = `₹${(subtotal + 1000).toLocaleString()}`;
};

const placeBooking = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
        showToast('Please Sign In to complete your booking', 'danger');
        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
        return;
    }

    const cart = JSON.parse(localStorage.getItem('rentalCart')) || [];
    if (cart.length === 0) return;

    const bookingData = {
        rentalItems: cart.map(item => ({
            name: item.name,
            qty: 1,
            days: item.days,
            image: item.image,
            price: item.price,
            product: item.id
        })),
        totalPrice: cart.reduce((acc, item) => acc + (item.price * item.days), 0) + 1000,
    };

    try {
        const res = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(bookingData)
        });

        if (res.ok) {
            localStorage.removeItem('rentalCart');
            const myModal = new bootstrap.Modal(document.getElementById('orderModal'));
            myModal.show();
            updateRentalCount();
        } else {
            const data = await res.json();
            showToast(data.message || 'Booking failed', 'danger');
        }
    } catch (error) {
        showToast('Network error, booking saved as draft', 'info');
    }
};

window.updateDuration = updateDuration;
window.removeFromCart = removeFromCart;
