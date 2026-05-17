// Check authentication
checkAuth();

let currentPage = 1;
let currentFilters = {};

// Load tasks on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    setupFilters();
});

async function loadTasks(page = 1) {
    try {
        const params = new URLSearchParams({
            page: page,
            ...currentFilters,
        });

        const response = await fetchAPI(`/tasks?${params}`);
        const data = await response.json();

        if (!response.ok) {
            showNotification('Błąd wczytywania zadań', 'danger');
            return;
        }

        displayTasks(data.data || []);
        setupPagination(data);
        currentPage = page;
    } catch (error) {
        showNotification(`Błąd: ${error.message}`, 'danger');
    }
}

function displayTasks(tasks) {
    const tbody = document.getElementById('tasksBody');
    tbody.innerHTML = '';

    if (tasks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Brak zadań spełniających kryteria</td></tr>';
        return;
    }

    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.style.cursor = 'pointer';
        row.innerHTML = `
            <td><strong>${task.title}</strong></td>
            <td>${task.description ? task.description.substring(0, 50) + '...' : '-'}</td>
            <td>${getStatusBadge(task.status)}</td>
            <td>${getPriorityBadge(task.priority)}</td>
            <td>${formatDate(task.due_date)}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editTask(${task.id})">
                    Edytuj
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function setupPagination(data) {
    const paginationList = document.getElementById('paginationList');
    paginationList.innerHTML = '';

    if (data.last_page <= 1) return;

    // Previous page
    if (data.current_page > 1) {
        const li = document.createElement('li');
        li.className = 'page-item';
        li.innerHTML = `<a class="page-link" href="#" onclick="loadTasks(${data.current_page - 1})">Poprzednia</a>`;
        paginationList.appendChild(li);
    }

    // Page numbers
    for (let i = 1; i <= data.last_page; i++) {
        if (i === data.current_page) {
            const li = document.createElement('li');
            li.className = 'page-item active';
            li.innerHTML = `<span class="page-link">${i}</span>`;
            paginationList.appendChild(li);
        } else if (i <= 3 || i >= data.last_page - 2 || Math.abs(i - data.current_page) <= 1) {
            const li = document.createElement('li');
            li.className = 'page-item';
            li.innerHTML = `<a class="page-link" href="#" onclick="loadTasks(${i})">${i}</a>`;
            paginationList.appendChild(li);
        }
    }

    // Next page
    if (data.current_page < data.last_page) {
        const li = document.createElement('li');
        li.className = 'page-item';
        li.innerHTML = `<a class="page-link" href="#" onclick="loadTasks(${data.current_page + 1})">Następna</a>`;
        paginationList.appendChild(li);
    }
}

function setupFilters() {
    document.getElementById('filterStatus').addEventListener('change', applyFilters);
    document.getElementById('filterPriority').addEventListener('change', applyFilters);
    document.getElementById('searchInput').addEventListener('input', applyFilters);
}

function applyFilters() {
    currentFilters = {
        status: document.getElementById('filterStatus').value || undefined,
        priority: document.getElementById('filterPriority').value || undefined,
        search: document.getElementById('searchInput').value || undefined,
    };

    // Remove undefined values
    Object.keys(currentFilters).forEach(key => {
        if (!currentFilters[key]) delete currentFilters[key];
    });

    loadTasks(1);
}

// New task form handler
document.getElementById('newTaskForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value || null,
        priority: document.getElementById('taskPriority').value,
        due_date: document.getElementById('taskDueDate').value || null,
    };

    try {
        const response = await fetchAPI('/tasks', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (response.ok) {
            showNotification('Zadanie dodane pomyślnie!', 'success');
            document.getElementById('newTaskForm').reset();
            bootstrap.Modal.getInstance(document.getElementById('newTaskModal')).hide();
            loadTasks(1);
        } else {
            const error = await response.json();
            showNotification(`Błąd: ${JSON.stringify(error.message || error)}`, 'danger');
        }
    } catch (error) {
        showNotification(`Błąd: ${error.message}`, 'danger');
    }
});

// Edit task function
async function editTask(taskId) {
    try {
        const response = await fetchAPI(`/tasks/${taskId}`);
        const task = await response.json();

        if (!response.ok) {
            showNotification('Błąd wczytywania zadania', 'danger');
            return;
        }

        // Fill modal with task data
        document.getElementById('editTaskId').value = task.id;
        document.getElementById('editTaskTitle').value = task.title;
        document.getElementById('editTaskDescription').value = task.description || '';
        document.getElementById('editTaskStatus').value = task.status;
        document.getElementById('editTaskPriority').value = task.priority;
        document.getElementById('editTaskDueDate').value = formatDateTimeLocal(task.due_date);

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('editTaskModal'));
        modal.show();
    } catch (error) {
        showNotification(`Błąd: ${error.message}`, 'danger');
    }
}

// Edit task form handler
document.getElementById('editTaskForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const taskId = document.getElementById('editTaskId').value;
    const data = {
        title: document.getElementById('editTaskTitle').value,
        description: document.getElementById('editTaskDescription').value || null,
        status: document.getElementById('editTaskStatus').value,
        priority: document.getElementById('editTaskPriority').value,
        due_date: document.getElementById('editTaskDueDate').value || null,
    };

    try {
        const response = await fetchAPI(`/tasks/${taskId}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });

        if (response.ok) {
            showNotification('Zadanie zaktualizowane pomyślnie!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('editTaskModal')).hide();
            loadTasks(currentPage);
        } else {
            const error = await response.json();
            showNotification(`Błąd: ${error.message || 'Nie udało się zaktualizować zadania'}`, 'danger');
        }
    } catch (error) {
        showNotification(`Błąd: ${error.message}`, 'danger');
    }
});

// Delete task function
async function deleteTask() {
    const taskId = document.getElementById('editTaskId').value;

    if (!confirm('Czy chcesz usunąć to zadanie?')) {
        return;
    }

    try {
        const response = await fetchAPI(`/tasks/${taskId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            showNotification('Zadanie usunięte pomyślnie!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('editTaskModal')).hide();
            loadTasks(currentPage);
        } else {
            const error = await response.json();
            showNotification(`Błąd: ${error.message || 'Nie udało się usunąć zadania'}`, 'danger');
        }
    } catch (error) {
        showNotification(`Błąd: ${error.message}`, 'danger');
    }
}
