document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Login logic
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch(`${API_URL}/users/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('userInfo', JSON.stringify(data));
                    showToast(`Welcome back, ${data.name}!`, 'success');
                    setTimeout(() => { window.location.href = 'index.html'; }, 1000);
                } else {
                    showToast(data.message || 'Login failed', 'danger');
                }
            } catch (error) {
                showToast('Network error, try again later', 'danger');
            }
        });
    }

    // Register logic
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch(`${API_URL}/users`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('userInfo', JSON.stringify(data));
                    showToast('Account Created Successfully!', 'success');
                    setTimeout(() => { window.location.href = 'index.html'; }, 1000);
                } else {
                    showToast(data.message || 'Registration failed', 'danger');
                }
            } catch (error) {
                showToast('Network error, try again later', 'danger');
            }
        });
    }
});
