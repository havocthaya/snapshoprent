// app.js - Handles logic for index.html (Home Page)

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Navbar
    window.updateNav();

    const productsGrid = document.getElementById('products-grid');
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('error-message');

    // Fetch and display products
    const fetchProducts = async () => {
        loader.style.display = 'block';
        productsGrid.innerHTML = '';
        errorMessage.style.display = 'none';

        try {
            const res = await fetch(`${window.API_URL}/products`);
            if (!res.ok) throw new Error('Failed to fetch products');
            
            const products = await res.json();
            
            if (products.length === 0) {
                productsGrid.innerHTML = '<div class="col-12 text-center text-muted py-5">No products found.</div>';
                return;
            }

            products.forEach(product => {
                const productHTML = `
                    <div class="col-12 col-md-6 col-lg-4 col-xl-3">
                        <div class="card product-card h-100 shadow-sm">
                            <img src="${product.image}" class="card-img-top product-img" alt="${product.name}">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title text-truncate">${product.name}</h5>
                                <p class="card-text text-muted small flex-grow-1">${product.description.substring(0, 60)}...</p>
                                <div class="d-flex justify-content-between align-items-center mt-3">
                                    <span class="price-tag">₹${product.price.toLocaleString('en-IN')}</span>
                                    <button class="btn btn-primary btn-sm add-to-cart-btn" data-id="${product._id}">
                                        <i class="fas fa-cart-plus me-1"></i> Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                productsGrid.insertAdjacentHTML('beforeend', productHTML);
            });

            // Add event listeners to "Add to Cart" buttons
            document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = e.currentTarget.getAttribute('data-id');
                    const product = products.find(p => p._id === productId);
                    addToCart(product);
                });
            });

        } catch (error) {
            errorMessage.textContent = error.message || 'An error occurred';
            errorMessage.style.display = 'block';
        } finally {
            loader.style.display = 'none';
        }
    };

    const addToCart = (product) => {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        const existItem = cartItems.find(x => x.product === product._id);

        if (existItem) {
            // Update quantity
            cartItems = cartItems.map(x => 
                x.product === existItem.product ? { ...x, qty: x.qty + 1 } : x
            );
            window.showToast('Increased item quantity in cart!', 'success');
        } else {
            // Add new item
            cartItems.push({
                product: product._id,
                name: product.name,
                image: product.image,
                price: product.price,
                qty: 1
            });
            window.showToast('Item added to cart!', 'success');
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        window.updateCartCount();
    };

    fetchProducts();
});
