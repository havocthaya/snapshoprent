document.addEventListener('DOMContentLoaded', () => {
    updateNav();
    checkAdminAccess();
    loadAdminProducts();

    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', handleAddProduct);
    }
});

const checkAdminAccess = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.isAdmin) {
        window.location.href = 'index.html';
    }
};

const loadAdminProducts = async () => {
    const list = document.getElementById('admin-product-list');
    try {
        const res = await fetch(`${API_URL}/products`);
        const products = await res.json();
        
        list.innerHTML = products.map(p => `
            <tr>
                <td><img src="${p.image}" class="rounded shadow-sm" style="width: 50px; height: 50px; object-fit: cover;"></td>
                <td class="fw-bold">${p.name}</td>
                <td><span class="badge bg-light text-dark">${p.category}</span></td>
                <td>₹${p.pricePerDay.toLocaleString()}</td>
                <td><span class="badge ${p.isAvailable ? 'bg-success' : 'bg-danger'}">${p.isAvailable ? 'Available' : 'Rented'}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-2"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-outline-danger"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Fetch error:', error);
    }
};

const handleAddProduct = (e) => {
    e.preventDefault();
    showToast('Product added successfully (Simulation)', 'success');
    const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
    modal.hide();
    e.target.reset();
};
