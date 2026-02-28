// Inject login button and modal into every page
(function () {
    if (document.getElementById('show-login-btn')) return; // Prevent duplicate

    // Button container
    const btnContainer = document.createElement('div');
    btnContainer.style.position = 'absolute';
    btnContainer.style.top = '18px';
    btnContainer.style.right = '32px';
    btnContainer.style.zIndex = '2000';
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '12px';

    // Login Button
    const loginBtn = document.createElement('button');
    loginBtn.className = 'login-btn-topright';
    loginBtn.id = 'show-login-btn';
    loginBtn.textContent = 'Login';

    // Register Button
    const registerBtn = document.createElement('button');
    registerBtn.className = 'register-btn-topright';
    registerBtn.id = 'show-register-btn-top';
    registerBtn.textContent = 'Register';

    btnContainer.appendChild(loginBtn);
    btnContainer.appendChild(registerBtn);
    document.body.appendChild(btnContainer);

    // Login Modal HTML
    const modalHTML = `
    <div id="login-modal" class="modal-bg">
      <div class="modal-content login-modal-content">
        <button type="button" id="close-login-modal" class="btn-close position-absolute end-0 top-0 m-3" aria-label="Close"></button>
        <h2 class="mb-4 text-center">Login</h2>
        <form id="login-form">
          <div class="mb-3">
            <label for="login-name" class="form-label">Name</label>
            <input type="text" class="form-control" id="login-name" required />
          </div>
          <div class="mb-3">
            <label for="login-email" class="form-label">Email</label>
            <input type="email" class="form-control" id="login-email" required />
          </div>
          <button type="submit" class="btn btn-primary w-100">Login</button>
          <button type="button" class="btn btn-secondary w-100 mt-2" id="show-register-btn">Register</button>
        </form>
        <div id="login-error" class="text-danger mt-3 error-message" style="display:none;"></div>
      </div>
    </div>
    <div id="register-modal" class="modal-bg">
      <div class="modal-content register-modal-content">
        <button type="button" id="close-register-modal" class="btn-close position-absolute end-0 top-0 m-3" aria-label="Close"></button>
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
            <label for="register-name" class="form-label">Name</label>
            <input type="text" class="form-control" id="register-name" required />
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

  // Optionally: Add form submit logic here or in login.js
})();
