import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const registerForm = document.getElementById('register-form');
    const registerError = document.getElementById('register-error');
    const profileSection = document.getElementById('profile-section');
    const profileForm = document.getElementById('profile-form');
    const profileError = document.getElementById('profile-error');
    const profileSuccess = document.getElementById('profile-success');
    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');

    // Show register form
    showRegisterLink.addEventListener('click', function (e) {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });
    // Show login form
    showLoginLink.addEventListener('click', function (e) {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    // Login form submit
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        loginError.style.display = 'none';
        if (!email || !password) {
            loginError.textContent = 'All fields are required.';
            loginError.style.display = 'block';
            return;
        }
        let { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            loginError.textContent = error.message;
            loginError.style.display = 'block';
            return;
        }
        // Success: show profile section
        profileSection.style.display = 'block';
        loginForm.style.display = 'none';
        // Optionally fetch profile if exists
        const user = supabase.auth.getUser ? (await supabase.auth.getUser()).data.user : null;
        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();
            if (profile) {
                document.getElementById('profile-name').value = profile.name || '';
                document.getElementById('diabetes-type').value = profile.diabetes_type || '';
                document.getElementById('glucose-unit').value = profile.glucose_unit || 'mmol/L';
                document.getElementById('insulin-user').value = profile.insulin_user || '';
            }
        }
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
        const insulin = document.getElementById('register-insulin-user').value;
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
        // Show profile section
        registerForm.style.display = 'none';
        profileSection.style.display = 'block';
        document.getElementById('profile-name').value = name;
        document.getElementById('diabetes-type').value = dtype;
        document.getElementById('glucose-unit').value = gunit;
        document.getElementById('insulin-user').value = insulin;
    });

    // Profile form submit
    profileForm.addEventListener('submit', async function (e) {
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
        // Save to Supabase
        const user = supabase.auth.getUser ? (await supabase.auth.getUser()).data.user : null;
        if (!user) {
            profileError.textContent = 'User not authenticated.';
            profileError.style.display = 'block';
            return;
        }
        const { error } = await supabase.from('profiles').upsert({
            user_id: user.id,
            name: pname,
            diabetes_type: dtype,
            glucose_unit: gunit,
            insulin_user: insulin
        });
        if (error) {
            profileError.textContent = error.message;
            profileError.style.display = 'block';
        } else {
            profileSuccess.style.display = 'block';
        }
    });
});
