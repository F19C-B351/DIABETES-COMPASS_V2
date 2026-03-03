// Admin Panel JavaScript
import { supabase } from './supabaseClient.js';

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
        const { data: roleData, error } = await supabase
            .from('user_roles')
            .select('user_role')
            .eq('user_id', user.id)
            .single();

        if (error || roleData?.user_role !== 'admin') {
            showAccessDenied();
            return false;
        }

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
    tbody.innerHTML = '<tr><td colspan="6" class="loading-row">Loading articles...</td></tr>';

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
        tbody.innerHTML = '<tr><td colspan="6" class="no-data-row">No articles found. Click "Add Article" to create one.</td></tr>';
        return;
    }

    tbody.innerHTML = articles.map(article => `
        <tr data-id="${article.id}">
            <td class="truncate" title="${escapeHtml(article.title)}">${escapeHtml(article.title)}</td>
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
    const tbody = document.getElementById('users-tbody');
    tbody.innerHTML = '<tr><td colspan="6" class="loading-row">Loading users...</td></tr>';

    try {
        // Get all profiles with their roles
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (profilesError) throw profilesError;

        // Get all roles
        const { data: roles, error: rolesError } = await supabase
            .from('user_roles')
            .select('*');

        if (rolesError) throw rolesError;

        // Combine data
        users = (profiles || []).map(profile => {
            const roleRecord = roles?.find(r => r.user_id === profile.user_id);
            return {
                ...profile,
                role: roleRecord?.user_role || 'user',
                role_id: roleRecord?.id
            };
        });

        renderUsersTable();

    } catch (error) {
        console.error('Error loading users:', error);
        tbody.innerHTML = '<tr><td colspan="6" class="no-data-row">Error loading users</td></tr>';
        showToast('Error loading users: ' + error.message);
    }
}

function renderUsersTable() {
    const tbody = document.getElementById('users-tbody');

    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data-row">No users found.</td></tr>';
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
                    ${user.role === 'admin'
            ? `<button class="btn-remove-admin" onclick="changeRole('${user.user_id}', 'user', '${escapeHtml(user.name || user.email || 'this user')}')">Remove Admin</button>`
            : `<button class="btn-make-admin" onclick="changeRole('${user.user_id}', 'admin', '${escapeHtml(user.name || user.email || 'this user')}')">Make Admin</button>`
        }
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
    // First check admin access
    const isAdmin = await checkAdminAccess();

    if (!isAdmin) {
        return;
    }

    // Initialize tabs
    initTabs();

    // Initialize event listeners
    initEventListeners();

    // Load initial data
    await loadArticles();
    await loadUsers();
}

// Start the app
init();
