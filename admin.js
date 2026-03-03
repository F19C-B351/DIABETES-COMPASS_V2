// Admin Panel JavaScript (uses window.supabase for non-module loading)
let supabase = window.supabase;

console.log('🔌 admin.js loaded, supabase (initial):', supabase ? 'available' : 'NOT AVAILABLE');

// Wait briefly for module script to initialize window.supabase if not present
async function ensureSupabaseReady(timeout = 3000) {
    const start = Date.now();
    while (!window.supabase && (Date.now() - start) < timeout) {
        await new Promise(r => setTimeout(r, 100));
    }
    supabase = window.supabase;
    console.log('🔌 supabase after wait:', supabase ? 'available' : 'NOT AVAILABLE');
}

const SUPABASE_URL = 'https://uzwinhyzipndpjxmprns.supabase.co';

// Utility functions
function showSpinner() {
    document.getElementById('loading-spinner').style.display = 'block';
}

function hideSpinner() {
    document.getElementById('loading-spinner').style.display = 'none';
}

function showToast(message, timeout = 3000) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => container.removeChild(toast), 400);
    }, timeout);
}

// Check admin access
async function checkAdminAccess() {
    showSpinner();

    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            // Not logged in
            showAccessDenied();
            return false;
        }

        // Check if user is admin
        try {
            const { data: roleData, error } = await supabase
                .from('user_roles')
                .select('user_role')
                .eq('user_id', user.id)
                .single();

            if (!error && roleData?.user_role === 'admin') {
                // User is admin - show admin panel
                document.querySelector('.admin-container').style.display = 'block';
                hideSpinner();
                return true;
            }
        } catch (selErr) {
            console.warn('Direct select of user_roles failed (may be RLS). Falling back to function check.', selErr);
        }

        // Fallback: call Edge Function `list-users` with user's JWT to verify role server-side
        try {
            const token = await getAccessToken();
            if (token) {
                const res = await fetch(`${SUPABASE_URL}/functions/v1/list-users`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                });

                if (res.ok) {
                    const list = await res.json();
                    const me = (list || []).find(u => u.user_id === user.id && u.role === 'admin');
                    if (me) {
                        document.querySelector('.admin-container').style.display = 'block';
                        hideSpinner();
                        return true;
                    }
                } else {
                    console.warn('Fallback list-users call returned', res.status);
                }
            }
        } catch (fnErr) {
            console.error('Error calling list-users function for admin check:', fnErr);
        }

        // Not admin
        showAccessDenied();
        return false;

        // User is admin - show admin panel
        document.querySelector('.admin-container').style.display = 'block';
        hideSpinner();
        return true;

    } catch (error) {
        console.error('Error checking admin access:', error);
        showAccessDenied();
        return false;
    }
}

function showAccessDenied() {
    hideSpinner();
    document.querySelector('.admin-container').style.display = 'none';
    document.getElementById('access-denied').style.display = 'block';
}

