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

    // Update Location UI from storage
    const savedLoc = localStorage.getItem('thayaLocation') || 'Mumbai 400001';
    const locText = document.getElementById('current-location-text');
    if (locText) locText.textContent = `Delivering to ${savedLoc}`;
}

/**
 * Geolocation & Location Services
 */
function askForLocation() {
    if (!navigator.geolocation) {
        showToast('Geolocation is not supported by your browser.', 'error');
        return;
    }
    
    showToast('Fetching your current location...', 'info');
    
    navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
            // Reverse Geocoding using free Nominatim API
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            const data = await res.json();
            
            const city = data.address.city || data.address.town || data.address.village || 'Unknown City';
            const postcode = data.address.postcode || '';
            const locationStr = `${city} ${postcode}`.trim();
            
            localStorage.setItem('thayaLocation', locationStr);
            const lTexts = document.querySelectorAll('#current-location-text');
            lTexts.forEach(lt => lt.textContent = `Delivering to ${locationStr}`);
            
            showToast(`Location updated to ${city}!`, 'success');
        } catch (error) {
            const manual = prompt('Could not fetch address automatically. Enter your city/zip:', 'Mumbai 400001');
            if (manual) {
                localStorage.setItem('thayaLocation', manual);
                const lTexts = document.querySelectorAll('#current-location-text');
                lTexts.forEach(lt => lt.textContent = `Delivering to ${manual}`);
            }
        }
    }, (err) => {
        showToast('Location access denied or unavailable.', 'info');
    });
}

/**
 * Reusable Product Card Component
 * Dynamically handles both 'sale' and 'rental' types
 */
function renderProductCard(p) {
    const isRental = p.type === 'rental';
    const id = p._id || p.id;
    const nameEscaped = p.name.replace(/'/g, "\\'");
    
    // Rental Specific Elements
    const rentalInput = isRental ? `
        <div class="days-input-wrap">
            <label for="days-${id}">Days:</label>
            <input type="number" id="days-${id}" min="1" value="1" max="30">
        </div>
    ` : '';

    const priceHtml = isRental ? `
        <span class="price-currency">₹</span>
        <span class="price-amount rental-price">${p.pricePerDay.toLocaleString()}</span>
        <span class="price-unit">/ day</span>
    ` : `
        <span class="price-currency">₹</span>
        <span class="price-amount">${p.price.toLocaleString()}</span>
    `;

    const buttonHtml = isRental ? `
        <button class="btn-add rental" onclick="addRentalToCart('${id}', '${nameEscaped}', ${p.pricePerDay}, '${p.image}', '${p.category}')">
            Rent Now
        </button>
    ` : `
        <button class="btn-add" onclick="addShopToCart('${id}', '${nameEscaped}', ${p.price}, '${p.image}', '${p.category}')">
            Add to Cart
        </button>
    `;

    return `
        <div class="product-card">
            <div class="card-img-wrap">
                <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/400x300?text=${isRental?'Rental':'Product'}'">
                <span class="card-badge ${isRental ? 'rental' : ''}">${isRental ? '🔑 Rent' : '🛍 Buy'}</span>
            </div>
            <div class="card-body">
                <span class="card-cat">${p.category}</span>
                <h3 class="card-name">${p.name}</h3>
                <div class="card-price">${priceHtml}</div>
            </div>
            <div class="card-footer">
                ${rentalInput}
                ${buttonHtml}
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', renderNavbar);
