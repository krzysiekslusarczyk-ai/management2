// API Configuration
const API_BASE_URL = '/api';

// Get auth token from localStorage
function getAuthToken() {
    return localStorage.getItem('auth_token');
}

// Set auth token
function setAuthToken(token) {
    localStorage.setItem('auth_token', token);
}

// Clear auth token
function clearAuthToken() {
    localStorage.removeItem('auth_token');
}

// Fetch with auth header
async function fetchAPI(endpoint, options = {}) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        clearAuthToken();
        window.location.href = '/';
        return;
    }

    return response;
}

// Register handler
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        name: document.getElementById('registerName').value,
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value,
        password_confirmation: document.getElementById('registerPasswordConfirm').value,
        phone: document.getElementById('registerPhone').value || null,
        company: document.getElementById('registerCompany').value || null,
    };

    try {
        const response = await fetchAPI('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Rejestracja pomyślna! Zaloguj się teraz.');
            document.getElementById('registerForm').reset();
            bootstrap.Modal.getInstance(document.getElementById('register')).hide();
        } else {
            const error = await response.json();
            alert(`Błąd: ${error.message || 'Rejestracja nie powiodła się'}`);
        }
    } catch (error) {
        alert(`Błąd: ${error.message}`);
    }
});

// Login handler
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value,
    };

    try {
        const response = await fetchAPI('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            setAuthToken(result.token);
            window.location.href = '/dashboard';
        } else {
            alert(`Błąd logowania: ${result.message || 'Logowanie nie powiodło się'}`);
        }
    } catch (error) {
        alert(`Błąd: ${error.message}`);
    }
});

// Logout function
function logout() {
    if (confirm('Czy chcesz się wylogować?')) {
        clearAuthToken();
        window.location.href = '/';
    }
}

// Check if user is logged in
function checkAuth() {
    const token = getAuthToken();
    if (!token) {
        window.location.href = '/';
    }
    return token;
}

// Format date to datetime-local format
function formatDateTimeLocal(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
}

// Format date for display
function formatDate(date) {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

// Get priority badge HTML
function getPriorityBadge(priority) {
    const badges = {
        low: '<span class="badge priority-low">Niski</span>',
        medium: '<span class="badge priority-medium">Średni</span>',
        high: '<span class="badge priority-high">Wysoki</span>',
        urgent: '<span class="badge priority-urgent">Nadzwyczajny</span>',
    };
    return badges[priority] || '<span class="badge bg-secondary">Nieznany</span>';
}

// Get status badge HTML
function getStatusBadge(status) {
    const badges = {
        pending: '<span class="badge status-pending">Nowe</span>',
        in_progress: '<span class="badge status-in-progress">W trakcie</span>',
        completed: '<span class="badge status-completed">Ukończone</span>',
        cancelled: '<span class="badge status-cancelled">Anulowane</span>',
    };
    return badges[status] || '<span class="badge bg-secondary">Nieznany</span>';
}

// Show notification
function showNotification(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    const container = document.querySelector('body');
    const existingAlert = container.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    container.insertBefore(alertDiv, container.firstChild);

    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}