// Tab switching
function initTabs() {
    const tabs = document.querySelectorAll('.admin-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active to clicked tab
            tab.classList.add('active');
            const tabId = tab.dataset.tab + '-tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// =====================
// ARTICLES MANAGEMENT
// =====================

let articles = [];

async function loadArticles() {
    const tbody = document.getElementById('articles-tbody');
    tbody.innerHTML = '<tr><td colspan="7" class="loading-row">Loading articles...</td></tr>';

    try {
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        articles = data || [];
        renderArticlesTable();

    } catch (error) {
        console.error('Error loading articles:', error);
        tbody.innerHTML = '<tr><td colspan="6" class="no-data-row">Error loading articles</td></tr>';
        showToast('Error loading articles: ' + error.message);
    }
}

function renderArticlesTable() {
    const tbody = document.getElementById('articles-tbody');

    if (articles.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data-row">No articles found. Click "Add Article" to create one.</td></tr>';
        return;
    }
    tbody.innerHTML = articles.map(article => `
        <tr data-id="${article.id}">
            <td class="truncate" title="${escapeHtml(article.title)}">${escapeHtml(article.title)}</td>
            <td class="truncate" title="${escapeHtml(article.excerpt || '')}">${escapeHtml((article.excerpt || '').slice(0, 120))}</td>
            <td>${escapeHtml(article.category || '-')}</td>
            <td class="truncate-sm">${escapeHtml(article.author || '-')}</td>
            <td>
                <span class="published-badge ${article.published ? 'yes' : 'no'}">
                    ${article.published ? 'Yes' : 'No'}
                </span>
            </td>
            <td>${formatDate(article.created_at)}</td>
            <td>
                <div class="action-btns">
                    <button class="btn-edit" onclick="editArticle('${article.id}')">Edit</button>
                    <button class="btn-delete" onclick="deleteArticle('${article.id}', '${escapeHtml(article.title)}')">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openArticleModal(isEdit = false, article = null) {
    const modal = document.getElementById('article-modal');
    const title = document.getElementById('article-modal-title');
    const form = document.getElementById('article-form');

    // Reset form
    form.reset();
    document.getElementById('article-id').value = '';

    if (isEdit && article) {
        title.textContent = 'Edit Article';
        document.getElementById('article-id').value = article.id;
        document.getElementById('article-title').value = article.title || '';
        document.getElementById('article-category').value = article.category || '';
        document.getElementById('article-author').value = article.author || '';
        document.getElementById('article-image').value = article.image_url || '';
        document.getElementById('article-content').value = article.content || '';
        document.getElementById('article-published').checked = article.published !== false;
        document.getElementById('article-slug').value = article.slug || '';
        document.getElementById('article-excerpt').value = article.excerpt || '';
    } else {
        title.textContent = 'Add Article';
    }

    modal.classList.add('active');
}

function closeArticleModal() {
    document.getElementById('article-modal').classList.remove('active');
}

async function saveArticle(e) {
    e.preventDefault();
    showSpinner();

    const id = document.getElementById('article-id').value;
    const articleData = {
        title: document.getElementById('article-title').value.trim(),
        category: document.getElementById('article-category').value || null,
        author: document.getElementById('article-author').value.trim() || null,
        image_url: document.getElementById('article-image').value.trim() || null,
        slug: document.getElementById('article-slug').value.trim() || null,
        excerpt: document.getElementById('article-excerpt').value.trim() || null,
        content: document.getElementById('article-content').value.trim(),
        published: document.getElementById('article-published').checked
    };

    try {
        let error;

        if (id) {
            // Update existing article
            const { error: updateError } = await supabase
                .from('articles')
                .update(articleData)
                .eq('id', id);
            error = updateError;
        } else {
            // Insert new article
            const { error: insertError } = await supabase
                .from('articles')
                .insert([articleData]);
            error = insertError;
        }

        if (error) throw error;

        closeArticleModal();
        showToast(id ? 'Article updated successfully!' : 'Article created successfully!');
        await loadArticles();

    } catch (error) {
        console.error('Error saving article:', error);
        showToast('Error saving article: ' + error.message);
    } finally {
        hideSpinner();
    }
}

window.editArticle = function (id) {
    const article = articles.find(a => a.id === id);
    if (article) {
        openArticleModal(true, article);
    }
};

window.deleteArticle = function (id, title) {
    document.getElementById('delete-article-id').value = id;
    document.getElementById('delete-article-title').textContent = title;
    document.getElementById('delete-article-modal').classList.add('active');
};

async function confirmDeleteArticle() {
    showSpinner();
    const id = document.getElementById('delete-article-id').value;

    try {
        const { error } = await supabase
            .from('articles')
            .delete()
            .eq('id', id);

        if (error) throw error;

        document.getElementById('delete-article-modal').classList.remove('active');
        showToast('Article deleted successfully!');
        await loadArticles();

    } catch (error) {
        console.error('Error deleting article:', error);
        showToast('Error deleting article: ' + error.message);
    } finally {
        hideSpinner();
    }
}

// =====================
// USERS MANAGEMENT
// =====================

let users = [];

async function loadUsers() {
    console.log('📋 loadUsers() (via Edge Function) called');
    const tbody = document.getElementById('users-tbody');
    tbody.innerHTML = '<tr><td colspan="6" class="loading-row">Loading users...</td></tr>';

    try {
        const token = await getAccessToken();
        if (!token) throw new Error('No access token');

        const res = await fetch(`${SUPABASE_URL}/functions/v1/list-users`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || `HTTP ${res.status}`);
        }

        const data = await res.json();
        users = data || [];
        console.log('📋 Users received from function:', users.length);
        renderUsersTable();

    } catch (error) {
        console.error('Error loading users via function:', error);
        // Fallback: try direct Supabase query in dev mode
        if (window.location.protocol === 'file:' || new URLSearchParams(window.location.search).get('force_admin') === '1') {
            try {
                // Get profiles and roles separately, then merge
                const { data: profiles, error: profilesError } = await supabase
                    .from('profiles')
                    .select('user_id, name, email, diabetes_type, created_at');
                if (profilesError) throw profilesError;
                const { data: roles, error: rolesError } = await supabase
                    .from('user_roles')
                    .select('user_id, user_role');
                if (rolesError) throw rolesError;
                // Merge roles into profiles
                const rolesMap = {};
                (roles || []).forEach(r => { rolesMap[r.user_id] = r.user_role; });
                users = (profiles || []).map(u => ({
                    ...u,
                    role: rolesMap[u.user_id] || 'user'
                }));
                console.log('📋 Users received from Supabase direct:', users.length);
                renderUsersTable();
            } catch (fallbackError) {
                console.error('Error loading users via Supabase direct:', fallbackError);
                tbody.innerHTML = '<tr><td colspan="6" class="no-data-row">Error loading users</td></tr>';
                showToast('Error loading users: ' + (fallbackError.message || fallbackError));
            }
        } else {
            tbody.innerHTML = '<tr><td colspan="6" class="no-data-row">Error loading users</td></tr>';
            showToast('Error loading users: ' + (error.message || error));
        }
    }
}

function renderUsersTable() {
    console.log('📋 renderUsersTable() called with', users.length, 'users');
    const tbody = document.getElementById('users-tbody');

    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data-row">No users found. Click "Add User" to create one.</td></tr>';
        return;
    }

    tbody.innerHTML = users.map(user => `
        <tr data-id="${user.user_id}">
            <td class="truncate" title="${escapeHtml(user.name || '')}">${escapeHtml(user.name || '-')}</td>
            <td class="truncate" title="${escapeHtml(user.email || '')}">${escapeHtml(user.email || '-')}</td>
            <td>
                <span class="role-badge ${user.role}">${user.role}</span>
            </td>
            <td>${escapeHtml(user.diabetes_type || '-')}</td>
            <td>${formatDate(user.created_at)}</td>
            <td>
                <div class="action-btns">
                    <button class="btn-edit" onclick="editUser('${user.user_id}')">Edit</button>
                    <button class="btn-delete" onclick="deleteUser('${user.user_id}', '${escapeHtml(user.email || user.name || 'this user')}')">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

window.changeRole = function (userId, newRole, userName) {
    document.getElementById('role-user-id').value = userId;
    document.getElementById('role-new-value').value = newRole;

    const title = document.getElementById('role-modal-title');
    const message = document.getElementById('role-modal-message');

    if (newRole === 'admin') {
        title.textContent = 'Make Admin';
        message.innerHTML = `Are you sure you want to make <strong>${userName}</strong> an administrator?<br><br>Admins have full access to the admin panel and can manage all content and users.`;
    } else {
        title.textContent = 'Remove Admin';
        message.innerHTML = `Are you sure you want to remove admin privileges from <strong>${userName}</strong>?<br><br>They will no longer be able to access the admin panel.`;
    }

    document.getElementById('role-modal').classList.add('active');
};

async function confirmRoleChange() {
    showSpinner();
    const userId = document.getElementById('role-user-id').value;
    const newRole = document.getElementById('role-new-value').value;

    try {
        // Check if user has a role record
        const { data: existingRole, error: checkError } = await supabase
            .from('user_roles')
            .select('id')
            .eq('user_id', userId)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            throw checkError;
        }

        if (existingRole) {
            // Update existing role
            const { error } = await supabase
                .from('user_roles')
                .update({ user_role: newRole })
                .eq('user_id', userId);

            if (error) throw error;
        } else {
            // Insert new role
            const { error } = await supabase
                .from('user_roles')
                .insert([{ user_id: userId, user_role: newRole }]);

            if (error) throw error;
        }

        document.getElementById('role-modal').classList.remove('active');
        showToast(`User role updated to ${newRole}!`);
        await loadUsers();

    } catch (error) {
        console.error('Error changing role:', error);
        showToast('Error changing role: ' + error.message);
    } finally {
        hideSpinner();
    }
}

// =====================
// USER CRUD OPERATIONS
// =====================


async function getAccessToken() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
}

function openUserModal(isEdit = false, user = null) {
    const modal = document.getElementById('user-modal');
    const title = document.getElementById('user-modal-title');
    const form = document.getElementById('user-form');
    const passwordInput = document.getElementById('user-password');
    const passwordHint = document.getElementById('password-hint');
    const saveBtn = document.getElementById('save-user-btn');
    const errorDiv = document.getElementById('user-modal-error');

    // Reset form
    form.reset();
    errorDiv.style.display = 'none';
    document.getElementById('user-id').value = '';

    if (isEdit && user) {
        title.textContent = 'Edit User';
        saveBtn.textContent = 'Save Changes';
        passwordInput.required = false;
        passwordHint.textContent = '(leave blank to keep current)';

        document.getElementById('user-id').value = user.user_id;
        document.getElementById('user-email').value = user.email || '';
        document.getElementById('user-name').value = user.name || '';
        document.getElementById('user-role').value = user.role || 'user';
        document.getElementById('user-diabetes-type').value = user.diabetes_type || '';
        document.getElementById('user-glucose-unit').value = user.glucose_unit || 'mg/dL';
        document.getElementById('user-insulin-user').value = user.insulin_user || 'No';
        document.getElementById('user-phone').value = user.phone_number || '';
    } else {
        title.textContent = 'Add User';
        saveBtn.textContent = 'Create User';
        passwordInput.required = true;
        passwordHint.textContent = '(min 6 characters)';
    }

    modal.classList.add('active');
}

function closeUserModal() {
    document.getElementById('user-modal').classList.remove('active');
}

async function saveUser(e) {
    e.preventDefault();
    showSpinner();

    const userId = document.getElementById('user-id').value;
    const errorDiv = document.getElementById('user-modal-error');
    const saveBtn = document.getElementById('save-user-btn');

    errorDiv.style.display = 'none';
    saveBtn.disabled = true;

    const formData = {
        email: document.getElementById('user-email').value.trim(),
        name: document.getElementById('user-name').value.trim() || null,
        role: document.getElementById('user-role').value,
        diabetes_type: document.getElementById('user-diabetes-type').value || null,
        glucose_unit: document.getElementById('user-glucose-unit').value,
        insulin_user: document.getElementById('user-insulin-user').value,
        phone_number: document.getElementById('user-phone').value.trim() || null
    };

    const password = document.getElementById('user-password').value;
    if (password) {
        formData.password = password;
    }

    try {
        const token = await getAccessToken();
        const endpoint = userId ? 'update-user' : 'create-user';

        if (userId) {
            formData.user_id = userId;
        }

        const response = await fetch(`${SUPABASE_URL}/functions/v1/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || `Failed to ${userId ? 'update' : 'create'} user`);
        }

        closeUserModal();
        showToast(userId ? 'User updated successfully!' : 'User created successfully!');
        await loadUsers();

    } catch (error) {
        console.error('Error saving user:', error);
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    } finally {
        hideSpinner();
        saveBtn.disabled = false;
    }
}

window.editUser = function (userId) {
    const user = users.find(u => u.user_id === userId);
    if (user) {
        openUserModal(true, user);
    }
};

window.deleteUser = function (userId, email) {
    document.getElementById('delete-user-id').value = userId;
    document.getElementById('delete-user-email').textContent = email;
    document.getElementById('delete-user-error').style.display = 'none';
    document.getElementById('delete-user-modal').classList.add('active');
};

async function confirmDeleteUser() {
    showSpinner();
    const userId = document.getElementById('delete-user-id').value;
    const errorDiv = document.getElementById('delete-user-error');
    const deleteBtn = document.getElementById('confirm-delete-user-btn');

    errorDiv.style.display = 'none';
    deleteBtn.disabled = true;

    try {
        const token = await getAccessToken();
        const response = await fetch(`${SUPABASE_URL}/functions/v1/delete-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ user_id: userId })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to delete user');
        }

        document.getElementById('delete-user-modal').classList.remove('active');
        showToast('User deleted successfully!');
        await loadUsers();

    } catch (error) {
        console.error('Error deleting user:', error);
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    } finally {
        hideSpinner();
        deleteBtn.disabled = false;
    }
}

