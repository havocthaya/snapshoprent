document.addEventListener('DOMContentLoaded', () => {
    updateNav();
    loadProducts();

    // Event listeners
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.toLowerCase();
            loadProducts(query);
        });

        // Search on Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.toLowerCase();
                loadProducts(query);
            }
        });
    }

    // Category click handler
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active', 'btn-primary'));
            document.querySelectorAll('.category-btn').forEach(b => b.classList.add('btn-outline-secondary'));
            
            btn.classList.remove('btn-outline-secondary');
            btn.classList.add('active', 'btn-primary');
            
            const category = btn.getAttribute('data-category');
            loadProducts('', category);
        });
    });
});

const loadProducts = async (query = '', category = 'All') => {
    const list = document.getElementById('product-list');
    if (!list) return;

    try {
        const res = await fetch(`${API_URL}/products`);
        const allProducts = await res.json();
        
        // Client-side Filter
        let filtered = allProducts.filter(p => {
            const matchQuery = p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
            const matchCategory = category === 'All' || p.category === category;
            return matchQuery && matchCategory;
        });

        if (filtered.length === 0) {
            list.innerHTML = `
                <div class="col-12 py-5 text-center text-muted">
                    <i class="fas fa-search fa-3x mb-3 opacity-25"></i>
                    <h4>No rental items found...</h4>
                    <button class="btn btn-primary mt-3" onclick="window.location.reload()">Clear Filters</button>
                </div>`;
            return;
        }

        renderProducts(filtered);
    } catch (error) {
        console.error('Fetch error:', error);
        list.innerHTML = `
            <div class="alert alert-danger col-12 m-2">
                <i class="fas fa-exclamation-triangle me-2"></i> Unable to connect to the rental database.
            </div>`;
    }
};

const renderProducts = (products) => {
    const list = document.getElementById('product-list');
    list.innerHTML = products.map((p, idx) => `
        <div class="col fade-in" style="animation-delay: ${idx * 0.1}s">
            <div class="product-card">
                <div class="product-img-wrapper">
                    <span class="category-badge">${p.category}</span>
                    <img src="${p.image}" class="product-img" alt="${p.name}">
                </div>
                <div class="product-info d-flex flex-column h-100">
                    <h5 class="product-name text-truncate">${p.name}</h5>
                    <p class="text-muted small flex-grow-1">${p.description.substring(0, 70)}...</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <div>
                            <span class="product-price">₹${p.pricePerDay.toLocaleString()}</span>
                            <span class="price-unit">/ day</span>
                        </div>
                        <button class="btn btn-primary btn-sm rounded-circle px-3 py-2" onclick="addToRentalCart('${p._id}', '${p.name.replace(/'/g, "\\'")}', '${p.pricePerDay}', '${p.image}')">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
};

const addToRentalCart = (id, name, price, image) => {
    // Rental Cart Logic
    const cart = JSON.parse(localStorage.getItem('rentalCart')) || [];
    
    // Check if duplicate
    const exists = cart.find(item => item.id === id);
    if (!exists) {
        cart.push({ id, name, price: Number(price), image, days: 1 });
        localStorage.setItem('rentalCart', JSON.stringify(cart));
        showToast('Successfully added to your Rental Bag!', 'success');
        updateRentalCount();
    } else {
        showToast('Item already in your Rental Bag', 'info');
    }
};

window.addToRentalCart = addToRentalCart;
