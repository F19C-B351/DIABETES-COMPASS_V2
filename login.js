import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const registerForm = document.getElementById('register-form');
    const registerError = document.getElementById('register-error');
    const showRegisterBtn = document.getElementById('show-register-btn');
    const showLoginBtn = document.getElementById('show-login-btn');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const closeLoginModal = document.getElementById('close-login-modal');
    const closeRegisterModal = document.getElementById('close-register-modal');
    const showLoginLink = document.getElementById('show-login-link');

    // Check all modal elements exist
    if (!loginForm || !loginError || !registerForm || !registerError || !showRegisterBtn || !showLoginBtn || !loginModal || !registerModal || !closeLoginModal || !closeRegisterModal || !showLoginLink) {
        console.error('Login/Register modal elements missing in DOM.');
        return;
    }

    // Show login modal
    showLoginBtn.addEventListener('click', function () {
        loginModal.classList.add('active');
    });
    // Close login modal
    closeLoginModal.addEventListener('click', function () {
        loginModal.classList.remove('active');
    });
    // Show register modal from login modal
    showRegisterBtn.addEventListener('click', function () {
        loginModal.classList.remove('active');
        registerModal.classList.add('active');
    });
    // Close register modal
    closeRegisterModal.addEventListener('click', function () {
        registerModal.classList.remove('active');
    });
    // Show login modal from register modal link
    showLoginLink.addEventListener('click', function (e) {
        e.preventDefault();
        registerModal.classList.remove('active');
        loginModal.classList.add('active');
    });

    // Login form submit
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const name = document.getElementById('login-name').value.trim();
        const email = document.getElementById('login-email').value.trim();
        loginError.style.display = 'none';
        if (!name || !email) {
            loginError.textContent = 'Name and email are required.';
            loginError.style.display = 'block';
            return;
        }
        // Optionally: You can implement a custom login logic here, or just close the modal for demo purposes
        loginModal.classList.remove('active');
        window.location.reload();
    });

    // Register form submit
    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        registerError.style.display = 'none';
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const name = document.getElementById('register-name').value.trim();
        const dtype = document.getElementById('register-diabetes-type').value;
        const gunit = document.getElementById('register-glucose-unit').value;
        let insulin = '';
        const insulinYes = document.getElementById('register-insulin-yes');
        const insulinNo = document.getElementById('register-insulin-no');
        if (insulinYes && insulinYes.checked) insulin = 'Yes';
        else if (insulinNo && insulinNo.checked) insulin = 'No';
        if (!email || !password || !name || !dtype || !gunit || !insulin) {
            registerError.textContent = 'All fields are required.';
            registerError.style.display = 'block';
            return;
        }
        // Register user
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name } }
        });
        if (error) {
            registerError.textContent = error.message;
            registerError.style.display = 'block';
            return;
        }
        // Save profile
        const user = data.user || (supabase.auth.getUser ? (await supabase.auth.getUser()).data.user : null);
        if (user) {
            const { error: profileErrorUpsert } = await supabase.from('profiles').upsert({
                user_id: user.id,
                name,
                diabetes_type: dtype,
                glucose_unit: gunit,
                insulin_user: insulin
            });
            if (profileErrorUpsert) {
                registerError.textContent = profileErrorUpsert.message;
                registerError.style.display = 'block';
                return;
            }
        }
        // Registration success: close modal and optionally reload page or update UI
        registerModal.classList.remove('active');
        window.location.reload();
    });

    // Profile form submit removed (not used in modal-only flow)
});
