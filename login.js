// login.js - Simple local login/profile logic for Diabetes Compass V2

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const profileSection = document.getElementById('profile-section');
    const profileForm = document.getElementById('profile-form');
    const profileError = document.getElementById('profile-error');
    const profileSuccess = document.getElementById('profile-success');

    // Simulate login (local only)
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('login-name').value.trim();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        loginError.style.display = 'none';
        if (!name || !email || !password) {
            loginError.textContent = 'All fields are required.';
            loginError.style.display = 'block';
            return;
        }
        // Simulate login success
        profileSection.style.display = 'block';
        loginForm.style.display = 'none';
        document.getElementById('profile-name').value = name;
    });

    // Profile form submit
    profileForm.addEventListener('submit', function (e) {
        e.preventDefault();
        profileError.style.display = 'none';
        profileSuccess.style.display = 'none';
        const pname = document.getElementById('profile-name').value.trim();
        const dtype = document.getElementById('diabetes-type').value;
        const gunit = document.getElementById('glucose-unit').value;
        const insulin = document.getElementById('insulin-user').value;
        if (!pname || !dtype || !gunit || !insulin) {
            profileError.textContent = 'Please fill out all profile fields.';
            profileError.style.display = 'block';
            return;
        }
        // Simulate save
        profileSuccess.style.display = 'block';
    });
});
