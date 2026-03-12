// auth.js - Handles logic for login.html and register.html

document.addEventListener('DOMContentLoaded', () => {
    
    // Redirect if already logged in
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
        window.location.href = 'index.html';
    }

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const errorMsg = document.getElementById('auth-error-message');

    // Handle Login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const btn = document.getElementById('login-btn');
            
            errorMsg.style.display = 'none';
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...';

            try {
                const res = await fetch(`${window.API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();

                if (res.ok) {
                    localStorage.setItem('userInfo', JSON.stringify(data));
                    window.location.href = 'index.html';
                } else {
                    throw new Error(data.message || 'Invalid email or password');
                }
            } catch (error) {
                errorMsg.textContent = error.message;
                errorMsg.style.display = 'block';
                btn.disabled = false;
                btn.innerHTML = 'Login';
            }
        });
    }

    // Handle Register
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const btn = document.getElementById('register-btn');
            
            errorMsg.style.display = 'none';

            if (password !== confirmPassword) {
                errorMsg.textContent = 'Passwords do not match';
                errorMsg.style.display = 'block';
                return;
            }

            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Registering...';

            try {
                const res = await fetch(`${window.API_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await res.json();

                if (res.ok) {
                    localStorage.setItem('userInfo', JSON.stringify(data));
                    window.location.href = 'index.html';
                } else {
                    throw new Error(data.message || 'Failed to register');
                }
            } catch (error) {
                errorMsg.textContent = error.message;
                errorMsg.style.display = 'block';
                btn.disabled = false;
                btn.innerHTML = 'Register';
            }
        });
    }
});