// =====================
// UTILITY FUNCTIONS
// =====================

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// =====================
// EVENT LISTENERS
// =====================

function initEventListeners() {
    // Add Article button
    document.getElementById('add-article-btn').addEventListener('click', () => {
        openArticleModal(false);
    });

    // Article form submit
    document.getElementById('article-form').addEventListener('submit', saveArticle);

    // Close article modal
    document.getElementById('close-article-modal').addEventListener('click', closeArticleModal);
    document.getElementById('cancel-article-btn').addEventListener('click', closeArticleModal);

    // Delete article modal
    document.getElementById('close-delete-article-modal').addEventListener('click', () => {
        document.getElementById('delete-article-modal').classList.remove('active');
    });
    document.getElementById('cancel-delete-article-btn').addEventListener('click', () => {
        document.getElementById('delete-article-modal').classList.remove('active');
    });
    document.getElementById('confirm-delete-article-btn').addEventListener('click', confirmDeleteArticle);

    // Role modal
    document.getElementById('close-role-modal').addEventListener('click', () => {
        document.getElementById('role-modal').classList.remove('active');
    });
    document.getElementById('cancel-role-btn').addEventListener('click', () => {
        document.getElementById('role-modal').classList.remove('active');
    });
    document.getElementById('confirm-role-btn').addEventListener('click', confirmRoleChange);

    // Add User button
    document.getElementById('add-user-btn').addEventListener('click', () => {
        openUserModal(false);
    });

    // User form submit
    document.getElementById('user-form').addEventListener('submit', saveUser);

    // Close user modal
    document.getElementById('close-user-modal').addEventListener('click', closeUserModal);
    document.getElementById('cancel-user-btn').addEventListener('click', closeUserModal);

    // Delete user modal
    document.getElementById('close-delete-user-modal').addEventListener('click', () => {
        document.getElementById('delete-user-modal').classList.remove('active');
    });
    document.getElementById('cancel-delete-user-btn').addEventListener('click', () => {
        document.getElementById('delete-user-modal').classList.remove('active');
    });
    document.getElementById('confirm-delete-user-btn').addEventListener('click', confirmDeleteUser);

    // Close modals on background click
    document.querySelectorAll('.modal-bg').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Close modals on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-bg.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
}

