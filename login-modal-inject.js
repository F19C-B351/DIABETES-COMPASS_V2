// Inject login button and modal into every page
(async function () {
    if (document.getElementById('show-login-btn')) return; // Prevent duplicate

    // Button container
    const btnContainer = document.createElement('div');
    btnContainer.style.position = 'fixed';
    btnContainer.style.top = '18px';
    btnContainer.style.right = '32px';
    btnContainer.style.zIndex = '100010';
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '12px';
    btnContainer.style.alignItems = 'center';

    // Login Button
    const loginBtn = document.createElement('button');
    loginBtn.className = 'login-btn-topright';
    loginBtn.id = 'show-login-btn';
    loginBtn.textContent = 'Login';
    loginBtn.style.flexShrink = '0';
    loginBtn.style.whiteSpace = 'nowrap';

    // Register Button
    const registerBtn = document.createElement('button');
    registerBtn.className = 'register-btn-topright';
    registerBtn.id = 'show-register-btn-top';
    registerBtn.textContent = 'Register';
    registerBtn.style.flexShrink = '0';
    registerBtn.style.whiteSpace = 'nowrap';

    btnContainer.appendChild(loginBtn);
    btnContainer.appendChild(registerBtn);
    document.body.insertBefore(btnContainer, document.body.firstChild);

    // Login Modal HTML
    const modalHTML = `
    <div id="login-modal" class="modal-bg">
      <div class="modal-content login-modal-content">
        <button type="button" id="close-login-modal" class="modal-close-btn" aria-label="Close">&times;</button>
        <h2 class="mb-4 text-center">Login</h2>
        <form id="login-form">
          <div class="mb-3">
            <label for="login-email" class="form-label">Email</label>
            <input type="email" class="form-control" id="login-email" required />
          </div>
          <div class="mb-3">
            <label for="login-password" class="form-label">Password</label>
            <input type="password" class="form-control" id="login-password" required />
          </div>
          <button type="submit" class="btn btn-primary w-100">Login</button>
          <button type="button" class="btn btn-secondary w-100 mt-2" id="show-register-btn">Register</button>
        </form>
        <div id="login-error" class="text-danger mt-3 error-message" style="display:none;"></div>
      </div>
    </div>
    <div id="register-modal" class="modal-bg">
      <div class="modal-content register-modal-content">
        <button type="button" id="close-register-modal" class="modal-close-btn" aria-label="Close">&times;</button>
        <h2 class="mb-4 text-center">Register</h2>
        <form id="register-form">
          <div class="mb-3">
            <label for="register-email" class="form-label">Email</label>
            <input type="email" class="form-control" id="register-email" required />
          </div>
          <div class="mb-3">
            <label for="register-password" class="form-label">Password</label>
            <input type="password" class="form-control" id="register-password" required />
          </div>
          <div class="mb-3">
            <label for="register-password-confirm" class="form-label">Confirm Password</label>
            <input type="password" class="form-control" id="register-password-confirm" required />
          </div>
          <div class="mb-3">
            <label for="register-name" class="form-label">Name</label>
            <input type="text" class="form-control" id="register-name" required />
          </div>
          <div class="mb-3">
            <label for="register-phone" class="form-label">Phone Number (Optional)</label>
            <input type="tel" class="form-control" id="register-phone" placeholder="e.g. +1 234 567 8900" />
          </div>
          <div class="mb-3">
            <label for="register-diabetes-type" class="form-label">Diabetes Type</label>
            <select class="form-select" id="register-diabetes-type" required>
              <option value="">Select type</option>
              <option value="Type 1">Type 1</option>
              <option value="Type 2">Type 2</option>
              <option value="Gestational">Gestational</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="register-glucose-unit" class="form-label">Glucose Unit</label>
            <select class="form-select" id="register-glucose-unit" required>
              <option value="mmol/L">mmol/L</option>
              <option value="mg/dL">mg/dL</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Insulin User</label>
            <div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="register-insulin-user" id="register-insulin-yes" value="Yes" required />
                <label class="form-check-label" for="register-insulin-yes">Yes</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="register-insulin-user" id="register-insulin-no" value="No" required />
                <label class="form-check-label" for="register-insulin-no">No</label>
              </div>
            </div>
          </div>
          <div id="register-error" class="text-danger mt-3 error-message" style="display:none;"></div>
          <div id="register-success" class="text-success mt-3 success-message" style="display:none;"></div>
          <button type="submit" class="btn btn-primary w-100">Register</button>
        </form>
        <div class="mt-3 text-center">
          <span>Already have an account? <a href="#" id="show-login-link">Login</a></span>
        </div>
      </div>
    </div>
  `;
    const modalDiv = document.createElement('div');
    modalDiv.innerHTML = modalHTML;
    document.body.appendChild(modalDiv);

    // Modal logic (open/close/forms)
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const showLoginBtn = document.getElementById('show-login-btn');
    const showRegisterBtnTop = document.getElementById('show-register-btn-top');
    const closeLoginModal = document.getElementById('close-login-modal');
    const showRegisterBtn = document.getElementById('show-register-btn');
    const closeRegisterModal = document.getElementById('close-register-modal');
    const showLoginLink = document.getElementById('show-login-link');

    showLoginBtn.addEventListener('click', function () {
        loginModal.classList.add('active');
    });
    showRegisterBtnTop.addEventListener('click', function () {
        registerModal.classList.add('active');
    });
    closeLoginModal.addEventListener('click', function () {
        loginModal.classList.remove('active');
    });
    showRegisterBtn.addEventListener('click', function () {
        loginModal.classList.remove('active');
        registerModal.classList.add('active');
    });
    closeRegisterModal.addEventListener('click', function () {
        registerModal.classList.remove('active');
    });
    showLoginLink.addEventListener('click', function (e) {
        e.preventDefault();
        registerModal.classList.remove('active');
        loginModal.classList.add('active');
    });


    // --- Registration and Login Logic (moved from login.js) ---
    // Wait for supabase client to be available
    async function waitForSupabase() {
        let attempts = 0;
        const maxAttempts = 300; // 30 seconds

        while (!window.supabase && attempts < maxAttempts) {
            console.log('Waiting for Supabase initialization... (' + (attempts + 1) + '/300)');
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }

        if (!window.supabase) {
            console.error('❌ ERROR: Supabase client failed to initialize after 30 seconds');
            console.error('This usually means the Supabase library or supabase-init.js failed to load');
            throw new Error('Supabase client not available');
        }

        console.log('✓ Supabase client successfully initialized');
        return window.supabase;
    }

    const supabasePromise = waitForSupabase().then(initializeLoginForms);

    // Check if user is logged in and show user banner
    async function checkUserSession() {
        try {
            const { data: { session } } = await window.supabase.auth.getSession();

            if (session && session.user) {
                console.log('User session found:', session.user.email);

                // Get user profile to get name
                let userName = session.user.email;
                try {
                    const { data: profile } = await window.supabase
                        .from('profiles')
                        .select('name')
                        .eq('user_id', session.user.id)
                        .single();
                    if (profile && profile.name) {
                        userName = profile.name;
                    }
                } catch (e) {
                    console.log('Could not fetch profile name, using email');
                }

                // Hide login/register buttons
                const loginBtn = document.getElementById('show-login-btn');
                const registerBtn = document.getElementById('show-register-btn-top');
                if (loginBtn) loginBtn.style.display = 'none';
                if (registerBtn) registerBtn.style.display = 'none';

                // Show user name and logout button
                const btnContainer = loginBtn?.parentElement;
                if (btnContainer && !document.getElementById('user-welcome-text')) {
                    const welcomeText = document.createElement('span');
                    welcomeText.id = 'user-welcome-text';
                    welcomeText.style.color = '#667eea';
                    welcomeText.style.fontWeight = '600';
                    welcomeText.style.fontSize = '0.95rem';
                    welcomeText.style.marginRight = '10px';
                    welcomeText.textContent = `Hi, ${userName}`;

                    const logoutBtn = document.createElement('button');
                    logoutBtn.className = 'login-btn-topright';
                    logoutBtn.id = 'logout-btn';
                    logoutBtn.textContent = 'Logout';
                    logoutBtn.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
                    logoutBtn.addEventListener('click', async function () {
                        await window.supabase.auth.signOut();
                        window.location.reload();
                    });

                    btnContainer.appendChild(welcomeText);
                    btnContainer.appendChild(logoutBtn);
                }
            }
        } catch (error) {
            console.error('Error checking session:', error);
        }
    }

    // Check session after Supabase is ready
    waitForSupabase().then(() => checkUserSession());

    async function initializeLoginForms(supabase) {
        const loginForm = document.getElementById('login-form');
        const loginError = document.getElementById('login-error');
        const registerForm = document.getElementById('register-form');
        const registerError = document.getElementById('register-error');

        // Function to fetch user profile from Supabase
        async function fetchUserProfile(email) {
            try {
                console.log('Fetching profile for:', email);
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .match({ user_id: (await supabase.auth.getUser()).data.user?.id })
                    .single();

                if (error && error.code !== 'PGRST116') {
                    console.error('Error fetching profile:', error);
                    return null;
                }

                console.log('User profile:', data);
                return data;
            } catch (error) {
                console.error('Error:', error);
                return null;
            }
        }

        // Expose fetch function globally for debugging
        window.fetchUserProfile = fetchUserProfile;

        // Login form submit
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            loginError.style.display = 'none';

            if (!email || !password) {
                loginError.textContent = 'Email and password are required.';
                loginError.style.display = 'block';
                return;
            }

            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                });

                if (error) {
                    loginError.textContent = error.message || 'Login failed. Please check your credentials.';
                    loginError.style.display = 'block';
                    return;
                }

                console.log('Login successful:', data.user.email);
                loginModal.classList.remove('active');
                window.location.reload();
            } catch (err) {
                loginError.textContent = 'An error occurred. Please try again.';
                loginError.style.display = 'block';
                console.error('Login error:', err);
            }
        });

        // Register form submit
        registerForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            registerError.style.display = 'none';
            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value;
            const passwordConfirm = document.getElementById('register-password-confirm').value;
            const name = document.getElementById('register-name').value.trim();
            const phone = document.getElementById('register-phone').value.trim();
            const dtype = document.getElementById('register-diabetes-type').value;
            const gunit = document.getElementById('register-glucose-unit').value;
            let insulin = '';
            const insulinYes = document.getElementById('register-insulin-yes');
            const insulinNo = document.getElementById('register-insulin-no');
            if (insulinYes && insulinYes.checked) insulin = 'Yes';
            else if (insulinNo && insulinNo.checked) insulin = 'No';
            if (!email || !password || !passwordConfirm || !name || !dtype || !gunit || !insulin) {
                registerError.textContent = 'All fields are required.';
                registerError.style.display = 'block';
                return;
            }
            if (password !== passwordConfirm) {
                registerError.textContent = 'Passwords do not match.';
                registerError.style.display = 'block';
                return;
            }

            try {
                console.log('Attempting registration with:', { email, name, phone, dtype, gunit, insulin });

                // Verify supabase is available
                if (!supabase) {
                    throw new Error('Supabase client not initialized');
                }

                console.log('Supabase client ready, calling auth.signUp...');
                console.log('Supabase URL:', supabase?.supabaseUrl);
                console.log('Supabase Key exists:', !!supabase?.supabaseKey);

                // Sign up user with Supabase Auth
                const signUpPromise = supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            name: name,
                            phone_number: phone || null,
                            diabetes_type: dtype,
                            glucose_unit: gunit,
                            insulin_user: insulin
                        }
                    }
                });

                console.log('Sign-up request sent, waiting for response...');

                const { data: signUpData, error: signUpError } = await signUpPromise;

                if (signUpError) {
                    console.error('Sign-up error details:', {
                        message: signUpError.message,
                        status: signUpError.status,
                        error: signUpError
                    });
                    registerError.textContent = 'Sign-up failed: ' + signUpError.message;
                    registerError.style.display = 'block';
                    return;
                }

                console.log('Sign-up successful, received data:', signUpData);

                console.log('Sign-up successful:', signUpData);

                // Get user ID from response
                const userId = signUpData.user?.id;

                if (!userId) {
                    console.error('No user ID returned from sign-up');
                    registerError.textContent = 'Error: Could not get user ID';
                    registerError.style.display = 'block';
                    return;
                }

                console.log('User created with ID:', userId);

                // Update the profile with additional info using upsert
                // The profile should be auto-created by the trigger, so we're updating it
                const profileData = {
                    user_id: userId,
                    name: name,
                    phone_number: phone || null,
                    diabetes_type: dtype,
                    glucose_unit: gunit,
                    insulin_user: insulin
                };
                console.log('Saving profile data:', profileData);

                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert(profileData, {
                        onConflict: 'user_id'
                    });

                if (profileError) {
                    console.error('Profile update error:', profileError);
                    registerError.textContent = 'Could not save profile: ' + profileError.message;
                    registerError.style.display = 'block';
                    return;
                }

                console.log('Profile saved successfully');

                // Verify the data was saved
                const { data: verifyData, error: verifyError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('user_id', userId)
                    .single();

                if (!verifyError) {
                    console.log('Verified saved profile:', verifyData);
                }

                // Sign out the user - they need to login manually
                await supabase.auth.signOut();

                // Show success message
                const successMsg = document.getElementById('register-success');
                if (successMsg) {
                    successMsg.textContent = 'Registration successful! Please use the login page to sign in.';
                    successMsg.style.display = 'block';
                }
                registerError.style.color = '#388e3c';
                registerError.textContent = 'Registration successful! Please use the login page to sign in.';
                registerError.style.display = 'block';

                // Close register modal and open login modal after a short delay
                setTimeout(() => {
                    registerModal.classList.remove('active');
                    loginModal.classList.add('active');
                }, 2500);

            } catch (error) {
                console.error('Unexpected error during registration:', error);
                console.error('Error type:', error.constructor.name);
                console.error('Error message:', error.message);
                console.error('Full error:', error);

                let userMessage = 'An unexpected error occurred: ' + error.message;

                // Check for specific error types
                if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                    userMessage = 'Network error: Cannot reach Supabase. Check your internet connection and try again.';
                } else if (error instanceof TypeError) {
                    userMessage = 'Network error: ' + error.message;
                }

                registerError.textContent = userMessage;
                registerError.style.display = 'block';
            }
        });
    }

})();
