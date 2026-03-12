// admin.js - Handles logic for admin.html

document.addEventListener('DOMContentLoaded', () => {
    window.updateNav();

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.isAdmin) {
        window.location.href = 'index.html'; // Redirect non-admins
    }

    const tbody = document.getElementById('products-tbody');
    const ordersTbody = document.getElementById('orders-tbody');
    const adminError = document.getElementById('admin-error');
    
    // Modal elements
    const productModal = new bootstrap.Modal(document.getElementById('productModal'));
    const modalTitle = document.getElementById('modal-title');
    const productForm = document.getElementById('product-form');
    const pid = document.getElementById('product-id');
    const pname = document.getElementById('p-name');
    const pprice = document.getElementById('p-price');
    const pimage = document.getElementById('p-image');
    const pdesc = document.getElementById('p-description');
    const modalError = document.getElementById('modal-error');
    const btnSaveProduct = document.getElementById('btn-save-product');

    // Fetch Products
    const fetchAdminProducts = async () => {
        try {
            const res = await fetch(`${window.API_URL}/products`);
            if (!res.ok) throw new Error('Failed to fetch products');
            
            const products = await res.json();
            
            let html = '';
            if (products.length === 0) {
                html = '<tr><td colspan="5" class="text-center py-4">No products found. Add one above.</td></tr>';
            } else {
                products.forEach(p => {
                    // Store product data in a data attribute
                    const productDataStr = JSON.stringify(p).replace(/'/g, "&apos;").replace(/"/g, "&quot;");
                    
                    html += `
                        <tr>
                            <td class="text-truncate" style="max-width: 100px;">${p._id}</td>
                            <td><strong>${p.name}</strong></td>
                            <td>$${p.price.toFixed(2)}</td>
                            <td class="text-truncate" style="max-width: 150px;">
                                <a href="${p.image}" target="_blank" class="text-decoration-none">View Image</a>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary btn-edit me-2" data-product='${productDataStr}'>
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${p._id}">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    `;
                });
            }
            tbody.innerHTML = html;

            // Attach listeners to newly created buttons
            document.querySelectorAll('.btn-edit').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productStr = e.currentTarget.getAttribute('data-product');
                    // Unescape quotes before parsing
                    const unescapedStr = productStr.replace(/&quot;/g, '"').replace(/&apos;/g, "'");
                    const p = JSON.parse(unescapedStr);
                    
                    modalTitle.textContent = 'Edit Product';
                    pid.value = p._id;
                    pname.value = p.name;
                    pprice.value = p.price;
                    pimage.value = p.image;
                    pdesc.value = p.description;
                    
                    modalError.style.display = 'none';
                    productModal.show();
                });
            });

            document.querySelectorAll('.btn-delete').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    if(confirm("Are you sure you want to delete this product?")) {
                        const id = e.currentTarget.getAttribute('data-id');
                        await deleteProduct(id);
                    }
                });
            });

        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-danger text-center">${error.message}</td></tr>`;
        }
    };

    // Open Modal for Create
    document.getElementById('btn-create-product').addEventListener('click', () => {
        modalTitle.textContent = 'Create Product';
        pid.value = '';
        productForm.reset();
        modalError.style.display = 'none';
    });

    // Save or Update Product
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const isUpdate = pid.value !== '';
        const url = isUpdate ? `${window.API_URL}/products/${pid.value}` : `${window.API_URL}/products`;
        const method = isUpdate ? 'PUT' : 'POST';
        
        btnSaveProduct.disabled = true;
        btnSaveProduct.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';
        modalError.style.display = 'none';

        try {
            const res = await fetch(url, {
                method,
                headers: window.getAuthHeaders(),
                body: JSON.stringify({
                    name: pname.value,
                    price: Number(pprice.value),
                    image: pimage.value,
                    description: pdesc.value
                })
            });

            const data = await res.json();

            if (res.ok) {
                window.showToast(isUpdate ? 'Product updated successfully' : 'Product created successfully', 'success');
                productModal.hide();
                fetchAdminProducts();
            } else {
                throw new Error(data.message || 'Error saving product');
            }
        } catch (error) {
            modalError.textContent = error.message;
            modalError.style.display = 'block';
        } finally {
            btnSaveProduct.disabled = false;
            btnSaveProduct.innerHTML = 'Save Product';
        }
    });

    // Delete Product
    const deleteProduct = async (id) => {
        try {
            const res = await fetch(`${window.API_URL}/products/${id}`, {
                method: 'DELETE',
                headers: window.getAuthHeaders()
            });

            const data = await res.json();

            if (res.ok) {
                window.showToast('Product deleted successfully', 'success');
                fetchAdminProducts();
            } else {
                throw new Error(data.message || 'Error deleting product');
            }
        } catch (error) {
            adminError.textContent = error.message;
            adminError.style.display = 'block';
        }
    };

    // Fetch Orders
    const fetchAdminOrders = async () => {
        try {
            const res = await fetch(`${window.API_URL}/orders`, {
                headers: window.getAuthHeaders()
            });
            if (!res.ok) throw new Error('Failed to fetch orders');
            
            const orders = await res.json();
            
            let html = '';
            if (orders.length === 0) {
                html = '<tr><td colspan="6" class="text-center py-4">No orders found.</td></tr>';
            } else {
                orders.forEach(o => {
                    const date = new Date(o.createdAt).toLocaleDateString();
                    const statusClass = 'text-success fw-bold'; // Simplified status logic
                    const userName = o.user ? o.user.name : 'Deleted User';
                    
                    html += `
                        <tr>
                            <td class="text-truncate" style="max-width: 120px;">
                                <small class="text-muted">${o._id}</small>
                            </td>
                            <td>${userName}</td>
                            <td>${date}</td>
                            <td class="fw-bold text-primary">₹${o.totalPrice.toLocaleString('en-IN')}</td>
                            <td>
                                <span class="badge ${o.paymentMethod === 'Online Payment' ? 'bg-primary' : 'bg-secondary'}">
                                    ${o.paymentMethod}
                                </span>
                            </td>
                            <td><span class="${statusClass}">Completed</span></td>
                        </tr>
                    `;
                });
            }
            ordersTbody.innerHTML = html;
        } catch (error) {
            ordersTbody.innerHTML = `<tr><td colspan="6" class="text-danger text-center">${error.message}</td></tr>`;
        }
    };

    fetchAdminProducts();
    fetchAdminOrders();
});