// =====================
// INITIALIZATION
// =====================

async function init() {
    console.log('🚀 Admin panel init() starting...');
    // Ensure Supabase client is ready, then check admin access
    await ensureSupabaseReady();
    // Developer/file-mode override: if page is opened via file:// or ?force_admin=1, show panel for local testing
    const urlParams = new URLSearchParams(window.location.search);
    const isFileProtocol = window.location.protocol === 'file:' || urlParams.get('force_admin') === '1';
    if (isFileProtocol) {
        console.warn('Developer mode: forcing admin panel visible (file:// or ?force_admin=1)');
        document.querySelector('.admin-container').classList.add('dev-visible');
        // initialize UI but still attempt to load data if possible
        initTabs();
        initEventListeners();
        await loadArticles().catch(e => console.warn('loadArticles failed in dev mode:', e));
        await loadUsers().catch(e => console.warn('loadUsers failed in dev mode:', e));
        console.log('🚀 Dev-mode init complete');
        return;
    }

    // First check admin access
    const isAdmin = await checkAdminAccess();
    console.log('🚀 isAdmin:', isAdmin);

    if (!isAdmin) {
        console.log('🚀 Not admin, returning');
        return;
    }

    // Initialize tabs
    console.log('🚀 Initializing tabs...');
    initTabs();

    // Initialize event listeners
    console.log('🚀 Initializing event listeners...');
    initEventListeners();

    // Load initial data
    console.log('🚀 Loading articles...');
    await loadArticles();
    console.log('🚀 Loading users...');
    await loadUsers();
    console.log('🚀 Init complete');
}

// Start the app
console.log('🚀 Starting admin.js module...');
init();
