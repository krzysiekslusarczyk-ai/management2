// Check authentication
checkAuth();

// Load settings on page load
document.addEventListener('DOMContentLoaded', loadSettings);

async function loadSettings() {
    await loadProfileData();
    await loadiCloudAccounts();
}

async function loadProfileData() {
    try {
        const response = await fetchAPI('/auth/me');
        const user = await response.json();

        if (response.ok) {
            document.getElementById('profileName').value = user.name || '';
            document.getElementById('profileEmail').value = user.email || '';
            document.getElementById('profileCompany').value = user.company || '';
            document.getElementById('profilePhone').value = user.phone || '';
        }
    } catch (error) {
        showNotification(`Błąd: ${error.message}`, 'danger');
    }
}

async function loadiCloudAccounts() {
    try {
        const response = await fetchAPI('/icloud/accounts');
        const accounts = await response.json();

        if (response.ok) {
            displayiCloudAccounts(accounts);
        }
    } catch (error) {
        showNotification(`Błąd: ${error.message}`, 'danger');
    }
}

function displayiCloudAccounts(accounts) {
    const container = document.getElementById('connectedAccounts');
    
    if (!accounts || accounts.length === 0) {
        container.innerHTML = '<p class="text-muted">Brak połączonych kont iCloud</p>';
        return;
    }

    container.innerHTML = '';
    
    accounts.forEach(account => {
        const accountCard = document.createElement('div');
        accountCard.className = 'card mb-2';
        accountCard.innerHTML = `
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col">
                        <h6 class="card-title">${account.icloud_email}</h6>
                        <small class="text-muted">
                            Ostatnia synchronizacja: ${account.last_sync_at ? formatDate(account.last_sync_at) : 'Nigdy'}
                        </small>
                        <br>
                        <small class="text-${account.sync_status === 'success' ? 'success' : account.sync_status === 'error' ? 'danger' : 'muted'}">
                            Status: ${account.sync_status}
                        </small>
                    </div>
                    <div class="col-auto">
                        <div class="btn-group" role="group">
                            <button class="btn btn-sm btn-${account.sync_enabled ? 'success' : 'secondary'}" 
                                    onclick="toggleSync(${account.id})">${account.sync_enabled ? 'Włączone' : 'Wyłączone'}</button>
                            <button class="btn btn-sm btn-primary" onclick="syncNow(${account.id})">Synchronizuj teraz</button>
                            <button class="btn btn-sm btn-danger" onclick="disconnectAccount(${account.id})">Rozłącz</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(accountCard);
    });
}

// Profile form handler
document.getElementById('profileForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // In a real application, you would have an API endpoint to update user profile
    showNotification('Zmiany będą zapisane w przyszłej wersji', 'info');
});

// Connect iCloud account handler
document.getElementById('connectiCloudForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        icloud_email: document.getElementById('icloudEmail').value,
        app_password: document.getElementById('icloudPassword').value,
    };

    try {
        const response = await fetchAPI('/icloud/connect', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (response.ok) {
            showNotification('Konto iCloud połączone pomyślnie!', 'success');
            document.getElementById('connectiCloudForm').reset();
            loadiCloudAccounts();
        } else {
            const error = await response.json();
            showNotification(`Błąd: ${error.error || 'Nie udało się połączyć konta iCloud'}`, 'danger');
        }
    } catch (error) {
        showNotification(`Błąd: ${error.message}`, 'danger');
    }
});

// Change password form handler
document.getElementById('changePasswordForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        showNotification('Hasła nie pasują do siebie', 'danger');
        return;
    }

    // In a real application, you would have an API endpoint to change password
    showNotification('Zmiana hasła będzie dostępna w przyszłej wersji', 'info');
});

// Sync now function
async function syncNow(accountId) {
    try {
        const response = await fetchAPI(`/icloud/accounts/${accountId}/sync`, {
            method: 'POST',
        });

        if (response.ok) {
            const result = await response.json();
            showNotification('Synchronizacja zakończona pomyślnie!', 'success');
            loadiCloudAccounts();
        } else {
            const error = await response.json();
            showNotification(`Błąd: ${error.error || 'Synchronizacja nie powiodła się'}`, 'danger');
        }
    } catch (error) {
        showNotification(`Błąd: ${error.message}`, 'danger');
    }
}

// Toggle sync function
async function toggleSync(accountId) {
    try {
        const response = await fetchAPI(`/icloud/accounts/${accountId}/toggle-sync`, {
            method: 'PATCH',
        });

        if (response.ok) {
            const result = await response.json();
            showNotification(result.message, 'success');
            loadiCloudAccounts();
        } else {
            const error = await response.json();
            showNotification(`Błąd: ${error.error || 'Nie udało się zmienić ustawienia'}`, 'danger');
        }
    } catch (error) {
        showNotification(`Błąd: ${error.message}`, 'danger');
    }
}

// Disconnect account function
async function disconnectAccount(accountId) {
    if (!confirm('Czy chcesz odłączyć to konto iCloud?')) {
        return;
    }

    try {
        const response = await fetchAPI(`/icloud/accounts/${accountId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            showNotification('Konto iCloud odłączone', 'success');
            loadiCloudAccounts();
        } else {
            const error = await response.json();
            showNotification(`Błąd: ${error.error || 'Nie udało się odłączyć konta'}`, 'danger');
        }
    } catch (error) {
        showNotification(`Błąd: ${error.message}`, 'danger');
    }
}
