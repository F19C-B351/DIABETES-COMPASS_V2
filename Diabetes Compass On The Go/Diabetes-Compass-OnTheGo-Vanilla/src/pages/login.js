// login.js - Handles login and profile logic
// TODO: Integrate Supabase Auth and profile storage

document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');
  const profileSection = document.getElementById('profile-section');
  const profileForm = document.getElementById('profile-form');
  const profileSuccess = document.getElementById('profile-success');

  // Handle login form submit
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // Placeholder: Replace with Supabase Auth
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      if (email && password) {
        // Simulate login success
        loginForm.style.display = 'none';
        profileSection.style.display = 'block';
        loginError.style.display = 'none';
      } else {
        loginError.textContent = 'Invalid email or password.';
        loginError.style.display = 'block';
      }
    });
  }

  // Handle profile form submit
  if (profileForm) {
    profileForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // Placeholder: Save profile fields (to be replaced with Supabase logic)
      profileSuccess.textContent = 'Profile saved!';
      profileSuccess.style.display = 'block';
    });
  }
});
