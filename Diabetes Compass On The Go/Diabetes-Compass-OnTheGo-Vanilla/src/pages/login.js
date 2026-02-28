// login.js - Handles login and profile logic
// TODO: Integrate Supabase Auth and profile storage

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const profileSection = document.getElementById('profile-section');
    const profileForm = document.getElementById('profile-form');
    const profileSuccess = document.getElementById('profile-success');
    const supabase = window.supabaseClient;

    // Helper: Show/hide sections
    function showProfileSection() {
        loginForm.style.display = 'none';
        profileSection.style.display = 'block';
        loginError.style.display = 'none';
    }
});
// Handle login form submit
if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        loginError.style.display = 'none';
        if (email && password) {
            // Supabase sign in
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                loginError.textContent = error.message;
                loginError.style.display = 'block';
            } else {
                showProfileSection();
                // Optionally, load profile data here
            }
        } else {
            loginError.textContent = 'Invalid email or password.';
            loginError.style.display = 'block';
        }
    });
}
    }

// Handle profile form submit
if (profileForm) {
    profileForm.addEventListener('submit', function (e) {
        e.preventDefault();
        // Placeholder: Save profile fields (to be replaced with Supabase logic)
        profileSuccess.textContent = 'Profile saved!';
        profileSuccess.style.display = 'block';
    });
    if (profileForm) {
        profileForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            profileSuccess.style.display = 'none';
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                profileSuccess.textContent = 'Not logged in.';
                profileSuccess.style.display = 'block';
                return;
            }
            // Collect profile fields
            const name = document.getElementById('profile-name').value;
            const diabetes_type = document.getElementById('profile-diabetes-type').value;
            const glucose_unit = document.getElementById('profile-glucose-unit').value;
            const insulin_user = document.querySelector('input[name="insulin-user"]:checked')?.value;
            // Upsert profile to Supabase (table: profiles)
            const { error } = await supabase.from('profiles').upsert({
                id: user.id,
                name,
                diabetes_type,
                glucose_unit,
                insulin_user
            });
            if (error) {
                profileSuccess.textContent = 'Error saving profile: ' + error.message;
                profileSuccess.style.display = 'block';
            } else {
                profileSuccess.textContent = 'Profile saved!';
                profileSuccess.style.display = 'block';
            }
        });
    }
}
});
