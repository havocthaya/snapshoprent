// cart.js - Handles logic for cart.html

document.addEventListener('DOMContentLoaded', () => {
    window.updateNav();

    const cartContainer = document.getElementById('cart-items-container');
    const summaryCard = document.getElementById('cart-summary');
    const qtySpan = document.getElementById('summary-qty');
    const priceSpan = document.getElementById('summary-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    const authWarning = document.getElementById('auth-warning');
    const orderError = document.getElementById('order-error');

    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const renderCart = () => {
        cartContainer.innerHTML = '';
        
        if (cartItems.length === 0) {
            cartContainer.innerHTML = `
                <div class="text-center py-5">
                    <div class="mb-3"><i class="fas fa-shopping-cart fa-3x text-muted"></i></div>
                    <h4>Your cart is empty</h4>
                    <p class="text-muted">Looks like you haven't added anything to your cart yet.</p>
                    <a href="index.html" class="btn btn-outline-primary mt-3">Go Shopping</a>
                </div>
            `;
            summaryCard.style.display = 'none';
            return;
        }

        summaryCard.style.display = 'block';

        let listHtml = '<ul class="list-group list-group-flush mb-4 shadow-sm rounded-3 overflow-hidden">';
        cartItems.forEach(item => {
            listHtml += `
                <li class="list-group-item p-3 p-md-4">
                    <div class="row align-items-center">
                        <div class="col-3 col-md-2">
                            <img src="${item.image}" alt="${item.name}" class="img-fluid rounded border p-1" style="height: 80px; object-fit: contain;">
                        </div>
                        <div class="col-5 col-md-5">
                            <h6 class="mb-1 text-truncate">${item.name}</h6>
                            <span class="text-primary fw-bold">₹${Number(item.price).toLocaleString('en-IN')}</span>
                        </div>
                        <div class="col-4 col-md-3">
                            <select class="form-select qty-select" data-id="${item.product}">
                                ${[...Array(10).keys()].map(x => 
                                    `<option value="${x + 1}" ${item.qty === x + 1 ? 'selected' : ''}>${x + 1}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div class="col-12 col-md-2 text-md-end mt-3 mt-md-0 text-center">
                            <button class="btn btn-outline-danger btn-sm delete-btn" data-id="${item.product}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </li>
            `;
        });
        listHtml += '</ul>';
        cartContainer.innerHTML = listHtml;

        // Add Event Listeners for Quantities and Deletes
        document.querySelectorAll('.qty-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const id = e.target.getAttribute('data-id');
                const newQty = Number(e.target.value);
                cartItems = cartItems.map(item => item.product === id ? { ...item, qty: newQty } : item);
                saveAndReRender();
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                cartItems = cartItems.filter(item => item.product !== id);
                saveAndReRender();
                window.showToast('Item removed from cart', 'success');
            });
        });

        updateSummary();
    };

    const updateSummary = () => {
        const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);
        const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
        
        qtySpan.textContent = totalQty;
        priceSpan.textContent = totalPrice.toLocaleString('en-IN');
        
        window.updateCartCount();
    };

    const saveAndReRender = () => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        renderCart();
    };

    renderCart();

    const checkoutForm = document.getElementById('checkout-form');

    // Checkout Logic
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent page reload
            
            if (!userInfo) {
                authWarning.style.display = 'block';
                return;
            }

            const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);
            
            // Get form values
            const address = document.getElementById('ship-address').value;
            const city = document.getElementById('ship-city').value;
            const postalCode = document.getElementById('ship-postal').value;
            const country = document.getElementById('ship-country').value;
            
            const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

            const shippingAddress = { address, city, postalCode, country };
            
            const btn = document.getElementById('checkout-btn');
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing Order...';
            orderError.style.display = 'none';

            try {
                // Simulate Online Payment Processing Delay
                if (paymentMethod === 'Online Payment') {
                    btn.innerHTML = '<i class="fas fa-lock me-2"></i>Processing Payment...';
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Fake 2 second delay for payment gateway
                }

                const res = await fetch(`${window.API_URL}/orders`, {
                    method: 'POST',
                    headers: window.getAuthHeaders(),
                    body: JSON.stringify({
                        orderItems: cartItems,
                        shippingAddress,
                        paymentMethod,
                        totalPrice: Number(totalPrice)
                    })
                });

                const data = await res.json();

                if (res.ok) {
                    localStorage.removeItem('cartItems');
                    cartItems = [];
                    window.updateCartCount();
                    renderCart();
                    
                    const successMsg = paymentMethod === 'Online Payment' 
                        ? 'Payment Successful! Order placed.' 
                        : 'Order placed via Cash On Delivery!';
                        
                    window.showToast(successMsg + ` (ID: ${data._id})`, 'success');
                    
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 3000);

                } else {
                    throw new Error(data.message || 'Error placing order');
                }
            } catch (error) {
                orderError.textContent = error.message;
                orderError.style.display = 'block';
                btn.disabled = false;
                btn.innerHTML = 'Place Order';
            }
        });
    }

    // Add interactivity to payment options UI
    const paymentOptions = document.querySelectorAll('.payment-option');
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            if (radio.checked) {
                radio.closest('.payment-option').classList.add('selected');
            }
        });
    });
});
